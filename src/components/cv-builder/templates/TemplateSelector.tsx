'use client';

import { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { templates } from '@/lib/cv-builder/template-registry';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import TemplateThumbnail from './TemplateThumbnail';

export default function TemplateSelector() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = gridRef.current?.querySelectorAll('[role="radio"]');
    if (!items) return;

    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      default:
        return;
    }

    (items[nextIndex] as HTMLElement).focus();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">{t('templateSelector.title')}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t('templateSelector.subtitle')}</p>
      </div>
      <div
        ref={gridRef}
        role="radiogroup"
        aria-label={t('templateSelector.title')}
        onKeyDown={handleKeyDown}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {templates.map((template, index) => (
          <TemplateThumbnail
            key={template.id}
            template={template}
            isSelected={state.templateId === template.id}
            onSelect={() => dispatch({ type: 'SET_TEMPLATE', payload: template.id })}
            tabIndex={state.templateId === template.id || (!state.templateId && index === 0) ? 0 : -1}
          />
        ))}
      </div>
    </div>
  );
}
