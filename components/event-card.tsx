"use client"

import { useState, useEffect } from "react"
import {
  Edit,
  Save,
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  Building,
  CalendarClock,
  Eye,
  EyeOff,
  Plus,
  Trash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { GET_EVENT, TOGGLE_EVENT_VISIBILITY, UPDATE_EVENT_FIELD } from "@/services/event.service"

// Mock service for event data - replace with actual service
const getEvent = async () => {
  return GET_EVENT()
}

const updateEvent = async (id: number, field: string, value: any) => {
  return { success: true }
}

interface EventData {
  id: number
  eventName: string
  eventDate: string
  eventTime: string
  location: string
  description: string
  studentBenefits: { title: string; description: string }[]
  institutionBenefits: { title: string; description: string }[]
  registrationDeadline: string
  visible: boolean
}

export function EventCard() {
  const [event, setEvent] = useState<EventData | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState<any>(null)
  const [isAddingField, setIsAddingField] = useState<string | null>(null)
  const [newFieldValue, setNewFieldValue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const { data } = await getEvent()
        setEvent(data)
      } catch (error) {
        console.error("Failed to fetch event", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [])

  useEffect(() => {}, [])

  const handleEdit = (field: string, value: any) => {
    setEditingField(field)
    setTempValue(value)
  }

  const handleSave = async () => {
    if (!event || !editingField) return

    try {
      // Create a deep copy of the event
      const updatedEvent = JSON.parse(JSON.stringify(event))
      let updateField = editingField
      let updateValue = tempValue

      // Handle nested fields like studentBenefits.0.title
      if (editingField.includes(".")) {
        const keys = editingField.split(".")
        let target = updatedEvent

        // Traverse through the object except the last key
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]]
        }

        // Set the final value
        target[keys[keys.length - 1]] = tempValue
      } else {
        // Handle top-level fields
        updatedEvent[editingField] = tempValue
      }

      // Ensure we send the correct full object if studentBenefits or institutionBenefits is modified
      if (editingField.startsWith("studentBenefits")) {
        updateField = "studentBenefits"
        updateValue = JSON.stringify(updatedEvent.studentBenefits)
      } else if (editingField.startsWith("institutionBenefits")) {
        updateField = "institutionBenefits"
        updateValue = JSON.stringify(updatedEvent.institutionBenefits)
      }


      await Promise.all([UPDATE_EVENT_FIELD(updateField, updateValue), updateEvent(event.id, updateField, updateValue)])

      setEvent(updatedEvent)
      setEditingField(null)
      setTempValue(null)

      toast({
        title: "Field updated",
        description: `The ${updateField} field has been updated successfully.`,
      })
    } catch (error) {
      console.error("Failed to update event", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the field. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBenefit = async (field: "studentBenefits" | "institutionBenefits", index: number) => {
    if (!event || !event[field]) return

    try {
      // Create a deep copy of the event
      const updatedEvent = JSON.parse(JSON.stringify(event))

      // Remove the selected item from the array
      updatedEvent[field].splice(index, 1)

      // Update the backend with the new array
      await updateEvent(event.id, field, updatedEvent[field])
      await UPDATE_EVENT_FIELD(field, JSON.stringify(updatedEvent[field]))
      // Update state
      setEvent(updatedEvent)

      toast({
        title: "Benefit deleted",
        description: "The benefit has been removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete benefit", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the benefit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditingField(null)
    setTempValue(null)
  }

  const handleAddField = (field: string) => {
    setIsAddingField(field)

    // Initialize with appropriate default values based on field type
    if (field === "studentBenefits" || field === "institutionBenefits") {
      setNewFieldValue({ title: "", description: "" })
    } else if (field === "eventDate" || field === "registrationDeadline") {
      setNewFieldValue(new Date().toISOString().split("T")[0])
    } else if (field === "visible") {
      setNewFieldValue(true)
    } else {
      setNewFieldValue("")
    }
  }

  const handleSaveNewField = async () => {
    if (!event || !isAddingField || newFieldValue === null) return

    try {
      // Create a deep copy of the event
      const updatedEvent = JSON.parse(JSON.stringify(event))
      const updateField = isAddingField
      let updateValue = newFieldValue

      // Handle array fields (studentBenefits, institutionBenefits)
      if (isAddingField === "studentBenefits" || isAddingField === "institutionBenefits") {
        if (!Array.isArray(updatedEvent[isAddingField])) {
          updatedEvent[isAddingField] = []
        }
        updatedEvent[isAddingField].push(newFieldValue)
        updateValue = updatedEvent[isAddingField] // Send full updated array
      } else {
        // Handle regular fields
        updatedEvent[isAddingField] = newFieldValue
      }

      updateValue = JSON.stringify(updateValue)

      await UPDATE_EVENT_FIELD(updateField, updateValue)
      await updateEvent(event.id, updateField, updateValue)
      setEvent(updatedEvent)
      setIsAddingField(null)
      setNewFieldValue(null)

      toast({
        title: "Field added",
        description: `The ${updateField} field has been added successfully.`,
      })
    } catch (error) {
      console.error("Failed to add field", error)
      toast({
        title: "Add failed",
        description: "There was an error adding the field. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelAddField = () => {
    setIsAddingField(null)
    setNewFieldValue(null)
  }

  const toggleVisibility = async () => {
    if (!event) return

    try {
      await TOGGLE_EVENT_VISIBILITY()
      const newVisibility = !event.visible
      await updateEvent(event.id, "visible", newVisibility)

      setEvent({
        ...event,
        visible: newVisibility,
      })
      toast({
        title: newVisibility ? "Event visible" : "Event hidden",
        description: `The event is now ${newVisibility ? "visible to" : "hidden from"} users.`,
      })
    } catch (error) {
      console.error("Failed to toggle visibility", error)
      toast({
        title: "Update failed",
        description: "There was an error updating visibility. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="fade-in">
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>Loading event information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!event) {
    return (
      <Card className="fade-in">
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>No event information available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There was an error loading the event information. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  // Helper function to render edit buttons
  const renderEditButton = (field: string, value: any) => (
    <Button variant="ghost" size="sm" onClick={() => handleEdit(field, value)}>
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit {field}</span>
    </Button>
  )

  // Helper function to render save/cancel buttons
  const renderSaveButtons = () => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={handleCancel}>
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSave}>
        <Save className="h-4 w-4" />
        <span className="sr-only">Save</span>
      </Button>
    </div>
  )

  // Helper function to render add field buttons
  const renderAddFieldButton = (field: string, label: string) => (
    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleAddField(field)}>
      <Plus className="h-4 w-4 mr-2" />
      Add {label}
    </Button>
  )

  return (
    <Card className="fade-in">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>Manage your event information - edit one field at a time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={event.visible ? "default" : "outline"}>{event.visible ? "Visible" : "Hidden"}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVisibility}
            className={event.visible ? "text-green-600" : "text-muted-foreground"}
          >
            {event.visible ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Event
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Event
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Event Name
            </Label>
            {editingField === "eventName"
              ? renderSaveButtons()
              : event.eventName && renderEditButton("eventName", event.eventName)}
          </div>
          {editingField === "eventName" ? (
            <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} placeholder="Enter event name" />
          ) : event.eventName ? (
            <div className="rounded-md border p-3 text-sm">{event.eventName}</div>
          ) : (
            renderAddFieldButton("eventName", "Event Name")
          )}
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Event Date
            </Label>
            {editingField === "eventDate"
              ? renderSaveButtons()
              : event.eventDate && renderEditButton("eventDate", event.eventDate)}
          </div>
          {editingField === "eventDate" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !tempValue && "text-muted-foreground")}
                >
                  {tempValue ? format(new Date(tempValue), "PPP") : <span>Pick a date</span>}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={tempValue ? new Date(tempValue) : undefined}
                  onSelect={(date) => setTempValue(date?.toISOString().split("T")[0])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : event.eventDate ? (
            <div className="rounded-md border p-3 text-sm">{format(new Date(event.eventDate), "PPP")}</div>
          ) : (
            renderAddFieldButton("eventDate", "Event Date")
          )}
        </div>

        {/* Event Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Event Time
            </Label>
            {editingField === "eventTime"
              ? renderSaveButtons()
              : event.eventTime && renderEditButton("eventTime", event.eventTime)}
          </div>
          {editingField === "eventTime" ? (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Enter event time (e.g., 10:00 AM - 6:00 PM)"
            />
          ) : event.eventTime ? (
            <div className="rounded-md border p-3 text-sm">{event.eventTime}</div>
          ) : (
            renderAddFieldButton("eventTime", "Event Time")
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </Label>
            {editingField === "location"
              ? renderSaveButtons()
              : event.location && renderEditButton("location", event.location)}
          </div>
          {editingField === "location" ? (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Enter event location"
            />
          ) : event.location ? (
            <div className="rounded-md border p-3 text-sm">{event.location}</div>
          ) : (
            renderAddFieldButton("location", "Location")
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Description
            </Label>
            {editingField === "description"
              ? renderSaveButtons()
              : event.description && renderEditButton("description", event.description)}
          </div>
          {editingField === "description" ? (
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="Enter event description"
              rows={4}
            />
          ) : event.description ? (
            <div className="rounded-md border p-3 text-sm">{event.description}</div>
          ) : (
            renderAddFieldButton("description", "Description")
          )}
        </div>

        {/* Registration Deadline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <CalendarClock className="h-4 w-4 mr-2" />
              Registration Deadline
            </Label>
            {editingField === "registrationDeadline"
              ? renderSaveButtons()
              : event.registrationDeadline && renderEditButton("registrationDeadline", event.registrationDeadline)}
          </div>
          {editingField === "registrationDeadline" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !tempValue && "text-muted-foreground")}
                >
                  {tempValue ? format(new Date(tempValue), "PPP") : <span>Pick a date</span>}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={tempValue ? new Date(tempValue) : undefined}
                  onSelect={(date) => setTempValue(date?.toISOString().split("T")[0])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : event.registrationDeadline ? (
            <div className="rounded-md border p-3 text-sm">{format(new Date(event.registrationDeadline), "PPP")}</div>
          ) : (
            renderAddFieldButton("registrationDeadline", "Registration Deadline")
          )}
        </div>

        {/* Student Benefits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Student Benefits
            </Label>
          </div>
          {event.studentBenefits && event.studentBenefits.length > 0 ? (
            <div className="space-y-4">
              {event.studentBenefits.map((benefit, index) => (
                <div key={index} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Title</Label>
                    <div className="flex gap-2">
                      {editingField === `studentBenefits.${index}.title`
                        ? renderSaveButtons()
                        : renderEditButton(`studentBenefits.${index}.title`, benefit.title)}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBenefit("studentBenefits", index)}>
                        <Trash className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  {editingField === `studentBenefits.${index}.title` ? (
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Enter benefit title"
                    />
                  ) : (
                    <div className="rounded-md border p-2 text-sm">{benefit.title}</div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Description</Label>
                    {editingField === `studentBenefits.${index}.description`
                      ? renderSaveButtons()
                      : renderEditButton(`studentBenefits.${index}.description`, benefit.description)}
                  </div>
                  {editingField === `studentBenefits.${index}.description` ? (
                    <Textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Enter benefit description"
                      rows={2}
                    />
                  ) : (
                    <div className="rounded-md border p-2 text-sm">{benefit.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {/* Add Student Benefit */}
          {isAddingField === "studentBenefits" ? (
            <div className="rounded-md border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Title</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancelAddField}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSaveNewField}>
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                </div>
              </div>
              <Input
                value={newFieldValue?.title || ""}
                onChange={(e) => setNewFieldValue({ ...newFieldValue, title: e.target.value })}
                placeholder="Enter benefit title"
              />

              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={newFieldValue?.description || ""}
                onChange={(e) =>
                  setNewFieldValue({
                    ...newFieldValue,
                    description: e.target.value,
                  })
                }
                placeholder="Enter benefit description"
                rows={2}
              />
            </div>
          ) : (
            renderAddFieldButton("studentBenefits", "Student Benefit")
          )}
        </div>

        {/* Institution Benefits (Same structure as Student Benefits) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Institution Benefits
            </Label>
          </div>
          {event.institutionBenefits && event.institutionBenefits.length > 0 ? (
            <div className="space-y-4">
              {event.institutionBenefits.map((benefit, index) => (
                <div key={index} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Title</Label>
                    <div className="flex gap-2">
                      {editingField === `institutionBenefits.${index}.title`
                        ? renderSaveButtons()
                        : renderEditButton(`institutionBenefits.${index}.title`, benefit.title)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBenefit("institutionBenefits", index)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  {editingField === `institutionBenefits.${index}.title` ? (
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Enter benefit title"
                    />
                  ) : (
                    <div className="rounded-md border p-2 text-sm">{benefit.title}</div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Description</Label>
                    {editingField === `institutionBenefits.${index}.description`
                      ? renderSaveButtons()
                      : renderEditButton(`institutionBenefits.${index}.description`, benefit.description)}
                  </div>
                  {editingField === `institutionBenefits.${index}.description` ? (
                    <Textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder="Enter benefit description"
                      rows={2}
                    />
                  ) : (
                    <div className="rounded-md border p-2 text-sm">{benefit.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <Button variant={event.visible ? "outline" : "default"} onClick={toggleVisibility}>
          {event.visible ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Event
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Event
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

