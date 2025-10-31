"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Shield, Users, HelpCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    category: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactCategories = [
    "General Inquiry",
    "Technical Support", 
    "Data Privacy",
    "Legal & Compliance",
    "Partnership",
    "Sales",
    "Billing",
    "Security Issue"
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          Get in touch with our team for support, partnerships, or any questions about AidChain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactCategories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide details about your inquiry..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* General Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                General Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">contact@aidchain.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    123 Innovation Drive<br />
                    Tech City, TC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specialized Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Specialized Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium">Privacy & Legal</p>
                  <p className="text-sm text-muted-foreground">privacy@aidchain.com</p>
                  <p className="text-sm text-muted-foreground">dpo@aidchain.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-4 w-4 mt-1 text-green-500" />
                <div>
                  <p className="font-medium">Technical Support</p>
                  <p className="text-sm text-muted-foreground">support@aidchain.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-1 text-purple-500" />
                <div>
                  <p className="font-medium">Partnerships</p>
                  <p className="text-sm text-muted-foreground">partnerships@aidchain.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monday - Friday</span>
                <span className="text-sm text-muted-foreground">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Saturday</span>
                <span className="text-sm text-muted-foreground">10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sunday</span>
                <span className="text-sm text-muted-foreground">Closed</span>
              </div>
              <div className="mt-4 p-3 bg-muted text-sm">
                <p className="font-medium">24/7 Emergency Support</p>
                <p className="text-muted-foreground">
                  For critical security issues, contact: emergency@aidchain.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regional Offices */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Offices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Europe (GDPR)</p>
                <p className="text-sm text-muted-foreground">eu-rep@aidchain.com</p>
                <p className="text-sm text-muted-foreground">Dublin, Ireland</p>
              </div>
              <div>
                <p className="font-medium">Asia Pacific</p>
                <p className="text-sm text-muted-foreground">apac@aidchain.com</p>
                <p className="text-sm text-muted-foreground">Singapore</p>
              </div>
              <div>
                <p className="font-medium">Latin America</p>
                <p className="text-sm text-muted-foreground">latam@aidchain.com</p>
                <p className="text-sm text-muted-foreground">São Paulo, Brazil</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions. For more detailed information, please contact us directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">How do I get started with AidChain?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Sign up for an account, complete the verification process, and you can start uploading or browsing datasets immediately.
              </p>
              
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Yes, we use enterprise-grade encryption, blockchain verification, and comply with international privacy standards including GDPR and HIPAA.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What file formats do you support?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                We support CSV, JSON, XML, Parquet, and many other common data formats. Contact us for specific format requirements.
              </p>
              
              <h4 className="font-semibold mb-2">How does pricing work?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Data providers set their own prices. We charge a small platform fee for transactions. Contact sales for enterprise pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}