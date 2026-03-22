// src/lib/cv-builder/__tests__/cv-labels.test.ts
import { getCVLabels, CVLabels } from '../cv-labels';
import type { CVLanguage } from '@/types/cv';

const ALL_LANGUAGES: CVLanguage[] = ['az', 'en', 'ru'];

const REQUIRED_KEYS: (keyof CVLabels)[] = [
  'workExperience',
  'education',
  'skills',
  'languages',
  'courses',
  'certificates',
  'interests',
  'references',
  'aboutMe',
  'personalInfo',
  'phone',
  'email',
  'address',
  'city',
  'dateOfBirth',
  'maritalStatus',
  'single',
  'married',
  'male',
  'female',
  'driversLicense',
  'currentlyWorking',
  'currentlyStudying',
  'present',
  'linkedin',
];

describe('getCVLabels', () => {
  describe('all languages have all CVLabels keys', () => {
    ALL_LANGUAGES.forEach((lang) => {
      it(`language "${lang}" has all required keys`, () => {
        const result = getCVLabels(lang);
        REQUIRED_KEYS.forEach((key) => {
          expect(result).toHaveProperty(key);
        });
      });
    });
  });

  describe('no values are empty strings', () => {
    ALL_LANGUAGES.forEach((lang) => {
      it(`language "${lang}" has no empty string values`, () => {
        const result = getCVLabels(lang);
        REQUIRED_KEYS.forEach((key) => {
          expect(result[key]).not.toBe('');
          expect(result[key].length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('getCVLabels("az") returns correct type with expected values', () => {
    const result: CVLabels = getCVLabels('az');
    expect(result.workExperience).toBe('İş Təcrübəsi');
    expect(result.education).toBe('Təhsil');
    expect(result.skills).toBe('Bacarıqlar');
    expect(result.languages).toBe('Dillər');
    expect(result.courses).toBe('Kurslar');
    expect(result.certificates).toBe('Sertifikatlar');
    expect(result.interests).toBe('Maraqlar');
    expect(result.references).toBe('Referanslar');
    expect(result.aboutMe).toBe('Haqqımda');
    expect(result.personalInfo).toBe('Şəxsi Məlumatlar');
    expect(result.phone).toBe('Telefon');
    expect(result.email).toBe('E-poçt');
    expect(result.address).toBe('Ünvan');
    expect(result.city).toBe('Şəhər');
    expect(result.present).toBe('Davam edir');
    expect(result.linkedin).toBe('LinkedIn');
  });

  it('getCVLabels("en") returns correct English values', () => {
    const result: CVLabels = getCVLabels('en');
    expect(result.workExperience).toBe('Work Experience');
    expect(result.education).toBe('Education');
    expect(result.present).toBe('Present');
    expect(result.driversLicense).toBe("Driver's License");
  });

  it('getCVLabels("ru") returns correct Russian values', () => {
    const result: CVLabels = getCVLabels('ru');
    expect(result.workExperience).toBe('Опыт работы');
    expect(result.education).toBe('Образование');
    expect(result.present).toBe('По настоящее время');
  });
});
