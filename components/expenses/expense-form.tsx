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
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants"

interface ExpenseFormProps {
  initialExpense?: Partial<Expense>
  onSubmit: (expense: Omit<Expense, "id" | "created_at">) => Promise<boolean>
  onCancel: () => void
  defaultDate: string
  isEdit?: boolean
}

export default function ExpenseForm({
  initialExpense,
  onSubmit,
  onCancel,
  defaultDate,
  isEdit = false,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(defaultDate)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with expense data if provided
  useEffect(() => {
    if (initialExpense) {
      setAmount(initialExpense.amount?.toString() || "")
      setCategory(initialExpense.category || "")
      setDescription(initialExpense.description || "")
      setDate(initialExpense.date || defaultDate)
    } else {
      // Reset form when not editing
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(defaultDate)
    }
    setError("")
  }, [initialExpense, defaultDate])

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

      // Create expense object
      const expenseData: Omit<Expense, "id" | "created_at"> = {
        amount: Number(amount),
        category,
        description,
        date,
      }

      // Submit the expense
      const success = await onSubmit(expenseData)

      if (success) {
        // Reset form if not editing
        if (!isEdit) {
          setAmount("")
          setCategory("")
          setDescription("")
          setDate(defaultDate)
        }
      }
    } catch (error) {
      console.error("Error submitting expense:", error)
      setError("Failed to submit expense. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}
