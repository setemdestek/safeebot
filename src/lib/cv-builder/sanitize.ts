// src/lib/cv-builder/sanitize.ts
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { CVFormData } from '@/types/cv';

const window = new JSDOM('').window;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

function sanitizeString(str: string): string {
  return purify.sanitize(str, { ALLOWED_TAGS: [] }); // strip ALL HTML
}

export function sanitizeCVData(data: CVFormData): CVFormData {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      firstName: sanitizeString(data.personalInfo.firstName),
      lastName: sanitizeString(data.personalInfo.lastName),
      city: sanitizeString(data.personalInfo.city),
      address: data.personalInfo.address ? sanitizeString(data.personalInfo.address) : undefined,
      driversLicense: data.personalInfo.driversLicense ? sanitizeString(data.personalInfo.driversLicense) : undefined,
      aboutMe: data.personalInfo.aboutMe ? sanitizeString(data.personalInfo.aboutMe) : undefined,
      linkedinUrl: data.personalInfo.linkedinUrl ? sanitizeString(data.personalInfo.linkedinUrl) : undefined,
    },
    workExperience: data.workExperience.map(w => ({
      ...w,
      company: sanitizeString(w.company),
      position: sanitizeString(w.position),
      description: sanitizeString(w.description),
    })),
    education: data.education.map(e => ({
      ...e,
      institution: sanitizeString(e.institution),
      major: sanitizeString(e.major),
      city: sanitizeString(e.city),
    })),
    skills: data.skills.map(s => ({
      ...s,
      name: sanitizeString(s.name),
    })),
    languages: data.languages.map(l => ({
      ...l,
      name: sanitizeString(l.name),
    })),
    courses: data.courses.map(c => ({
      ...c,
      name: sanitizeString(c.name),
      organization: sanitizeString(c.organization),
    })),
    certificates: data.certificates.map(c => ({
      ...c,
      name: sanitizeString(c.name),
      issuer: sanitizeString(c.issuer),
    })),
    interests: data.interests.map(i => sanitizeString(i)),
    references: data.references.map(r => ({
      ...r,
      fullName: sanitizeString(r.fullName),
      position: sanitizeString(r.position),
      company: sanitizeString(r.company),
    })),
  };
}
