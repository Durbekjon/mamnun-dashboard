"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DELETE_CONTACT_REQUESTS, GET_CONTACT_REQUESTS } from "@/services/contact.service"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ContactForm {
  id: number
  subject: string
  firstName: string
  lastName: string
  email: string
  message: string
  createdAt: string
}

export function RequestsTable() {
  const [requests, setRequests] = useState<ContactForm[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchContactRequests = async () => {
      try {
        const { data } = await GET_CONTACT_REQUESTS()
        setRequests(data.contactForms || [])
      } catch (error) {
        console.error("Failed to fetch contact requests", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContactRequests()
  }, [])

  const handleDelete = async (id: number) => {
    await DELETE_CONTACT_REQUESTS(id)
    setRequests((prev) => prev.filter((request) => request.id !== id))
    setDeleteId(null)
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Contact Requests</CardTitle>
        <CardDescription>Manage incoming contact form submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell className="capitalize">{request.subject}</TableCell>
                      <TableCell>{`${request.firstName} ${request.lastName}`}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{request.email}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger className="truncate max-w-[150px] block text-ellipsis overflow-hidden cursor-pointer hover:text-primary">
                            {request.message}
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <p className="text-sm">{request.message}</p>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(request.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

