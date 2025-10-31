"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Server,
  Upload as UploadIcon
} from "lucide-react"

// Import step components
import { MetadataStep } from "@/components/upload/metadata-step"
import { HostingStep } from "@/components/upload/hosting-step"
import { FilesStep } from "@/components/upload/files-step"
import { ReviewStep } from "@/components/upload/review-step"

export interface UploadData {
  // Metadata
  name: string
  category: string
  description: string
  tags: string[]
  accessType: "free" | "paid"
  price?: number
  
  // Hosting
  hostingPlan: string
  region: string
  retention: string
  
  // Files
  files: File[]
  totalSize: number
  
  // Additional metadata
  license: string
  dataFormat: string
  updateFrequency: string
}

const steps = [
  {
    id: 1,
    title: "Dataset Information",
    description: "Basic details and metadata",
    icon: FileText
  },
  {
    id: 2,
    title: "Hosting Options",
    description: "Choose your hosting plan",
    icon: Server
  },
  {
    id: 3,
    title: "Upload Files",
    description: "Add your dataset files",
    icon: UploadIcon
  },
  {
    id: 4,
    title: "Review & Submit",
    description: "Final review and submission",
    icon: CheckCircle
  }
]

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadData, setUploadData] = useState<UploadData>({
    name: "",
    category: "",
    description: "",
    tags: [],
    accessType: "free",
    hostingPlan: "",
    region: "",
    retention: "",
    files: [],
    totalSize: 0,
    license: "",
    dataFormat: "",
    updateFrequency: ""
  })

  const updateUploadData = (data: Partial<UploadData>) => {
    setUploadData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return uploadData.name && uploadData.category && uploadData.description
      case 2:
        return uploadData.hostingPlan && uploadData.region
      case 3:
        return uploadData.files.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MetadataStep data={uploadData} updateData={updateUploadData} />
      case 2:
        return <HostingStep data={uploadData} updateData={updateUploadData} />
      case 3:
        return <FilesStep data={uploadData} updateData={updateUploadData} />
      case 4:
        return <ReviewStep data={uploadData} updateData={updateUploadData} />
      default:
        return null
    }
  }

  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Dataset</h1>
        <p className="text-muted-foreground">
          Share your data securely with the AidChain community
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep
              const isCurrent = step.id === currentStep
              const StepIcon = step.icon
              
              return (
                <div key={step.id} className="flex flex-col items-center text-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={true ||!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Handle final submission
                console.log("Submitting dataset:", uploadData)
                alert("Dataset submitted successfully!")
              }}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Submit Dataset
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}