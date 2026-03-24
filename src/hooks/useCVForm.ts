'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import type {
  CVFormData,
  CVFormAction,
  CVLanguage,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Language as CVLang,
  Course,
  Certificate,
  Reference,
} from '@/types/cv';

const STORAGE_KEY = 'cv-builder-draft';

const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  city: '',
  address: undefined,
  driversLicense: undefined,
  gender: 'male',
  maritalStatus: 'single',
  linkedinUrl: undefined,
  aboutMe: undefined,
};

export const initialFormData: CVFormData = {
  cvLanguage: 'az',
  templateId: '',
  photo: null,
  personalInfo: initialPersonalInfo,
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  courses: [],
  certificates: [],
  interests: [],
  references: [],
};

function createId(): string {
  return crypto.randomUUID();
}

function cvFormReducer(state: CVFormData, action: CVFormAction): CVFormData {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, cvLanguage: action.payload };
    case 'SET_TEMPLATE':
      return { ...state, templateId: action.payload };
    case 'SET_PHOTO':
      return { ...state, photo: action.payload };
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };

    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: [
          ...state.workExperience,
          { id: createId(), company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, description: '' },
        ],
      };
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        workExperience: state.workExperience.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_WORK_EXPERIENCE':
      return { ...state, workExperience: state.workExperience.filter((item) => item.id !== action.payload) };

    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [
          ...state.education,
          { id: createId(), institution: '', major: '', startDate: '', endDate: '', currentlyStudying: false, city: '' },
        ],
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_EDUCATION':
      return { ...state, education: state.education.filter((item) => item.id !== action.payload) };

    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, { id: createId(), name: '', level: 'intermediate' }],
      };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_SKILL':
      return { ...state, skills: state.skills.filter((item) => item.id !== action.payload) };

    case 'ADD_LANGUAGE':
      return {
        ...state,
        languages: [...state.languages, { id: createId(), name: '', level: 'B1' }],
      };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_LANGUAGE':
      return { ...state, languages: state.languages.filter((item) => item.id !== action.payload) };

    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, { id: createId(), name: '', organization: '', date: '' }],
      };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_COURSE':
      return { ...state, courses: state.courses.filter((item) => item.id !== action.payload) };

    case 'ADD_CERTIFICATE':
      return {
        ...state,
        certificates: [...state.certificates, { id: createId(), name: '', issuer: '', date: '' }],
      };
    case 'UPDATE_CERTIFICATE':
      return {
        ...state,
        certificates: state.certificates.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_CERTIFICATE':
      return { ...state, certificates: state.certificates.filter((item) => item.id !== action.payload) };

    case 'ADD_INTEREST':
      return { ...state, interests: [...state.interests, action.payload] };
    case 'REMOVE_INTEREST':
      return { ...state, interests: state.interests.filter((_, i) => i !== action.payload) };

    case 'ADD_REFERENCE':
      return {
        ...state,
        references: [...state.references, { id: createId(), fullName: '', position: '', company: '', phone: '', email: '' }],
      };
    case 'UPDATE_REFERENCE':
      return {
        ...state,
        references: state.references.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'REMOVE_REFERENCE':
      return { ...state, references: state.references.filter((item) => item.id !== action.payload) };

    case 'LOAD_STATE':
      return { ...action.payload, photo: null }; // photo can't be restored from storage
    case 'RESET':
      return initialFormData;
    default:
      return state;
  }
}

export { cvFormReducer };

export function useCVFormReducer() {
  const [state, dispatch] = useReducer(cvFormReducer, initialFormData);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save to localStorage (debounced 1s)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const { photo, ...serializableState } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
      } catch {
        // Ignore storage errors
      }
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  // Restore from localStorage
  const getSavedDraft = useCallback((): CVFormData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return { ...JSON.parse(saved), photo: null };
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { state, dispatch, getSavedDraft, clearDraft };
}

export { STORAGE_KEY };
