import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddExpense from './AddExpense'
import { Expense } from '../types/expense'

describe('AddExpense', () => {
  const mockOnAddExpense = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock the current date to ensure consistent testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-04-14'))
  })
  
  afterEach(() => {
    jest.useRealTimers()
  })
  
  it('renders the form with default values', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    expect(screen.getByLabelText(/amount/i)).toHaveDisplayValue('')
    expect(screen.getByLabelText(/category/i)).toHaveValue('Housing')
    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(screen.getByLabelText(/date/i)).toHaveValue('2024-04-14')
  })
  
  it('calls onAddExpense with correct data when form is submitted', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food & Dining' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Groceries' } })
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-04-15' } })
    
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }))
    
    expect(mockOnAddExpense).toHaveBeenCalledWith({
      amount: 100,
      category: 'Food & Dining',
      description: 'Groceries',
      date: '2024-04-15T00:00:00.000Z'
    })
  })
  
  it('resets the form after submission', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food & Dining' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Groceries' } })
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-04-15' } })
    
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }))
    
    expect(screen.getByLabelText(/amount/i)).toHaveDisplayValue('')
    expect(screen.getByLabelText(/category/i)).toHaveValue('Housing')
    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(screen.getByLabelText(/date/i)).toHaveValue('2024-04-15') // Date should not reset
  })
  
  it('validates required fields', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }))
    
    // Check that onAddExpense was not called
    expect(mockOnAddExpense).not.toHaveBeenCalled()
    
    // Check that required fields have the required attribute
    expect(screen.getByLabelText(/amount/i)).toHaveAttribute('required')
    expect(screen.getByLabelText(/date/i)).toHaveAttribute('required')
  })
}) 