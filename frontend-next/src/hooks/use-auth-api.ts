import { useAuth } from "@/contexts/auth-context";
import { useRequest } from "@/contexts/request-context";

export function useAuthApi() {
  const { jwt } = useAuth();
  const api = useRequest();

  const getAuthenticatedDatasets = async () => {
    if (!jwt) {
      throw new Error("Authentication required");
    }
    return api.getDatasets(jwt);
  };

  const getAuthenticatedApprovalRequests = async () => {
    if (!jwt) {
      throw new Error("Authentication required");
    }
    return api.getApprovalRequests(jwt);
  };

  const approveDatasetWithAuth = async (datasetId: string, username: string) => {
    if (!jwt) {
      throw new Error("Authentication required");
    }
    return api.approveDataset({
      jwt,
      datasetId,
      username,
    });
  };

  return {
    ...api,
    jwt,
    isAuthenticated: !!jwt,
    getAuthenticatedDatasets,
    getAuthenticatedApprovalRequests,
    approveDatasetWithAuth,
  };
}