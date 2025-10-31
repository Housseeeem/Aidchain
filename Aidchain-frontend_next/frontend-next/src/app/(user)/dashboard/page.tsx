"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Upload,
  Download,
  FileText,
  Database,
  Settings,
  Check,
  X,
  Clock,
} from "lucide-react";
import {
  useRequest,
  Dataset,
  ApprovalRequest,
} from "@/contexts/request-context";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { getDatasets, getApprovalRequests, approveDataset } = useRequest();
  const { user, jwt, isLoading: authLoading } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) {
        return; // Wait for auth to load
      }

      if (!jwt) {
        setLoading(false);
        return;
      }

      try {
        const [datasetsData, requestsData] = await Promise.all([
          getDatasets(jwt),
          getApprovalRequests(jwt),
        ]);

        setDatasets(datasetsData);
        setApprovalRequests(requestsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getDatasets, getApprovalRequests, jwt, authLoading]);

  const userDatasets = datasets.filter(
    (d) => d.ownerUsername === user?.username
  );
  const pendingRequests = approvalRequests.filter((r) => !r.approved);

  // Get approval requests for user's datasets
  const userDatasetIds = userDatasets.map((d) => d.datasetId);
  const requestsForUserDatasets = approvalRequests.filter(
    (r) => userDatasetIds.includes(r.datasetId) && !r.approved
  );

  const handleApproveRequest = async (
    datasetId: string,
    username: string,
    approve: boolean
  ) => {
    if (!jwt) {
      alert("Authentication required");
      return;
    }

    try {
      const response = await approveDataset({
        jwt,
        datasetId,
        username,
      });

      if (response.requestReceived) {
        // Update the approval requests state
        setApprovalRequests((prev) =>
          prev.map((req) =>
            req.datasetId === datasetId && req.username === username
              ? { ...req, approved: approve }
              : req
          )
        );

        alert(approve ? "Request approved successfully!" : "Request processed");
      }
    } catch (error) {
      console.error("Failed to process approval:", error);
      alert("Failed to process request");
    }
  };

  const stats = [
    {
      title: "Total Datasets Uploaded",
      value: loading ? "..." : userDatasets.length.toString(),
      icon: Upload,
      description: loading
        ? "Loading..."
        : `${userDatasets.length} total datasets`,
    },
    {
      title: "Available Datasets",
      value: loading ? "..." : datasets.length.toString(),
      icon: Database,
      description: loading ? "Loading..." : "In the marketplace",
    },
    {
      title: "Pending Approvals",
      value: loading ? "..." : requestsForUserDatasets.length.toString(),
      icon: FileText,
      description: loading ? "Loading..." : "Requests for your datasets",
    },
    {
      title: "Total Downloads",
      value: loading
        ? "..."
        : userDatasets.reduce((sum, d) => sum + d.downloads, 0).toString(),
      icon: Download,
      description: loading ? "Loading..." : "Across all datasets",
    },
  ];

  const recentActivity = loading
    ? []
    : [
        ...userDatasets.slice(0, 2).map((dataset) => ({
          action: "Dataset uploaded",
          dataset: dataset.datasetName,
          time: new Date().toLocaleDateString(), // Mock date
          status: "success",
        })),
        ...pendingRequests.slice(0, 2).map((request) => ({
          action: "Access request",
          dataset:
            datasets.find((d) => d.datasetId === request.datasetId)
              ?.datasetName || "Unknown",
          time: new Date().toLocaleDateString(), // Mock date
          status: "pending",
        })),
      ];

  const quickActions = [
    {
      title: "Upload New Dataset",
      description: "Share your data securely",
      href: "/upload",
      icon: Upload,
      color: "bg-blue-500",
    },
    {
      title: "Browse Datasets",
      description: "Find data you need",
      href: "/browse",
      icon: Database,
      color: "bg-green-500",
    },
    {
      title: "Manage Approvals",
      description: "Review access requests",
      href: "/approvals",
      icon: Check,
      color: "bg-orange-500",
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      href: "/settings",
      icon: Settings,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.username ? `, ${user.username}` : ""}! Here&apos;s
          an overview of your AidChain activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center space-x-3 p-3 border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div
                    className={`w-10 h-10 ${action.color} flex items-center justify-center text-white`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
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
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading activity...
                  </p>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{activity.action}</span>
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.dataset}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Approval Requests */}
      {requestsForUserDatasets.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approval Requests
            </CardTitle>
            <CardDescription>
              Users requesting access to your datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestsForUserDatasets.map((request, index) => {
                const dataset = datasets.find(
                  (d) => d.datasetId === request.datasetId
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{request.username}</span>
                        <Badge variant="outline">Access Request</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requesting access to:{" "}
                        <span className="font-medium">
                          {dataset?.datasetName || "Unknown Dataset"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dataset ID: {request.datasetId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleApproveRequest(
                            request.datasetId,
                            request.username,
                            false
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApproveRequest(
                            request.datasetId,
                            request.username,
                            true
                          )
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
  );
}
