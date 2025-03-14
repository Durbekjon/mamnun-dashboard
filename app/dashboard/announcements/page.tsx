import Link from "next/link"
import { CalendarClock, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground">Create and manage events for your organization.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example events */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">EduFair 2025</CardTitle>
              <Badge>Visible</Badge>
            </div>
            <CardDescription className="flex items-center gap-1 text-xs">
              <CalendarClock className="h-3 w-3" />
              April 6, 2025 • 10:00 AM - 6:00 PM
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              This is a fantastic opportunity for both institutions and students...
            </p>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="#">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">Tech Innovation Summit</CardTitle>
              <Badge>Visible</Badge>
            </div>
            <CardDescription className="flex items-center gap-1 text-xs">
              <CalendarClock className="h-3 w-3" />
              March 15, 2025 • 10:00 AM
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              Join us for a full day of talks, workshops, and networking focused on the latest technology trends and
              innovations.
            </p>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="#">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">Career Fair 2025</CardTitle>
              <Badge variant="outline">Hidden</Badge>
            </div>
            <CardDescription className="flex items-center gap-1 text-xs">
              <CalendarClock className="h-3 w-3" />
              May 20, 2025 • 9:00 AM
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              Connect with top employers from various industries. Bring your resume and be prepared for on-the-spot
              interviews with participating companies.
            </p>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href="#">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

