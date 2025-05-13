import type { Expense } from "@/types/expense"
import ExpenseDayGroup from "@/components/expenses/expense-day-group"

interface ExpenseListProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
  isLoading: boolean
}

export default function ExpenseList({ expenses, onEditExpense, onDeleteExpense, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No expenses this month</p>
        <p className="text-sm text-muted-foreground mt-1">Tap + to add your first expense</p>
      </div>
    )
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group expenses by date
  const groupedExpenses: Record<string, Expense[]> = {}

  sortedExpenses.forEach((expense) => {
    const date = expense.date
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = []
    }
    groupedExpenses[date].push(expense)
  })

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="space-y-6 mt-4">
      {sortedDates.map((date) => (
        <ExpenseDayGroup
          key={date}
          date={date}
          expenses={groupedExpenses[date]}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
        />
      ))}
    </div>
  )
}
