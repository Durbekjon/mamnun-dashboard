"use client";
import type React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Visit {
  id: number;
  count: number;
  date: string;
  visits: string[];
}

interface VisitsChartProps {
  data: Visit[];
}

const getMonthName = (month: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month] || "Unknown";
};

// Sample data for when real data is not available
const sampleData = [
  { date: "Jan", visitsCount: 65 },
  { date: "Feb", visitsCount: 59 },
  { date: "Mar", visitsCount: 80 },
  { date: "Apr", visitsCount: 81 },
  { date: "May", visitsCount: 56 },
  { date: "Jun", visitsCount: 55 },
];

export const VisitsChart: React.FC<VisitsChartProps> = ({ data }) => {
  const [type, setType] = useState<"daily" | "monthly" | "yearly">("monthly");

  // Use sample data if no real data is available
  const useRealData = data && Array.isArray(data) && data.length > 0;

  let chartData: { date: string; visitsCount: number }[] = [];

  if (useRealData) {
    const today = new Date().toISOString().split("T")[0];

    if (type === "daily") {
      const hourlyData: Record<string, number> = {};

      data.forEach((item) => {
        if (Array.isArray(item.visits)) {
          item.visits.forEach((visit) => {
            if (visit && typeof visit === "string" && visit.startsWith(today)) {
              const hour = visit.split("T")[1]?.slice(0, 2) + ":00" || "00:00";
              if (!hourlyData[hour]) hourlyData[hour] = 0;
              hourlyData[hour]++;
            }
          });
        }
      });

      chartData = Object.entries(hourlyData).map(([hour, count]) => ({
        date: hour,
        visitsCount: count,
      }));
    } else if (type === "monthly") {
      const monthlyData: Record<string, number> = {};
      data.forEach((item) => {
        if (item.date && typeof item.date === "string") {
          try {
            const month = getMonthName(new Date(item.date).getMonth());
            if (!monthlyData[month]) monthlyData[month] = 0;
            monthlyData[month] += item.count || 0;
          } catch (e) {
            console.error("Invalid date format:", item.date);
          }
        }
      });
      chartData = Object.keys(monthlyData).map((month) => ({
        date: month,
        visitsCount: monthlyData[month],
      }));
    } else if (type === "yearly") {
      const yearlyData: Record<number, number> = {};
      data.forEach((item) => {
        if (item.date && typeof item.date === "string") {
          try {
            const year = new Date(item.date).getFullYear();
            if (!yearlyData[year]) yearlyData[year] = 0;
            yearlyData[year] += item.count || 0;
          } catch (e) {
            console.error("Invalid date format:", item.date);
          }
        }
      });
      chartData = Object.keys(yearlyData).map((year) => ({
        date: year.toString(),
        visitsCount: yearlyData[Number(year)],
      }));
    }

    // Sort data chronologically
    if (type === "monthly") {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      chartData.sort(
        (a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
      );
    } else if (type === "yearly") {
      chartData.sort((a, b) => Number(a.date) - Number(b.date));
    } else {
      // For daily, sort by hour
      chartData.sort((a, b) => {
        const hourA = Number.parseInt(a.date.split(":")[0]);
        const hourB = Number.parseInt(b.date.split(":")[0]);
        return hourA - hourB;
      });
    }
  }

  // If no real data or processing failed, use sample data
  if (chartData.length === 0) {
    console.log(chartData);
    chartData = [{ visitsCount: 0, date: "" }];
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
            <YAxis
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
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
              formatter={(value) => (
                <span className="text-sm font-medium">{value}</span>
              )}
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
  );
};
