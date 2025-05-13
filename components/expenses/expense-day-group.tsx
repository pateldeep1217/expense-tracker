import type { Expense } from "@/types/expense"
import ExpenseItem from "@/components/expenses/expense-item"

interface ExpenseDayGroupProps {
  date: string
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}

export default function ExpenseDayGroup({ date, expenses, onEditExpense, onDeleteExpense }: ExpenseDayGroupProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground">{formattedDate}</h3>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onEdit={onEditExpense} onDelete={onDeleteExpense} />
        ))}
      </div>
    </div>
  )
}
