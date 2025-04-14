# Budget Tracker

A modern web application for tracking personal expenses and managing budgets. Built with Next.js and Tailwind CSS.

## Features

### Expense Management
- Add and track expenses across different categories
- View expenses with details like amount, category, and date
- Delete or modify existing expenses

### Budget Management
- Set and manage monthly budget limits
- Configure individual category budgets
- Visual representation of budget allocation
- Real-time budget vs. expense tracking

### Monthly View
- Filter expenses by month and year
- View spending trends over time
- Track budget compliance on a monthly basis

### Visual Analytics
- Progress bars showing budget utilization
- Category-wise budget allocation visualization
- Color-coded indicators for budget status
- Percentage breakdowns of spending by category

## Components

### Key Components
1. **MonthYearSelector**
   - Allows users to select specific month and year
   - Dynamically shows available years based on expense data
   - Provides intuitive navigation through time periods

2. **BudgetSettingsPopup**
   - Modal interface for budget configuration
   - Visual indicators for budget allocation
   - Real-time updates of budget distribution
   - Validates total allocation against monthly budget

3. **ExpenseList**
   - Displays expenses in a clean, organized format
   - Supports filtering and sorting
   - Provides expense management options

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
cd budget-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- **Next.js 15.3.0** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React** - UI library

## Project Structure

```
budget-tracker/
├── app/
│   ├── components/
│   │   ├── BudgetSettingsPopup.tsx
│   │   ├── MonthYearSelector.tsx
│   │   └── ... other components
│   ├── types/
│   │   └── expense.ts
│   └── page.tsx
├── public/
├── .env.example
├── .env.local (not in repo)
├── LICENSE
└── ... configuration files
```

## Development Notes

### Budget Management
- Budget settings are managed through a modal popup
- Each category can have its own budget allocation
- Visual feedback provided for budget distribution
- Warning indicators for over-allocation

### Monthly View Implementation
- Expenses are filtered based on selected month and year
- Budget tracking is done on a monthly basis
- Available years are dynamically calculated from expense data

### Type Documentation
- All types are documented in `app/types/expense.ts`
- Components use TypeScript interfaces for props
- JSDoc comments provide detailed documentation

## Future Enhancements
- [ ] Data export functionality
- [ ] More detailed analytics and reports
- [ ] Custom category management
- [ ] Multiple currency support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
