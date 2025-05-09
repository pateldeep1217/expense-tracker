import type { Expense } from "@/types/expense"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface MonthlyTotalProps {
  expenses: Expense[]
  selectedDate: Date
}

export default function MonthlyTotal({ expenses, selectedDate }: MonthlyTotalProps) {
  // Get month name from selected date
  const monthName = selectedDate.toLocaleString("default", { month: "long" })

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card className="bg-primary/5">
      <CardContent className="p-6">
        <h2 className="text-xl text-center">
          You spent <span className="font-bold text-primary">{formatCurrency(total)}</span> in {monthName}
        </h2>
      </CardContent>
    </Card>
  )
}
