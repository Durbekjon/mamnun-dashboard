"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Info, Loader2, Plus, Trash2 } from "lucide-react"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the form schema with Zod
const formSchema = z.object({
  eventName: z.string().min(2, "Event name must be at least 2 characters."),
  eventDate: z.date({
    required_error: "Event date is required.",
  }),
  eventTime: z.string().min(1, "Event time is required."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  studentBenefits: z.array(
    z.object({
      title: z.string().min(2, "Title must be at least 2 characters."),
      description: z.string().min(5, "Description must be at least 5 characters."),
    }),
  ),
  institutionBenefits: z.array(
    z.object({
      title: z.string().min(2, "Title must be at least 2 characters."),
      description: z.string().min(5, "Description must be at least 5 characters."),
    }),
  ),
  registrationDeadline: z.date({
    required_error: "Registration deadline is required.",
  }),
  visibility: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: undefined,
      eventTime: "",
      location: "",
      description: "",
      studentBenefits: [{ title: "", description: "" }],
      institutionBenefits: [{ title: "", description: "" }],
      registrationDeadline: undefined,
      visibility: true,
    },
  })

  // Function to handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Event Submitted",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <pre className="text-xs text-white">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ),
    })

    setIsSubmitting(false)
  }

  // Function to add a new student benefit
  const addStudentBenefit = () => {
    const currentBenefits = form.getValues("studentBenefits")
    form.setValue("studentBenefits", [...currentBenefits, { title: "", description: "" }])
  }

  // Function to remove a student benefit
  const removeStudentBenefit = (index: number) => {
    const currentBenefits = form.getValues("studentBenefits")
    if (currentBenefits.length > 1) {
      form.setValue(
        "studentBenefits",
        currentBenefits.filter((_, i) => i !== index),
      )
    }
  }

  // Function to add a new institution benefit
  const addInstitutionBenefit = () => {
    const currentBenefits = form.getValues("institutionBenefits")
    form.setValue("institutionBenefits", [...currentBenefits, { title: "", description: "" }])
  }

  // Function to remove an institution benefit
  const removeInstitutionBenefit = (index: number) => {
    const currentBenefits = form.getValues("institutionBenefits")
    if (currentBenefits.length > 1) {
      form.setValue(
        "institutionBenefits",
        currentBenefits.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-3xl mx-auto shadow-lg animate-in fade-in slide-in">
        <CardHeader>
          <CardTitle className="text-2xl">Create Event Announcement</CardTitle>
          <CardDescription>
            Fill out the form below to create a new event announcement. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Event Name */}
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Event Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Time */}
                <FormField
                  control={form.control}
                  name="eventTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Time *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="time" placeholder="Select time" {...field} />
                        </FormControl>
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter event description" className="min-h-[120px] resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Student Benefits */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Student Benefits</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="outline" size="sm" onClick={addStudentBenefit}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Benefit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add another student benefit</TooltipContent>
                    </Tooltip>
                  </div>

                  {form.watch("studentBenefits").map((_, index) => (
                    <div key={index} className="space-y-4 p-4 rounded-lg border relative">
                      <div className="absolute right-2 top-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStudentBenefit(index)}
                              disabled={form.watch("studentBenefits").length <= 1}
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove benefit</TooltipContent>
                        </Tooltip>
                      </div>

                      <FormField
                        control={form.control}
                        name={`studentBenefits.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="Benefit title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`studentBenefits.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Benefit description"
                                className="min-h-[80px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Institution Benefits */}
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Institution Benefits</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" variant="outline" size="sm" onClick={addInstitutionBenefit}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Benefit
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add another institution benefit</TooltipContent>
                    </Tooltip>
                  </div>

                  {form.watch("institutionBenefits").map((_, index) => (
                    <div key={index} className="space-y-4 p-4 rounded-lg border relative">
                      <div className="absolute right-2 top-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeInstitutionBenefit(index)}
                              disabled={form.watch("institutionBenefits").length <= 1}
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove benefit</TooltipContent>
                        </Tooltip>
                      </div>

                      <FormField
                        control={form.control}
                        name={`institutionBenefits.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="Benefit title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`institutionBenefits.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Benefit description"
                                className="min-h-[80px] resize-y"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Registration Deadline */}
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Registration Deadline *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select deadline</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visibility Toggle */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Visibility</FormLabel>
                        <FormDescription>Make this event visible to all users</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>All fields marked with * are required</TooltipContent>
                </Tooltip>
                <span className="text-sm text-muted-foreground">Required fields are marked with *</span>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Create Event Announcement"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

