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

// For date selection, let's use a simple native input for now
// We'll implement a React 19 compatible date picker later

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

const CATEGORY_ICONS: { [key: string]: string } = {
  Rent: "🏠",
  Groceries: "🍎",
  Utilities: "💡",
  Transportation: "🚗",
  Entertainment: "🎬",
  Dining: "🍽️",
  Shopping: "🛍️",
  Health: "⚕️",
  Other: "📦",
}

interface ExpenseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExpense: (expense: Omit<Expense, "id" | "created_at">) => void
  selectedDate: Date // Currently viewed month
}

export default function ExpenseFormModal({ open, onOpenChange, onAddExpense, selectedDate }: ExpenseFormModalProps) {
  // Default to a date in the currently selected month
  const getDefaultDate = () => {
    const today = new Date()
    // If today is in the selected month, use today
    if (today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear()) {
      return today.toISOString().split("T")[0]
    }
    // Otherwise use the 1st day of the selected month
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split("T")[0]
  }

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(getDefaultDate())
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(getDefaultDate())
      setError("")
    }
  }, [open, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
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

      // Create new expense
      const newExpense: Omit<Expense, "id" | "created_at"> = {
        amount: Number(amount),
        category,
        description,
        date,
      }

      // Add expense
      await onAddExpense(newExpense)

      // Reset form
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(getDefaultDate())
    } catch (error) {
      console.error("Error submitting expense:", error)
      setError("Failed to add expense. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current month name for the title
  const currentMonthName = selectedDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={`Add Expense for ${currentMonthName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
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
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Date
          </Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </BottomSheet>
  )
}
