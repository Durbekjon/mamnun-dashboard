"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GET_CONTACT_REQUESTS } from "@/services/contact.service"

export function StatsChart() {
  const [stats, setStats] = useState({
    business: 0,
    edu: 0,
    travel: 0,
    other: 0,
  })

  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const { data } = await GET_CONTACT_REQUESTS()
        setStats({
          business: data.business || 0,
          edu: data.edu || 0,
          travel: data.travel || 0,
          other: data.other || 0,
        })
      } catch (error) {
        console.error("Failed to fetch contact stats", error)
      }
    }
    fetchContactRequests()
  }, [])

  // Define theme-consistent colors using CSS variables
  const CHART_COLORS = [
    "var(--color-chart-1, hsl(var(--chart-1)))",
    "var(--color-chart-2, hsl(var(--chart-2)))",
    "var(--color-chart-3, hsl(var(--chart-3)))",
    "var(--color-chart-4, hsl(var(--chart-4)))",
  ]

  // Create CSS variables for the chart colors
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--color-chart-1", "hsl(var(--chart-1))")
    root.style.setProperty("--color-chart-2", "hsl(var(--chart-2))")
    root.style.setProperty("--color-chart-3", "hsl(var(--chart-3))")
    root.style.setProperty("--color-chart-4", "hsl(var(--chart-4))")
  }, [])

  const pieData = Object.entries(stats).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
    value,
  }))

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Request Categories</CardTitle>
        <CardDescription>Distribution of contact requests by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col justify-center">
        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(stats).map(([key, value], index) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-xs font-medium capitalize">{key}:</span>
              <span className="text-xs font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Pie chart */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => (percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : "")}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  className="stroke-background stroke-2"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} requests`, "Count"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

