"use client";

import { createContext, useContext, ReactNode } from "react";

// Configuration
const USE_REAL_API = false; // Set to true when backend is ready
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Types for API requests and responses
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UploadRequest {
  datasetName: string;
  description: string;
  access: boolean; // true for free, false for paid
  price: number;
  file: File;
}

export interface Dataset {
  datasetId: string;
  datasetName: string;
  description: string;
  sizeFile: string; // e.g., '200mb', '2g'
  downloads: number;
  price: number; // 0-100
  ownerUsername: string;
}

export interface RequestDatasetRequest {
  datasetId: string;
}

export interface ApprovalRequest {
  datasetId: string;
  username: string;
  approved: boolean;
}

export interface ApproveDatasetRequest {
  jwt: string;
  datasetId: string;
  username: string;
}

export interface ApproveDatasetResponse {
  requestReceived: boolean;
}

interface RequestContextType {
  // Test endpoint
  helloWorld: () => Promise<{ message: string }>;

  // 1. Authentication
  auth: (data: AuthRequest) => Promise<AuthResponse>;

  // 2. Upload dataset
  upload: (data: UploadRequest) => Promise<{ success: boolean; datasetId?: string }>;

  // 3. Get datasets
  getDatasets: (jwt: string) => Promise<Dataset[]>;

  // 4. Request dataset access
  requestDataset: (data: RequestDatasetRequest) => Promise<{ success: boolean }>;

  // 5. Get approval requests
  getApprovalRequests: (jwt: string) => Promise<ApprovalRequest[]>;

  // 6. Approve dataset request
  approveDataset: (data: ApproveDatasetRequest) => Promise<ApproveDatasetResponse>;

  // Configuration
  isUsingRealApi: boolean;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function useRequest() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
}

// Mock data
const mockDatasets: Dataset[] = [
  {
    datasetId: "1",
    datasetName: "Customer Analytics Q3 2024",
    description: "Comprehensive customer behavior analysis for Q3 2024",
    sizeFile: "2.5gb",
    downloads: 45,
    price: 25,
    ownerUsername: "john_doe",
  },
  {
    datasetId: "2",
    datasetName: "Financial Transaction Patterns",
    description: "Anonymized financial transaction data",
    sizeFile: "1.8gb",
    downloads: 123,
    price: 0,
    ownerUsername: "jane_smith",
  },
  {
    datasetId: "3",
    datasetName: "Supply Chain Analytics",
    description: "Global supply chain performance metrics",
    sizeFile: "850mb",
    downloads: 67,
    price: 15,
    ownerUsername: "mike_wilson",
  },
];

const mockApprovalRequests: ApprovalRequest[] = [
  {
    datasetId: "1",
    username: "researcher_alice",
    approved: false,
  },
  {
    datasetId: "2",
    username: "analyst_bob",
    approved: false,
  },
];

// Mock API functions
const mockApi = {
  helloWorld: async (): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { message: "Hello World from Mock API!" };
  },

  auth: async (data: AuthRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock validation
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    // Extract username from email for mock response
    const username = data.email.split('@')[0];

    return {
      jwt: `mock_jwt_${Date.now()}`,
      firstName: username.charAt(0).toUpperCase() + username.slice(1),
      lastName: "",
      role: "researcher",
    };
  },

  upload: async (data: UploadRequest): Promise<{ success: boolean; datasetId?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload time

    const newDatasetId = String(mockDatasets.length + 1);
    const newDataset: Dataset = {
      datasetId: newDatasetId,
      datasetName: data.datasetName,
      description: data.description,
      sizeFile: `${Math.round(data.file.size / (1024 * 1024))}mb`,
      downloads: 0,
      price: data.access ? 0 : data.price,
      ownerUsername: "current_user",
    };

    mockDatasets.push(newDataset);

    return {
      success: true,
      datasetId: newDatasetId,
    };
  },

  getDatasets: async (jwt: string): Promise<Dataset[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!jwt) {
      throw new Error("JWT token is required");
    }

    return [...mockDatasets];
  },

  requestDataset: async (data: RequestDatasetRequest): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const dataset = mockDatasets.find((d) => d.datasetId === data.datasetId);
    if (!dataset) {
      throw new Error("Dataset not found");
    }

    return { success: true };
  },

  getApprovalRequests: async (jwt: string): Promise<ApprovalRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!jwt) {
      throw new Error("JWT token is required");
    }

    return [...mockApprovalRequests];
  },

  approveDataset: async (data: ApproveDatasetRequest): Promise<ApproveDatasetResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!data.jwt || !data.datasetId || !data.username) {
      throw new Error("JWT, datasetId, and username are required");
    }

    // Update mock approval request
    const requestIndex = mockApprovalRequests.findIndex(
      (r) => r.datasetId === data.datasetId && r.username === data.username
    );

    if (requestIndex !== -1) {
      mockApprovalRequests[requestIndex].approved = true;
    }

    return { requestReceived: true };
  },
};

// Real API functions
const realApi = {
  helloWorld: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/hello`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hello world");
    }

    return response.json();
  },

  auth: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    return response.json();
  },

  upload: async (data: UploadRequest): Promise<{ success: boolean; datasetId?: string }> => {
    const formData = new FormData();
    formData.append("datasetName", data.datasetName);
    formData.append("description", data.description);
    formData.append("access", data.access.toString());
    formData.append("price", data.price.toString());
    formData.append("file", data.file);

    const response = await fetch(`${API_URL}/datasets`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },

  getDatasets: async (jwt: string): Promise<Dataset[]> => {
    const response = await fetch(`${API_URL}/datasets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ jwt }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch datasets");
    }

    return response.json();
  },

  requestDataset: async (data: RequestDatasetRequest): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/request_dataset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to request dataset");
    }

    return response.json();
  },

  getApprovalRequests: async (jwt: string): Promise<ApprovalRequest[]> => {
    const response = await fetch(`${API_URL}/approve_dataset`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ jwt }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch approval requests");
    }

    return response.json();
  },

  approveDataset: async (data: ApproveDatasetRequest): Promise<ApproveDatasetResponse> => {
    const response = await fetch(`${API_URL}/approve_dataset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to approve dataset");
    }

    return response.json();
  },
};

interface RequestProviderProps {
  children: ReactNode;
}

export function RequestProvider({ children }: RequestProviderProps) {
  const api = USE_REAL_API ? realApi : mockApi;

  const value: RequestContextType = {
    ...api,
    isUsingRealApi: USE_REAL_API,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}