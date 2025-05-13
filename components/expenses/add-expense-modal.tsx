"use client"

import type { Expense } from "@/types/expense"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import ExpenseForm from "@/components/expenses/expense-form"

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExpense: (expense: Omit<Expense, "id" | "created_at">) => Promise<boolean>
  defaultDate: string
  monthName: string
}

export default function AddExpenseModal({
  open,
  onOpenChange,
  onAddExpense,
  defaultDate,
  monthName,
}: AddExpenseModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={`Add Expense for ${monthName}`}>
      <ExpenseForm
        onSubmit={async (expense) => {
          const success = await onAddExpense(expense)
          if (success) {
            onOpenChange(false)
          }
          return success
        }}
        onCancel={() => onOpenChange(false)}
        defaultDate={defaultDate}
      />
    </BottomSheet>
  )
}
