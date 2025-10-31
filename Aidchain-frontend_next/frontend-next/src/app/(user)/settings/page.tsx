"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building, 
  CreditCard, 
  Shield, 
  Key, 
  Bell, 
  Wallet,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from "lucide-react"

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    organization: "Johns Hopkins Medical Center",
    role: "Research Director",
    bio: "Cardiovascular researcher with 15 years of experience in medical imaging and data analysis."
  })

  const [notifications, setNotifications] = useState({
    datasetApproved: true,
    accessRequests: true,
    paymentReceived: true,
    systemUpdates: false,
    marketingEmails: false
  })

  const apiKey = "ak_live_1234567890abcdef1234567890abcdef"
  const credits = 2450
  const subscription = "Professional"

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationToggle = (field: string) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    // You could add a toast notification here
  }

  const regenerateApiKey = () => {
    // Handle API key regeneration
    console.log("Regenerating API key...")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, security, and account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal and professional information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileUpdate("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileUpdate("email", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={profile.organization}
                  onChange={(e) => handleProfileUpdate("organization", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Title</Label>
                <Input
                  id="role"
                  value={profile.role}
                  onChange={(e) => handleProfileUpdate("role", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                value={profile.bio}
                onChange={(e) => handleProfileUpdate("bio", e.target.value)}
              />
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" onClick={copyApiKey}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={regenerateApiKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep your API key secure. Don't share it in publicly accessible areas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credits and Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credits & Subscription
            </CardTitle>
            <CardDescription>
              Manage your credits and subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border">
                <div className="text-2xl font-bold">{credits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Available Credits</div>
                <div className="text-xs text-muted-foreground mt-1">≈ ${(credits / 10).toFixed(2)} USD</div>
              </div>
              <div className="text-center p-4 border">
                <div className="text-2xl font-bold">{subscription}</div>
                <div className="text-sm text-muted-foreground">Current Plan</div>
                <Badge variant="outline" className="mt-1">Active</Badge>
              </div>
              <div className="text-center p-4 border">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-sm text-muted-foreground">API Calls/Month</div>
                <div className="text-xs text-muted-foreground mt-1">Unlimited</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Wallet className="h-4 w-4 mr-2" />
                Add Credits
              </Button>
              <Button variant="outline">Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Login Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage active login sessions
                  </p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    {key === "datasetApproved" && "Dataset Approved"}
                    {key === "accessRequests" && "Access Requests"}
                    {key === "paymentReceived" && "Payment Received"}
                    {key === "systemUpdates" && "System Updates"}
                    {key === "marketingEmails" && "Marketing Emails"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {key === "datasetApproved" && "When your uploaded datasets are approved"}
                    {key === "accessRequests" && "When someone requests access to your data"}
                    {key === "paymentReceived" && "When you receive payments for data access"}
                    {key === "systemUpdates" && "Important system updates and maintenance"}
                    {key === "marketingEmails" && "Product updates and promotional content"}
                  </p>
                </div>
                <Button
                  variant={value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNotificationToggle(key)}
                >
                  {value ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}