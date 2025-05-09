import type { Expense } from "@/types/expense"
import ExpenseItem from "./expense-item"

interface ExpenseListProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}

export default function ExpenseList({ expenses, onEditExpense, onDeleteExpense }: ExpenseListProps) {
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

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No expenses this month</p>
        <p className="text-sm text-muted-foreground mt-1">Tap + to add your first expense</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-4">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <div className="space-y-2">
            {groupedExpenses[date].map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onEdit={() => onEditExpense(expense)}
                onDelete={() => onDeleteExpense(expense.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
