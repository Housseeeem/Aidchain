"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Server, 
  Globe, 
  Shield, 
  Zap, 
  Database, 
  Clock,
  CheckCircle,
  Star
} from "lucide-react"
import { UploadData } from "@/app/(user)/upload/page"

interface HostingStepProps {
  data: UploadData
  updateData: (data: Partial<UploadData>) => void
}

const hostingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    storage: "1 GB",
    bandwidth: "10 GB/month",
    retention: "6 months",
    features: ["Basic encryption", "Standard support", "Public datasets only"],
    recommended: false,
    available: true
  },
  {
    id: "professional",
    name: "Professional",
    price: "$29/month",
    storage: "100 GB",
    bandwidth: "1 TB/month",
    retention: "2 years",
    features: ["Advanced encryption", "Priority support", "Private datasets", "API access"],
    recommended: true,
    available: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199/month",
    storage: "1 TB",
    bandwidth: "10 TB/month",
    retention: "5 years",
    features: ["Enterprise encryption", "24/7 support", "Custom compliance", "Dedicated infrastructure"],
    recommended: false,
    available: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99/month",
    storage: "500 GB",
    bandwidth: "5 TB/month",
    retention: "3 years",
    features: ["Premium encryption", "Priority support", "Advanced analytics", "Custom integrations"],
    recommended: false,
    available: false // User doesn't have this plan
  }
]

const regions = [
  { id: "us-east-1", name: "US East (Virginia)", flag: "🇺🇸" },
  { id: "us-west-2", name: "US West (Oregon)", flag: "🇺🇸" },
  { id: "eu-west-1", name: "Europe (Ireland)", flag: "🇪🇺" },
  { id: "eu-central-1", name: "Europe (Frankfurt)", flag: "🇩🇪" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", flag: "🇸🇬" },
  { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)", flag: "🇯🇵" }
]

const retentionOptions = [
  { id: "6months", name: "6 Months", description: "Suitable for temporary datasets" },
  { id: "1year", name: "1 Year", description: "Standard retention period" },
  { id: "2years", name: "2 Years", description: "Extended retention for research" },
  { id: "5years", name: "5 Years", description: "Long-term archival" },
  { id: "indefinite", name: "Indefinite", description: "Permanent storage (Enterprise only)" }
]

export function HostingStep({ data, updateData }: HostingStepProps) {
  const selectedPlan = hostingPlans.find(plan => plan.id === data.hostingPlan)

  return (
    <div className="space-y-6">
      {/* Hosting Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Hosting Plan</CardTitle>
          <CardDescription>
            Select a plan based on your storage needs and subscription level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hostingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative border p-4 cursor-pointer transition-all
                  ${data.hostingPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border'}
                  ${!plan.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
                  ${plan.recommended ? 'ring-2 ring-primary/20' : ''}
                `}
                onClick={() => plan.available && updateData({ hostingPlan: plan.id })}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-2 left-4 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
                
                {!plan.available && (
                  <Badge variant="secondary" className="absolute -top-2 right-4">
                    Upgrade Required
                  </Badge>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-2xl font-bold text-primary">{plan.price}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.storage} storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.bandwidth} bandwidth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.retention} retention</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {data.hostingPlan === plan.id && (
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && !selectedPlan.available && (
            <div className="mt-4 p-4 bg-muted border border-border">
              <p className="text-sm text-muted-foreground">
                The {selectedPlan.name} plan requires a subscription upgrade. 
                <Button variant="link" className="p-0 h-auto ml-1">
                  Upgrade your account
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Region Selection */}
      {data.hostingPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Data Region</CardTitle>
            <CardDescription>
              Choose where your data will be stored for optimal performance and compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region">Storage Region</Label>
              <Select value={data.region} onValueChange={(value) => updateData({ region: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      <div className="flex items-center gap-2">
                        <span>{region.flag}</span>
                        <span>{region.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Global CDN</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-500" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retention Policy */}
      {data.hostingPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
            <CardDescription>
              How long should your dataset be stored on AidChain?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period</Label>
              <Select value={data.retention} onValueChange={(value) => updateData({ retention: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  {retentionOptions.map((option) => (
                    <SelectItem 
                      key={option.id} 
                      value={option.id}
                      disabled={option.id === "indefinite" && data.hostingPlan !== "enterprise"}
                    >
                      <div className="flex flex-col">
                        <span>{option.name}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlan && (
              <div className="mt-4 p-3 bg-muted/50 text-sm">
                <p className="font-medium mb-1">Plan Limits:</p>
                <p className="text-muted-foreground">
                  Your {selectedPlan.name} plan includes {selectedPlan.retention} of retention by default.
                  {selectedPlan.id !== "enterprise" && " Upgrade to Enterprise for indefinite storage."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}