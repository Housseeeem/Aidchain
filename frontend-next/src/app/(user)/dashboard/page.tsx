"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  Upload, 
  Download, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Users, 
  Database,
  Settings
} from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Datasets Uploaded",
      value: "12",
      icon: Upload,
      description: "3 pending approval"
    },
    {
      title: "Datasets Downloaded",
      value: "45",
      icon: Download,
      description: "This month: 8"
    },
    {
      title: "Credits Available",
      value: "2,450",
      icon: CreditCard,
      description: "$245.00 USD"
    },
    {
      title: "Active Requests",
      value: "7",
      icon: FileText,
      description: "2 require action"
    }
  ]

  const recentActivity = [
    {
      action: "Dataset approved",
      dataset: "Cardiac MRI Scans 2024",
      time: "2 hours ago",
      status: "success"
    },
    {
      action: "Access request received",
      dataset: "Diabetes Patient Records",
      time: "5 hours ago",
      status: "pending"
    },
    {
      action: "Dataset downloaded",
      dataset: "Cancer Genomics Data",
      time: "1 day ago",
      status: "info"
    },
    {
      action: "Payment received",
      dataset: "Neurological Imaging",
      time: "2 days ago",
      status: "success"
    }
  ]

  const quickActions = [
    {
      title: "Upload New Dataset",
      description: "Share your medical data securely",
      href: "/upload",
      icon: Upload,
      color: "bg-blue-500"
    },
    {
      title: "Browse Datasets",
      description: "Find research data you need",
      href: "/browse",
      icon: Database,
      color: "bg-green-500"
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      href: "/settings",
      icon: Settings,
      color: "bg-purple-500"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AidChain activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center space-x-3 p-3 border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 ${action.color} flex items-center justify-center text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{activity.action}</span>
                      <Badge 
                        variant={
                          activity.status === "success" ? "default" :
                          activity.status === "pending" ? "secondary" : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.dataset}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription>
            Your data sharing and access patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>7.2 GB / 10 GB</span>
              </div>
              <Progress value={72} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Downloads</span>
                <span>23 / 50</span>
              </div>
              <Progress value={46} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls</span>
                <span>1,247 / 5,000</span>
              </div>
              <Progress value={25} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}