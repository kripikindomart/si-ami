# API Endpoints - Modul User Management

## Overview
Dokumentasi lengkap API endpoints untuk User Management dengan standardisasi response format (singleton pattern + error JSON per field).

---

## Base URL

```
Local: http://localhost:3000
Environment Variable: process.env.NEXT_PUBLIC_APP_URL
```

**Note**: Semua endpoint menggunakan Supabase client (singleton pattern), bukan REST API tradisional. Documentation ini menjelaskan service methods yang bisa dipanggil dari client-side. Gunakan environment variable untuk URL, jangan hardcode.

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Login

**Method**: `POST` (Supabase Auth)

**Service Method**:
```typescript
import { supabase } from '@/lib/supabase/client';

const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string,
});
```

**Request Body**:
```json
{
  "email": "zaki@uika.ac.id",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "zaki@uika.ac.id",
      "aud": "authenticated",
      "role": "authenticated",
      "created_at": "2026-09-01T10:00:00Z"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "xyz...",
      "expires_in": 3600
    }
  },
  "message": "Login berhasil"
}
```

**Error Response - Invalid Credentials** (401):
```json
{
  "success": false,
  "data": null,
  "message": "Email atau password salah",
  "errors": {
    "email": ["Email atau password salah"],
    "password": ["Email atau password salah"]
  }
}
```

**Error Response - User Nonaktif** (403):
```json
{
  "success": false,
  "data": null,
  "message": "Akun Anda telah dinonaktifkan",
  "errors": {
    "_general": ["Akun Anda telah dinonaktifkan. Hubungi admin untuk informasi lebih lanjut."]
  }
}
```

---

### 1.2 Logout

**Method**: `POST` (Supabase Auth)

**Service Method**:
```typescript
const { error } = await supabase.auth.signOut();
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Logout berhasil"
}
```

---

### 1.3 Forgot Password

**Method**: `POST` (Supabase Auth)

**Service Method**:
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
});
```

**Request Body**:
```json
{
  "email": "zaki@uika.ac.id"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Link reset password telah dikirim ke email Anda"
}
```

**Error Response - Email Not Found** (404):
```json
{
  "success": false,
  "data": null,
  "message": "Email tidak ditemukan",
  "errors": {
    "email": ["Email tidak terdaftar di sistem"]
  }
}
```

---

### 1.4 Reset Password

**Method**: `POST` (Supabase Auth)

**Service Method**:
```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

**Request Body**:
```json
{
  "password": "newpassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Password berhasil diubah"
}
```

**Error Response - Weak Password** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Password terlalu lemah",
  "errors": {
    "password": ["Password minimal 6 karakter"]
  }
}
```

---

## 2. USER CRUD ENDPOINTS

### 2.1 Get All Users

**Service Method**:
```typescript
import { userService } from '@/lib/api/user.service';

const response = await userService.getAllWithRole();
```

**Query Params** (Optional):
```
?role=auditor
&status=aktif
&search=ahmad
&page=1
&per_page=10
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "nama": "Ahmad Zaki",
      "email": "zaki@uika.ac.id",
      "role_id": "role-uuid-1",
      "role_nama": "admin_gpm",
      "role_deskripsi": "Administrator GPM",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z",
      "updated_at": "2026-09-01T10:00:00Z"
    },
    {
      "id": "uuid-456",
      "nama": "Siti Aminah",
      "email": "siti@uika.ac.id",
      "role_id": "role-uuid-2",
      "role_nama": "auditor",
      "role_deskripsi": "Auditor Internal",
      "status": "aktif",
      "created_at": "2026-09-01T11:00:00Z",
      "updated_at": "2026-09-01T11:00:00Z"
    }
  ],
  "message": "Data berhasil diambil",
  "meta": {
    "total": 12,
    "page": 1,
    "perPage": 10,
    "totalPages": 2
  }
}
```

---

### 2.2 Get User by ID

**Service Method**:
```typescript
const response = await userService.getById(userId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki",
    "email": "zaki@uika.ac.id",
    "role_id": "role-uuid-1",
    "role_nama": "admin_gpm",
    "status": "aktif",
    "created_at": "2026-09-01T10:00:00Z",
    "updated_at": "2026-09-01T10:00:00Z"
  },
  "message": "Data berhasil diambil"
}
```

**Error Response - Not Found** (404):
```json
{
  "success": false,
  "data": null,
  "message": "User tidak ditemukan",
  "errors": {
    "id": ["User dengan ID tersebut tidak ditemukan"]
  }
}
```

---

### 2.3 Create User

**Service Method**:
```typescript
const response = await userService.createWithAuth({
  nama: string,
  email: string,
  password: string,
  role_id: string,
  unit_kerja_ids?: string[], // Required jika role=pic_unit
});
```

**Request Body**:
```json
{
  "nama": "Budi Santoso",
  "email": "budi@uika.ac.id",
  "password": "password123",
  "role_id": "uuid-role-pic",
  "unit_kerja_ids": [
    "uuid-unit-dpai",
    "uuid-unit-mm"
  ]
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-789",
    "nama": "Budi Santoso",
    "email": "budi@uika.ac.id",
    "role_id": "uuid-role-pic",
    "status": "aktif",
    "created_at": "2026-09-01T12:00:00Z",
    "updated_at": "2026-09-01T12:00:00Z"
  },
  "message": "User berhasil ditambahkan"
}
```

**Error Response - Validation** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama minimal 3 karakter"],
    "email": ["Email tidak valid"],
    "password": ["Password minimal 6 karakter"],
    "unit_kerja_ids": ["PIC Unit wajib memilih minimal 1 unit kerja"]
  }
}
```

**Error Response - Duplicate Email** (409):
```json
{
  "success": false,
  "data": null,
  "message": "Data duplikat",
  "errors": {
    "email": ["Email sudah digunakan"]
  }
}
```

**Error Response - Invalid Role** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Referensi data tidak valid",
  "errors": {
    "role_id": ["Role tidak ditemukan atau tidak valid"]
  }
}
```

---

### 2.4 Update User

**Service Method**:
```typescript
const response = await userService.update(userId, {
  nama: string,
  role_id: string,
  status: 'aktif' | 'nonaktif',
});
```

**Request Body**:
```json
{
  "nama": "Ahmad Zaki Updated",
  "role_id": "uuid-role-admin",
  "status": "aktif"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki Updated",
    "email": "zaki@uika.ac.id",
    "role_id": "uuid-role-admin",
    "status": "aktif",
    "updated_at": "2026-09-01T13:00:00Z"
  },
  "message": "User berhasil diupdate"
}
```

**Error Response - Cannot Edit Self** (403):
```json
{
  "success": false,
  "data": null,
  "message": "Tidak diizinkan",
  "errors": {
    "_general": ["Anda tidak bisa mengubah data diri sendiri di halaman ini. Gunakan halaman Profil."]
  }
}
```

**Note**: Email TIDAK BISA diubah (immutable).

---

### 2.5 Toggle User Status

**Service Method**:
```typescript
const response = await userService.toggleStatus(userId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki",
    "email": "zaki@uika.ac.id",
    "status": "nonaktif",
    "updated_at": "2026-09-01T14:00:00Z"
  },
  "message": "User berhasil dinonaktifkan"
}
```

**Error Response - Last Admin** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Operasi tidak diizinkan",
  "errors": {
    "_general": ["Tidak bisa menonaktifkan admin terakhir. Minimal harus ada 1 admin aktif di sistem."]
  }
}
```

---

### 2.6 Assign Units to User (PIC Unit)

**Service Method**:
```typescript
const response = await userService.assignUnits(userId, unitIds);
```

**Request Body**:
```json
{
  "unit_kerja_ids": [
    "uuid-unit-dpai",
    "uuid-unit-mm",
    "uuid-unit-mh"
  ]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-789",
    "units": [
      {
        "id": "uuid-assignment-1",
        "user_id": "uuid-789",
        "unit_kerja_id": "uuid-unit-dpai",
        "unit_kode": "DPAI",
        "unit_nama": "Program Studi Doktor Pendidikan Agama Islam"
      },
      {
        "id": "uuid-assignment-2",
        "user_id": "uuid-789",
        "unit_kerja_id": "uuid-unit-mm",
        "unit_kode": "MM",
        "unit_nama": "Program Studi Magister Manajemen"
      }
    ]
  },
  "message": "Unit kerja berhasil diassign"
}
```

**Error Response - Not PIC Unit** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Operasi tidak diizinkan",
  "errors": {
    "_general": ["Hanya user dengan role PIC Unit yang bisa di-assign unit kerja"]
  }
}
```

**Error Response - Empty Units** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "unit_kerja_ids": ["Minimal 1 unit kerja harus dipilih"]
  }
}
```

---

## 3. PROFILE ENDPOINTS

### 3.1 Get Own Profile

**Service Method**:
```typescript
const response = await userService.getProfile();
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki",
    "email": "zaki@uika.ac.id",
    "role_nama": "admin_gpm",
    "role_deskripsi": "Administrator GPM",
    "status": "aktif",
    "created_at": "2026-09-01T10:00:00Z"
  },
  "message": "Data profil berhasil diambil"
}
```

---

### 3.2 Update Own Profile

**Service Method**:
```typescript
const response = await userService.updateProfile({
  nama: string,
});
```

**Request Body**:
```json
{
  "nama": "Ahmad Zaki Updated"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki Updated",
    "email": "zaki@uika.ac.id",
    "updated_at": "2026-09-01T15:00:00Z"
  },
  "message": "Profil berhasil diupdate"
}
```

**Error Response - Validation** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama minimal 3 karakter"]
  }
}
```

**Note**: Hanya nama yang bisa diubah. Email dan role tidak bisa diubah sendiri.

---

### 3.3 Change Own Password

**Service Method**:
```typescript
const response = await userService.changePassword({
  old_password: string,
  new_password: string,
});
```

**Request Body**:
```json
{
  "old_password": "password123",
  "new_password": "newpassword456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Password berhasil diubah"
}
```

**Error Response - Wrong Old Password** (401):
```json
{
  "success": false,
  "data": null,
  "message": "Password lama salah",
  "errors": {
    "old_password": ["Password lama tidak sesuai"]
  }
}
```

**Error Response - Weak New Password** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "new_password": ["Password minimal 6 karakter"]
  }
}
```

---

## 4. PERMISSION ENDPOINTS

### 4.1 Get Permissions by Role

**Service Method**:
```typescript
const response = await supabase
  .from('permissions')
  .select('*')
  .eq('role_id', roleId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-perm-1",
      "role_id": "uuid-role-admin",
      "modul": "users",
      "can_create": true,
      "can_read": true,
      "can_update": true,
      "can_delete": true
    },
    {
      "id": "uuid-perm-2",
      "role_id": "uuid-role-admin",
      "modul": "temuan",
      "can_create": true,
      "can_read": true,
      "can_update": true,
      "can_delete": false
    }
  ],
  "message": "Data permissions berhasil diambil"
}
```

---

### 4.2 Update Permission

**Service Method**:
```typescript
const response = await supabase
  .from('permissions')
  .update({
    can_create: boolean,
    can_read: boolean,
    can_update: boolean,
    can_delete: boolean,
  })
  .eq('role_id', roleId)
  .eq('modul', modul);
```

**Request Body**:
```json
{
  "can_create": true,
  "can_read": true,
  "can_update": true,
  "can_delete": false
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-perm-1",
    "role_id": "uuid-role-auditor",
    "modul": "temuan",
    "can_create": true,
    "can_read": true,
    "can_update": true,
    "can_delete": false
  },
  "message": "Permission berhasil diupdate"
}
```

---

### 4.3 Check Permission (Helper Function)

**Service Method**:
```typescript
const { data } = await supabase.rpc('check_permission', {
  p_user_id: userId,
  p_modul: 'temuan',
  p_action: 'create',
});
```

**Response**:
```json
{
  "data": true
}
```

**Usage di Frontend**:
```typescript
const canCreateTemuan = await supabase.rpc('check_permission', {
  p_user_id: auth.uid(),
  p_modul: 'temuan',
  p_action: 'create',
});

if (canCreateTemuan.data) {
  // Show create button
}
```

---

## 5. ERROR CODES REFERENCE

### PostgreSQL Error Codes

| Code | Meaning | Example Response |
|------|---------|------------------|
| 23505 | Unique violation | `{ "email": ["Email sudah digunakan"] }` |
| 23503 | Foreign key violation | `{ "role_id": ["Role tidak ditemukan"] }` |
| 23502 | Not null violation | `{ "nama": ["Nama wajib diisi"] }` |
| 23514 | Check constraint violation | `{ "status": ["Status harus 'aktif' atau 'nonaktif'"] }` |

### Custom Error Codes

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| AUTH_FAILED | Login gagal | 401 |
| USER_INACTIVE | User nonaktif | 403 |
| LAST_ADMIN | Cannot deactivate last admin | 400 |
| NOT_PIC_UNIT | Operation only for PIC Unit | 400 |
| CANNOT_EDIT_SELF | Cannot edit own user via admin page | 403 |

---

## 6. AUTHENTICATION & AUTHORIZATION

### Headers

Semua request (kecuali login) harus include auth token di header (otomatis handle oleh Supabase client):

```
Authorization: Bearer <access_token>
```

### RLS (Row Level Security)

Supabase RLS policies secara otomatis filter data berdasarkan user yang login:

- **Admin GPM**: Full access ke semua data
- **Auditor**: Read-only users, CRUD audit data
- **PIC Unit**: Read-only users, view temuan unit sendiri, CRUD RTL unit sendiri
- **Pimpinan**: Read-only dashboard & laporan

### Permission Check Flow

```typescript
// 1. Check di RLS (database level)
// Supabase automatically filters based on auth.uid()

// 2. Check di Permission table (application level)
const hasPermission = await supabase.rpc('check_permission', {
  p_user_id: auth.uid(),
  p_modul: 'temuan',
  p_action: 'create',
});

// 3. Check di Frontend (UI level)
if (!hasPermission.data) {
  return <NoAccess />;
}
```

---

## 7. RATE LIMITING

**Note**: Supabase has built-in rate limiting. Adjust di Supabase dashboard jika perlu.

Default limits:
- Auth endpoints: 60 requests/hour per IP
- Database queries: 500 requests/minute per user

---

## 8. TYPESCRIPT TYPES

```typescript
// types/user.types.ts
export interface User {
  id: string;
  nama: string;
  email: string;
  role_id: string;
  role_nama?: string;
  role_deskripsi?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface CreateUserDto {
  nama: string;
  email: string;
  password: string;
  role_id: string;
  unit_kerja_ids?: string[];
}

export interface UpdateUserDto {
  nama?: string;
  role_id?: string;
  status?: 'aktif' | 'nonaktif';
}

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
**Maintained by**: Tim Development SIM-AMI
