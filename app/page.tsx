"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MonthNavigator from "@/components/month-navigator"
import ExpenseList from "@/components/expense-list"
import FloatingActionButton from "@/components/floating-action-button"
import ExpenseFormModal from "@/components/expense-form-modal"
import EditExpenseModal from "@/components/edit-expense-modal"
import { getExpensesByMonth, addExpense, updateExpense, deleteExpense } from "@/actions/expense-actions"
import type { Expense } from "@/types/expense"

export default function Home() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get current month name
  const currentMonthName = selectedDate.toLocaleString("default", { month: "short" })

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
      } else {
        // If it's for a different month, optionally switch to that month
        // Uncomment the next line if you want to automatically switch to the expense's month
        // setSelectedDate(new Date(expenseDate.getFullYear(), expenseDate.getMonth(), 1))
      }

      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense)

      // Check if the updated expense date is in the currently selected month
      const expenseDate = new Date(updatedExpense.date)
      const isInSelectedMonth =
        expenseDate.getMonth() === selectedDate.getMonth() && expenseDate.getFullYear() === selectedDate.getFullYear()

      // If the expense is for the current month, refresh the list
      if (isInSelectedMonth) {
        fetchExpenses()
      } else {
        // If it's for a different month, the expense will disappear from the current view
        fetchExpenses()
      }

      setIsEditModalOpen(false)
      setEditingExpense(null)
    } catch (error) {
      console.error("Error updating expense:", error)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)
      fetchExpenses() // Refresh the expenses list
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditModalOpen(true)
  }

  return (
    <main className="max-w-md mx-auto pb-20">
      {/* Fixed header with month navigation */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <MonthNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} expenses={expenses} />
      </div>

      <div className="px-4 py-3">
        {/* Expense list */}
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList expenses={expenses} onEditExpense={handleEditExpense} onDeleteExpense={handleDeleteExpense} />
        )}
      </div>

      {/* Floating action button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} currentMonth={currentMonthName} />

      {/* Add expense modal */}
      <ExpenseFormModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddExpense={handleAddExpense}
        selectedDate={selectedDate}
      />

      {/* Edit expense modal */}
      <EditExpenseModal
        expense={editingExpense}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdate={handleUpdateExpense}
      />
    </main>
  )
}
