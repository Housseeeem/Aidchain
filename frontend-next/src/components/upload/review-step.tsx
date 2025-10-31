"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Server, 
  Upload as UploadIcon, 
  CheckCircle, 
  Edit,
  Globe,
  Clock,
  DollarSign,
  Shield,
  Database,
  Tag
} from "lucide-react"
import { UploadData } from "@/app/(user)/upload/page"

interface ReviewStepProps {
  data: UploadData
  updateData: (data: Partial<UploadData>) => void
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function ReviewStep({ data }: ReviewStepProps) {
  const estimatedProcessingTime = Math.ceil(data.totalSize / (1024 * 1024 * 100)) // Rough estimate: 100MB per minute

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Review Your Dataset
          </CardTitle>
          <CardDescription>
            Please review all information before submitting your dataset for processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Dataset Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{data.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{data.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Access Type:</span>
                    <Badge variant={data.accessType === "free" ? "secondary" : "default"}>
                      {data.accessType === "free" ? "Free" : `$${data.price}`}
                    </Badge>
                  </div>
                  {data.dataFormat && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{data.dataFormat}</span>
                    </div>
                  )}
                  {data.license && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License:</span>
                      <span>{data.license}</span>
                    </div>
                  )}
                </div>
              </div>

              {data.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {data.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Hosting Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium capitalize">{data.hostingPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Region:</span>
                    <span>{data.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retention:</span>
                    <span>{data.retention}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Files</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Files:</span>
                    <span className="font-medium">{data.files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Size:</span>
                    <span className="font-medium">{formatFileSize(data.totalSize)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {data.description && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3">
                {data.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Information */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>
            Here's what will happen after you submit your dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium">Security Scan</h4>
                <p className="text-sm text-muted-foreground">
                  All files will be scanned for malware and security threats
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium">Data Anonymization</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI will automatically detect and anonymize any sensitive information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium">Quality Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Data quality checks and format validation will be performed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <h4 className="font-medium">Blockchain Registration</h4>
                <p className="text-sm text-muted-foreground">
                  Dataset metadata will be registered on the Hedera blockchain for immutable provenance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold">
                5
              </div>
              <div>
                <h4 className="font-medium">Publication</h4>
                <p className="text-sm text-muted-foreground">
                  Your dataset will be published and available for discovery
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estimated Processing Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted">
              <div className="text-2xl font-bold text-primary">{estimatedProcessingTime}min</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
            <div className="p-4 bg-muted">
              <div className="text-2xl font-bold text-primary">2-5min</div>
              <div className="text-sm text-muted-foreground">Blockchain Registration</div>
            </div>
            <div className="p-4 bg-muted">
              <div className="text-2xl font-bold text-primary">~{estimatedProcessingTime + 5}min</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-sm">
            <p className="text-blue-800">
              <strong>Note:</strong> You'll receive email notifications at each step of the process. 
              You can also track progress in your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p>I confirm that I have the legal right to share this dataset</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p>I have obtained all necessary consents and authorizations for data sharing</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p>I understand that the dataset will be processed and anonymized automatically</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p>I agree to AidChain's Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}