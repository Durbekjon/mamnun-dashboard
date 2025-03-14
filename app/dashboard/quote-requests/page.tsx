"use client"

import { useEffect, useState } from "react"
import {
  MoreHorizontal,
  Trash2,
  Loader2,
  Search,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  X,
  FileText,
} from "lucide-react"
import { GET_QUOTE_REQUESTS, DELETE_QUOTE_REQUEST } from "@/services/quote-request.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Updated interface to match the actual API response
interface IQuoteRequest {
  id: number
  name: string
  email: string
  phoneNumber?: string
  message: string
  quoteType: "EDU" | "TRAVEL" // Changed from 'type' to 'quoteType' to match API
  requestType: string
  createdAt: string
  updatedAt: string
}

export default function QuoteRequestsPage() {
  const [requests, setRequests] = useState<IQuoteRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<IQuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<IQuoteRequest | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IQuoteRequest | null
    direction: "ascending" | "descending"
  }>({ key: "createdAt", direction: "descending" })

  useEffect(() => {
    fetchQuoteRequests()
  }, [])

  useEffect(() => {
    // Ensure requests is an array before filtering
    if (!Array.isArray(requests)) {
      setFilteredRequests([])
      return
    }

    // Apply filtering and sorting
    let result = [...requests]

    // Filter by type based on active tab
    if (activeTab !== "all") {
      result = result.filter((request) =>
        activeTab === "edu" ? request.quoteType === "EDU" : request.quoteType === "TRAVEL",
      )
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (request) =>
          request.name.toLowerCase().includes(term) ||
          request.email.toLowerCase().includes(term) ||
          (request.phoneNumber && request.phoneNumber.toLowerCase().includes(term)) ||
          request.message.toLowerCase().includes(term) ||
          request.requestType.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredRequests(result)
  }, [requests, searchTerm, activeTab, sortConfig])

  const fetchQuoteRequests = async () => {
    try {
      setLoading(true)
      const response = await GET_QUOTE_REQUESTS()

      // Extract the quoteRequests array from the response
      if (response && response.data) {
        if (response.data.quoteRequests && Array.isArray(response.data.quoteRequests)) {
          // This is the correct path based on the error message
          setRequests(response.data.quoteRequests)
        } else if (Array.isArray(response.data)) {
          // Fallback if the API returns a direct array
          setRequests(response.data)
        } else {
          console.error("Unexpected response format:", response.data)
          setRequests([])
        }
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error("Failed to fetch quote requests", error)
      setRequests([])
      toast({
        title: "Error",
        description: "Failed to load quote requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await DELETE_QUOTE_REQUEST(id)
      setRequests(requests.filter((request) => request.id !== id))
      toast({
        title: "Request deleted",
        description: "The quote request has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete quote request", error)
      toast({
        title: "Error",
        description: "Failed to delete quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleViewDetails = (request: IQuoteRequest) => {
    setSelectedRequest(request)
    setIsDetailsOpen(true)
  }

  const handleConfirmDelete = (request: IQuoteRequest) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }

  const handleSort = (key: keyof IQuoteRequest) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  const formatRequestType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quote Requests</h1>
        <p className="text-muted-foreground">Manage and respond to customer quote requests</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="edu">Education</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Quote Requests</CardTitle>
          <CardDescription>
            {filteredRequests.length} {filteredRequests.length === 1 ? "request" : "requests"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No quote requests found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : activeTab !== "all"
                    ? `No ${activeTab} quote requests available`
                    : "No quote requests have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <Button variant="ghost" size="sm" className="font-medium -ml-4" onClick={() => handleSort("id")}>
                        ID
                        {sortConfig.key === "id" && (
                          <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-medium -ml-4"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortConfig.key === "name" && (
                          <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-medium -ml-4"
                        onClick={() => handleSort("createdAt")}
                      >
                        Date
                        {sortConfig.key === "createdAt" && (
                          <span className="ml-1">{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(request)}
                    >
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>
                        <Badge variant={request.quoteType === "EDU" ? "default" : "secondary"}>
                          {request.quoteType === "EDU" ? "Education" : "Travel"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{formatRequestType(request.requestType)}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetails(request)
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleConfirmDelete(request)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.id} from {selectedRequest?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-start">
                <Badge variant={selectedRequest.quoteType === "EDU" ? "default" : "secondary"} className="mb-4">
                  {selectedRequest.quoteType === "EDU" ? "Education" : "Travel"}
                </Badge>
                <Badge variant="outline">{formatRequestType(selectedRequest.requestType)}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Submitted on
                  </p>
                  <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Last updated
                  </p>
                  <p className="text-sm">{formatDate(selectedRequest.updatedAt)}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  Email
                </p>
                <p className="text-sm">{selectedRequest.email}</p>
              </div>

              {selectedRequest.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    Phone
                  </p>
                  <p className="text-sm">{selectedRequest.phoneNumber}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  Message
                </p>
                <div className="rounded-md border p-4 text-sm whitespace-pre-wrap">{selectedRequest.message}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDetailsOpen(false)
                handleConfirmDelete(selectedRequest!)
              }}
            >
              Delete Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quote request from {selectedRequest?.name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => selectedRequest && handleDelete(selectedRequest.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

