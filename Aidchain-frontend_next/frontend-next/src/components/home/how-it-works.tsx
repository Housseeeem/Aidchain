"use client"

import { Upload, Shield, Search, Download } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Dataset",
      description: "Organizations upload datasets to our secure platform"
    },
    {
      icon: Shield,
      title: "Auto-Anonymization",
      description: "Our AI automatically anonymizes data while preserving analytical value"
    },
    {
      icon: Search,
      title: "Discover & Request",
      description: "Data consumers browse and request access to relevant datasets"
    },
    {
      icon: Download,
      title: "Secure Access",
      description: "Approved users get secure access to anonymized data"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and efficient data sharing in four easy steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary text-primary text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}