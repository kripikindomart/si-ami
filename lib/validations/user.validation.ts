import { z } from "zod";

/**
 * User Management Validation Schemas
 * 
 * Rules:
 * - Email must be valid and lowercase
 * - Nama min 3 chars, max 255 chars
 * - Role ID must be valid UUID
 * - Status only 'aktif' or 'nonaktif'
 * - Password min 8 chars with complexity rules
 */

// ============================================
// BASE SCHEMAS
// ============================================

export const emailSchema = z
  .string({ required_error: "Email wajib diisi" })
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")
  .toLowerCase()
  .trim();

export const namaSchema = z
  .string({ required_error: "Nama wajib diisi" })
  .min(3, "Nama minimal 3 karakter")
  .max(255, "Nama maksimal 255 karakter")
  .trim();

export const roleIdSchema = z
  .string({ required_error: "Role wajib dipilih" })
  .uuid("Role ID tidak valid");

export const statusSchema = z.enum(["aktif", "nonaktif"], {
  required_error: "Status wajib dipilih",
  invalid_type_error: "Status harus 'aktif' atau 'nonaktif'",
});

export const passwordSchema = z
  .string({ required_error: "Password wajib diisi" })
  .min(8, "Password minimal 8 karakter")
  .regex(/[A-Z]/, "Password harus ada huruf besar")
  .regex(/[a-z]/, "Password harus ada huruf kecil")
  .regex(/[0-9]/, "Password harus ada angka");

// ============================================
// CREATE USER SCHEMA
// ============================================

export const createUserSchema = z.object({
  nama: namaSchema,
  email: emailSchema,
  roleId: roleIdSchema,
  password: passwordSchema,
  status: statusSchema.optional().default("aktif"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ============================================
// CREATE USER WITH UNITS SCHEMA
// ============================================

export const createUserWithUnitsSchema = createUserSchema.extend({
  unitKerjaIds: z
    .array(z.string().uuid("Unit kerja ID tidak valid"))
    .optional()
    .refine(
      (val) => {
        // Jika roleId = pic_unit (33333333-3333-3333-3333-333333333333), maka unitKerjaIds wajib minimal 1
        return true; // Validasi ini akan dilakukan di service layer karena butuh context roleId
      },
      { message: "PIC Unit harus memiliki minimal 1 unit kerja" }
    ),
});

export type CreateUserWithUnitsInput = z.infer<typeof createUserWithUnitsSchema>;

// ============================================
// UPDATE USER SCHEMA
// ============================================

export const updateUserSchema = z.object({
  nama: namaSchema.optional(),
  roleId: roleIdSchema.optional(),
  status: statusSchema.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ============================================
// TOGGLE STATUS SCHEMA
// ============================================

export const toggleStatusSchema = z.object({
  status: statusSchema,
});

export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;

// ============================================
// CHANGE PASSWORD SCHEMA
// ============================================

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Password lama wajib diisi" })
      .min(1, "Password lama wajib diisi"),
    newPassword: passwordSchema,
    confirmPassword: z
      .string({ required_error: "Konfirmasi password wajib diisi" })
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Password baru harus berbeda dengan password lama",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// UPDATE PROFILE SCHEMA
// ============================================

export const updateProfileSchema = z.object({
  nama: namaSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================
// ASSIGN UNITS SCHEMA
// ============================================

export const assignUnitsSchema = z.object({
  unitKerjaIds: z
    .array(z.string().uuid("Unit kerja ID tidak valid"), {
      required_error: "Unit kerja wajib dipilih",
    })
    .min(1, "Minimal 1 unit kerja harus dipilih"),
});

export type AssignUnitsInput = z.infer<typeof assignUnitsSchema>;

// ============================================
// QUERY/FILTER SCHEMAS
// ============================================

export const userFilterSchema = z.object({
  roleId: z.string().uuid().optional(),
  status: statusSchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(["nama", "email", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type UserFilterInput = z.infer<typeof userFilterSchema>;
