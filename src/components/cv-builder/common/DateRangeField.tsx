'use client';

import DateSelector from './DateSelector';

interface DateRangeFieldProps {
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onCurrentChange: (value: boolean) => void;
  currentLabel: string;
  startLabel: string;
  endLabel: string;
}

export default function DateRangeField({
  startDate,
  endDate,
  isCurrent,
  onStartDateChange,
  onEndDateChange,
  onCurrentChange,
  currentLabel,
  startLabel,
  endLabel,
}: DateRangeFieldProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium mb-1 block">{startLabel}</label>
        <DateSelector
          mode="month"
          value={startDate}
          onChange={onStartDateChange}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">{endLabel}</label>
        <DateSelector
          mode="month"
          value={isCurrent ? '' : (endDate || '')}
          onChange={onEndDateChange}
          disabled={isCurrent}
        />
        <label className="flex items-center gap-2 mt-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => onCurrentChange(e.target.checked)}
            className="rounded border-input"
          />
          {currentLabel}
        </label>
      </div>
    </div>
  );
}
