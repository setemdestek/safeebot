'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import type { CVLanguage } from '@/types/cv';

const LANGUAGES: { code: CVLanguage; flag: string }[] = [
  { code: 'az', flag: '🇦🇿' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'ru', flag: '🇷🇺' },
];

interface CVLanguageSelectorProps {
  onSelect: () => void;
}

export default function CVLanguageSelector({ onSelect }: CVLanguageSelectorProps) {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();

  const handleSelect = (code: CVLanguage) => {
    dispatch({ type: 'SET_LANGUAGE', payload: code });
    onSelect();
  };

  return (
    <div className="text-center space-y-6 py-12">
      <h2 className="text-2xl font-bold">{t('languageSelector.title')}</h2>
      <p className="text-muted-foreground">{t('languageSelector.subtitle')}</p>
      <div className="flex justify-center gap-4">
        {LANGUAGES.map(({ code, flag }) => (
          <motion.button
            key={code}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(code)}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-colors min-w-[140px] ${
              state.cvLanguage === code
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="text-4xl">{flag}</span>
            <span className="font-semibold">
              {t(`languageSelector.${code}` as Parameters<typeof t>[0])}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
