# GitHub Issues - Modul User Management

## Overview
Breakdown tasks untuk implementasi modul User Management dengan mengikuti standar API (singleton pattern + error format JSON per field).

---

## ISSUE #1: Setup Base API Infrastructure

**Title**: Setup Base API Service dengan Singleton Pattern dan Error Handling

**Labels**: `enhancement`, `api`, `infrastructure`, `high-priority`

**Description**:

Buat infrastruktur dasar API dengan singleton pattern dan standardisasi error response format JSON per field.

**Acceptance Criteria**:
- [ ] File `lib/supabase/client.ts` dengan singleton Supabase client
- [ ] File `lib/api/base.service.ts` dengan abstract base service
- [ ] Type definitions di `types/api.types.ts`
- [ ] Error parser untuk PostgreSQL error codes (23505, 23503, 23502, 23514)
- [ ] Error format: `{ field: ["error1", "error2"] }`
- [ ] Semua method CRUD dasar (getAll, getById, create, update, delete)

**Technical Details**:
```typescript
// Error format yang diharapkan:
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah digunakan"],
    "nama": ["Nama minimal 3 karakter"],
    "password": ["Password minimal 6 karakter"]
  }
}
```

**Dependencies**:
- Supabase client library
- TypeScript

**Estimate**: 4 jam

---

## ISSUE #2: Setup Database Schema untuk User Management

**Title**: Create Database Tables dan RLS Policies untuk User Management

**Labels**: `database`, `schema`, `high-priority`

**Description**:

Implementasi database schema sesuai `docs/modules/user-management/01-schema.md`.

**Acceptance Criteria**:
- [ ] Tabel `roles` dengan 4 roles default (admin_gpm, auditor, pic_unit, pimpinan)
- [ ] Tabel `users` yang extends `auth.users`
- [ ] Tabel `permissions` dengan permission matrix per role
- [ ] Tabel `user_unit` untuk many-to-many user-unit assignment
- [ ] Views: `v_users_with_role`, `v_user_units_detail`
- [ ] RLS policies untuk semua tabel
- [ ] Function `check_permission(user_id, modul, action)`
- [ ] Triggers: `update_updated_at`, `sync_user_email`
- [ ] Seed data untuk roles dan permissions

**Migration File**:
```sql
-- File: supabase/migrations/001_user_management.sql
```

**Dependencies**:
- Supabase project setup
- PostgreSQL extensions (uuid-ossp)

**Estimate**: 6 jam

---

## ISSUE #3: Implementasi Validation Schemas dengan Zod

**Title**: Buat Validation Schemas untuk User Management Forms

**Labels**: `validation`, `frontend`, `medium-priority`

**Description**:

Buat Zod schemas untuk validasi client-side dengan error messages yang jelas.

**Acceptance Criteria**:
- [ ] File `lib/validation/user.schemas.ts`
- [ ] Schema: `loginSchema` (email, password)
- [ ] Schema: `createUserSchema` (nama, email, password, role_id, unit_kerja_ids)
- [ ] Schema: `updateUserSchema` (nama, role_id, status)
- [ ] Schema: `changePasswordSchema` (old_password, new_password, confirm_password)
- [ ] Helper function `zodErrorToApiError()` untuk convert Zod error ke format API
- [ ] Custom validation: unit_kerja_ids required jika role=pic_unit

**Example**:
```typescript
export const createUserSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role_id: z.string().uuid('Role tidak valid'),
  unit_kerja_ids: z.array(z.string().uuid()).optional(),
}).refine(/* validation for pic_unit */);
```

**Dependencies**:
- Zod library
- Issue #1 (API types)

**Estimate**: 3 jam

---

## ISSUE #4: User Service dengan Singleton Pattern

**Title**: Implementasi UserService dengan Singleton Pattern

**Labels**: `api`, `service`, `high-priority`

**Description**:

Buat UserService yang extends BaseApiService dengan method khusus untuk user management.

**Acceptance Criteria**:
- [ ] File `lib/api/user.service.ts`
- [ ] Singleton pattern implementation
- [ ] Method `createWithAuth()` - create user di auth + custom table
- [ ] Method `getAllWithRole()` - get users dengan join role
- [ ] Method `toggleStatus()` - aktifkan/nonaktifkan user
- [ ] Method `updateProfile()` - update nama user sendiri
- [ ] Method `changePassword()` - ubah password via Supabase Auth
- [ ] Method `assignUnits()` - assign units untuk PIC
- [ ] Transaction rollback jika ada error
- [ ] Error handling sesuai standar (JSON per field)

**Technical Details**:
```typescript
class UserService extends BaseApiService<User> {
  private static instance: UserService;
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  
  async createWithAuth(payload: CreateUserDto): Promise<ApiResponse<User>> {
    // 1. Create auth user
    // 2. Insert to users table
    // 3. Assign units if PIC
    // 4. Rollback if any error
  }
}
```

**Dependencies**:
- Issue #1 (Base service)
- Issue #2 (Database)
- Issue #3 (Validation)

**Estimate**: 6 jam

---

## ISSUE #5: Authentication Flow (Login, Logout, Reset Password)

**Title**: Implementasi Authentication dengan Supabase Auth

**Labels**: `auth`, `frontend`, `high-priority`

**Description**:

Implementasi login, logout, forgot password, dan reset password menggunakan Supabase Auth.

**Acceptance Criteria**:
- [ ] Page `/login` dengan form email + password
- [ ] Page `/forgot-password` dengan form email
- [ ] Page `/reset-password` dengan form password baru
- [ ] Auth context provider untuk manage user state
- [ ] Protected route wrapper
- [ ] Check user status (aktif/nonaktif) setelah login
- [ ] Force logout jika status=nonaktif
- [ ] Session persistence
- [ ] Auto-refresh token
- [ ] Error handling per field

**Component Structure**:
```
app/
├─ (auth)/
│  ├─ login/
│  │  └─ page.tsx
│  ├─ forgot-password/
│  │  └─ page.tsx
│  └─ reset-password/
│     └─ page.tsx
├─ providers/
│  └─ auth-provider.tsx
└─ components/
   └─ protected-route.tsx
```

**Dependencies**:
- Issue #4 (User service)
- Supabase Auth

**Estimate**: 8 jam

---

## ISSUE #6: User List Page dengan Filter dan Search

**Title**: Buat Halaman List Users dengan Filter, Search, dan Pagination

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Implementasi halaman list users dengan filter by role/status, search, dan action menu sesuai wireframe.

**Acceptance Criteria**:
- [ ] Page `/dashboard/users` dengan data table
- [ ] Filter dropdown: Role (semua/admin_gpm/auditor/pic_unit/pimpinan)
- [ ] Filter dropdown: Status (semua/aktif/nonaktif)
- [ ] Search input (real-time search by nama atau email)
- [ ] Sortable columns (klik header untuk sort)
- [ ] Pagination (10/25/50 per page)
- [ ] Action menu: Edit, Kelola Unit, Reset Password, Toggle Status
- [ ] Loading skeleton saat fetch data
- [ ] Empty state jika tidak ada data
- [ ] Responsive (mobile: card layout)

**shadcn/ui Components**:
- Table
- Input (search)
- Select (filter)
- DropdownMenu (action)
- Button
- Skeleton

**Dependencies**:
- Issue #4 (User service)
- shadcn/ui components

**Estimate**: 8 jam

---

## ISSUE #7: Create User Dialog dengan Unit Assignment

**Title**: Dialog Tambah User dengan Form Multi-step dan Unit Assignment

**Labels**: `frontend`, `ui`, `high-priority`

**Description**:

Implementasi dialog create user dengan form yang show/hide unit assignment berdasarkan role yang dipilih.

**Acceptance Criteria**:
- [ ] Dialog component dengan form
- [ ] Input: Nama (text)
- [ ] Input: Email (email)
- [ ] Input: Password (password dengan show/hide toggle)
- [ ] Select: Role (dropdown)
- [ ] Checkbox list: Unit Kerja (conditional, hanya muncul jika role=pic_unit)
- [ ] Validation per field (client-side dengan Zod)
- [ ] Error display per field (sesuai API response)
- [ ] Loading state saat submit
- [ ] Success toast setelah submit
- [ ] Reset form setelah success
- [ ] Transaction rollback handling

**Validation**:
- Nama: required, min 3 char
- Email: required, valid email format
- Password: required, min 6 char
- Role: required
- Unit (jika PIC): min 1 unit selected

**Dependencies**:
- Issue #4 (User service)
- Issue #3 (Validation)
- shadcn/ui Dialog, Form, Input, Select, Checkbox

**Estimate**: 8 jam

---

## ISSUE #8: Edit User dan Toggle Status

**Title**: Implementasi Edit User dan Toggle Status dengan Confirmation

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Dialog edit user (nama, role, status) dan confirmation dialog untuk toggle status.

**Acceptance Criteria**:
- [ ] Dialog edit user dengan pre-filled data
- [ ] Email field read-only (tidak bisa diubah)
- [ ] Update nama, role, status
- [ ] Jika role diubah dari/ke pic_unit: redirect ke unit assignment
- [ ] Confirmation dialog untuk toggle status
- [ ] Show warning jika user punya data terkait
- [ ] Prevent nonaktifkan admin terakhir
- [ ] Error handling per field
- [ ] Success feedback

**Business Logic**:
```typescript
// Check: Cannot deactivate last admin
const activeAdmins = await supabase
  .from('users')
  .select('id')
  .eq('role_id', adminRoleId)
  .eq('status', 'aktif');

if (activeAdmins.length === 1 && targetUser.role === 'admin_gpm') {
  throw new Error('Tidak bisa nonaktifkan admin terakhir');
}
```

**Dependencies**:
- Issue #4 (User service)
- Issue #6 (User list)

**Estimate**: 6 jam

---

## ISSUE #9: Unit Assignment untuk PIC Unit

**Title**: Dialog Kelola Unit Kerja untuk User dengan Role PIC Unit

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Dialog untuk assign/unassign multiple units ke user dengan role PIC Unit.

**Acceptance Criteria**:
- [ ] Dialog dengan checkbox list semua unit
- [ ] Pre-checked units yang sudah di-assign
- [ ] Group by jenis unit (Prodi, Lab, dll) - optional
- [ ] Save: delete old assignments, insert new assignments
- [ ] Min 1 unit must be selected
- [ ] Error handling
- [ ] Success feedback

**API Flow**:
```typescript
// 1. Delete existing
await supabase.from('user_unit').delete().eq('user_id', userId);

// 2. Insert new
await supabase.from('user_unit').insert(newAssignments);
```

**Dependencies**:
- Issue #4 (User service)
- Unit Kerja modul (for unit list)

**Estimate**: 5 jam

---

## ISSUE #10: Permission Matrix Management

**Title**: Halaman Permission Matrix untuk Manage Role Permissions

**Labels**: `frontend`, `ui`, `low-priority`

**Description**:

Halaman untuk admin GPM manage permission matrix per role per modul.

**Acceptance Criteria**:
- [ ] Page `/dashboard/permissions`
- [ ] Dropdown pilih role
- [ ] Table matrix: Modul vs CRUD permissions
- [ ] Checkbox untuk toggle permission
- [ ] Inline edit (klik checkbox langsung save)
- [ ] Confirmation jika ubah permission critical
- [ ] Loading state per checkbox
- [ ] Error handling
- [ ] Success feedback

**Table Layout**:
```
Modul          | Create | Read | Update | Delete | Actions
-------------  | ------ | ---- | ------ | ------ | -------
Users          |   ✓    |  ✓   |   ✓    |   ✓    | [Reset]
Temuan         |   ✓    |  ✓   |   ✓    |   -    | [Reset]
```

**Dependencies**:
- Issue #4 (User service)
- Permission service

**Estimate**: 6 jam

---

## ISSUE #11: User Profile Page

**Title**: Halaman Profil User untuk Edit Nama dan Ubah Password

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Halaman profile untuk user edit data diri sendiri (nama) dan ubah password.

**Acceptance Criteria**:
- [ ] Page `/dashboard/profile`
- [ ] Display: Avatar (optional), Nama, Email (read-only), Role (read-only), Status
- [ ] Button "Edit Profil" → dialog edit nama
- [ ] Button "Ubah Password" → dialog change password
- [ ] Change password form: old password, new password, confirm password
- [ ] Validation per field
- [ ] Re-authentication untuk change password
- [ ] Error handling per field
- [ ] Success feedback

**Password Change Flow**:
```typescript
// 1. Verify old password via re-auth
const { error } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: oldPassword,
});

// 2. Update password
await supabase.auth.updateUser({ password: newPassword });
```

**Dependencies**:
- Issue #4 (User service)
- Issue #5 (Auth context)

**Estimate**: 5 jam

---

## ISSUE #12: React Hook untuk API Calls

**Title**: Custom Hook useApi untuk Handle API Calls dan Loading State

**Labels**: `frontend`, `hook`, `medium-priority`

**Description**:

Buat reusable hook untuk handle API calls dengan loading state dan error state.

**Acceptance Criteria**:
- [ ] File `hooks/use-api.ts`
- [ ] Hook `useApi<T>()` dengan generic type
- [ ] State: loading, error (per field format)
- [ ] Method: `execute(apiCall)` untuk run API call
- [ ] Auto handle loading state
- [ ] Auto parse error ke per-field format
- [ ] Return response

**Usage Example**:
```typescript
const { loading, error, execute } = useApi<User>();

const handleSubmit = async (values) => {
  const response = await execute(() => userService.create(values));
  
  if (!response.success) {
    // Error sudah di-set di hook
    return;
  }
  
  // Success
  toast.success(response.message);
};
```

**Dependencies**:
- Issue #1 (API types)

**Estimate**: 3 jam

---

## ISSUE #13: Testing untuk User Service

**Title**: Unit Tests untuk UserService dan API Error Handling

**Labels**: `testing`, `backend`, `low-priority`

**Description**:

Buat unit tests untuk UserService method dan error handling.

**Acceptance Criteria**:
- [ ] File `__tests__/user.service.test.ts`
- [ ] Test: createWithAuth success
- [ ] Test: createWithAuth dengan email duplicate
- [ ] Test: createWithAuth dengan invalid role_id
- [ ] Test: createWithAuth dengan validation error
- [ ] Test: toggleStatus success
- [ ] Test: toggleStatus untuk last admin (should fail)
- [ ] Test: assignUnits untuk PIC Unit
- [ ] Mock Supabase client
- [ ] Coverage minimal 80%

**Testing Framework**:
- Jest atau Vitest
- Mock Supabase

**Dependencies**:
- Issue #4 (User service)

**Estimate**: 6 jam

---

## ISSUE #14: Integration Testing untuk Auth Flow

**Title**: E2E Tests untuk Authentication Flow

**Labels**: `testing`, `e2e`, `low-priority`

**Description**:

E2E tests untuk login, logout, forgot password flow.

**Acceptance Criteria**:
- [ ] File `e2e/auth.spec.ts`
- [ ] Test: Login dengan credentials valid
- [ ] Test: Login dengan credentials invalid
- [ ] Test: Login dengan user nonaktif (should be rejected)
- [ ] Test: Logout
- [ ] Test: Forgot password flow
- [ ] Test: Reset password flow
- [ ] Test: Protected route redirect ke login jika belum auth

**Testing Framework**:
- Playwright atau Cypress

**Dependencies**:
- Issue #5 (Auth flow)

**Estimate**: 8 jam

---

## ISSUE #15: Documentation dan API Endpoints

**Title**: Dokumentasi API Endpoints untuk User Management

**Labels**: `documentation`, `low-priority`

**Description**:

Buat dokumentasi lengkap API endpoints sesuai file `05-api-endpoints.md`.

**Acceptance Criteria**:
- [ ] File `docs/modules/user-management/05-api-endpoints.md`
- [ ] List semua endpoints dengan method, path, params, body, response
- [ ] Example request/response untuk setiap endpoint
- [ ] Error response examples per field
- [ ] Authentication requirements
- [ ] Permission requirements
- [ ] Rate limiting info (jika ada)

**Dependencies**:
- Issue #4 (User service)

**Estimate**: 4 jam

---

## Task Priority & Timeline

### Sprint 1 (Week 1):
- Issue #1: Base API Infrastructure (HIGH)
- Issue #2: Database Schema (HIGH)
- Issue #3: Validation Schemas (MEDIUM)

### Sprint 2 (Week 2):
- Issue #4: User Service (HIGH)
- Issue #5: Authentication Flow (HIGH)

### Sprint 3 (Week 3):
- Issue #6: User List Page (MEDIUM)
- Issue #7: Create User Dialog (HIGH)
- Issue #12: useApi Hook (MEDIUM)

### Sprint 4 (Week 4):
- Issue #8: Edit User & Toggle Status (MEDIUM)
- Issue #9: Unit Assignment (MEDIUM)
- Issue #11: User Profile Page (MEDIUM)

### Sprint 5 (Week 5):
- Issue #10: Permission Matrix (LOW)
- Issue #13: Unit Tests (LOW)
- Issue #14: E2E Tests (LOW)
- Issue #15: Documentation (LOW)

**Total Estimate**: 86 jam (sekitar 5 minggu untuk 1 developer)

---

**Version**: 1.0
**Last Updated**: 2026-09-01
