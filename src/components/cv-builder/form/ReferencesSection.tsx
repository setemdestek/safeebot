'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import { Input } from '@/components/ui/input';
import type { Reference } from '@/types/cv';

export default function ReferencesSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.references;

  const update = (id: string, data: Partial<Reference>) => {
    dispatch({ type: 'UPDATE_REFERENCE', payload: { id, data } });
  };

  return (
    <div id="cv-section-references" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.references.title')}
        addLabel={t('form.references.add')}
        onAdd={() => dispatch({ type: 'ADD_REFERENCE' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_REFERENCE', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.references.fullName')}
                </label>
                <Input
                  type="text"
                  value={item.fullName}
                  onChange={(e) => update(item.id, { fullName: e.target.value })}
                  placeholder={t('form.references.fullName')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.references.position')}
                </label>
                <Input
                  type="text"
                  value={item.position}
                  onChange={(e) => update(item.id, { position: e.target.value })}
                  placeholder={t('form.references.position')}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.references.company')}
              </label>
              <Input
                type="text"
                value={item.company}
                onChange={(e) => update(item.id, { company: e.target.value })}
                placeholder={t('form.references.company')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.references.phone')}
                </label>
                <Input
                  type="tel"
                  value={item.phone}
                  onChange={(e) => update(item.id, { phone: e.target.value })}
                  placeholder="+994 50 000 00 00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.references.email')}
                </label>
                <Input
                  type="email"
                  value={item.email}
                  onChange={(e) => update(item.id, { email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
