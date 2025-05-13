"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Expense } from "@/types/expense"

interface MonthNavigatorProps {
  selectedDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  expenses: Expense[]
  previousMonthName: string
  nextMonthName: string
  currentMonthName: string
  currentYear: number
}

export default function MonthNavigator({
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  expenses,
  previousMonthName,
  nextMonthName,
  currentMonthName,
  currentYear,
}: MonthNavigatorProps) {
  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="p-4 bg-background">
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={onPreviousMonth} className="flex items-center p-1 h-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>{previousMonthName}</span>
        </Button>

        <h2 className="text-sm font-medium text-muted-foreground">
          {currentMonthName} {currentYear}
        </h2>

        <Button variant="ghost" size="sm" onClick={onNextMonth} className="flex items-center p-1 h-8">
          <span>{nextMonthName}</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="text-center py-3 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground">You spent</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
        <p className="text-sm text-muted-foreground">in {currentMonthName}</p>
      </div>
    </div>
  )
}
