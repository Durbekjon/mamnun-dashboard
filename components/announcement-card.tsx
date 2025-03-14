"use client"

import { useState, useEffect } from "react"
import { Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GET_INFOS, UPDATE_INFOS } from "@/services/info.service"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface IUpdateInformation {
  phoneNumber: string
  mail: string
  address: string
}

export function AnnouncementCard() {
  const [isEditing, setIsEditing] = useState(false)
  const [info, setInfo] = useState<any | null>(null)
  const [tempInfo, setTempInfo] = useState<IUpdateInformation | null>(null)

  useEffect(() => {
    GET_INFOS().then((res) => setInfo(res.data))
  }, [])

  const handleEdit = () => {
    setTempInfo(info)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!tempInfo) return
    await UPDATE_INFOS(info.id, tempInfo)
    setInfo(tempInfo)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Card className="fade-in h-full">
      <CardHeader className="pb-2">
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>{new Date().toLocaleDateString()} - Editable contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="text"
                value={tempInfo?.phoneNumber || ""}
                onChange={(e) => setTempInfo({ ...tempInfo!, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={tempInfo?.mail || ""}
                onChange={(e) => setTempInfo({ ...tempInfo!, mail: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={tempInfo?.address || ""}
                onChange={(e) => setTempInfo({ ...tempInfo!, address: e.target.value })}
                placeholder="Address"
                rows={3}
              />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone:</p>
              <p className="rounded-md border p-3 text-sm">{info?.phoneNumber || "Not available"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email:</p>
              <p className="rounded-md border p-3 text-sm">{info?.mail || "Not available"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Address:</p>
              <p className="rounded-md border p-3 text-sm">{info?.address || "Not available"}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

