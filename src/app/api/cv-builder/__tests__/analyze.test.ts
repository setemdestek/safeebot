// src/app/api/cv-builder/__tests__/analyze.test.ts

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
jest.mock('@/lib/cv-builder/gemini', () => ({
  callGemini: jest.fn(),
}));
jest.mock('@/lib/cv-builder/prompts', () => ({
  buildAnalysisPrompt: jest.fn(() => 'mock-analysis-prompt'),
  buildCoverLetterPrompt: jest.fn(),
}));
jest.mock('@/lib/cv-builder/sanitize', () => ({
  sanitizeCVData: jest.fn((data: any) => data),
}));

import { POST } from '../analyze/route';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/cv-builder/gemini';
import { buildAnalysisPrompt } from '@/lib/cv-builder/prompts';
import { sanitizeCVData } from '@/lib/cv-builder/sanitize';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockCallGemini = callGemini as jest.MockedFunction<typeof callGemini>;
const mockBuildAnalysisPrompt = buildAnalysisPrompt as jest.MockedFunction<typeof buildAnalysisPrompt>;
const mockSanitizeCVData = sanitizeCVData as jest.MockedFunction<typeof sanitizeCVData>;

// Valid CV data for request body
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

// Valid Gemini analysis response that satisfies cvAnalysisResultSchema
const validAnalysisResult = {
  overallImpression: 'Good CV overall.',
  atsScore: 75,
  atsJustification: 'Meets most criteria.',
  atsSubCriteria: {
    keywordRelevance: 18,
    formatCompatibility: 20,
    sectionCompleteness: 17,
    contentQuality: 20,
  },
  strengths: ['Clear formatting', 'Good education section'],
  improvements: [
    {
      section: 'Work',
      current: 'Empty',
      suggested: 'Add experience',
      why: 'Employers look for this',
    },
  ],
  grammarErrors: [],
  topThreeActions: ['Add work experience', 'Add skills', 'Add about me'],
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

function buildJsonRequest(body: object): Request {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
}

beforeEach(() => {
  jest.clearAllMocks();
  // Default: sanitizeCVData passes through
  mockSanitizeCVData.mockImplementation((data: any) => data);
  // Default: prompt builder returns a mock string
  mockBuildAnalysisPrompt.mockReturnValue('mock-analysis-prompt');
});

describe('POST /api/cv-builder/analyze', () => {
  describe('Authentication', () => {
    it('returns 401 when user is not authenticated (no user)', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({ user: null }) as any
      );

      const request = buildJsonRequest({ cvData: validCVData });
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

      const request = buildJsonRequest({ cvData: validCVData });
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
          limitCheck: { allowed: false, reason: 'Analiz limiti aşıldı.' },
        }) as any
      );

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(429);
      const body = await response.json();
      expect(body.message).toBe('Analiz limiti aşıldı.');
    });

    it('returns 500 when RPC call fails', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase({
          rpcError: new Error('RPC failed'),
        }) as any
      );

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.message).toBe('Server xətası.');
    });
  });

  describe('Successful analysis', () => {
    it('returns valid CVAnalysisResult JSON on success', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      mockCallGemini.mockResolvedValue(JSON.stringify(validAnalysisResult));

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.overallImpression).toBe(validAnalysisResult.overallImpression);
      expect(body.atsScore).toBe(validAnalysisResult.atsScore);
      expect(body.atsJustification).toBe(validAnalysisResult.atsJustification);
      expect(body.atsSubCriteria).toEqual(validAnalysisResult.atsSubCriteria);
      expect(body.strengths).toEqual(validAnalysisResult.strengths);
      expect(body.improvements).toEqual(validAnalysisResult.improvements);
      expect(body.grammarErrors).toEqual(validAnalysisResult.grammarErrors);
      expect(body.topThreeActions).toEqual(validAnalysisResult.topThreeActions);
    });

    it('strips markdown code fences from Gemini response', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      const fencedResponse = '```json\n' + JSON.stringify(validAnalysisResult) + '\n```';
      mockCallGemini.mockResolvedValue(fencedResponse);

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.atsScore).toBe(75);
    });

    it('calls buildAnalysisPrompt and callGemini with sanitized data', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      const sanitized = { ...validCVData, photo: null };
      mockSanitizeCVData.mockReturnValue(sanitized as any);
      mockCallGemini.mockResolvedValue(JSON.stringify(validAnalysisResult));

      const request = buildJsonRequest({ cvData: validCVData });
      await POST(request);

      expect(mockSanitizeCVData).toHaveBeenCalled();
      expect(mockBuildAnalysisPrompt).toHaveBeenCalledWith(sanitized);
      expect(mockCallGemini).toHaveBeenCalledWith('mock-analysis-prompt');
    });
  });

  describe('Gemini API errors', () => {
    it('returns 503 when Gemini API throws on first call', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      mockCallGemini.mockRejectedValue(new Error('Gemini API unreachable'));

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(503);
      const body = await response.json();
      expect(body.message).toBe('AI xidməti müvəqqəti əlçatmazdır.');
    });

    it('returns 502 when Gemini returns invalid JSON on both attempts', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      // Both calls return malformed JSON that cannot be parsed
      mockCallGemini
        .mockResolvedValueOnce('not valid json {{{')
        .mockResolvedValueOnce('also not valid json <<<');

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(502);
      const body = await response.json();
      expect(body.message).toBe('AI cavabı düzgün formatda deyil.');
    });

    it('returns 502 when Gemini returns valid JSON but fails schema validation', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      // Returns valid JSON but missing required fields
      const invalidStructure = {
        overallImpression: 'OK',
        // atsScore missing, other fields missing
      };
      mockCallGemini.mockResolvedValue(JSON.stringify(invalidStructure));

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(502);
      const body = await response.json();
      expect(body.message).toBe('AI cavabı düzgün formatda deyil.');
    });

    it('succeeds on retry when first Gemini parse fails but second succeeds', async () => {
      mockCreateClient.mockResolvedValue(
        buildMockSupabase() as any
      );
      // First call returns unparseable JSON, second call returns valid JSON
      mockCallGemini
        .mockResolvedValueOnce('not valid json {{{')
        .mockResolvedValueOnce(JSON.stringify(validAnalysisResult));

      const request = buildJsonRequest({ cvData: validCVData });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.atsScore).toBe(75);
    });
  });
});
