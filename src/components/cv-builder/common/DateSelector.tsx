'use client';

import { useTranslations } from 'next-intl';
import CustomSelect from './CustomSelect';

interface DateSelectorProps {
  mode: 'date' | 'month';
  value: string; // "YYYY-MM-DD" or "YYYY-MM"
  onChange: (value: string) => void;
  disabled?: boolean;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const currentYear = new Date().getFullYear();

export default function DateSelector({ mode, value, onChange, disabled = false }: DateSelectorProps) {
  const t = useTranslations('cvBuilder');

  // Parse current value
  const parts = value ? value.split('-') : [];
  const selectedYear = parts[0] || '';
  const selectedMonth = parts[1] || '';
  const selectedDay = mode === 'date' ? (parts[2] || '') : '';

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: t(`form.months.${i + 1}`),
  }));

  const yearOptions = Array.from(
    { length: mode === 'date' ? currentYear - 1939 : currentYear - 1969 + 2 },
    (_, i) => {
      const y = currentYear + 1 - i;
      return { value: String(y), label: String(y) };
    }
  );

  const maxDay = selectedYear && selectedMonth
    ? getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth))
    : 31;

  const dayOptions = Array.from({ length: maxDay }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  }));

  const handleChange = (type: 'day' | 'month' | 'year', val: string) => {
    let y = selectedYear;
    let m = selectedMonth;
    let d = selectedDay;

    if (type === 'year') y = val;
    if (type === 'month') m = val;
    if (type === 'day') d = val;

    if (mode === 'month') {
      if (y && m) onChange(`${y}-${m}`);
      else onChange('');
    } else {
      if (y && m && d) onChange(`${y}-${m}-${d}`);
      else onChange('');
    }
  };

  if (mode === 'month') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <CustomSelect
          value={selectedMonth}
          onChange={(v) => handleChange('month', v)}
          options={monthOptions}
          placeholder={t('form.datePicker.month')}
          disabled={disabled}
        />
        <CustomSelect
          value={selectedYear}
          onChange={(v) => handleChange('year', v)}
          options={yearOptions}
          placeholder={t('form.datePicker.year')}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <CustomSelect
        value={selectedDay}
        onChange={(v) => handleChange('day', v)}
        options={dayOptions}
        placeholder={t('form.datePicker.day')}
        disabled={disabled}
      />
      <CustomSelect
        value={selectedMonth}
        onChange={(v) => handleChange('month', v)}
        options={monthOptions}
        placeholder={t('form.datePicker.month')}
        disabled={disabled}
      />
      <CustomSelect
        value={selectedYear}
        onChange={(v) => handleChange('year', v)}
        options={yearOptions}
        placeholder={t('form.datePicker.year')}
        disabled={disabled}
      />
    </div>
  );
}
