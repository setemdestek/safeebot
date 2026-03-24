'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVFormContext } from '@/components/cv-builder/CVBuilderContext';
import { Input } from '@/components/ui/input';
import DateSelector from '@/components/cv-builder/common/DateSelector';
import CustomSelect from '@/components/cv-builder/common/CustomSelect';
import type { PersonalInfo } from '@/types/cv';

const LICENSE_CATEGORIES = ['B', 'C', 'D', 'E'] as const;

export default function PersonalInfoSection() {
  const t = useTranslations('cvBuilder');
  const { state, dispatch } = useCVFormContext();
  const info = state.personalInfo;

  const hasLicense = Boolean(info.driversLicense);
  const [licenseEnabled, setLicenseEnabled] = useState(hasLicense);

  const update = (partial: Partial<PersonalInfo>) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: partial });
  };

  const categoryOptions = LICENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: `${t('form.personalInfo.category')} ${cat}`,
  }));

  return (
    <div id="cv-section-personalInfo" className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.firstName')} <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            value={info.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder={t('form.personalInfo.firstName')}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.lastName')} <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            value={info.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder={t('form.personalInfo.lastName')}
          />
        </div>
      </div>

      {/* Date of Birth + City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.dateOfBirth')} <span className="text-destructive">*</span>
          </label>
          <DateSelector
            mode="date"
            value={info.dateOfBirth}
            onChange={(v) => update({ dateOfBirth: v })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.city')} <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            value={info.city}
            onChange={(e) => update({ city: e.target.value })}
            placeholder={t('form.personalInfo.city')}
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.email')} <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            value={info.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t('form.personalInfo.phone')} <span className="text-destructive">*</span>
          </label>
          <Input
            type="tel"
            value={info.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+994 50 000 00 00"
          />
        </div>
      </div>

      {/* Address (optional) */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          {t('form.personalInfo.address')}
          <span className="text-muted-foreground text-xs ml-1">({t('form.optional')})</span>
        </label>
        <Input
          type="text"
          value={info.address ?? ''}
          onChange={(e) => update({ address: e.target.value })}
          placeholder={t('form.personalInfo.address')}
        />
      </div>

      {/* LinkedIn (optional) */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          {t('form.personalInfo.linkedinUrl')}
          <span className="text-muted-foreground text-xs ml-1">({t('form.optional')})</span>
        </label>
        <Input
          type="url"
          value={info.linkedinUrl ?? ''}
          onChange={(e) => update({ linkedinUrl: e.target.value })}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      {/* Gender + Marital Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('form.personalInfo.gender')} <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            {(['male', 'female'] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={info.gender === g}
                  onChange={() => update({ gender: g })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t(`form.personalInfo.${g}`)}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('form.personalInfo.maritalStatus')} <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-4">
            {(['single', 'married'] as const).map((ms) => (
              <label key={ms} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="maritalStatus"
                  value={ms}
                  checked={info.maritalStatus === ms}
                  onChange={() => update({ maritalStatus: ms })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">{t(`form.personalInfo.${ms}`)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Driver's License (optional) */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {t('form.personalInfo.driversLicense')}
          <span className="text-muted-foreground text-xs ml-1">({t('form.optional')})</span>
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasLicense"
              checked={!licenseEnabled}
              onChange={() => {
                setLicenseEnabled(false);
                update({ driversLicense: undefined });
              }}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{t('form.personalInfo.noLicenseRadio')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasLicense"
              checked={licenseEnabled}
              onChange={() => {
                setLicenseEnabled(true);
                update({ driversLicense: 'B' });
              }}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{t('form.personalInfo.hasLicense')}</span>
          </label>
        </div>
        {licenseEnabled && (
          <CustomSelect
            value={info.driversLicense ?? 'B'}
            onChange={(v) => update({ driversLicense: v })}
            options={categoryOptions}
            placeholder={t('form.personalInfo.category')}
          />
        )}
      </div>
    </div>
  );
}
