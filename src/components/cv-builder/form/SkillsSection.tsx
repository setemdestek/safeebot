'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import ProficiencySelector from '@/components/cv-builder/common/ProficiencySelector';
import { Input } from '@/components/ui/input';
import type { Skill } from '@/types/cv';

export default function SkillsSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.skills;

  const update = (id: string, data: Partial<Skill>) => {
    dispatch({ type: 'UPDATE_SKILL', payload: { id, data } });
  };

  return (
    <div id="cv-section-skills" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.skills.title')}
        addLabel={t('form.skills.add')}
        onAdd={() => dispatch({ type: 'ADD_SKILL' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_SKILL', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.skills.name')}
              </label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => update(item.id, { name: e.target.value })}
                placeholder={t('form.skills.namePlaceholder')}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.skills.level')}
              </label>
              <ProficiencySelector
                type="skill"
                value={item.level}
                onChange={(v) => update(item.id, { level: v as Skill['level'] })}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
