"use client"

import { useState } from "react"
import MonthNavigator from "@/components/expenses/month-navigator"
import ExpenseList from "@/components/expenses/expense-list"
import FloatingActionButton from "@/components/expenses/floating-action-button"
import AddExpenseModal from "@/components/expenses/add-expense-modal"
import EditExpenseModal from "@/components/expenses/edit-expense-modal"
import { useExpenses } from "@/lib/hooks/use-expenses"
import { useDateNavigation } from "@/lib/hooks/use-date-navigation"
import { useModal } from "@/lib/hooks/use-modal"
import type { Expense } from "@/types/expense"

export default function Home() {
  const dateNav = useDateNavigation()
  const { selectedDate } = dateNav

  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses(selectedDate)

  const addModal = useModal()
  const editModal = useModal()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  // Get month information
  const { name: currentMonthName, shortName: currentMonthShortName, year: currentYear } = dateNav.getCurrentMonthInfo()
  const { name: prevMonthName } = dateNav.getPreviousMonthInfo()
  const { name: nextMonthName } = dateNav.getNextMonthInfo()

  // Handle editing an expense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    editModal.open()
  }

  return (
    <main className="max-w-md mx-auto pb-20">
      {/* Fixed header with month navigation */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <MonthNavigator
          selectedDate={selectedDate}
          onPreviousMonth={dateNav.goToPreviousMonth}
          onNextMonth={dateNav.goToNextMonth}
          expenses={expenses}
          previousMonthName={prevMonthName}
          nextMonthName={nextMonthName}
          currentMonthName={currentMonthName}
          currentYear={currentYear}
        />
      </div>

      <div className="px-4 py-3">
        {/* Expense list */}
        <ExpenseList
          expenses={expenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={deleteExpense}
          isLoading={isLoading}
        />
      </div>

      {/* Floating action button */}
      <FloatingActionButton onClick={addModal.open} currentMonth={currentMonthShortName} />

      {/* Add expense modal */}
      <AddExpenseModal
        open={addModal.isOpen}
        onOpenChange={addModal.setIsOpen}
        onAddExpense={addExpense}
        defaultDate={dateNav.getDefaultDate()}
        monthName={`${currentMonthName} ${currentYear}`}
      />

      {/* Edit expense modal */}
      <EditExpenseModal
        expense={editingExpense}
        open={editModal.isOpen}
        onOpenChange={editModal.setIsOpen}
        onUpdate={updateExpense}
        defaultDate={dateNav.getDefaultDate()}
      />
    </main>
  )
}
