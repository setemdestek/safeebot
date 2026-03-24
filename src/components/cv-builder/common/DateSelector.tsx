'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import CustomSelect from './CustomSelect';

interface DateSelectorProps {
  mode: 'date' | 'month';
  value: string; // "YYYY-MM-DD" or "YYYY-MM"
  onChange: (value: string) => void;
  disabled?: boolean;
}

function getDaysInMonth(year: string, month: string): number {
  if (!year || !month) return 31;
  return new Date(parseInt(year), parseInt(month), 0).getDate();
}

const currentYear = new Date().getFullYear();

export default function DateSelector({ mode, value, onChange, disabled = false }: DateSelectorProps) {
  const t = useTranslations('cvBuilder');

  // Parse initial value into parts
  const parseValue = (v: string) => {
    const parts = v ? v.split('-') : [];
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: mode === 'date' ? (parts[2] || '') : '',
    };
  };

  const initial = parseValue(value);
  const [selYear, setSelYear] = useState(initial.year);
  const [selMonth, setSelMonth] = useState(initial.month);
  const [selDay, setSelDay] = useState(initial.day);

  // Sync if parent resets value to empty
  useEffect(() => {
    if (!value) {
      setSelYear('');
      setSelMonth('');
      setSelDay('');
    }
  }, [value]);

  // Emit combined value whenever any part changes
  const emit = (y: string, m: string, d: string) => {
    if (mode === 'month') {
      onChange(y && m ? `${y}-${m}` : '');
    } else {
      onChange(y && m && d ? `${y}-${m}-${d}` : '');
    }
  };

  const handleYear = (v: string) => { setSelYear(v); emit(v, selMonth, selDay); };
  const handleMonth = (v: string) => { setSelMonth(v); emit(selYear, v, selDay); };
  const handleDay = (v: string) => { setSelDay(v); emit(selYear, selMonth, v); };

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

  const maxDay = getDaysInMonth(selYear, selMonth);
  const dayOptions = Array.from({ length: maxDay }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  }));

  if (mode === 'month') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <CustomSelect
          value={selMonth}
          onChange={handleMonth}
          options={monthOptions}
          placeholder={t('form.datePicker.month')}
          disabled={disabled}
        />
        <CustomSelect
          value={selYear}
          onChange={handleYear}
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
        value={selDay}
        onChange={handleDay}
        options={dayOptions}
        placeholder={t('form.datePicker.day')}
        disabled={disabled}
      />
      <CustomSelect
        value={selMonth}
        onChange={handleMonth}
        options={monthOptions}
        placeholder={t('form.datePicker.month')}
        disabled={disabled}
      />
      <CustomSelect
        value={selYear}
        onChange={handleYear}
        options={yearOptions}
        placeholder={t('form.datePicker.year')}
        disabled={disabled}
      />
    </div>
  );
}
