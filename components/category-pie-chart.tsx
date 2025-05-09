"use client"

import { useMemo } from "react"
import type { Expense } from "@/types/expense"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CategoryPieChartProps {
  expenses: Expense[]
}

// Soft pastel colors for the chart
const COLORS = [
  "#8dd3c7",
  "#ffffb3",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
]

export default function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    // Group expenses by category
    const categoryMap = expenses.reduce(
      (acc, expense) => {
        const category = expense.category
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array format for the chart
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  // If no expenses, show a message
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">No expenses to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            category: {
              label: "Category",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
