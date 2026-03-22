'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import ProficiencySelector from '@/components/cv-builder/common/ProficiencySelector';
import { Input } from '@/components/ui/input';
import type { Language } from '@/types/cv';

export default function LanguagesSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.languages;

  const update = (id: string, data: Partial<Language>) => {
    dispatch({ type: 'UPDATE_LANGUAGE', payload: { id, data } });
  };

  return (
    <div id="cv-section-languages" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.languages.title')}
        addLabel={t('form.languages.add')}
        onAdd={() => dispatch({ type: 'ADD_LANGUAGE' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_LANGUAGE', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.languages.name')}
              </label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => update(item.id, { name: e.target.value })}
                placeholder={t('form.languages.namePlaceholder')}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.languages.level')}
              </label>
              <ProficiencySelector
                type="language"
                value={item.level}
                onChange={(v) => update(item.id, { level: v as Language['level'] })}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
