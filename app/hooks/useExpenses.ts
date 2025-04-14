'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, CategoryTotal, BudgetSettings } from '../types/expense';

const defaultBudgetSettings: BudgetSettings = {
  monthlyBudget: 50000,
  categoryBudgets: []
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(defaultBudgetSettings);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const calculateTotals = useCallback(() => {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === selectedMonth && 
             expenseDate.getFullYear() === selectedYear;
    });

    const newTotalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setMonthlySpending(newTotalSpent);
    setTotalBalance(budgetSettings.monthlyBudget - newTotalSpent);

    // Calculate category totals with budget percentages for selected month
    const categoryMap = new Map<string, number>();
    filteredExpenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const totals = Array.from(categoryMap.entries()).map(([category, amount]) => {
      const categoryBudget = budgetSettings.categoryBudgets.find(b => b.category === category);
      const budgetAmount = categoryBudget?.amount || 0;
      const percentage = budgetAmount > 0 ? (amount / budgetAmount) * 100 : (amount / newTotalSpent) * 100;
      
      return {
        category,
        amount,
        percentage,
      };
    });

    setCategoryTotals(totals.sort((a, b) => b.amount - a.amount));
  }, [expenses, budgetSettings, selectedMonth, selectedYear]);

  useEffect(() => {
    calculateTotals();
  }, [expenses, budgetSettings, selectedMonth, selectedYear, calculateTotals]);

  // Load expenses and budget settings from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedSettings = localStorage.getItem('budgetSettings');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedSettings) {
      setBudgetSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save expenses and budget settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budgetSettings', JSON.stringify(budgetSettings));
  }, [expenses, budgetSettings]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateBudgetSettings = (settings: BudgetSettings) => {
    setBudgetSettings(settings);
  };

  const getMonthlyData = () => {
    const monthlyData = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = months[date.getMonth()];
      const current = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, current + expense.amount);
    });

    return months.map((month) => ({
      month,
      amount: monthlyData.get(month) || 0,
    }));
  };

  const getAvailableYears = () => {
    const years = new Set<number>();
    expenses.forEach(expense => {
      years.add(new Date(expense.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  return {
    expenses,
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
  };
}; 