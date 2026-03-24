'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import DateRangeField from '@/components/cv-builder/common/DateRangeField';
import { Input } from '@/components/ui/input';
import type { Education } from '@/types/cv';

export default function EducationSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.education;

  const update = (id: string, data: Partial<Education>) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data } });
  };

  return (
    <div id="cv-section-education" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.education.title')}
        addLabel={t('form.education.add')}
        onAdd={() => dispatch({ type: 'ADD_EDUCATION' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_EDUCATION', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.education.institution')}
                </label>
                <Input
                  type="text"
                  value={item.institution}
                  onChange={(e) => update(item.id, { institution: e.target.value })}
                  placeholder={t('form.education.institutionPlaceholder')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.education.major')}
                </label>
                <Input
                  type="text"
                  value={item.major}
                  onChange={(e) => update(item.id, { major: e.target.value })}
                  placeholder={t('form.education.majorPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.education.city')}
              </label>
              <Input
                type="text"
                value={item.city}
                onChange={(e) => update(item.id, { city: e.target.value })}
                placeholder={t('form.education.city')}
              />
            </div>

            <DateRangeField
              startDate={item.startDate}
              endDate={item.endDate}
              isCurrent={item.currentlyStudying}
              onStartDateChange={(v) => update(item.id, { startDate: v })}
              onEndDateChange={(v) => update(item.id, { endDate: v })}
              onCurrentChange={(v) => update(item.id, { currentlyStudying: v })}
              startLabel={t('form.education.startDate')}
              endLabel={t('form.education.endDate')}
              currentLabel={t('form.education.currentlyStudying')}
            />
          </div>
        )}
      />
    </div>
  );
}
