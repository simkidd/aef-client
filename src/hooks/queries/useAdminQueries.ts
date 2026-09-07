import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin.api";
import { AuditLog } from "@/interfaces";

export function useAuditLogsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: async () => {
      const response = await adminApi.getAuditLogs(params);
      const rawPagination = response?.pagination;
      const logs =
        (Array.isArray(response?.data)
          ? response.data
          : (response as any)?.data?.docs) || [];

      return {
        logs: logs as AuditLog[],
        pagination: {
          page: rawPagination?.page || 1,
          limit: rawPagination?.limit || 10,
          total: rawPagination?.total ?? logs.length,
          totalPages: rawPagination?.totalPages || 1,
        },
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useRolesMatrixQuery() {
  return useQuery({
    queryKey: ["admin", "roles-matrix"],
    queryFn: async () => {
      const response = await adminApi.getRoles();
      return response?.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useSystemStatsQuery() {
  return useQuery({
    queryKey: ["admin", "system-stats"],
    queryFn: async () => {
      const response = await adminApi.getSystemStats();
      return response?.data;
    },
    staleTime: 60 * 1000,
  });
}
