'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';

const MIN_CHARS = 50;
const MAX_CHARS = 500;

export default function AboutMeSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();

  const value = state.personalInfo.aboutMe ?? '';
  const count = value.length;
  const isBelowMin = count > 0 && count < MIN_CHARS;
  const isAboveMax = count > MAX_CHARS;
  const counterRed = isBelowMin || isAboveMax;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { aboutMe: e.target.value },
    });
  };

  return (
    <div id="cv-section-aboutMe" className="space-y-2">
      <textarea
        value={value}
        onChange={handleChange}
        rows={5}
        maxLength={MAX_CHARS + 50} // allow a bit over so user sees counter turn red
        placeholder={t('form.aboutMe.placeholder')}
        className={`w-full rounded-md border px-3 py-2 text-sm resize-none bg-transparent ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors ${
          isAboveMax ? 'border-destructive' : 'border-input'
        }`}
      />
      <div className="flex items-center justify-between">
        {isBelowMin && (
          <p className="text-xs text-destructive">
            {t('form.aboutMe.tooShort', { min: MIN_CHARS })}
          </p>
        )}
        {isAboveMax && (
          <p className="text-xs text-destructive">
            {t('form.aboutMe.tooLong', { max: MAX_CHARS })}
          </p>
        )}
        {!isBelowMin && !isAboveMax && <span />}
        <span
          className={`text-xs font-mono ml-auto ${
            counterRed ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          {count}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
