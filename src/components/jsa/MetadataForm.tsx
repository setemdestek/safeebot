'use client';

import { useTranslations } from 'next-intl';
import { JSAMetadata } from '@/types/jsa';

interface MetadataFormProps {
    value: JSAMetadata;
    onChange: (v: JSAMetadata) => void;
    disabled?: boolean;
}

export default function MetadataForm({ value, onChange, disabled = false }: MetadataFormProps) {
    const t = useTranslations('jsa.metadata');
    const handleChange = (field: keyof JSAMetadata, val: string) => {
        onChange({ ...value, [field]: val });
    };

    // Köməkçi: Şərti olaraq məcburi sahənin boş olub-olmamasını yoxlayır
    const isRequiredEmpty = (fieldValue: string) => fieldValue.trim() === '';

    const inputClass = (isEmpty: boolean) => `
    w-full border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 
    ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed border-gray-300' : ''}
    ${!disabled && isEmpty ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${!disabled && !isEmpty ? 'border-gray-300 focus:ring-[#1F3864] focus:border-transparent' : ''}
  `;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{t('heading')}</h3>

            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('inspectorLabel')}</label>
                <input
                    type="text"
                    value={value.inspector_name}
                    onChange={(e) => handleChange('inspector_name', e.target.value)}
                    disabled={disabled}
                    className={inputClass(isRequiredEmpty(value.inspector_name))}
                    placeholder={t('inspectorPlaceholder')}
                />
                {isRequiredEmpty(value.inspector_name) && (
                    <p className="text-red-500 text-xs mt-1">{t('fieldRequired')}</p>
                )}
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('locationLabel')}</label>
                <input
                    type="text"
                    value={value.work_location}
                    onChange={(e) => handleChange('work_location', e.target.value)}
                    disabled={disabled}
                    className={inputClass(isRequiredEmpty(value.work_location))}
                    placeholder={t('locationPlaceholder')}
                />
                {isRequiredEmpty(value.work_location) && (
                    <p className="text-red-500 text-xs mt-1">{t('fieldRequired')}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('dateLabel')}</label>
                    <input
                        type="date"
                        value={value.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        disabled={disabled}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-transparent ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t('companyLabel')}</label>
                    <input
                        type="text"
                        value={value.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        disabled={disabled}
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-transparent ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                        placeholder={t('companyPlaceholder')}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('notesLabel')}</label>
                <textarea
                    value={value.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    disabled={disabled}
                    rows={3}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3864] focus:border-transparent resize-none ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                    placeholder={t('notesPlaceholder')}
                />
            </div>
        </div>
    );
}
