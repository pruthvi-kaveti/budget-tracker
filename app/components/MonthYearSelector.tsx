'use client';

import React from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function MonthYearSelector({
  selectedMonth,
  selectedYear,
  availableYears,
  onMonthChange,
  onYearChange,
}: MonthYearSelectorProps) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div className="flex-1">
        <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
          Month
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
          Year
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {availableYears.length > 0 ? (
            availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))
          ) : (
            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
          )}
        </select>
      </div>
    </div>
  );
} 