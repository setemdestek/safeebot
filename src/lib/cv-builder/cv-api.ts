import type { CVFormData, CVAnalysisResult, CoverLetterResult } from '@/types/cv';

/**
 * Normalize form data before sending to API.
 * JSON.stringify strips `undefined` values, which makes Zod fail
 * on required string fields. Convert undefined → '' for string fields.
 */
function prepareForAPI(cvData: CVFormData) {
  const { photo: _, ...data } = cvData;
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      aboutMe: data.personalInfo.aboutMe ?? '',
      address: data.personalInfo.address ?? '',
      driversLicense: data.personalInfo.driversLicense ?? '',
      linkedinUrl: data.personalInfo.linkedinUrl ?? '',
    },
  };
}

export async function generateCVDocx(cvData: CVFormData, photo: File | null): Promise<Blob> {
  const formData = new FormData();
  const prepared = prepareForAPI(cvData);
  formData.append('cvData', JSON.stringify(prepared));
  if (photo) formData.append('photo', photo);

  const response = await fetch('/api/cv-builder/generate', {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    let errorMessage = 'CV yaradılarkən xəta baş verdi.';
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        const fieldErrors = errorData.errors.fieldErrors ?? {};
        const messages = Object.entries(fieldErrors)
          .flatMap(([, msgs]) => msgs as string[]);
        if (messages.length > 0) {
          errorMessage = messages.join('\n');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      if (response.status === 401) errorMessage = 'Autentifikasiya xətası.';
      else if (response.status === 429) errorMessage = 'Gündəlik limit dolmuşdur.';
    }
    throw new Error(errorMessage);
  }

  return response.blob();
}

export async function analyzeCVData(cvData: CVFormData): Promise<CVAnalysisResult> {
  const prepared = prepareForAPI(cvData);
  const response = await fetch('/api/cv-builder/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvData: prepared }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    let errorMessage = 'Analiz zamanı xəta baş verdi.';
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        const fieldErrors = errorData.errors.fieldErrors ?? {};
        const messages = Object.entries(fieldErrors)
          .flatMap(([, msgs]) => msgs as string[]);
        if (messages.length > 0) {
          errorMessage = messages.join('\n');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      if (response.status === 401) errorMessage = 'Autentifikasiya xətası.';
      else if (response.status === 429) errorMessage = 'Gündəlik limit dolmuşdur.';
      else if (response.status === 503) errorMessage = 'AI xidməti müvəqqəti əlçatmazdır.';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function generateCoverLetter(cvData: CVFormData, jobDescription: string): Promise<CoverLetterResult> {
  const prepared = prepareForAPI(cvData);
  const response = await fetch('/api/cv-builder/cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvData: prepared, jobDescription }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    let errorMessage = 'Məktub yaradılarkən xəta baş verdi.';
    try {
      const errorData = await response.json();
      if (errorData.errors) {
        const fieldErrors = errorData.errors.fieldErrors ?? {};
        const messages = Object.entries(fieldErrors)
          .flatMap(([, msgs]) => msgs as string[]);
        if (messages.length > 0) {
          errorMessage = messages.join('\n');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      if (response.status === 401) errorMessage = 'Autentifikasiya xətası.';
      else if (response.status === 429) errorMessage = 'Gündəlik limit dolmuşdur.';
      else if (response.status === 503) errorMessage = 'AI xidməti müvəqqəti əlçatmazdır.';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
