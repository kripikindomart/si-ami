import { db } from "@/lib/db/client";
import type { ApiResponse, PostgresError } from "@/types/api.types";

/**
 * Abstract Base API Service
 * Semua service harus extend class ini
 * Implements singleton pattern per service
 */
export abstract class BaseApiService<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      // Using Drizzle ORM
      const data = await db.query[this.tableName].findMany();

      return {
        success: true,
        data: data as T[],
        message: "Data berhasil diambil",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const data = await db.query[this.tableName].findFirst({
        where: (table: any, { eq }: any) => eq(table.id, id),
      });

      if (!data) {
        return {
          success: false,
          data: null,
          message: "Data tidak ditemukan",
          errors: { id: ["Data dengan ID tersebut tidak ditemukan"] },
        };
      }

      return {
        success: true,
        data: data as T,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create record
   */
  async create(payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      // Implementation depends on specific service
      // Override di child class
      throw new Error("Method create() must be implemented in child class");
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update record
   */
  async update(id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      // Implementation depends on specific service
      // Override di child class
      throw new Error("Method update() must be implemented in child class");
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete record (soft delete via status)
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      // Implementation depends on specific service
      // Override di child class
      throw new Error("Method delete() must be implemented in child class");
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle error dengan format konsisten
   */
  protected handleError(error: any): ApiResponse<any> {
    console.error(`[${this.tableName}] Error:`, error);

    // PostgreSQL error
    if (error.code) {
      return this.parsePostgresError(error);
    }

    // Drizzle error
    if (error.message?.includes("duplicate key")) {
      return this.parsePostgresError({
        code: "23505",
        message: error.message,
      });
    }

    // Generic error
    return {
      success: false,
      data: null,
      message: error.message || "Terjadi kesalahan",
      errors: { _general: [error.message || "Terjadi kesalahan"] },
    };
  }

  /**
   * Parse PostgreSQL error ke format JSON per field
   */
  protected parsePostgresError(error: PostgresError): ApiResponse<any> {
    const errors: Record<string, string[]> = {};

    switch (error.code) {
      // Unique constraint violation
      case "23505":
        const field = this.extractFieldFromError(error.message);
        errors[field] = [`${field} sudah digunakan`];
        return {
          success: false,
          data: null,
          message: "Data duplikat",
          errors,
        };

      // Foreign key violation
      case "23503":
        const fkField = this.extractFieldFromError(error.message);
        errors[fkField] = [`${fkField} tidak valid atau tidak ditemukan`];
        return {
          success: false,
          data: null,
          message: "Referensi data tidak valid",
          errors,
        };

      // Not null violation
      case "23502":
        const nullField = this.extractFieldFromError(error.message);
        errors[nullField] = [`${nullField} wajib diisi`];
        return {
          success: false,
          data: null,
          message: "Data tidak lengkap",
          errors,
        };

      // Check constraint violation
      case "23514":
        errors._general = ["Data tidak sesuai dengan aturan validasi"];
        return {
          success: false,
          data: null,
          message: "Validasi gagal",
          errors,
        };

      default:
        errors._general = [error.message];
        return {
          success: false,
          data: null,
          message: "Terjadi kesalahan database",
          errors,
        };
    }
  }

  /**
   * Extract field name from error message
   */
  protected extractFieldFromError(message: string): string {
    // PostgreSQL: Key (field_name)=(value) already exists
    const keyMatch = message.match(/Key \(([^)]+)\)/);
    if (keyMatch) return keyMatch[1];

    // PostgreSQL: null value in column "field_name" violates not-null constraint
    const nullMatch = message.match(/column "([^"]+)"/);
    if (nullMatch) return nullMatch[1];

    // PostgreSQL: insert or update on table "table_name" violates foreign key constraint
    const fkMatch = message.match(/on table "([^"]+)"/);
    if (fkMatch) return fkMatch[1];

    return "_general";
  }
}
