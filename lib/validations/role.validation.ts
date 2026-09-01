import { z } from "zod";

/**
 * Role & Permission Validation Schemas
 */

// ============================================
// ROLE SCHEMAS
// ============================================

export const createRoleSchema = z.object({
  nama: z
    .string({ required_error: "Nama role wajib diisi" })
    .min(3, "Nama role minimal 3 karakter")
    .max(50, "Nama role maksimal 50 karakter")
    .trim()
    .toLowerCase()
    .regex(/^[a-z_]+$/, "Nama role hanya boleh huruf kecil dan underscore"),
  deskripsi: z.string().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  deskripsi: z.string().optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// ============================================
// PERMISSION SCHEMAS
// ============================================

export const modulesEnum = z.enum([
  "user_management",
  "unit_kerja",
  "standar_mutu",
  "periode_audit",
  "kategori_status",
  "auditor",
  "sesi_audit",
  "temuan",
  "rekomendasi",
  "tindak_lanjut",
  "nilai_positif",
  "lam",
  "laporan",
  "dashboard",
  "konfigurasi",
  "import_data",
  "activity_log",
  "notifikasi",
]);

export type ModuleName = z.infer<typeof modulesEnum>;

export const permissionSchema = z.object({
  roleId: z.string().uuid("Role ID tidak valid"),
  modul: modulesEnum,
  canCreate: z.boolean().default(false),
  canRead: z.boolean().default(false),
  canUpdate: z.boolean().default(false),
  canDelete: z.boolean().default(false),
});

export type PermissionInput = z.infer<typeof permissionSchema>;

export const updatePermissionSchema = z.object({
  canCreate: z.boolean().optional(),
  canRead: z.boolean().optional(),
  canUpdate: z.boolean().optional(),
  canDelete: z.boolean().optional(),
});

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;

export const bulkUpdatePermissionsSchema = z.object({
  roleId: z.string().uuid("Role ID tidak valid"),
  permissions: z.array(
    z.object({
      modul: modulesEnum,
      canCreate: z.boolean(),
      canRead: z.boolean(),
      canUpdate: z.boolean(),
      canDelete: z.boolean(),
    })
  ),
});

export type BulkUpdatePermissionsInput = z.infer<typeof bulkUpdatePermissionsSchema>;
