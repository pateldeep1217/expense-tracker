"use client"

import type { Expense } from "@/types/expense"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"

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

interface ExpenseItemProps {
  expense: Expense
  onEdit: () => void
  onDelete: () => void
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const icon = CATEGORY_ICONS[expense.category] || "📦"

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span>{icon}</span>
              <Badge variant="outline" className="text-xs font-normal">
                {expense.category}
              </Badge>
            </div>
            {expense.description && <p className="text-sm">{expense.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{formatCurrency(expense.amount)}</p>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-7 w-7">
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 text-destructive">
                <Trash className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
