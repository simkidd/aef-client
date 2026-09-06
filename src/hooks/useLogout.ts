"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const { redirectTo = "/auth/login", onSuccess, onError } = options;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshToken, clearAuth } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => authApi.logout(refreshToken || undefined),
    onSettled: () => {
      // 1. Clear local authentication state (Zustand + Cookies + LocalStorage)
      clearAuth();

      // 2. Clear React Query cache to prevent data leakage between sessions
      queryClient.clear();

      // 3. Reset local modal state
      // setIsOpen(false);

      // 4. Trigger success callback if provided
      onSuccess?.();

      // 5. Redirect user
      router.push(redirectTo);
    },
    onError: (error) => {
      console.warn("Logout API error:", error);
      onError?.(error);
    },
  });

  const openLogoutModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLogoutModal = useCallback(() => {
    if (!mutation.isPending) {
      setIsOpen(false);
    }
  }, [mutation.isPending]);

  const handleLogout = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return {
    isOpen,
    setIsOpen,
    openLogoutModal,
    closeLogoutModal,
    isLoggingOut: mutation.isPending,
    isLoading: mutation.isPending,
    handleLogout,
    logout: handleLogout,
    mutation,
  };
}

export default useLogout;
