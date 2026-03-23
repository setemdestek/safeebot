'use client';

import { useTranslations } from 'next-intl';
import { Check, Circle } from 'lucide-react';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';

interface Section {
  key: string;
  isComplete: boolean;
}

export default function CVProgressIndicator() {
  const t = useTranslations('cvBuilder');
  const { state } = useCVFormContext();

  const sections: Section[] = [
    {
      key: 'personalInfo',
      isComplete: !!(state.personalInfo.firstName && state.personalInfo.lastName && state.personalInfo.email && state.personalInfo.phone),
    },
    {
      key: 'aboutMe',
      isComplete: !!(state.personalInfo.aboutMe && state.personalInfo.aboutMe.length >= 50),
    },
    {
      key: 'workExperience',
      isComplete: state.workExperience.length > 0 && state.workExperience.every((w) => w.company && w.position),
    },
    {
      key: 'education',
      isComplete: state.education.length > 0 && state.education.every((e) => e.institution && e.major),
    },
    {
      key: 'skills',
      isComplete: state.skills.length > 0 && state.skills.every((s) => s.name),
    },
    {
      key: 'languages',
      isComplete: state.languages.length > 0 && state.languages.every((l) => l.name),
    },
    { key: 'courses', isComplete: true }, // Optional, always "complete"
    { key: 'certificates', isComplete: true }, // Optional
    { key: 'interests', isComplete: true }, // Optional
    { key: 'references', isComplete: true }, // Optional
  ];

  const completedCount = sections.filter((s) => s.isComplete).length;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground mb-3">
        {completedCount}/{sections.length}
      </div>
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          onClick={() => {
            const el = document.getElementById(`cv-section-${section.key}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex items-center gap-2 w-full text-left text-sm py-1 hover:text-primary transition-colors"
        >
          {section.isComplete ? (
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className={section.isComplete ? 'text-foreground' : 'text-muted-foreground'}>
            {t(`progress.${section.key}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
