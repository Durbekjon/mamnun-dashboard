"use client"

import { useEffect, useState } from "react"
import { VisitsChart } from "@/components/visits-chart"
import { RequestsTable } from "@/components/requests-table"
import { StatsChart } from "@/components/stats-chart"
import { GET_VISITS } from "@/services/dashboard.servise"
import { WHOAMI } from "@/services/login.service"
import { AnnouncementCard } from "@/components/announcement-card"
export const fetchME = async () => {
  await WHOAMI()
}
export default function DashboardPage() {
  const [visits, setVisits] = useState<any>(null)

  const fetchVisits = async () => {
    try {
      const { data } = await GET_VISITS()
      if (data && Array.isArray(data)) {
        setVisits(data)
      } else {
        console.error("Invalid visits data format", data)
      }
    } catch (error) {
      console.error("Error fetching visits:", error)
    }
  }

  useEffect(() => {
    fetchVisits()

    fetchME()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard. Here's an overview of your business.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">{visits ? <VisitsChart data={visits} /> : <p>Loading visits...</p>}</div>

        <div className="lg:col-span-1">
          <StatsChart />
        </div>
      </div>

      <div>
        <RequestsTable />
      </div>

      <div>
        <AnnouncementCard />
      </div>
    </div>
  )
}

