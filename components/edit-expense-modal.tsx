"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Expense } from "@/types/expense"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign } from "lucide-react"
import { BottomSheet } from "@/components/ui/bottom-sheet"

const CATEGORIES = [
  "Rent",
  "Groceries",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Dining",
  "Shopping",
  "Health",
  "Other",
]

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  Rent: "🏠",
  Groceries: "🛒",
  Utilities: "💡",
  Transportation: "🚗",
  Entertainment: "🎬",
  Dining: "🍽️",
  Shopping: "🛍️",
  Health: "🏥",
  Other: "📦",
}

interface EditExpenseModalProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (expense: Expense) => void
}

export default function EditExpenseModal({ expense, open, onOpenChange, onUpdate }: EditExpenseModalProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when expense changes
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString())
      setCategory(expense.category)
      setDescription(expense.description)
      setDate(expense.date)
    }
  }, [expense])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!expense) return

    setIsSubmitting(true)

    try {
      // Validation
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError("Please enter a valid amount")
        setIsSubmitting(false)
        return
      }

      if (!category) {
        setError("Please select a category")
        setIsSubmitting(false)
        return
      }

      if (!date) {
        setError("Please select a date")
        setIsSubmitting(false)
        return
      }

      // Update expense
      const updatedExpense: Expense = {
        ...expense,
        amount: Number(amount),
        category,
        description,
        date,
      }

      await onUpdate(updatedExpense)
    } catch (error) {
      console.error("Error updating expense:", error)
      setError("Failed to update expense. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Edit Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-amount" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Amount
          </Label>
          <Input
            id="edit-amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_ICONS[cat] || "📦"} {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description (optional)</Label>
          <Textarea
            id="edit-description"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-date" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Date
          </Label>
          <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BottomSheet>
  )
}
