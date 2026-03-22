'use client';

import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';
import { Input } from '@/components/ui/input';
import type { Certificate } from '@/types/cv';

export default function CertificatesSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const items = state.certificates;

  const update = (id: string, data: Partial<Certificate>) => {
    dispatch({ type: 'UPDATE_CERTIFICATE', payload: { id, data } });
  };

  return (
    <div id="cv-section-certificates" className="space-y-4">
      <DynamicListField
        items={items}
        title={t('form.certificates.title')}
        addLabel={t('form.certificates.add')}
        onAdd={() => dispatch({ type: 'ADD_CERTIFICATE' })}
        onRemove={(id) => dispatch({ type: 'REMOVE_CERTIFICATE', payload: id })}
        renderItem={(item) => (
          <div className="space-y-3 pr-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t('form.certificates.name')}
              </label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => update(item.id, { name: e.target.value })}
                placeholder={t('form.certificates.name')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.certificates.issuer')}
                </label>
                <Input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => update(item.id, { issuer: e.target.value })}
                  placeholder={t('form.certificates.issuer')}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t('form.certificates.date')}
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
