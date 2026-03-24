'use client';

import { useTranslations } from 'next-intl';
import CustomSelect from './CustomSelect';

interface ProficiencySelectorProps {
  type: 'skill' | 'language';
  value: string;
  onChange: (value: string) => void;
}

const SKILL_LEVELS = ['beginner', 'intermediate', 'good', 'excellent', 'expert'] as const;
const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native'] as const;

export default function ProficiencySelector({ type, value, onChange }: ProficiencySelectorProps) {
  const t = useTranslations('cvBuilder');

  if (type === 'language') {
    const options = LANGUAGE_LEVELS.map((level) => ({
      value: level,
      label: level === 'native' ? t('form.languages.native') : level,
    }));

    return (
      <CustomSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder="A1"
      />
    );
  }

  // Skill: visual segment selector
  const currentIndex = SKILL_LEVELS.indexOf(value as typeof SKILL_LEVELS[number]);

  return (
    <div className="flex items-center gap-1">
      {SKILL_LEVELS.map((level, index) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={`h-8 flex-1 rounded text-xs font-medium transition-colors ${
            index <= currentIndex
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          title={t(`form.skills.${level}`)}
        >
          {t(`form.skills.${level}`)}
        </button>
      ))}
    </div>
  );
}
