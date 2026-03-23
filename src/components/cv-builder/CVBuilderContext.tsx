'use client';

import { createContext, useContext } from 'react';
import type { CVFormData, CVFormAction, CVAnalysisResult, CoverLetterResult } from '@/types/cv';

// ─── Form Context (stable — only changes on user edits) ───
interface CVFormContextType {
  state: CVFormData;
  dispatch: React.Dispatch<CVFormAction>;
}

const CVFormContext = createContext<CVFormContextType | null>(null);

export function CVFormProvider({ children, value }: { children: React.ReactNode; value: CVFormContextType }) {
  return <CVFormContext.Provider value={value}>{children}</CVFormContext.Provider>;
}

export function useCVFormContext(): CVFormContextType {
  const ctx = useContext(CVFormContext);
  if (!ctx) throw new Error('useCVFormContext must be used within CVFormProvider');
  return ctx;
}

// ─── UI Context (volatile — loading flags, results, errors) ───
interface CVUIContextType {
  analysisResult: CVAnalysisResult | null;
  setAnalysisResult: (result: CVAnalysisResult | null) => void;
  coverLetterResult: CoverLetterResult | null;
  setCoverLetterResult: (result: CoverLetterResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  isGeneratingCoverLetter: boolean;
  setIsGeneratingCoverLetter: (v: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;
}

const CVUIContext = createContext<CVUIContextType | null>(null);

export function CVUIProvider({ children, value }: { children: React.ReactNode; value: CVUIContextType }) {
  return <CVUIContext.Provider value={value}>{children}</CVUIContext.Provider>;
}

export function useCVUIContext(): CVUIContextType {
  const ctx = useContext(CVUIContext);
  if (!ctx) throw new Error('useCVUIContext must be used within CVUIProvider');
  return ctx;
}
