"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MonthSwitcherProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function MonthSwitcher({ selectedDate, onDateChange }: MonthSwitcherProps) {
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
  const prevMonthName = prevMonth.toLocaleString("default", { month: "long" })

  const nextMonth = new Date(selectedDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const nextMonthName = nextMonth.toLocaleString("default", { month: "long" })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{prevMonthName}</span>
          </Button>

          <h2 className="text-lg font-medium">
            {currentMonth} {currentYear}
          </h2>

          <Button variant="ghost" size="sm" onClick={goToNextMonth} className="flex items-center">
            <span className="hidden sm:inline">{nextMonthName}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
