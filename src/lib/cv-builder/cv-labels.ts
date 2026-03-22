// src/lib/cv-builder/cv-labels.ts
import type { CVLanguage } from '@/types/cv';

export interface CVLabels {
  workExperience: string;
  education: string;
  skills: string;
  languages: string;
  courses: string;
  certificates: string;
  interests: string;
  references: string;
  aboutMe: string;
  personalInfo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  dateOfBirth: string;
  maritalStatus: string;
  single: string;
  married: string;
  male: string;
  female: string;
  driversLicense: string;
  currentlyWorking: string;
  currentlyStudying: string;
  present: string;
  linkedin: string;
}

const labels: Record<CVLanguage, CVLabels> = {
  az: {
    workExperience: 'İş Təcrübəsi',
    education: 'Təhsil',
    skills: 'Bacarıqlar',
    languages: 'Dillər',
    courses: 'Kurslar',
    certificates: 'Sertifikatlar',
    interests: 'Maraqlar',
    references: 'Referanslar',
    aboutMe: 'Haqqımda',
    personalInfo: 'Şəxsi Məlumatlar',
    phone: 'Telefon',
    email: 'E-poçt',
    address: 'Ünvan',
    city: 'Şəhər',
    dateOfBirth: 'Doğum tarixi',
    maritalStatus: 'Ailə vəziyyəti',
    single: 'Subay',
    married: 'Evli',
    male: 'Kişi',
    female: 'Qadın',
    driversLicense: 'Sürücülük vəsiqəsi',
    currentlyWorking: 'Hal-hazırda işləyirəm',
    currentlyStudying: 'Hazırda oxuyuram',
    present: 'Davam edir',
    linkedin: 'LinkedIn',
  },
  en: {
    workExperience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    courses: 'Courses',
    certificates: 'Certificates',
    interests: 'Interests',
    references: 'References',
    aboutMe: 'About Me',
    personalInfo: 'Personal Information',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    city: 'City',
    dateOfBirth: 'Date of Birth',
    maritalStatus: 'Marital Status',
    single: 'Single',
    married: 'Married',
    male: 'Male',
    female: 'Female',
    driversLicense: "Driver's License",
    currentlyWorking: 'Currently Working',
    currentlyStudying: 'Currently Studying',
    present: 'Present',
    linkedin: 'LinkedIn',
  },
  ru: {
    workExperience: 'Опыт работы',
    education: 'Образование',
    skills: 'Навыки',
    languages: 'Языки',
    courses: 'Курсы',
    certificates: 'Сертификаты',
    interests: 'Интересы',
    references: 'Рекомендации',
    aboutMe: 'Обо мне',
    personalInfo: 'Личная информация',
    phone: 'Телефон',
    email: 'Электронная почта',
    address: 'Адрес',
    city: 'Город',
    dateOfBirth: 'Дата рождения',
    maritalStatus: 'Семейное положение',
    single: 'Не в браке',
    married: 'В браке',
    male: 'Мужской',
    female: 'Женский',
    driversLicense: 'Водительские права',
    currentlyWorking: 'В настоящее время работаю',
    currentlyStudying: 'В настоящее время учусь',
    present: 'По настоящее время',
    linkedin: 'LinkedIn',
  },
};

export function getCVLabels(language: CVLanguage): CVLabels {
  return labels[language];
}
