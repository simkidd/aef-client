"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentUserQuery } from "@/hooks/queries/useAuthQueries";
import { User } from "@/interfaces";

/**
 * Checks if a user possesses a specific role code or is a SUPER_ADMIN
 */
export function checkUserRole(user: User | null, roleCode: string): boolean {
  if (!user) return false;
  if (user.roles?.includes("SUPER_ADMIN")) return true;
  return user.roles?.includes(roleCode) || false;
}

/**
 * Checks if a user possesses any of the provided role codes
 */
export function checkUserAnyRole(
  user: User | null,
  roleCodes: string[],
): boolean {
  if (!user) return false;
  if (user.roles?.includes("SUPER_ADMIN")) return true;
  return roleCodes.some((role) => user.roles?.includes(role));
}

/**
 * Checks if a user possesses a specific permission code or is a SUPER_ADMIN
 */
export function checkUserPermission(
  user: User | null,
  permissionCode: string,
): boolean {
  if (!user) return false;
  if (user.roles?.includes("SUPER_ADMIN")) return true;
  return user.permissions?.includes(permissionCode) || false;
}

/**
 * Checks if a user possesses any of the provided permission codes
 */
export function checkUserAnyPermission(
  user: User | null,
  permissionCodes: string[],
): boolean {
  if (!user) return false;
  if (user.roles?.includes("SUPER_ADMIN")) return true;
  return permissionCodes.some((perm) => user.permissions?.includes(perm));
}

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard Component
 * Validates active session via `useCurrentUserQuery()` and synchronizes user state into `useAuthStore`.
 * Note: Route protection and path-based redirection are handled at the edge by proxy.ts.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { setUser, setInitialized, initialized } = useAuthStore();
  const { data, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setUser(data);
      }
      setInitialized(true);
    }
  }, [data, isLoading, setUser, setInitialized]);

  if (!initialized) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export const UserAuthGuard = AuthGuard;

/**
 * RoleGuard Component (Inline RBAC)
 * Conditionally renders UI elements (buttons, widgets, tabs) based on user permissions or roles.
 */
export function RoleGuard({
  children,
  fallback = null,
  roles,
  permissions,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) return <>{fallback}</>;

  if (roles && roles.length > 0 && !checkUserAnyRole(user, roles)) {
    return <>{fallback}</>;
  }

  if (
    permissions &&
    permissions.length > 0 &&
    !checkUserAnyPermission(user, permissions)
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default AuthGuard;
