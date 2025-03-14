import { EventCard } from "@/components/event-card"

export default function EventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
        <p className="text-muted-foreground">Manage your event information and visibility</p>
      </div>

      <EventCard />
    </div>
  )
}

