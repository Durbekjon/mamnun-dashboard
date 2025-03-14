"use client"

import { useState } from "react"
import { Edit, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InformationItem {
  id: string
  label: string
  value: string
  type: "text" | "textarea" | "email" | "tel"
}

const initialInformation: InformationItem[] = [
  {
    id: "company-name",
    label: "Company Name",
    value: "Acme Corporation",
    type: "text",
  },
  {
    id: "company-description",
    label: "Company Description",
    value:
      "Acme Corporation is a fictional company that manufactures everything from portable holes to rocket-powered roller skates.",
    type: "textarea",
  },
  {
    id: "contact-email",
    label: "Contact Email",
    value: "contact@acmecorp.example",
    type: "email",
  },
  {
    id: "contact-phone",
    label: "Contact Phone",
    value: "+1 (555) 123-4567",
    type: "tel",
  },
  {
    id: "address",
    label: "Address",
    value: "123 Acme Street, Toontown, CA 90210",
    type: "text",
  },
]

export function InformationSection() {
  const [information, setInformation] = useState<InformationItem[]>(initialInformation)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")

  const handleEdit = (id: string, value: string) => {
    setEditingId(id)
    setTempValue(value)
  }

  const handleSave = (id: string) => {
    setInformation(information.map((item) => (item.id === id ? { ...item, value: tempValue } : item)))
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Edit your company information displayed on your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {information.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={item.id}>{item.label}</Label>
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSave(item.id)}>
                      <Save className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item.id, item.value)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit {item.label}</span>
                  </Button>
                )}
              </div>
              {editingId === item.id ? (
                item.type === "textarea" ? (
                  <Textarea
                    id={item.id}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <Input
                    id={item.id}
                    type={item.type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                )
              ) : (
                <div className="rounded-md border p-3 text-sm">{item.value}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

