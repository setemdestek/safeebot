'use client';

import { useTranslations } from 'next-intl';
import { useCVUIContext } from '@/components/cv-builder/CVBuilderContext';
import { Check, AlertTriangle, Lightbulb } from 'lucide-react';

export default function CVAnalysisPanel() {
  const t = useTranslations('cvBuilder');
  const { analysisResult, isAnalyzing } = useCVUIContext();

  if (isAnalyzing) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted rounded animate-pulse"
            style={{ width: `${80 - i * 10}%` }}
          />
        ))}
      </div>
    );
  }

  if (!analysisResult) return null;

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h3 className="text-lg font-bold">{t('ai.analysis.title')}</h3>

      {/* Overall Impression */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-1">{t('ai.analysis.overallImpression')}</h4>
        <p className="text-sm">{analysisResult.overallImpression}</p>
      </div>

      {/* Strengths */}
      {analysisResult.strengths.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {t('ai.analysis.strengths')}
          </h4>
          <ul className="space-y-1">
            {analysisResult.strengths.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {analysisResult.improvements.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            {t('ai.analysis.improvements')}
          </h4>
          <div className="space-y-3">
            {analysisResult.improvements.map((imp, i) => (
              <div key={i} className="text-sm border rounded p-3 space-y-1">
                <p className="font-medium">
                  {t('ai.analysis.section')}: {imp.section}
                </p>
                <p>
                  <span className="text-muted-foreground">{t('ai.analysis.current')}:</span>{' '}
                  {imp.current}
                </p>
                <p>
                  <span className="text-green-600">{t('ai.analysis.suggested')}:</span>{' '}
                  {imp.suggested}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('ai.analysis.why')}: {imp.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Errors */}
      {analysisResult.grammarErrors.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            {t('ai.analysis.grammarErrors')}
          </h4>
          <div className="space-y-2">
            {analysisResult.grammarErrors.map((err, i) => (
              <div key={i} className="text-sm border rounded p-2">
                <p>
                  <span className="text-muted-foreground">{t('ai.analysis.location')}:</span>{' '}
                  {err.location}
                </p>
                <p>
                  <span className="text-red-500">{t('ai.analysis.error')}:</span> {err.error}
                </p>
                <p>
                  <span className="text-green-600">{t('ai.analysis.correction')}:</span>{' '}
                  {err.correction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Actions */}
      {analysisResult.topThreeActions.length > 0 && (
        <div className="p-3 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-2">{t('ai.analysis.topActions')}</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {analysisResult.topThreeActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
