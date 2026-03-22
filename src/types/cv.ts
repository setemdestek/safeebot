// src/types/cv.ts

// ─── CV Form Data Types ───

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  driversLicense?: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  linkedinUrl?: string;
  aboutMe?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  major: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  city: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'good' | 'excellent' | 'expert';

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';

export interface Course {
  id: string;
  name: string;
  organization: string;
  date: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Reference {
  id: string;
  fullName: string;
  position: string;
  company: string;
  phone: string;
  email: string;
}

export type CVLanguage = 'az' | 'en' | 'ru';

export interface CVFormData {
  cvLanguage: CVLanguage;
  templateId: string;
  photo: File | null; // Client-side only, excluded from JSON serialization
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  courses: Course[];
  certificates: Certificate[];
  interests: string[];
  references: Reference[];
}

// ─── CV Form Actions (for useReducer) ───

export type CVFormAction =
  | { type: 'SET_LANGUAGE'; payload: CVLanguage }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'SET_PHOTO'; payload: File | null }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_WORK_EXPERIENCE' }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { id: string; data: Partial<WorkExperience> } }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION' }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL' }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<Skill> } }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_LANGUAGE' }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Partial<Language> } }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'ADD_COURSE' }
  | { type: 'UPDATE_COURSE'; payload: { id: string; data: Partial<Course> } }
  | { type: 'REMOVE_COURSE'; payload: string }
  | { type: 'ADD_CERTIFICATE' }
  | { type: 'UPDATE_CERTIFICATE'; payload: { id: string; data: Partial<Certificate> } }
  | { type: 'REMOVE_CERTIFICATE'; payload: string }
  | { type: 'ADD_INTEREST'; payload: string }
  | { type: 'REMOVE_INTEREST'; payload: number }
  | { type: 'ADD_REFERENCE' }
  | { type: 'UPDATE_REFERENCE'; payload: { id: string; data: Partial<Reference> } }
  | { type: 'REMOVE_REFERENCE'; payload: string }
  | { type: 'LOAD_STATE'; payload: CVFormData }
  | { type: 'RESET' };

// ─── Template Types ───

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailPath: string;
  layout: 'single-column' | 'two-column' | 'sidebar' | 'timeline';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// ─── Gemini AI Response Types ───

export interface ATSSubCriteria {
  keywordRelevance: number;       // 0-25
  formatCompatibility: number;    // 0-25
  sectionCompleteness: number;    // 0-25
  contentQuality: number;         // 0-25
}

export interface CVAnalysisResult {
  overallImpression: string;
  atsScore: number;
  atsJustification: string;
  atsSubCriteria: ATSSubCriteria;
  strengths: string[];
  improvements: {
    section: string;
    current: string;
    suggested: string;
    why: string;
  }[];
  grammarErrors: {
    location: string;
    error: string;
    correction: string;
  }[];
  topThreeActions: string[];
}

export interface CoverLetterResult {
  coverLetterText: string;
}

// ─── UI State Types ───

export type CVBuilderStep = 'language' | 'template' | 'form' | 'analysis' | 'done';

export interface CVBuilderState {
  currentStep: CVBuilderStep;
  formData: CVFormData;
  analysisResult: CVAnalysisResult | null;
  coverLetterResult: CoverLetterResult | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isGeneratingCoverLetter: boolean;
  error: string | null;
}
