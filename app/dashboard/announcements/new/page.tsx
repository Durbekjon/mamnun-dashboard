import { EventForm } from "@/components/event-form"

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Event Announcement</h1>
        <p className="text-muted-foreground">Create a new event announcement with details and benefits.</p>
      </div>

      <EventForm />
    </div>
  )
}

