/**
 * @fileoverview Type definitions for the budget tracking application
 */

/**
 * Represents a single expense entry
 */
export interface Expense {
  /** Unique identifier for the expense */
  id: string;
  /** Amount spent */
  amount: number;
  /** Category of the expense */
  category: string;
  /** Description of the expense */
  description: string;
  /** Date when the expense occurred */
  date: Date;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * Represents budget allocation for a specific category
 */
export interface CategoryBudget {
  /** Name of the spending category */
  category: string;
  /** Allocated budget amount */
  amount: number;
}

/**
 * Represents overall budget settings
 */
export interface BudgetSettings {
  /** Total monthly budget limit */
  monthlyBudget: number;
  /** Array of category-specific budget allocations */
  categoryBudgets: CategoryBudget[];
}

/**
 * Type for expense filtering options
 */
export interface ExpenseFilter {
  /** Selected month (1-12) */
  month?: number;
  /** Selected year */
  year?: number;
  /** Selected category */
  category?: string;
}

/**
 * Type for expense sorting options
 */
export type SortOption = 'date' | 'amount' | 'category';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'; 