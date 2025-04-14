import { renderHook, act } from '@testing-library/react'
import { useExpenses } from './useExpenses'
import { Expense } from '../types/expense'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock crypto.randomUUID
const mockRandomUUID = jest.fn(() => 'test-uuid')
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: mockRandomUUID
  }
})

describe('useExpenses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock the current date to ensure consistent testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-04-14'))
    
    // Clear localStorage mocks
    mockLocalStorage.getItem.mockReset()
    mockLocalStorage.setItem.mockReset()
  })
  
  afterEach(() => {
    jest.useRealTimers()
  })
  
  it('initializes with default values', () => {
    const { result } = renderHook(() => useExpenses())
    
    expect(result.current.expenses).toEqual([])
    expect(result.current.totalBalance).toBe(0)
    expect(result.current.monthlySpending).toBe(0)
    expect(result.current.categoryTotals).toEqual([])
    expect(result.current.selectedMonth).toBe(3) // April (0-indexed)
    expect(result.current.selectedYear).toBe(2024)
  })
  
  it('loads expenses from localStorage on initialization', () => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-04-01T00:00:00.000Z'
      }
    ]
    
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'expenses') return JSON.stringify(mockExpenses)
      return null
    })
    
    const { result } = renderHook(() => useExpenses())
    
    expect(result.current.expenses).toEqual(mockExpenses)
    expect(result.current.totalBalance).toBe(100)
  })
  
  it('adds a new expense correctly', () => {
    const { result } = renderHook(() => useExpenses())
    
    act(() => {
      result.current.addExpense({
        amount: 50,
        category: 'Transportation',
        description: 'Bus fare',
        date: '2024-04-15T00:00:00.000Z'
      })
    })
    
    expect(result.current.expenses).toHaveLength(1)
    expect(result.current.expenses[0]).toEqual({
      id: 'test-uuid',
      amount: 50,
      category: 'Transportation',
      description: 'Bus fare',
      date: '2024-04-15T00:00:00.000Z'
    })
    expect(result.current.totalBalance).toBe(50)
  })
  
  it('filters expenses by selected month and year', () => {
    // Setup initial expenses
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-04-01T00:00:00.000Z'
      },
      {
        id: '2',
        amount: 200,
        category: 'Transportation',
        description: 'Bus fare',
        date: '2024-03-15T00:00:00.000Z'
      }
    ]
    
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'expenses') return JSON.stringify(mockExpenses)
      return null
    })
    
    const { result } = renderHook(() => useExpenses())
    
    // Initial state (April 2024)
    expect(result.current.monthlySpending).toBe(100) // Only the April expense
    
    // Change to March 2024
    act(() => {
      result.current.setSelectedMonth(2) // March (0-indexed)
    })
    
    expect(result.current.monthlySpending).toBe(200) // Only the March expense
    
    // Change to a month with no expenses
    act(() => {
      result.current.setSelectedMonth(0) // January (0-indexed)
    })
    
    expect(result.current.monthlySpending).toBe(0) // No expenses in January
  })
  
  it('calculates category totals correctly for the selected month', () => {
    // Setup initial expenses
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-04-01T00:00:00.000Z'
      },
      {
        id: '2',
        amount: 50,
        category: 'Food',
        description: 'Restaurant',
        date: '2024-04-15T00:00:00.000Z'
      },
      {
        id: '3',
        amount: 200,
        category: 'Transportation',
        description: 'Bus fare',
        date: '2024-03-15T00:00:00.000Z'
      }
    ]
    
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'expenses') return JSON.stringify(mockExpenses)
      return null
    })
    
    const { result } = renderHook(() => useExpenses())
    
    // Initial state (April 2024)
    expect(result.current.categoryTotals).toHaveLength(1)
    expect(result.current.categoryTotals[0].category).toBe('Food')
    expect(result.current.categoryTotals[0].amount).toBe(150) // 100 + 50
    
    // Change to March 2024
    act(() => {
      result.current.setSelectedMonth(2) // March (0-indexed)
    })
    
    expect(result.current.categoryTotals).toHaveLength(1)
    expect(result.current.categoryTotals[0].category).toBe('Transportation')
    expect(result.current.categoryTotals[0].amount).toBe(200)
  })
  
  it('gets available years from expenses', () => {
    // Setup initial expenses
    const mockExpenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: '2024-04-01T00:00:00.000Z'
      },
      {
        id: '2',
        amount: 200,
        category: 'Transportation',
        description: 'Bus fare',
        date: '2023-03-15T00:00:00.000Z'
      }
    ]
    
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'expenses') return JSON.stringify(mockExpenses)
      return null
    })
    
    const { result } = renderHook(() => useExpenses())
    
    const availableYears = result.current.getAvailableYears()
    expect(availableYears).toEqual([2023, 2024])
  })
}) 