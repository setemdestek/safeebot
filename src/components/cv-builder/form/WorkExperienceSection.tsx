'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import DateRangeField from '@/components/cv-builder/common/DateRangeField';
import { Input } from '@/components/ui/input';
import type { WorkExperience } from '@/types/cv';

export default function WorkExperienceSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.workExperience;

  const update = (id: string, data: Partial<WorkExperience>) => {
    dispatch({ type: 'UPDATE_WORK_EXPERIENCE', payload: { id, data } });
  };

  return (
    <div id="cv-section-workExperience" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.workExperience.title')}
        addLabel={t('form.workExperience.add')}
        onAdd={() => dispatch({ type: 'ADD_WORK_EXPERIENCE' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_WORK_EXPERIENCE', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.workExperience.company')}
                </label>
                <Input
                  type="text"
                  value={item.company}
                  onChange={(e) => update(item.id, { company: e.target.value })}
                  placeholder={t('form.workExperience.company')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.workExperience.position')}
                </label>
                <Input
                  type="text"
                  value={item.position}
                  onChange={(e) => update(item.id, { position: e.target.value })}
                  placeholder={t('form.workExperience.position')}
                />
              </div>
            </div>

            <DateRangeField
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.currentlyWorking}
              onStartDateChange={(v) => update(item.id, { startDate: v })}
              onEndDateChange={(v) => update(item.id, { endDate: v })}
              onCurrentChange={(v) => update(item.id, { currentlyWorking: v })}
              startLabel={t('form.workExperience.startDate')}
              endLabel={t('form.workExperience.endDate')}
              currentLabel={t('form.workExperience.currentlyWorking')}
            />

            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.workExperience.description')}
              </label>
              <textarea
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
                rows={3}
                placeholder={t('form.workExperience.descriptionPlaceholder')}
                className="w-full rounded-md border border-input px-3 py-2 text-sm resize-none bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
