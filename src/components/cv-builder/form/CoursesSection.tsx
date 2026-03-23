'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import { Input } from '@/components/ui/input';
import type { Course } from '@/types/cv';

export default function CoursesSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.courses;

  const update = (id: string, data: Partial<Course>) => {
    dispatch({ type: 'UPDATE_COURSE', payload: { id, data } });
  };

  return (
    <div id="cv-section-courses" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.courses.title')}
        addLabel={t('form.courses.add')}
        onAdd={() => dispatch({ type: 'ADD_COURSE' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_COURSE', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.courses.name')}
              </label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => update(item.id, { name: e.target.value })}
                placeholder={t('form.courses.name')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.courses.organization')}
                </label>
                <Input
                  type="text"
                  value={item.organization}
                  onChange={(e) => update(item.id, { organization: e.target.value })}
                  placeholder={t('form.courses.organization')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.courses.date')}
                </label>
                <Input
                  type="month"
                  value={item.date}
                  onChange={(e) => update(item.id, { date: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
