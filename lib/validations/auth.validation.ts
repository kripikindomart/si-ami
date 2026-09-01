import { z } from "zod";
import { emailSchema, passwordSchema } from "./user.validation";

/**
 * Authentication Validation Schemas
 */

// ============================================
// LOGIN SCHEMA
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// REGISTER SCHEMA (untuk self-registration jika ada)
// ============================================

export const registerSchema = z
  .object({
    nama: z
      .string({ required_error: "Nama wajib diisi" })
      .min(3, "Nama minimal 3 karakter")
      .max(255, "Nama maksimal 255 karakter")
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: "Konfirmasi password wajib diisi" })
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================
// FORGOT PASSWORD SCHEMA
// ============================================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ============================================
// RESET PASSWORD SCHEMA
// ============================================

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: "Token wajib diisi" })
      .min(1, "Token tidak valid"),
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: "Konfirmasi password wajib diisi" })
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// VERIFY EMAIL SCHEMA
// ============================================

export const verifyEmailSchema = z.object({
  token: z
    .string({ required_error: "Token wajib diisi" })
    .min(1, "Token tidak valid"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
