'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVFormContext, useCVUIContext } from '@/components/cv-builder/CVBuilderContext';
import { generateCoverLetter, downloadBlob } from '@/lib/cv-builder/cv-api';
import { Button } from '@/components/ui/button';
import { FileDown, RefreshCw, Loader2 } from 'lucide-react';

export default function CoverLetterTab() {
  const t = useTranslations('cvBuilder');
  const { state } = useCVFormContext();
  const {
    coverLetterResult,
    setCoverLetterResult,
    isGeneratingCoverLetter,
    setIsGeneratingCoverLetter,
    setError,
  } = useCVUIContext();
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerate = async () => {
    setIsGeneratingCoverLetter(true);
    setError(null);
    try {
      const result = await generateCoverLetter(state, jobDescription);
      setCoverLetterResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.coverLetterFailed'));
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleDownload = () => {
    if (!coverLetterResult) return;
    const blob = new Blob([coverLetterResult.coverLetterText], {
      type: 'text/plain;charset=utf-8',
    });
    downloadBlob(
      blob,
      `Cover_Letter_${state.personalInfo.firstName}_${state.personalInfo.lastName}.txt`
    );
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-bold">{t('ai.coverLetter.title')}</h3>
      <p className="text-sm text-muted-foreground">{t('ai.coverLetter.optional')}</p>

      <div>
        <label className="text-sm font-medium mb-1 block">
          {t('ai.coverLetter.jobDescription')}
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t('ai.coverLetter.jobDescriptionPlaceholder')}
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
          rows={5}
        />
      </div>

      <Button onClick={handleGenerate} disabled={isGeneratingCoverLetter}>
        {isGeneratingCoverLetter ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('actions.loading')}
          </>
        ) : coverLetterResult ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('ai.coverLetter.regenerate')}
          </>
        ) : (
          t('ai.coverLetter.generate')
        )}
      </Button>

      {coverLetterResult && (
        <div className="space-y-3">
          <div className="p-4 border rounded-lg bg-muted/30 whitespace-pre-wrap text-sm">
            {coverLetterResult.coverLetterText}
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <FileDown className="w-4 h-4 mr-2" />
            {t('ai.coverLetter.downloadDocx')}
          </Button>
        </div>
      )}
    </div>
  );
}
