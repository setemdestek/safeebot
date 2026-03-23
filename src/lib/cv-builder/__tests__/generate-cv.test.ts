// src/lib/cv-builder/__tests__/generate-cv.test.ts

// Polyfill TextEncoder/TextDecoder for jsdom environment (required by docx Packer)
import { TextEncoder, TextDecoder } from 'util';
if (typeof globalThis.TextEncoder === 'undefined') {
  Object.assign(globalThis, { TextEncoder, TextDecoder });
}

import type { CVFormData } from '@/types/cv';

// Mock sharp so the test does not require native bindings
jest.mock('sharp', () => {
  const mockSharp = () => ({
    metadata: jest.fn().mockResolvedValue({ width: 200, height: 200 }),
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('fake-image')),
  });
  return mockSharp;
});

import { generateCV, generateCoverLetterDocx } from '../generate-cv';

const mockData: CVFormData = {
  cvLanguage: 'en',
  templateId: 'azure-professional',
  photo: null,
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    city: 'New York',
    address: '123 Main St',
    driversLicense: 'B',
    gender: 'male',
    maritalStatus: 'single',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    aboutMe: 'Experienced software developer with a passion for building great products.',
  },
  workExperience: [
    {
      id: 'w1',
      company: 'Tech Corp',
      position: 'Senior Developer',
      startDate: '2020-01',
      endDate: undefined,
      currentlyWorking: true,
      description: 'Leading frontend development team and delivering high-quality solutions.',
    },
  ],
  education: [
    {
      id: 'e1',
      institution: 'MIT',
      major: 'Computer Science',
      startDate: '2008-09',
      endDate: '2012-06',
      currentlyStudying: false,
      city: 'Cambridge',
    },
  ],
  skills: [
    { id: 's1', name: 'TypeScript', level: 'expert' },
    { id: 's2', name: 'React', level: 'excellent' },
  ],
  languages: [
    { id: 'l1', name: 'English', level: 'native' },
    { id: 'l2', name: 'German', level: 'B2' },
  ],
  courses: [
    { id: 'c1', name: 'AWS Solutions Architect', organization: 'Amazon', date: '2023-03' },
  ],
  certificates: [
    { id: 'ct1', name: 'PMP', issuer: 'PMI', date: '2022-08' },
  ],
  interests: ['Open Source', 'Hiking', 'Photography'],
  references: [
    {
      id: 'r1',
      fullName: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Corp',
      phone: '+1987654321',
      email: 'jane.smith@techcorp.com',
    },
  ],
};

const ALL_TEMPLATE_IDS = [
  'azure-professional',
  'pearl-classic',
  'midnight-modern',
  'rose-elegant',
  'nordic-minimal',
  'carbon-executive',
  'ocean-sidebar',
  'emerald-timeline',
  'slate-two-column',
  'coral-creative',
];

describe('generateCV', () => {
  it('returns a valid DOCX buffer (PK zip header) with azure-professional template', async () => {
    const buffer = await generateCV(mockData, null);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    // DOCX files are ZIP archives — first two bytes are 'P' (0x50) and 'K' (0x4B)
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });

  describe('all 10 templates produce valid DOCX buffers', () => {
    ALL_TEMPLATE_IDS.forEach((templateId) => {
      it(`template "${templateId}" produces a valid buffer`, async () => {
        const data = { ...mockData, templateId };
        const buffer = await generateCV(data, null);
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
        expect(buffer[0]).toBe(0x50);
        expect(buffer[1]).toBe(0x4b);
      });
    });
  });

  it('throws for an unknown template', async () => {
    const data = { ...mockData, templateId: 'nonexistent-template' };
    await expect(generateCV(data, null)).rejects.toThrow('Unknown template: nonexistent-template');
  });

  it('handles data with empty optional sections', async () => {
    const minimalData: CVFormData = {
      ...mockData,
      workExperience: [],
      education: [],
      skills: [],
      languages: [],
      courses: [],
      certificates: [],
      interests: [],
      references: [],
      personalInfo: {
        ...mockData.personalInfo,
        aboutMe: undefined,
        address: undefined,
        driversLicense: undefined,
        linkedinUrl: undefined,
      },
    };
    const buffer = await generateCV(minimalData, null);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });
});

describe('generateCoverLetterDocx', () => {
  it('returns a valid DOCX buffer', async () => {
    const buffer = await generateCoverLetterDocx('Dear Hiring Manager,\n\nI am writing to apply for the position.', 'en');
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });

  it('handles empty text', async () => {
    const buffer = await generateCoverLetterDocx('', 'az');
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });
});
