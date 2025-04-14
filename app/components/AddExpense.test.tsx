import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddExpense from './AddExpense'

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
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    
    // Check if the date input has today's date as default
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement
    expect(dateInput.value).toBe('2024-04-14')
  })
  
  it('calls onAddExpense with correct data when form is submitted', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-04-15' } })
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100.50' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food & Dining' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Groceries' } })
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /add expense/i }))
    
    // Check if onAddExpense was called with the correct data
    expect(mockOnAddExpense).toHaveBeenCalledTimes(1)
    expect(mockOnAddExpense).toHaveBeenCalledWith({
      date: '2024-04-15T00:00:00.000Z', // ISO string format
      amount: 100.5,
      category: 'Food & Dining',
      description: 'Groceries'
    })
  })
  
  it('resets the form after submission', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-04-15' } })
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100.50' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food & Dining' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Groceries' } })
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /add expense/i }))
    
    // Check if the form was reset
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement
    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement
    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement
    
    expect(dateInput.value).toBe('2024-04-14') // Reset to today's date
    expect(amountInput.value).toBe('')
    expect(categorySelect.value).toBe('Housing') // Reset to first category
    expect(descriptionInput.value).toBe('')
  })
  
  it('validates required fields', () => {
    render(<AddExpense onAddExpense={mockOnAddExpense} />)
    
    // Submit the form without filling in required fields
    fireEvent.submit(screen.getByRole('button', { name: /add expense/i }))
    
    // Check if onAddExpense was not called
    expect(mockOnAddExpense).not.toHaveBeenCalled()
    
    // Check if required fields are marked as required
    expect(screen.getByLabelText(/date/i)).toHaveAttribute('required')
    expect(screen.getByLabelText(/amount/i)).toHaveAttribute('required')
  })
}) 