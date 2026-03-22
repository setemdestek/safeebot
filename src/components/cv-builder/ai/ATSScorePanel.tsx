'use client';

import { useTranslations } from 'next-intl';
import { useCVUIContext } from '@/components/cv-builder/CVBuilderContext';

export default function ATSScorePanel() {
  const t = useTranslations('cvBuilder');
  const { analysisResult } = useCVUIContext();

  if (!analysisResult) return null;

  const { atsScore, atsJustification, atsSubCriteria } = analysisResult;
  const scoreColor = atsScore < 50 ? '#ef4444' : atsScore < 75 ? '#eab308' : '#22c55e';

  const subCriteriaItems = [
    { key: 'keywordRelevance', value: atsSubCriteria.keywordRelevance, max: 25 },
    { key: 'formatCompatibility', value: atsSubCriteria.formatCompatibility, max: 25 },
    { key: 'sectionCompleteness', value: atsSubCriteria.sectionCompleteness, max: 25 },
    { key: 'contentQuality', value: atsSubCriteria.contentQuality, max: 25 },
  ];

  return (
    <div aria-live="polite" className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-bold">{t('ai.atsScore.title')}</h3>

      {/* Circular Score */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={scoreColor} strokeWidth="8"
              strokeDasharray={`${(atsScore / 100) * 264} 264`}
              strokeLinecap="round"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
            style={{ color: scoreColor }}
          >
            {atsScore}
          </span>
        </div>
        <p className="text-sm text-muted-foreground flex-1">{atsJustification}</p>
      </div>

      {/* Sub-criteria */}
      <div className="space-y-2">
        {subCriteriaItems.map(({ key, value, max }) => (
          <div key={key}>
            <div className="flex justify-between text-sm">
              <span>{t(`ai.atsScore.subCriteria.${key}` as Parameters<typeof t>[0])}</span>
              <span className="font-medium">{value}/{max}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(value / max) * 100}%`, backgroundColor: scoreColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
