"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  Database, 
  DollarSign,
  Building,
  Star
} from "lucide-react"

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedPrice, setSelectedPrice] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  const datasets = [
    {
      id: 1,
      title: "Cardiac MRI Imaging Dataset 2024",
      description: "Comprehensive cardiac MRI scans from 1,200 patients with various cardiovascular conditions. Includes segmentation masks and clinical annotations.",
      category: "Cardiology",
      organization: "Johns Hopkins Medical Center",
      size: "2.3 GB",
      records: "1,200",
      price: 450,
      rating: 4.8,
      downloads: 89,
      uploadDate: "2024-01-15",
      tags: ["MRI", "Cardiac", "Segmentation", "Clinical"]
    },
    {
      id: 2,
      title: "Brain Tumor Classification Dataset",
      description: "High-resolution brain MRI scans with tumor classifications. Perfect for machine learning research in medical imaging.",
      category: "Neurology",
      organization: "Stanford Medical AI Lab",
      size: "5.1 GB",
      records: "3,064",
      price: 0,
      rating: 4.9,
      downloads: 234,
      uploadDate: "2024-02-03",
      tags: ["Brain", "Tumor", "Classification", "MRI"]
    },
    {
      id: 3,
      title: "COVID-19 Chest X-Ray Collection",
      description: "Large collection of chest X-rays from COVID-19 patients and healthy controls. Includes severity scores and clinical outcomes.",
      category: "Radiology",
      organization: "Mayo Clinic Research",
      size: "1.8 GB",
      records: "5,856",
      price: 200,
      rating: 4.7,
      downloads: 156,
      uploadDate: "2024-01-28",
      tags: ["COVID-19", "X-Ray", "Chest", "Diagnosis"]
    },
    {
      id: 4,
      title: "Genomic Variants in Cancer Patients",
      description: "Whole genome sequencing data from 500 cancer patients with matched normal samples. Includes mutation annotations.",
      category: "Genomics",
      organization: "Harvard Medical School",
      size: "12.4 GB",
      records: "500",
      price: 800,
      rating: 4.6,
      downloads: 67,
      uploadDate: "2024-02-10",
      tags: ["Genomics", "Cancer", "WGS", "Mutations"]
    },
    {
      id: 5,
      title: "Diabetes Patient Electronic Health Records",
      description: "De-identified EHR data from 10,000 diabetes patients over 5 years. Includes lab results, medications, and outcomes.",
      category: "Endocrinology",
      organization: "Cleveland Clinic",
      size: "890 MB",
      records: "10,000",
      price: 350,
      rating: 4.5,
      downloads: 123,
      uploadDate: "2024-01-20",
      tags: ["Diabetes", "EHR", "Longitudinal", "Clinical"]
    },
    {
      id: 6,
      title: "Pediatric Growth Development Data",
      description: "Longitudinal growth and development data from 2,500 children tracked over 10 years. Includes anthropometric measurements.",
      category: "Pediatrics",
      organization: "Boston Children's Hospital",
      size: "450 MB",
      records: "2,500",
      price: 0,
      rating: 4.4,
      downloads: 78,
      uploadDate: "2024-02-05",
      tags: ["Pediatrics", "Growth", "Development", "Longitudinal"]
    }
  ]

  const categories = ["All", "Cardiology", "Neurology", "Radiology", "Genomics", "Endocrinology", "Pediatrics"]
  const priceRanges = ["All", "Free", "$1-100", "$101-500", "$500+"]
  const dateRanges = ["All", "Last 7 days", "Last 30 days", "Last 3 months", "Last year"]

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || selectedCategory === "All" || dataset.category === selectedCategory
    
    const matchesPrice = !selectedPrice || selectedPrice === "All" || 
                        (selectedPrice === "Free" && dataset.price === 0) ||
                        (selectedPrice === "$1-100" && dataset.price > 0 && dataset.price <= 100) ||
                        (selectedPrice === "$101-500" && dataset.price > 100 && dataset.price <= 500) ||
                        (selectedPrice === "$500+" && dataset.price > 500)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Datasets</h1>
        <p className="text-muted-foreground">
          Discover and access high-quality medical datasets for your research
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Upload Date" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredDatasets.length} of {datasets.length} datasets
        </p>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{dataset.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{dataset.category}</Badge>
                    {dataset.price === 0 ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <Badge variant="outline">${dataset.price}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{dataset.rating}</span>
                </div>
              </div>
              <CardDescription className="line-clamp-3">
                {dataset.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {dataset.organization}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(dataset.uploadDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{dataset.size}</div>
                    <div className="text-muted-foreground">Size</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{dataset.records}</div>
                    <div className="text-muted-foreground">Records</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{dataset.downloads}</div>
                    <div className="text-muted-foreground">Downloads</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {dataset.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    {dataset.price === 0 ? (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Request Access
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No datasets found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or browse all available datasets
          </p>
        </div>
      )}
    </div>
  )
}