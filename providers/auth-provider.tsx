"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, type AuthUser } from "@/lib/api/auth.service";
import { supabase } from "@/lib/db/supabase-client";

/**
 * Auth Context Provider
 * 
 * Provides:
 * - Current user state
 * - Loading state
 * - Login/Logout functions
 * - Permission checking helpers
 * - Auto session refresh
 */

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPermission: (modul: string, action: "create" | "read" | "update" | "delete") => boolean;
  hasRole: (roleName: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Initialize session on mount
   */
  useEffect(() => {
    initializeSession();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthProvider] Auth state changed:", event);

        if (event === "SIGNED_IN" && session) {
          await loadUser(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/login");
        } else if (event === "TOKEN_REFRESHED" && session) {
          await loadUser(session.user.id);
        } else if (event === "USER_UPDATED" && session) {
          await loadUser(session.user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  /**
   * Initialize session from storage
   */
  const initializeSession = async () => {
    try {
      const response = await authService.getSession();

      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthProvider] Initialize session error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user data dari database
   */
  const loadUser = async (userId: string) => {
    try {
      const response = await authService.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthProvider] Load user error:", error);
      setUser(null);
    }
  };

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        return {
          success: true,
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.error?.message || "Login gagal",
      };
    } catch (error: any) {
      console.error("[AuthProvider] Login error:", error);
      return {
        success: false,
        message: error.message || "Terjadi kesalahan",
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("[AuthProvider] Logout error:", error);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    if (user) {
      await loadUser(user.id);
    }
  };

  /**
   * Check permission helper
   */
  const checkPermission = (
    modul: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    return authService.checkPermission(user, modul, action);
  };

  /**
   * Has role helper
   */
  const hasRole = (roleName: string): boolean => {
    return authService.hasRole(user, roleName);
  };

  /**
   * Is admin helper
   */
  const isAdmin = (): boolean => {
    return authService.isAdmin(user);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    checkPermission,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

/**
 * useRequireAuth hook - Redirect ke login jika belum auth
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * useRequirePermission hook - Redirect ke 403 jika tidak punya permission
 */
export function useRequirePermission(
  modul: string,
  action: "create" | "read" | "update" | "delete"
) {
  const { user, loading, checkPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const hasPermission = checkPermission(modul, action);
      if (!hasPermission) {
        router.push("/403");
      }
    }
  }, [user, loading, modul, action, checkPermission, router]);

  return { user, loading, hasPermission: checkPermission(modul, action) };
}
