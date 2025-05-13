"use client"

import type { Expense } from "@/types/expense"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import ExpenseForm from "@/components/expenses/expense-form"

interface EditExpenseModalProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (expense: Expense) => Promise<boolean>
  defaultDate: string
}

export default function EditExpenseModal({
  expense,
  open,
  onOpenChange,
  onUpdate,
  defaultDate,
}: EditExpenseModalProps) {
  if (!expense) return null

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Edit Expense">
      <ExpenseForm
        initialExpense={expense}
        onSubmit={async (expenseData) => {
          const updatedExpense: Expense = {
            ...expense,
            ...expenseData,
          }
          const success = await onUpdate(updatedExpense)
          if (success) {
            onOpenChange(false)
          }
          return success
        }}
        onCancel={() => onOpenChange(false)}
        defaultDate={defaultDate}
        isEdit={true}
      />
    </BottomSheet>
  )
}
