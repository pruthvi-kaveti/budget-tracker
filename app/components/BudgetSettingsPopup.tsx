/**
 * @fileoverview Budget Settings Popup Component
 * 
 * A modal component that allows users to configure their monthly budget and category-wise budget allocations.
 * Features visual indicators for budget distribution and real-time updates.
 */

'use client';

import React, { useState, useEffect } from 'react';
import type { BudgetSettings, CategoryBudget } from '../types/expense';

/** Predefined spending categories */
const categories = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Other'
];

/** Props interface for the BudgetSettingsPopup component */
interface BudgetSettingsPopupProps {
  /** Current budget settings */
  settings: BudgetSettings;
  /** Callback function to update budget settings */
  onUpdateSettings: (settings: BudgetSettings) => void;
  /** Controls visibility of the popup */
  isOpen: boolean;
  /** Callback function to close the popup */
  onClose: () => void;
}

/**
 * BudgetSettingsPopup Component
 * 
 * A modal interface for managing budget settings with visual feedback.
 * Features:
 * - Monthly budget configuration
 * - Category-wise budget allocation
 * - Visual progress bars for budget distribution
 * - Real-time updates and validation
 * 
 * @param {BudgetSettingsPopupProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function BudgetSettingsPopup({ 
  settings, 
  onUpdateSettings, 
  isOpen, 
  onClose 
}: BudgetSettingsPopupProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(
    settings.categoryBudgets.length > 0
      ? settings.categoryBudgets
      : categories.map(category => ({ category, amount: 0 }))
  );
  const [isVisible, setIsVisible] = useState(false);

  // Update local state when settings change
  useEffect(() => {
    setMonthlyBudget(settings.monthlyBudget.toString());
    setCategoryBudgets(
      settings.categoryBudgets.length > 0
        ? settings.categoryBudgets
        : categories.map(category => ({ category, amount: 0 }))
    );
  }, [settings]);

  // Handle animation timing and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Small delay to ensure the DOM is ready before animation starts
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      
      // Re-enable body scrolling when modal is closed
      // Use a small delay to ensure the animation completes first
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      monthlyBudget: parseFloat(monthlyBudget),
      categoryBudgets: categoryBudgets.filter(budget => budget.amount > 0)
    });
    onClose();
  };

  const updateCategoryBudget = (category: string, amount: string) => {
    setCategoryBudgets(prev =>
      prev.map(budget =>
        budget.category === category
          ? { ...budget, amount: parseFloat(amount) || 0 }
          : budget
      )
    );
  };

  // Calculate total allocated budget
  const totalAllocated = categoryBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  
  // Calculate percentage for each category
  const getPercentage = (amount: number) => {
    if (totalAllocated === 0) return 0;
    return Math.round((amount / totalAllocated) * 100);
  };

  // Get color based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 10) return 'bg-blue-200';
    if (percentage < 20) return 'bg-blue-300';
    if (percentage < 30) return 'bg-blue-400';
    if (percentage < 40) return 'bg-blue-500';
    if (percentage < 50) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  // Always render the component, but control visibility with CSS
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
      />
      
      {/* Modal */}
      <div 
        className={`bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">Budget Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Monthly Budget</h3>
            <p className="text-sm text-blue-600 mb-4">
              Set your overall monthly budget limit. This will be used to track your spending progress.
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                id="monthlyBudget"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                required
                min="0"
                step="100"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Category Budgets</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set individual budget limits for each spending category. Leave as 0 to not set a specific limit.
            </p>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Total Allocated: ₹{totalAllocated.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-700">
                  {parseFloat(monthlyBudget) > 0 
                    ? `${Math.round((totalAllocated / parseFloat(monthlyBudget)) * 100)}% of monthly budget` 
                    : '0% of monthly budget'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${totalAllocated > parseFloat(monthlyBudget) ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.min(100, (totalAllocated / (parseFloat(monthlyBudget) || 1)) * 100)}%` }}
                ></div>
              </div>
              {totalAllocated > parseFloat(monthlyBudget) && (
                <p className="text-xs text-red-500 mt-1">Warning: Total allocated exceeds monthly budget</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => {
                const budget = categoryBudgets.find(b => b.category === category);
                const amount = budget?.amount || 0;
                const percentage = getPercentage(amount);
                const colorClass = getColorClass(percentage);
                
                return (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor={`budget-${category}`} className="block text-sm font-medium text-gray-700">
                        {category}
                      </label>
                      <span className="text-xs font-medium text-gray-500">
                        {percentage}% of total
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${colorClass}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        id={`budget-${category}`}
                        value={amount}
                        onChange={(e) => updateCategoryBudget(category, e.target.value)}
                        className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 