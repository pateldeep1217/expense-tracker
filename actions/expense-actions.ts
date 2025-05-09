"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { Expense } from "@/types/expense"

// Get expenses for a specific month and year
export async function getExpensesByMonth(month: number, year: number) {
  const supabase = createServerSupabaseClient()

  // Calculate start and end dates for the month
  const startDate = new Date(year, month, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    throw new Error("Failed to fetch expenses")
  }

  return data as Expense[]
}

// Add a new expense
export async function addExpense(expense: Omit<Expense, "id" | "created_at">) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("expenses").insert([expense]).select()

  if (error) {
    console.error("Error adding expense:", error)
    throw new Error("Failed to add expense")
  }

  return data[0] as Expense
}

// Update an existing expense
export async function updateExpense(expense: Expense) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("expenses")
    .update({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    })
    .eq("id", expense.id)
    .select()

  if (error) {
    console.error("Error updating expense:", error)
    throw new Error("Failed to update expense")
  }

  return data[0] as Expense
}

// Delete an expense
export async function deleteExpense(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error)
    throw new Error("Failed to delete expense")
  }

  return true
}
