'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCVFormReducer } from '@/hooks/useCVForm';
import { CVFormProvider, CVUIProvider } from './CVBuilderContext';
import CVLanguageSelector from './CVLanguageSelector';
import TemplateSelector from './templates/TemplateSelector';
import TemplatePreview from './templates/preview/TemplatePreview';
import CVProgressIndicator from './common/CVProgressIndicator';
import PhotoUpload from './form/PhotoUpload';
import PersonalInfoSection from './form/PersonalInfoSection';
import AboutMeSection from './form/AboutMeSection';
import WorkExperienceSection from './form/WorkExperienceSection';
import EducationSection from './form/EducationSection';
import SkillsSection from './form/SkillsSection';
import LanguagesSection from './form/LanguagesSection';
import CoursesSection from './form/CoursesSection';
import CertificatesSection from './form/CertificatesSection';
import InterestsSection from './form/InterestsSection';
import ReferencesSection from './form/ReferencesSection';
import ATSScorePanel from './ai/ATSScorePanel';
import CVAnalysisPanel from './ai/CVAnalysisPanel';
import CoverLetterTab from './ai/CoverLetterTab';
import { generateCVDocx, analyzeCVData, downloadBlob } from '@/lib/cv-builder/cv-api';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, Search } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import type { CVAnalysisResult, CoverLetterResult, CVBuilderStep } from '@/types/cv';

export default function CVBuilder() {
  const t = useTranslations('cvBuilder');
  const { state: formState, dispatch, getSavedDraft, clearDraft } = useCVFormReducer();

  // UI State
  const [currentStep, setCurrentStep] = useState<CVBuilderStep>('language');
  const [showPreview, setShowPreview] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = getSavedDraft();
    if (draft && draft.templateId) {
      setShowRestoreDialog(true);
    }
  }, [getSavedDraft]);

  const handleRestore = () => {
    const draft = getSavedDraft();
    if (draft) {
      dispatch({ type: 'LOAD_STATE', payload: draft });
      setCurrentStep('form');
    }
    setShowRestoreDialog(false);
  };

  const handleStartFresh = () => {
    clearDraft();
    dispatch({ type: 'RESET' });
    setShowRestoreDialog(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeCVData(formState);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.analyzeFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const blob = await generateCVDocx(formState, formState.photo);
      const fileName = `CV_${formState.personalInfo.firstName}_${formState.personalInfo.lastName}.docx`;
      downloadBlob(blob, fileName);
      clearDraft();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  };

  const uiContextValue = {
    analysisResult,
    setAnalysisResult,
    coverLetterResult,
    setCoverLetterResult,
    isAnalyzing,
    setIsAnalyzing,
    isGenerating,
    setIsGenerating,
    isGeneratingCoverLetter,
    setIsGeneratingCoverLetter,
    error,
    setError,
  };

  return (
    <CVFormProvider value={{ state: formState, dispatch }}>
      <CVUIProvider value={uiContextValue}>
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

          {/* Restore Dialog */}
          <Dialog.Root open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg z-50 max-w-md w-full">
                <Dialog.Title className="text-lg font-bold">{t('restore.title')}</Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-2">
                  {t('restore.message')}
                </Dialog.Description>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleRestore}>{t('restore.continue')}</Button>
                  <Button variant="outline" onClick={handleStartFresh}>
                    {t('restore.startFresh')}
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Step: Language */}
          {currentStep === 'language' && (
            <CVLanguageSelector onSelect={() => setCurrentStep('template')} />
          )}

          {/* Step: Template */}
          {currentStep === 'template' && (
            <div className="space-y-4">
              <TemplateSelector />
              {formState.templateId && (
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    {t('templateSelector.preview')}
                  </Button>
                  <Button onClick={() => setCurrentStep('form')}>
                    {t('actions.next')}
                  </Button>
                </div>
              )}
              <TemplatePreview isOpen={showPreview} onClose={() => setShowPreview(false)} />
            </div>
          )}

          {/* Step: Form */}
          {currentStep === 'form' && (
            <div className="flex gap-6">
              {/* Left sidebar: progress */}
              <div className="hidden lg:block w-48 flex-shrink-0 sticky top-4 self-start">
                <CVProgressIndicator />
              </div>

              {/* Main form */}
              <div className="flex-1 space-y-8">
                <PhotoUpload />
                <PersonalInfoSection />
                <AboutMeSection />
                <WorkExperienceSection />
                <EducationSection />
                <SkillsSection />
                <LanguagesSection />
                <CoursesSection />
                <CertificatesSection />
                <InterestsSection />
                <ReferencesSection />

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 sticky bottom-4 bg-background/80 backdrop-blur p-4 rounded-lg border">
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} variant="outline">
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    {t('actions.analyze')}
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4 mr-2" />
                    )}
                    {t('actions.generate')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    {t('templateSelector.preview')}
                  </Button>
                </div>

                {/* AI Results - Tabs (shown after analysis) */}
                {(analysisResult || coverLetterResult) && (
                  <Tabs.Root defaultValue="analysis" className="mt-6">
                    <Tabs.List className="flex border-b mb-4">
                      <Tabs.Trigger
                        value="analysis"
                        className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                      >
                        {t('ai.analysis.title')}
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="ats"
                        className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                      >
                        {t('ai.atsScore.title')}
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="coverLetter"
                        className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary"
                      >
                        {t('ai.coverLetter.title')}
                      </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="analysis">
                      <CVAnalysisPanel />
                    </Tabs.Content>
                    <Tabs.Content value="ats">
                      <ATSScorePanel />
                    </Tabs.Content>
                    <Tabs.Content value="coverLetter">
                      <CoverLetterTab />
                    </Tabs.Content>
                  </Tabs.Root>
                )}

                {/* Always show cover letter tab even without analysis */}
                {!analysisResult && !coverLetterResult && (
                  <div className="mt-6 border rounded-lg">
                    <CoverLetterTab />
                  </div>
                )}

                <TemplatePreview isOpen={showPreview} onClose={() => setShowPreview(false)} />
              </div>
            </div>
          )}
        </div>
      </CVUIProvider>
    </CVFormProvider>
  );
}
