// src/lib/validations-cv.ts
import { z } from 'zod';

// ─── Personal Info Schema ───

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Ad tələb olunur').max(50),
  lastName: z.string().min(1, 'Soyad tələb olunur').max(50),
  dateOfBirth: z.string().min(1, 'Doğum tarixi tələb olunur'),
  email: z.string().email('Düzgün e-mail daxil edin'),
  phone: z.string().min(1, 'Telefon nömrəsi tələb olunur'),
  city: z.string().min(1, 'Şəhər tələb olunur'),
  address: z.string().optional(),
  driversLicense: z.string().optional(),
  gender: z.enum(['male', 'female']),
  maritalStatus: z.enum(['single', 'married']),
  linkedinUrl: z.string().url('Düzgün URL daxil edin').optional().or(z.literal('')),
  aboutMe: z.string().min(50, 'Minimum 50 simvol').max(500, 'Maksimum 500 simvol'),
});

// ─── Work Experience Schema ───

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Şirkət adı tələb olunur'),
  position: z.string().min(1, 'Vəzifə tələb olunur'),
  startDate: z.string().min(1, 'Başlama tarixi tələb olunur'),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  description: z.string().min(1, 'İş təsviri tələb olunur'),
}).refine(
  (data) => data.currentlyWorking || (data.endDate && data.endDate.length > 0),
  { message: 'Bitmə tarixi və ya "Hal-hazırda işləyirəm" seçilməlidir', path: ['endDate'] }
);

// ─── Education Schema ───

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Təhsil müəssisəsi tələb olunur'),
  major: z.string().min(1, 'İxtisas tələb olunur'),
  startDate: z.string().min(1, 'Başlama tarixi tələb olunur'),
  endDate: z.string().optional(),
  currentlyStudying: z.boolean(),
  city: z.string().min(1, 'Şəhər tələb olunur'),
}).refine(
  (data) => data.currentlyStudying || (data.endDate && data.endDate.length > 0),
  { message: 'Bitmə tarixi və ya "Hazırda oxuyuram" seçilməlidir', path: ['endDate'] }
);

// ─── Other Section Schemas ───

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Bacarıq adı tələb olunur'),
  level: z.enum(['beginner', 'intermediate', 'good', 'excellent', 'expert']),
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Dil adı tələb olunur'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']),
});

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  organization: z.string(),
  date: z.string(),
});

export const certificateSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
});

export const referenceSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  position: z.string(),
  company: z.string(),
  phone: z.string(),
  email: z.string().email().or(z.literal('')),
});

// ─── Full CV Form Schema ───

export const cvFormSchema = z.object({
  cvLanguage: z.enum(['az', 'en', 'ru']),
  templateId: z.string().min(1, 'Şablon seçilməlidir'),
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema).min(1, 'Minimum 1 iş təcrübəsi'),
  education: z.array(educationSchema).min(1, 'Minimum 1 təhsil'),
  skills: z.array(skillSchema).min(1, 'Minimum 1 bacarıq'),
  languages: z.array(languageSchema).min(1, 'Minimum 1 dil'),
  courses: z.array(courseSchema),
  certificates: z.array(certificateSchema),
  interests: z.array(z.string()),
  references: z.array(referenceSchema),
});

// ─── Gemini Response Validation ───

export const atsSubCriteriaSchema = z.object({
  keywordRelevance: z.number().min(0).max(25),
  formatCompatibility: z.number().min(0).max(25),
  sectionCompleteness: z.number().min(0).max(25),
  contentQuality: z.number().min(0).max(25),
});

export const cvAnalysisResultSchema = z.object({
  overallImpression: z.string(),
  atsScore: z.number().min(0).max(100),
  atsJustification: z.string(),
  atsSubCriteria: atsSubCriteriaSchema,
  strengths: z.array(z.string()),
  improvements: z.array(z.object({
    section: z.string(),
    current: z.string(),
    suggested: z.string(),
    why: z.string(),
  })),
  grammarErrors: z.array(z.object({
    location: z.string(),
    error: z.string(),
    correction: z.string(),
  })),
  topThreeActions: z.array(z.string()),
});

export const coverLetterResultSchema = z.object({
  coverLetterText: z.string().min(1),
});

export type CVFormSchemaType = z.infer<typeof cvFormSchema>;
