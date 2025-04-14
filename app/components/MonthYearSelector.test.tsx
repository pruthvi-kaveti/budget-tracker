import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MonthYearSelector from './MonthYearSelector'

describe('MonthYearSelector', () => {
  const mockOnMonthChange = jest.fn()
  const mockOnYearChange = jest.fn()
  const defaultProps = {
    selectedMonth: 0,
    selectedYear: 2024,
    availableYears: [2023, 2024],
    onMonthChange: mockOnMonthChange,
    onYearChange: mockOnYearChange,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders month and year dropdowns', () => {
    render(<MonthYearSelector {...defaultProps} />)
    
    expect(screen.getByLabelText(/month/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument()
  })

  it('calls onMonthChange when month is selected', () => {
    render(<MonthYearSelector {...defaultProps} />)
    
    const monthSelect = screen.getByLabelText(/month/i)
    fireEvent.change(monthSelect, { target: { value: '1' } })
    
    expect(mockOnMonthChange).toHaveBeenCalledWith(1)
  })

  it('calls onYearChange when year is selected', () => {
    render(<MonthYearSelector {...defaultProps} />)
    
    const yearSelect = screen.getByLabelText(/year/i)
    fireEvent.change(yearSelect, { target: { value: '2023' } })
    
    expect(mockOnYearChange).toHaveBeenCalledWith(2023)
  })
}) 