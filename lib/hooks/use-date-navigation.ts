"use client"

import { useState } from "react"

export function useDateNavigation(initialDate = new Date()) {
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setSelectedDate(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setSelectedDate(newDate)
  }

  const getPreviousMonthInfo = () => {
    const prevMonth = new Date(selectedDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    return {
      date: prevMonth,
      name: prevMonth.toLocaleString("default", { month: "short" }),
    }
  }

  const getNextMonthInfo = () => {
    const nextMonth = new Date(selectedDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return {
      date: nextMonth,
      name: nextMonth.toLocaleString("default", { month: "short" }),
    }
  }

  const getCurrentMonthInfo = () => {
    return {
      name: selectedDate.toLocaleString("default", { month: "long" }),
      shortName: selectedDate.toLocaleString("default", { month: "short" }),
      year: selectedDate.getFullYear(),
    }
  }

  // Get default date for the expense form (1st of current month)
  const getDefaultDate = () => {
    const today = new Date()
    // If today is in the selected month, use today
    if (today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear()) {
      return today.toISOString().split("T")[0]
    }
    // Otherwise use the 1st day of the selected month
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split("T")[0]
  }

  return {
    selectedDate,
    setSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
    getPreviousMonthInfo,
    getNextMonthInfo,
    getCurrentMonthInfo,
    getDefaultDate,
  }
}
