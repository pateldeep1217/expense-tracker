"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Expense } from "@/types/expense"

interface MonthNavigatorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  expenses: Expense[]
}

export default function MonthNavigator({ selectedDate, onDateChange, expenses }: MonthNavigatorProps) {
  const currentMonth = selectedDate.toLocaleString("default", { month: "long" })
  const currentYear = selectedDate.getFullYear()

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    onDateChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    onDateChange(newDate)
  }

  // Get previous and next month names
  const prevMonth = new Date(selectedDate)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const prevMonthName = prevMonth.toLocaleString("default", { month: "short" })

  const nextMonth = new Date(selectedDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthName = nextMonth.toLocaleString("default", { month: "short" })

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="p-4 bg-background">
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="flex items-center p-1 h-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>{prevMonthName}</span>
        </Button>

        <h2 className="text-sm font-medium text-muted-foreground">
          {currentMonth} {currentYear}
        </h2>

        <Button variant="ghost" size="sm" onClick={goToNextMonth} className="flex items-center p-1 h-8">
          <span>{nextMonthName}</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="text-center py-3 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground">You spent</p>
        <p className="text-2xl font-bold text-primary">{formatCurrency(total)}</p>
        <p className="text-sm text-muted-foreground">in {currentMonth}</p>
      </div>
    </div>
  )
}
