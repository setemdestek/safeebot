// src/app/api/cv-builder/__tests__/generate.test.ts

// Mock next/server before any imports
jest.mock('next/server', () => {
  class MockNextResponse {
    body: any;
    status: number;
    headers: Map<string, string>;

    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
    }

    async json() {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }

    static json(data: any, init?: any) {
      const response = new MockNextResponse(data, init);
      response.json = async () => data;
      return response;
    }
  }
  return { NextResponse: MockNextResponse };
});

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));
jest.mock('@/lib/cv-builder/generate-cv', () => ({
  generateCV: jest.fn(),
}));
jest.mock('@/lib/cv-builder/sanitize', () => ({
  sanitizeCVData: jest.fn((data: any) => data),
}));

import { POST } from '../generate/route';
import { createClient } from '@/lib/supabase/server';
import { generateCV } from '@/lib/cv-builder/generate-cv';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockGenerateCV = generateCV as jest.MockedFunction<typeof generateCV>;
const mockSanitizeCVData = sanitizeCVData as jest.MockedFunction<typeof sanitizeCVData>;

// Valid CV data that passes cvFormSchema validation
const validCVData = {
  cvLanguage: 'az',
  templateId: 'azure-professional',
  personalInfo: {
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    email: 'test@example.com',
    phone: '+994501234567',
    city: 'Baku',
    gender: 'male',
    maritalStatus: 'single',
    aboutMe: 'I am a software engineer with over five years of experience building scalable web applications.',
  },
  workExperience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Software Engineer',
      startDate: '2018-01',
      endDate: '2023-01',
      currentlyWorking: false,
      description: 'Developed and maintained full-stack web applications using React and Node.js.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Test University',
      major: 'Computer Science',
      startDate: '2010-09',
      endDate: '2014-06',
      currentlyStudying: false,
      city: 'Baku',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 'expert' },
  ],
  languages: [
    { id: '1', name: 'English', level: 'B2' },
  ],
  courses: [],
  certificates: [],
  interests: [],
  references: [],
};

function buildMockSupabase({
  user = { id: 'user-123' },
  authError = null,
  limitCheck = { allowed: true, reason: null },
  rpcError = null,
}: {
  user?: { id: string } | null;
  authError?: any;
  limitCheck?: any;
  rpcError?: any;
} = {}) {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user },
        error: authError,
      }),
    },
    rpc: jest.fn().mockResolvedValue({
      data: limitCheck,
      error: rpcError,
    }),
  };
}

function buildFormDataRequest(cvData: object | null, photo?: File): Request {
  const formData = new FormData();
  if (cvData !== null) {
    formData.append('cvData', JSON.stringify(cvData));
  }
  if (photo) {
    formData.append('photo', photo);
  }
  return {
    formData: () => Promise.resolve(formData),
  } as unknown as Request;
}

beforeEach(() => {
  jest.clearAllMocks();
  // Default: sanitizeCVData passes through
  mockSanitizeCVData.mockImplementation((data: any) => data);
  // Default: generateCV returns a fake buffer
  mockGenerateCV.mockResolvedValue(Buffer.from('fake-docx-content'));
});

describe('POST /api/cv-builder/generate', () => {
  describe('Authentication', () => {
    it('returns 401 when user is not authenticated (no user)', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({ user: null }) as any
      );

      const request = buildFormDataRequest(validCVData);
      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Autentifikasiya xətası.');
    });

    it('returns 401 when auth error occurs', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({
          user: null,
          authError: new Error('Auth failed'),
        }) as any
      );

      const request = buildFormDataRequest(validCVData);
      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Autentifikasiya xətası.');
    });
  });

  describe('Rate limiting', () => {
    it('returns 429 when rate limit is exceeded', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({
          limitCheck: { allowed: false, reason: 'CV limiti aşıldı.' },
        }) as any
      );

      const request = buildFormDataRequest(validCVData);
      const response = await POST(request);

      expect(response.status).toBe(429);
      const body = await response.json();
      expect(body.message).toBe('CV limiti aşıldı.');
    });

    it('returns 500 when RPC call fails', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({
          rpcError: new Error('RPC failed'),
        }) as any
      );

      const request = buildFormDataRequest(validCVData);
      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.message).toBe('Server xətası.');
    });
  });

  describe('Input validation', () => {
    it('returns 400 when cvData is missing from FormData', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );

      const request = buildFormDataRequest(null);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe('CV data tələb olunur.');
    });

    it('returns 400 when cvData fails schema validation', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );

      const invalidCVData = {
        cvLanguage: 'az',
        templateId: 'azure-professional',
        personalInfo: {
          firstName: '',  // fails min(1)
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          email: 'not-an-email',  // fails email validation
          phone: '+994501234567',
          city: 'Baku',
          gender: 'male',
          maritalStatus: 'single',
        },
        workExperience: [],  // fails min(1)
        education: [],       // fails min(1)
        skills: [],          // fails min(1)
        languages: [],       // fails min(1)
        courses: [],
        certificates: [],
        interests: [],
        references: [],
      };

      const request = buildFormDataRequest(invalidCVData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe('Validasiya xətası.');
      expect(body.errors).toBeDefined();
    });
  });

  describe('Successful generation', () => {
    it('returns 200 with DOCX content-type on success', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );

      const fakeBuffer = Buffer.from('fake-docx-content');
      mockGenerateCV.mockResolvedValue(fakeBuffer);

      const request = buildFormDataRequest(validCVData);
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(
        response.headers.get(
          'Content-Type'
        )
      ).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
    });

    it('calls generateCV with sanitized data', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );

      const sanitized = { ...validCVData, photo: null };
      mockSanitizeCVData.mockReturnValue(sanitized as any);
      mockGenerateCV.mockResolvedValue(Buffer.from('docx'));

      const request = buildFormDataRequest(validCVData);
      await POST(request);

      expect(mockSanitizeCVData).toHaveBeenCalled();
      expect(mockGenerateCV).toHaveBeenCalledWith(sanitized, null);
    });
  });
});
