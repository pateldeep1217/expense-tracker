"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onClick: () => void
  currentMonth: string
}

export default function FloatingActionButton({ onClick, currentMonth }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2">
      <div className="bg-background/80 backdrop-blur-sm text-sm px-3 py-1 rounded-full shadow-sm border">
        Add to {currentMonth}
      </div>
      <Button onClick={onClick} className="rounded-full w-14 h-14 shadow-lg">
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Expense</span>
      </Button>
    </div>
  )
}
