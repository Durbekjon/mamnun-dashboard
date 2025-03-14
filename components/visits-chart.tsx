"use client"
import type React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Visit {
  id: number
  count: number
  date: string
  visits: string[]
}

interface VisitsChartProps {
  data: Visit[]
}

const getMonthName = (month: number): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[month] || "Unknown"
}

export const VisitsChart: React.FC<VisitsChartProps> = ({ data }) => {
  const [type, setType] = useState<"daily" | "monthly" | "yearly">("monthly")

  if (!data) return <p>Loading visits...</p>

  const today = new Date().toISOString().split("T")[0]

  let chartData: { date: string; visitsCount: number }[] = []

  if (type === "daily") {
    const hourlyData: Record<string, number> = {}

    data.forEach((item) => {
      item.visits.forEach((visit) => {
        if (visit.startsWith(today)) {
          const hour = visit.split("T")[1].slice(0, 2) + ":00"
          if (!hourlyData[hour]) hourlyData[hour] = 0
          hourlyData[hour]++
        }
      })
    })

    chartData = Object.entries(hourlyData).map(([hour, count]) => ({
      date: hour,
      visitsCount: count,
    }))
  } else if (type === "monthly") {
    const monthlyData: Record<string, number> = {}
    data.forEach((item) => {
      const month = getMonthName(new Date(item.date).getMonth())
      if (!monthlyData[month]) monthlyData[month] = 0
      monthlyData[month] += item.count
    })
    chartData = Object.keys(monthlyData).map((month) => ({
      date: month,
      visitsCount: monthlyData[month],
    }))
  } else if (type === "yearly") {
    const yearlyData: Record<number, number> = {}
    data.forEach((item) => {
      const year = new Date(item.date).getFullYear()
      if (!yearlyData[year]) yearlyData[year] = 0
      yearlyData[year] += item.count
    })
    chartData = Object.keys(yearlyData).map((year) => ({
      date: year.toString(),
      visitsCount: yearlyData[Number(year)],
    }))
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Visits Overview</CardTitle>
        <CardDescription>Number of visits per {type}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setType("daily")}
            variant={type === "daily" ? "default" : "outline"}
            size="sm"
            className="h-8"
          >
            Daily
          </Button>
          <Button
            onClick={() => setType("monthly")}
            variant={type === "monthly" ? "default" : "outline"}
            size="sm"
            className="h-8"
          >
            Monthly
          </Button>
          <Button
            onClick={() => setType("yearly")}
            variant={type === "yearly" ? "default" : "outline"}
            size="sm"
            className="h-8"
          >
            Yearly
          </Button>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis tick={{ fill: "hsl(var(--foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="visitsCount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              name="Visits"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

