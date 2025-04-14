'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import AddExpense from './components/AddExpense';
import BudgetSettingsPopup from './components/BudgetSettingsPopup';
import MonthYearSelector from './components/MonthYearSelector';
import { useExpenses } from './hooks/useExpenses';

const SpendingChart = dynamic(() => import('./components/SpendingChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Monthly Spending</h2>
      <div className="h-80 w-full flex items-center justify-center">
        Loading chart...
      </div>
    </div>
  ),
});

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Dashboard() {
  const {
    totalBalance,
    monthlySpending,
    categoryTotals,
    budgetSettings,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    addExpense,
    updateBudgetSettings,
    getMonthlyData,
    getAvailableYears,
  } = useExpenses();

  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false);

  const openBudgetSettings = () => {
    setIsBudgetSettingsOpen(true);
  };

  const closeBudgetSettings = () => {
    setIsBudgetSettingsOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Balance</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Monthly Spending</h3>
            <p className="text-2xl font-bold text-red-600">₹{monthlySpending.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Budget Status</h3>
              <button 
                onClick={openBudgetSettings}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Budget Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p className={`text-2xl font-bold ${
              (monthlySpending / budgetSettings.monthlyBudget) * 100 > 100
                ? 'text-red-600'
                : (monthlySpending / budgetSettings.monthlyBudget) * 100 > 80
                ? 'text-yellow-600'
                : 'text-blue-600'
            }`}>
              {((monthlySpending / budgetSettings.monthlyBudget) * 100).toFixed(1)}% Used
            </p>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="mb-8">
          <SpendingChart data={getMonthlyData()} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Spending Categories</h2>
              <span className="text-gray-500">
                {months[selectedMonth]} {selectedYear}
              </span>
            </div>
            
            <MonthYearSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              availableYears={getAvailableYears()}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />

            <div className="space-y-4">
              {categoryTotals.map((category) => {
                const categoryBudget = budgetSettings.categoryBudgets.find(b => b.category === category.category);
                const budgetAmount = categoryBudget?.amount || 0;
                const percentage = budgetAmount > 0 ? (category.amount / budgetAmount) * 100 : category.percentage;
                
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 mr-4">
                        <p className="font-medium">{category.category}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              percentage > 100
                                ? 'bg-red-600'
                                : percentage > 80
                                ? 'bg-yellow-600'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₹{category.amount.toFixed(2)}</span>
                        {budgetAmount > 0 && (
                          <span className="text-sm text-gray-500 block">
                            of ₹{budgetAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Expense Form */}
          <div>
            <AddExpense onAddExpense={addExpense} />
          </div>
        </div>
      </div>

      {/* Budget Settings Popup */}
      <BudgetSettingsPopup
        settings={budgetSettings}
        onUpdateSettings={updateBudgetSettings}
        isOpen={isBudgetSettingsOpen}
        onClose={closeBudgetSettings}
      />
    </main>
  );
}
