import { BaseApiService } from "./base.service";
import { db } from "@/lib/db/client";
import { users, userUnit, roles } from "@/lib/db/schema";
import { eq, and, or, ilike, desc, asc, SQL, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { User, NewUser, UserUnit } from "@/lib/db/schema";
import type { ApiResponse } from "@/types/api.types";
import type {
  CreateUserWithUnitsInput,
  UpdateUserInput,
  ToggleStatusInput,
  AssignUnitsInput,
  UserFilterInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "@/lib/validations";

/**
 * UserService - Singleton Pattern (PostgreSQL Local - NO Supabase Auth)
 * 
 * Handles:
 * - User CRUD dengan bcrypt password hashing
 * - Unit assignment untuk PIC role
 * - Status toggle dengan last admin protection
 * - Password management
 * - Profile update
 */
class UserService extends BaseApiService<User> {
  private static instance: UserService;

  private constructor() {
    super("users");
  }

  /**
   * Singleton getInstance
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get all users dengan filter, search, pagination
   */
  async getAll(filters?: UserFilterInput): Promise<ApiResponse<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    try {
      const {
        roleId,
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters || {};

      // Build where conditions
      const conditions: SQL[] = [];

      if (roleId) {
        conditions.push(eq(users.roleId, roleId));
      }

      if (status) {
        conditions.push(eq(users.status, status));
      }

      if (search) {
        conditions.push(
          or(
            ilike(users.nama, `%${search}%`),
            ilike(users.email, `%${search}%`)
          )!
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Count total
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(whereClause);

      // Get paginated data
      const orderByClause =
        sortOrder === "asc"
          ? asc(users[sortBy as keyof typeof users])
          : desc(users[sortBy as keyof typeof users]);

      const data = await db
        .select({
          id: users.id,
          nama: users.nama,
          email: users.email,
          passwordHash: users.passwordHash,
          roleId: users.roleId,
          status: users.status,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          role: {
            id: roles.id,
            nama: roles.nama,
            deskripsi: roles.deskripsi,
          },
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset((page - 1) * limit);

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        data: {
          data: data as any,
          total: count,
          page,
          limit,
          totalPages,
        },
        message: "Data berhasil diambil",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user by ID dengan relasi role dan units
   */
  async getById(id: string): Promise<ApiResponse<User & { role: any; units?: any[] }>> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          role: true,
          userUnits: true,
        },
      });

      if (!user) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User tidak ditemukan",
          },
        };
      }

      return {
        success: true,
        data: user as any,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create user dengan password hash + optional unit assignment
   */
  async create(
    payload: CreateUserWithUnitsInput
  ): Promise<ApiResponse<User>> {
    try {
      const { nama, email, password, roleId, status, unitKerjaIds } = payload;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user di database
      const [user] = await db
        .insert(users)
        .values({
          nama,
          email: email.toLowerCase(),
          passwordHash,
          roleId,
          status: status || "aktif",
        })
        .returning();

      // Assign units jika roleId = pic_unit dan ada unitKerjaIds
      if (unitKerjaIds && unitKerjaIds.length > 0) {
        await db.insert(userUnit).values(
          unitKerjaIds.map((unitKerjaId) => ({
            userId: user.id,
            unitKerjaId,
          }))
        );
      }

      return {
        success: true,
        data: user,
        message: "User berhasil dibuat",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user (nama, roleId, status)
   */
  async update(
    id: string,
    payload: UpdateUserInput
  ): Promise<ApiResponse<User>> {
    try {
      const { nama, roleId, status } = payload;

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!existingUser) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User tidak ditemukan",
          },
        };
      }

      // Prevent nonaktifkan last admin
      if (status === "nonaktif") {
        const isLastAdmin = await this.isLastAdmin(id);
        if (isLastAdmin) {
          return {
            success: false,
            error: {
              code: "LAST_ADMIN",
              message: "Tidak bisa nonaktifkan admin terakhir",
              fields: {
                status: ["Tidak bisa nonaktifkan admin terakhir"],
              },
            },
          };
        }
      }

      // Update database
      const [updatedUser] = await db
        .update(users)
        .set({
          ...payload,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      return {
        success: true,
        data: updatedUser,
        message: "User berhasil diupdate",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Toggle status user
   */
  async toggleStatus(
    id: string,
    payload: ToggleStatusInput
  ): Promise<ApiResponse<User>> {
    try {
      const { status } = payload;

      // Prevent nonaktifkan last admin
      if (status === "nonaktif") {
        const isLastAdmin = await this.isLastAdmin(id);
        if (isLastAdmin) {
          return {
            success: false,
            error: {
              code: "LAST_ADMIN",
              message: "Tidak bisa nonaktifkan admin terakhir",
              fields: {
                status: ["Tidak bisa nonaktifkan admin terakhir"],
              },
            },
          };
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      return {
        success: true,
        data: updatedUser,
        message: `User berhasil ${status === "aktif" ? "diaktifkan" : "dinonaktifkan"}`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Assign units ke user (untuk PIC role)
   */
  async assignUnits(
    userId: string,
    payload: AssignUnitsInput
  ): Promise<ApiResponse<UserUnit[]>> {
    try {
      const { unitKerjaIds } = payload;

      // Delete existing assignments
      await db.delete(userUnit).where(eq(userUnit.userId, userId));

      // Insert new assignments
      const assignments = await db
        .insert(userUnit)
        .values(
          unitKerjaIds.map((unitKerjaId) => ({
            userId,
            unitKerjaId,
          }))
        )
        .returning();

      return {
        success: true,
        data: assignments,
        message: "Unit berhasil diassign",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    payload: ChangePasswordInput
  ): Promise<ApiResponse<null>> {
    try {
      const { oldPassword, newPassword } = payload;

      // Get user
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User tidak ditemukan",
          },
        };
      }

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!isValid) {
        return {
          success: false,
          error: {
            code: "INVALID_PASSWORD",
            message: "Password lama tidak sesuai",
            fields: {
              oldPassword: ["Password lama tidak sesuai"],
            },
          },
        };
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await db
        .update(users)
        .set({
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return {
        success: true,
        data: null,
        message: "Password berhasil diubah",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update profile (nama only)
   */
  async updateProfile(
    userId: string,
    payload: UpdateProfileInput
  ): Promise<ApiResponse<User>> {
    try {
      const { nama } = payload;

      const [updatedUser] = await db
        .update(users)
        .set({
          nama,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return {
        success: true,
        data: updatedUser,
        message: "Profil berhasil diupdate",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if user is last active admin
   */
  private async isLastAdmin(userId: string): Promise<boolean> {
    // Get admin role ID (11111111-1111-1111-1111-111111111111)
    const adminRoleId = "11111111-1111-1111-1111-111111111111";

    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.roleId !== adminRoleId) {
      return false;
    }

    // Count active admins
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(and(eq(users.roleId, adminRoleId), eq(users.status, "aktif")));

    return count === 1;
  }

  /**
   * Delete user (hard delete)
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      // Check if last admin
      const isLastAdmin = await this.isLastAdmin(id);
      if (isLastAdmin) {
        return {
          success: false,
          error: {
            code: "LAST_ADMIN",
            message: "Tidak bisa menghapus admin terakhir",
          },
        };
      }

      // Delete user (cascade ke user_unit)
      await db.delete(users).where(eq(users.id, id));

      return {
        success: true,
        data: null,
        message: "User berhasil dihapus",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
