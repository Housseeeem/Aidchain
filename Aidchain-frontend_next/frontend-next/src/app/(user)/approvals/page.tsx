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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRequest, Dataset, ApprovalRequest } from "@/contexts/request-context";
import { useAuth } from "@/contexts/auth-context";

export default function ApprovalsPage() {
  const { getDatasets, getApprovalRequests, approveDataset } = useRequest();
  const { user, jwt, isLoading: authLoading } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDatasets, getApprovalRequests, jwt, authLoading]);

  const userDatasets = datasets.filter(
    (d) => d.ownerUsername === user?.username
  );
  const userDatasetIds = userDatasets.map((d) => d.datasetId);

  // Filter requests for user's datasets
  const requestsForUserDatasets = approvalRequests.filter((r) =>
    userDatasetIds.includes(r.datasetId)
  );

  // Apply search and status filters
  const filteredRequests = requestsForUserDatasets.filter((request) => {
    const dataset = datasets.find((d) => d.datasetId === request.datasetId);
    const matchesSearch =
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset?.datasetName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !request.approved) ||
      (statusFilter === "approved" && request.approved);

    return matchesSearch && matchesStatus;
  });

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
        setApprovalRequests((prev) =>
          prev.map((req) =>
            req.datasetId === datasetId && req.username === username
              ? { ...req, approved: approve }
              : req
          )
        );

        alert(
          approve
            ? "Request approved successfully!"
            : "Request denied successfully!"
        );
      }
    } catch (error) {
      console.error("Failed to process approval:", error);
      alert("Failed to process request");
    }
  };

  const pendingCount = requestsForUserDatasets.filter((r) => !r.approved).length;
  const approvedCount = requestsForUserDatasets.filter((r) => r.approved).length;

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading approval requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dataset Approvals</h1>
        <p className="text-muted-foreground">
          Manage access requests for your datasets
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Datasets</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDatasets.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or dataset name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Access Requests</CardTitle>
          <CardDescription>
            {filteredRequests.length} request(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No one has requested access to your datasets yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => {
                const dataset = datasets.find(
                  (d) => d.datasetId === request.datasetId
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-lg">
                          {request.username}
                        </span>
                        <Badge
                          variant={request.approved ? "default" : "secondary"}
                        >
                          {request.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Dataset:{" "}
                        <span className="font-medium">
                          {dataset?.datasetName || "Unknown Dataset"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dataset ID: {request.datasetId}
                      </p>
                      {dataset && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Size: {dataset.sizeFile}</span>
                          <span>Downloads: {dataset.downloads}</span>
                          <span>Price: ${dataset.price}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.approved ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}