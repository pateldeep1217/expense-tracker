export interface Expense {
  id: string // UUID from Supabase
  amount: number
  category: string
  description: string
  date: string // ISO date string format
  created_at?: string // Timestamp from Supabase
}
