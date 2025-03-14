"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Edit, Plus, Trash2, ImageIcon, Loader2 } from "lucide-react"
import {
  GET_COMPANY_SERVICES,
  CREATE_COMPANY_SERVICE,
  UPDATE_COMPANY_SERVICE,
  DELETE_COMPANY_SERVICE,
} from "@/services/company-services.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Service {
  id: number
  title: string
  imageUrl: string
  description?: string
  type: "edu" | "travel"
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Omit<Service, "id">>({
    title: "",
    imageUrl: "",
    description: "",
    type: "edu",
  })
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async (type?: "edu" | "travel") => {
    try {
      setLoading(true)
      const { data } = await GET_COMPANY_SERVICES(type)
      setServices(data)
    } catch (error) {
      console.error("Failed to fetch services", error)
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "all") {
      fetchServices()
    } else if (value === "edu" || value === "travel") {
      fetchServices(value)
    }
  }

  const handleCreateService = () => {
    setCurrentService(null)
    setFormData({
      title: "",
      imageUrl: "",
      description: "",
      type: "edu",
    })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setCurrentService(service)
    setFormData({
      title: service.title,
      imageUrl: service.imageUrl,
      description: service.description || "",
      type: service.type,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteService = (service: Service) => {
    setCurrentService(service)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!currentService) return

    try {
      await DELETE_COMPANY_SERVICE(currentService.id)
      setServices(services.filter((s) => s.id !== currentService.id))
      toast({
        title: "Service deleted",
        description: "The service has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete service", error)
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentService) {
        // Update existing service
        await UPDATE_COMPANY_SERVICE(currentService.id, {
          ...formData,
          id: currentService.id,
        })

        setServices(services.map((s) => (s.id === currentService.id ? { ...formData, id: currentService.id } : s)))

        toast({
          title: "Service updated",
          description: "The service has been successfully updated.",
        })
      } else {
        // Create new service
        const { data } = await CREATE_COMPANY_SERVICE(formData)
        setServices([...services, data])

        toast({
          title: "Service created",
          description: "The new service has been successfully created.",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save service", error)
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTypeChange = (type: "edu" | "travel") => {
    setFormData((prev) => ({
      ...prev,
      type,
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your company's services and offerings</p>
        </div>
        <Button onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="edu">Education</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          {renderServicesList()}
        </TabsContent>
        <TabsContent value="edu" className="mt-0">
          {renderServicesList()}
        </TabsContent>
        <TabsContent value="travel" className="mt-0">
          {renderServicesList()}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentService ? "Edit Service" : "Create New Service"}</DialogTitle>
            <DialogDescription>
              {currentService
                ? "Update the details of your existing service."
                : "Add a new service to your company's offerings."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter service title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter service description"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label>Service Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="edu"
                      name="type"
                      className="mr-2"
                      checked={formData.type === "edu"}
                      onChange={() => handleTypeChange("edu")}
                    />
                    <Label htmlFor="edu" className="cursor-pointer">
                      Education
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="travel"
                      name="type"
                      className="mr-2"
                      checked={formData.type === "travel"}
                      onChange={() => handleTypeChange("travel")}
                    />
                    <Label htmlFor="travel" className="cursor-pointer">
                      Travel
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{currentService ? "Update Service" : "Create Service"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the service "{currentService?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderServicesList() {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )
    }

    if (services.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground mt-2">
            {activeTab === "all" ? "You haven't added any services yet." : `You don't have any ${activeTab} services.`}
          </p>
          <Button className="mt-4" onClick={handleCreateService}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      )
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl || "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <Badge variant={service.type === "edu" ? "default" : "secondary"}>
                  {service.type === "edu" ? "Education" : "Travel"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {service.description || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-3 mt-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditService(service)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteService(service)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}

