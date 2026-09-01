import { db } from "@/lib/db/client";
import { users, roles, permissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "@/types/api.types";
import type { LoginInput } from "@/lib/validations";

/**
 * AuthService - Singleton Pattern (PostgreSQL Local - NO Supabase)
 * 
 * Handles:
 * - Login dengan bcrypt password verification
 * - Session management via cookies (Next.js server-side)
 * - Get user profile dengan permissions
 */

export interface AuthUser {
  id: string;
  email: string;
  nama: string;
  roleId: string;
  roleName: string;
  status: "aktif" | "nonaktif";
  permissions: {
    modul: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }[];
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Singleton getInstance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login dengan email & password
   */
  async login(credentials: LoginInput): Promise<ApiResponse<AuthUser>> {
    try {
      const { email, password } = credentials;

      // 1. Get user dari database dengan role & permissions
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
        with: {
          role: {
            with: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        return {
          success: false,
          error: {
            code: "AUTH_ERROR",
            message: "Email atau password salah",
            fields: {
              email: ["Email atau password salah"],
            },
          },
        };
      }

      // 2. Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        return {
          success: false,
          error: {
            code: "AUTH_ERROR",
            message: "Email atau password salah",
            fields: {
              email: ["Email atau password salah"],
            },
          },
        };
      }

      // 3. Check status aktif
      if (user.status === "nonaktif") {
        return {
          success: false,
          error: {
            code: "USER_INACTIVE",
            message: "Akun Anda telah dinonaktifkan",
            fields: {
              email: ["Akun Anda telah dinonaktifkan"],
            },
          },
        };
      }

      // 4. Return auth user dengan permissions
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        roleId: user.roleId,
        roleName: user.role?.nama || "",
        status: user.status,
        permissions: user.role?.permissions.map((p) => ({
          modul: p.modul,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        })) || [],
      };

      return {
        success: true,
        data: authUser,
        message: "Login berhasil",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Terjadi kesalahan",
        },
      };
    }
  }

  /**
   * Get user dengan permissions dari database (by ID)
   */
  async getUserWithPermissions(userId: string): Promise<ApiResponse<AuthUser>> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
          role: {
            with: {
              permissions: true,
            },
          },
        },
      });

      if (!user || !user.role) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User tidak ditemukan",
          },
        };
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        nama: user.nama,
        roleId: user.roleId,
        roleName: user.role.nama,
        status: user.status,
        permissions: user.role.permissions.map((p) => ({
          modul: p.modul,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        })),
      };

      return {
        success: true,
        data: authUser,
        message: "User found",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "Terjadi kesalahan",
        },
      };
    }
  }

  /**
   * Check permission untuk modul tertentu
   */
  checkPermission(
    user: AuthUser | null,
    modul: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean {
    if (!user) return false;

    const permission = user.permissions.find((p) => p.modul === modul);
    if (!permission) return false;

    switch (action) {
      case "create":
        return permission.canCreate;
      case "read":
        return permission.canRead;
      case "update":
        return permission.canUpdate;
      case "delete":
        return permission.canDelete;
      default:
        return false;
    }
  }

  /**
   * Check if user has role
   */
  hasRole(user: AuthUser | null, roleName: string): boolean {
    return user?.roleName === roleName;
  }

  /**
   * Check if user is admin
   */
  isAdmin(user: AuthUser | null): boolean {
    return user?.roleName === "admin_gpm";
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
