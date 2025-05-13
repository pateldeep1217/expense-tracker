"use client"

import { useState, useEffect } from "react"
import type { Expense } from "@/types/expense"
import { getExpensesByMonth, addExpense, updateExpense, deleteExpense } from "@/actions/expense-actions"

export function useExpenses(selectedDate: Date) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch expenses for the selected month
  const fetchExpenses = async () => {
    try {
      setIsLoading(true)
      const selectedMonth = selectedDate.getMonth()
      const selectedYear = selectedDate.getFullYear()

      const data = await getExpensesByMonth(selectedMonth, selectedYear)
      setExpenses(data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch expenses when the selected date changes
  useEffect(() => {
    fetchExpenses()
  }, [selectedDate])

  const handleAddExpense = async (newExpense: Omit<Expense, "id" | "created_at">) => {
    try {
      await addExpense(newExpense)

      // Check if the expense date is in the currently selected month
      const expenseDate = new Date(newExpense.date)
      const isInSelectedMonth =
        expenseDate.getMonth() === selectedDate.getMonth() && expenseDate.getFullYear() === selectedDate.getFullYear()

      // If the expense is for the current month, refresh the list
      if (isInSelectedMonth) {
        fetchExpenses()
      }

      return true
    } catch (error) {
      console.error("Error adding expense:", error)
      return false
    }
  }

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense)
      fetchExpenses() // Refresh the expenses list
      return true
    } catch (error) {
      console.error("Error updating expense:", error)
      return false
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)
      fetchExpenses() // Refresh the expenses list
      return true
    } catch (error) {
      console.error("Error deleting expense:", error)
      return false
    }
  }

  return {
    expenses,
    isLoading,
    addExpense: handleAddExpense,
    updateExpense: handleUpdateExpense,
    deleteExpense: handleDeleteExpense,
    refreshExpenses: fetchExpenses,
  }
}
