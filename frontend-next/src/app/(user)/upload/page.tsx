"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Upload as UploadIcon
} from "lucide-react"
import { useRequest } from "@/contexts/request-context"

// Import step components
import { MetadataStep } from "@/components/upload/metadata-step"
import { FilesStep } from "@/components/upload/files-step"
import { ReviewStep } from "@/components/upload/review-step"

export interface UploadData {
  // Metadata
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  
  // Files
  files: File[]
  totalSize: number
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
    title: "Upload Files",
    description: "Add your dataset files",
    icon: UploadIcon
  },
  {
    id: 3,
    title: "Review & Submit",
    description: "Final review and submission",
    icon: CheckCircle
  }
]

export default function UploadPage() {
  const { upload } = useRequest()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadData, setUploadData] = useState<UploadData>({
    title: "",
    description: "",
    category: "",
    tags: [],
    price: 0,
    files: [],
    totalSize: 0
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
        return uploadData.title && uploadData.description
      case 2:
        return uploadData.files.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (uploadData.files.length === 0) {
      alert('Please select at least one file to upload')
      return
    }

    setIsSubmitting(true)
    try {
      // Upload the first file (for now, since API expects single file)
      const response = await upload({
        datasetName: uploadData.title,
        description: uploadData.description,
        access: uploadData.price === 0, // true for free, false for paid
        price: uploadData.price,
        file: uploadData.files[0]
      })
      
      if (response.success) {
        alert('Dataset uploaded successfully!')
        // Reset form
        setUploadData({
          title: "",
          description: "",
          category: "",
          tags: [],
          price: 0,
          files: [],
          totalSize: 0
        })
        setCurrentStep(1)
      } else {
        alert('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MetadataStep data={uploadData} updateData={updateUploadData} />
      case 2:
        return <FilesStep data={uploadData} updateData={updateUploadData} />
      case 3:
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
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Dataset'}
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}