import { api } from "../client";
import { ApiResponse, AuditLog } from "@/interfaces";

export const adminApi = {
  /** [ADMIN] Fetch the system audit log (who did what and when — paginated) */
  getAuditLogs: async (
    params?: Record<string, any>,
  ): Promise<ApiResponse<AuditLog[]>> => {
    const res = await api.get("/admin/audit-logs", { params });
    return res.data;
  },

  /** [ADMIN] Fetch all system roles and their current permission sets */
  getRoles: async (): Promise<ApiResponse<any>> => {
    const res = await api.get("/admin/roles");
    return res.data;
  },

  /** [ADMIN] Update the permission set assigned to a specific system role */
  updateRolePermissions: async (
    id: string,
    permissions: string[],
  ): Promise<ApiResponse<any>> => {
    const res = await api.put(`/admin/roles/${id}`, { permissions });
    return res.data;
  },

  /** [ADMIN] Fetch top-level system statistics (users, sessions, DB health) */
  getSystemStats: async (): Promise<ApiResponse<any>> => {
    const res = await api.get("/admin/stats");
    return res.data;
  },
};
