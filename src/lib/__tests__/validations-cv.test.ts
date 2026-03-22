// src/lib/__tests__/validations-cv.test.ts
import {
  cvFormSchema,
  workExperienceSchema,
  cvAnalysisResultSchema,
  atsSubCriteriaSchema,
  personalInfoSchema,
} from '../validations-cv';

// ─── Helpers / Fixtures ───

const validPersonalInfo = {
  firstName: 'Anar',
  lastName: 'Həsənov',
  dateOfBirth: '1995-06-15',
  email: 'anar@example.com',
  phone: '+994501234567',
  city: 'Bakı',
  gender: 'male' as const,
  maritalStatus: 'single' as const,
  aboutMe:
    'Mən proqram təminatı mühəndisiyəm və 5 illik təcrübəyə malikəm. React və TypeScript ilə işləyirəm.',
};

const validWorkExperience = {
  id: 'we-1',
  company: 'ABC Şirkəti',
  position: 'Frontend Developer',
  startDate: '2020-01',
  currentlyWorking: true,
  description: 'React ilə müasir veb tətbiqləri hazırladım.',
};

const validEducation = {
  id: 'edu-1',
  institution: 'Bakı Dövlət Universiteti',
  major: 'Kompüter Elmləri',
  startDate: '2013-09',
  endDate: '2017-06',
  currentlyStudying: false,
  city: 'Bakı',
};

const validSkill = {
  id: 'sk-1',
  name: 'React',
  level: 'expert' as const,
};

const validLanguage = {
  id: 'lang-1',
  name: 'Azərbaycan',
  level: 'native' as const,
};

const validCVForm = {
  cvLanguage: 'az' as const,
  templateId: 'template-1',
  personalInfo: validPersonalInfo,
  workExperience: [validWorkExperience],
  education: [validEducation],
  skills: [validSkill],
  languages: [validLanguage],
  courses: [],
  certificates: [],
  interests: [],
  references: [],
};

const validAnalysisResult = {
  overallImpression: 'Güclü CV',
  atsScore: 85,
  atsJustification: 'Açar sözlər düzgün istifadə edilmişdir.',
  atsSubCriteria: {
    keywordRelevance: 20,
    formatCompatibility: 22,
    sectionCompleteness: 23,
    contentQuality: 20,
  },
  strengths: ['Güclü texniki bacarıqlar', 'Aydın iş təsviri'],
  improvements: [
    {
      section: 'aboutMe',
      current: 'Qısa təsvir',
      suggested: 'Daha ətraflı təsvir',
      why: 'İşəgötürənlər daha çox məlumat istəyir',
    },
  ],
  grammarErrors: [],
  topThreeActions: ['LinkedIn əlavə et', 'Foto əlavə et', 'Sertifikat əlavə et'],
};

// ─── Tests ───

describe('cvFormSchema', () => {
  it('valid CV data passes', () => {
    const result = cvFormSchema.safeParse(validCVForm);
    expect(result.success).toBe(true);
  });

  it('missing required firstName fails', () => {
    const data = {
      ...validCVForm,
      personalInfo: { ...validPersonalInfo, firstName: '' },
    };
    const result = cvFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const firstNameError = result.error.issues.some(
        (issue) =>
          issue.path.includes('firstName') && issue.message === 'Ad tələb olunur'
      );
      expect(firstNameError).toBe(true);
    }
  });

  it('invalid email fails', () => {
    const data = {
      ...validCVForm,
      personalInfo: { ...validPersonalInfo, email: 'not-an-email' },
    };
    const result = cvFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.some((issue) =>
        issue.path.includes('email')
      );
      expect(emailError).toBe(true);
    }
  });
});

describe('workExperienceSchema refine', () => {
  it('passes when currentlyWorking is true and endDate is absent', () => {
    const result = workExperienceSchema.safeParse(validWorkExperience);
    expect(result.success).toBe(true);
  });

  it('passes when currentlyWorking is false and endDate is provided', () => {
    const data = {
      ...validWorkExperience,
      currentlyWorking: false,
      endDate: '2023-12',
    };
    const result = workExperienceSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('fails when currentlyWorking is false and endDate is missing', () => {
    const data = {
      ...validWorkExperience,
      currentlyWorking: false,
      endDate: undefined,
    };
    const result = workExperienceSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.some(
        (issue) =>
          issue.path.includes('endDate') &&
          issue.message.includes('Bitmə tarixi')
      );
      expect(endDateError).toBe(true);
    }
  });

  it('fails when currentlyWorking is false and endDate is empty string', () => {
    const data = {
      ...validWorkExperience,
      currentlyWorking: false,
      endDate: '',
    };
    const result = workExperienceSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('cvAnalysisResultSchema', () => {
  it('validates correct structure', () => {
    const result = cvAnalysisResultSchema.safeParse(validAnalysisResult);
    expect(result.success).toBe(true);
  });

  it('atsScore > 100 fails', () => {
    const data = { ...validAnalysisResult, atsScore: 101 };
    const result = cvAnalysisResultSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const scoreError = result.error.issues.some((issue) =>
        issue.path.includes('atsScore')
      );
      expect(scoreError).toBe(true);
    }
  });

  it('atsScore < 0 fails', () => {
    const data = { ...validAnalysisResult, atsScore: -1 };
    const result = cvAnalysisResultSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('atsSubCriteriaSchema', () => {
  it('valid sub-criteria passes', () => {
    const result = atsSubCriteriaSchema.safeParse(
      validAnalysisResult.atsSubCriteria
    );
    expect(result.success).toBe(true);
  });

  it('keywordRelevance > 25 fails', () => {
    const data = { ...validAnalysisResult.atsSubCriteria, keywordRelevance: 26 };
    const result = atsSubCriteriaSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.some((issue) =>
        issue.path.includes('keywordRelevance')
      );
      expect(err).toBe(true);
    }
  });

  it('formatCompatibility > 25 fails', () => {
    const data = { ...validAnalysisResult.atsSubCriteria, formatCompatibility: 30 };
    const result = atsSubCriteriaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('sectionCompleteness > 25 fails', () => {
    const data = { ...validAnalysisResult.atsSubCriteria, sectionCompleteness: 100 };
    const result = atsSubCriteriaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('contentQuality > 25 fails', () => {
    const data = { ...validAnalysisResult.atsSubCriteria, contentQuality: 26 };
    const result = atsSubCriteriaSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
