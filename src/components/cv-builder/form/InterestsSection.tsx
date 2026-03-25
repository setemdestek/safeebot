'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function InterestsSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const interests = state.interests;

  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (interests.includes(trimmed)) {
      setInputValue('');
      return;
    }
    dispatch({ type: 'ADD_INTEREST', payload: trimmed });
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_INTEREST', payload: index });
  };

  return (
    <div id="cv-section-interests" className="space-y-4">
      {/* Input row */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('form.interests.placeholder')}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="shrink-0"
        >
          {t('form.interests.add')}
        </Button>
      </div>

      {/* Tags */}
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={`${interest}-${index}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
            >
              {interest}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-1 p-1 hover:text-destructive transition-colors rounded-full"
                aria-label={t('form.interests.remove')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {interests.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          {t('form.interests.empty')}
        </p>
      )}
    </div>
  );
}
