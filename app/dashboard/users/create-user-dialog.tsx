"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApi, getFieldErrors } from "@/hooks/use-api";
import { createUserWithUnitsSchema, type CreateUserWithUnitsInput } from "@/lib/validations";
import type { User } from "@/lib/db/schema";

/**
 * Create User Dialog Component
 * 
 * Features:
 * - Form validation dengan Zod
 * - Conditional unit assignment (role = PIC Unit)
 * - Per-field error display
 * - Loading state
 * - Success redirect
 */

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateUserDialog({ open, onClose, onSuccess }: CreateUserDialogProps) {
  const router = useRouter();
  const { execute, loading, error } = useApi<User>();

  // Form state
  const [formData, setFormData] = useState<CreateUserWithUnitsInput>({
    nama: "",
    email: "",
    password: "",
    roleId: "",
    status: "aktif",
    unitKerjaIds: [],
  });

  // Get field errors
  const fieldErrors = getFieldErrors(error);

  // Show unit assignment jika role = pic_unit
  const showUnitAssignment = formData.roleId === "33333333-3333-3333-3333-333333333333";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = createUserWithUnitsSchema.safeParse(formData);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.flatten().fieldErrors);
      return;
    }

    const response = await execute(() =>
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).then((res) => res.json())
    );

    if (response.success) {
      // Success
      onSuccess?.();
      onClose();
      router.refresh();
    }
  };

  const handleChange = (field: keyof CreateUserWithUnitsInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Tambah User Baru</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  fieldErrors.nama ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="Masukkan nama lengkap"
                disabled={loading}
              />
              {fieldErrors.nama && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.nama}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  fieldErrors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="nama@example.com"
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  fieldErrors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="Min 8 karakter, huruf besar, kecil, angka"
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimal 8 karakter, harus ada huruf besar, huruf kecil, dan angka
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.roleId}
                onChange={(e) => handleChange("roleId", e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  fieldErrors.roleId ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                disabled={loading}
              >
                <option value="">Pilih Role</option>
                <option value="11111111-1111-1111-1111-111111111111">Admin GPM</option>
                <option value="22222222-2222-2222-2222-222222222222">Auditor</option>
                <option value="33333333-3333-3333-3333-333333333333">PIC Unit</option>
                <option value="44444444-4444-4444-4444-444444444444">Pimpinan</option>
              </select>
              {fieldErrors.roleId && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.roleId}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value as "aktif" | "nonaktif")}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>

            {/* Unit Assignment - Conditional */}
            {showUnitAssignment && (
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2">
                  Unit Kerja <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  PIC Unit harus di-assign ke minimal 1 unit kerja
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
                  {/* Placeholder - akan fetch dari API nanti */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const unitId = "dummy-unit-1";
                        handleChange(
                          "unitKerjaIds",
                          e.target.checked
                            ? [...(formData.unitKerjaIds || []), unitId]
                            : (formData.unitKerjaIds || []).filter((id) => id !== unitId)
                        );
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">Unit Kerja 1 (Placeholder)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const unitId = "dummy-unit-2";
                        handleChange(
                          "unitKerjaIds",
                          e.target.checked
                            ? [...(formData.unitKerjaIds || []), unitId]
                            : (formData.unitKerjaIds || []).filter((id) => id !== unitId)
                        );
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">Unit Kerja 2 (Placeholder)</span>
                  </label>
                </div>
                {fieldErrors.unitKerjaIds && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.unitKerjaIds}</p>
                )}
              </div>
            )}

            {/* General Error */}
            {error && !Object.keys(fieldErrors).length && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{error.message}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
