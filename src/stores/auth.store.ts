import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "../interfaces";
import { COOKIE_KEYS } from "../constants/cookies.constants";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;

  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;

  hasRole: (roleCode: string) => boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      initialized: false,

      setAuth: (user: User, token: string, refreshToken?: string) => {
        if (typeof window !== "undefined") {
          Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, {
            expires: 7,
            sameSite: "lax",
          });
          if (refreshToken) {
            Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
              expires: 30,
              sameSite: "lax",
            });
          }
          Cookies.set(COOKIE_KEYS.USER, JSON.stringify(user), {
            expires: 7,
            sameSite: "lax",
          });
        }

        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
          initialized: true,
        });
      },

      setUser: (user: User | null) => {
        if (typeof window !== "undefined") {
          if (user) {
            Cookies.set(COOKIE_KEYS.USER, JSON.stringify(user), {
              expires: 7,
              sameSite: "lax",
            });
          } else {
            Cookies.remove(COOKIE_KEYS.USER);
          }
        }
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        if (typeof window !== "undefined") {
          if (token) {
            Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, {
              expires: 7,
              sameSite: "lax",
            });
          } else {
            Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);
          }
        }
        set({ token, isAuthenticated: !!token });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);
          Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
          Cookies.remove(COOKIE_KEYS.USER);
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          initialized: true,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setInitialized: (initialized: boolean) => set({ initialized }),

      hasRole: (roleCode: string): boolean => {
        const { user } = get();
        if (!user) return false;
        return (
          user.roles?.includes(roleCode) || user.roles?.includes("SUPER_ADMIN")
        );
      },

      hasPermission: (permissionCode: string): boolean => {
        const { user } = get();
        if (!user) return false;
        if (user.roles?.includes("SUPER_ADMIN")) return true;
        return user.permissions?.includes(permissionCode) || false;
      },

      hasAnyPermission: (permissionCodes: string[]): boolean => {
        const { user } = get();
        if (!user) return false;
        if (user.roles?.includes("SUPER_ADMIN")) return true;
        return permissionCodes.some((p) => user.permissions?.includes(p));
      },
    }),
    {
      name: "aef-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
