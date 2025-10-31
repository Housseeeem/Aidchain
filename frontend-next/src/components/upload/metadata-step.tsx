"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, DollarSign, Shield } from "lucide-react"
import { UploadData } from "@/app/(user)/upload/page"

interface MetadataStepProps {
  data: UploadData
  updateData: (data: Partial<UploadData>) => void
}

const categories = [
  "Healthcare & Medical",
  "Financial Services",
  "Retail & E-commerce",
  "Manufacturing",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Education",
  "Government & Public Sector",
  "Technology & Software",
  "Research & Development",
  "Other"
]

const dataFormats = [
  "CSV",
  "JSON",
  "XML",
  "Parquet",
  "Excel (XLSX)",
  "Database Export",
  "API Data",
  "Log Files",
  "Other"
]

const updateFrequencies = [
  "One-time",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annually",
  "Real-time",
  "On-demand"
]

const licenses = [
  "Creative Commons CC0",
  "Creative Commons BY",
  "Creative Commons BY-SA",
  "MIT License",
  "Apache 2.0",
  "Custom License",
  "Proprietary"
]

export function MetadataStep({ data, updateData }: MetadataStepProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      updateData({ tags: [...data.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateData({ tags: data.tags.filter(tag => tag !== tagToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Information</CardTitle>
          <CardDescription>
            Provide basic information about your dataset to help others discover and understand it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dataset Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Dataset Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Customer Analytics Q3 2024"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          </div>

          {/* Category and Data Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={data.category} onValueChange={(value) => updateData({ category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFormat">Data Format</Label>
              <Select value={data.dataFormat} onValueChange={(value) => updateData({ dataFormat: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {dataFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your dataset, methodology, and potential use cases..."
              rows={4}
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                placeholder="Add tags to help others find your dataset"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* License and Update Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Select value={data.license} onValueChange={(value) => updateData({ license: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select license" />
                </SelectTrigger>
                <SelectContent>
                  {licenses.map((license) => (
                    <SelectItem key={license} value={license}>
                      {license}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateFrequency">Update Frequency</Label>
              <Select value={data.updateFrequency} onValueChange={(value) => updateData({ updateFrequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="How often is this updated?" />
                </SelectTrigger>
                <SelectContent>
                  {updateFrequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Type */}
      <Card>
        <CardHeader>
          <CardTitle>Access & Pricing</CardTitle>
          <CardDescription>
            Choose how others can access your dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              type="button"
              variant={data.accessType === "free" ? "default" : "outline"}
              className="h-20 flex-col"
              onClick={() => updateData({ accessType: "free", price: undefined })}
            >
              <Shield className="h-6 w-6 mb-2" />
              Free Access
            </Button>
            <Button
              type="button"
              variant={data.accessType === "paid" ? "default" : "outline"}
              className="h-20 flex-col"
              onClick={() => updateData({ accessType: "paid" })}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              Paid Access
            </Button>
          </div>

          {data.accessType === "paid" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={data.price || ""}
                onChange={(e) => updateData({ price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}