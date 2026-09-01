# Workflow - Modul User Management

## Overview
Workflow untuk mengelola user, role, permission, dan assignment user ke unit kerja. Modul ini adalah CORE dari sistem karena mengatur authentication dan authorization.

---

## 1. WORKFLOW AUTHENTICATION

### 1.1 Login User

```
[Landing Page]
    ↓
Klik "Login"
    ↓
┌─────────────────────────────────┐
│ LOGIN SIM-AMI                   │
├─────────────────────────────────┤
│ Email: [___________________]    │
│                                 │
│ Password: [_______________]     │
│           [👁 Show/Hide]        │
│                                 │
│ [Lupa Password?]                │
│                                 │
│ [Login]                         │
└─────────────────────────────────┘
    ↓
User submit form
    ↓
Validasi Client:
├─ Email not empty, valid format
└─ Password not empty, min 6 char
    ↓
Call Supabase Auth API:
supabase.auth.signInWithPassword({email, password})
    ↓
Supabase Auth Response:
    │
    ├─ Success (200):
    │   ├─ Get auth token
    │   ├─ Get user.id
    │   └─ Fetch user data:
    │       SELECT * FROM v_users_with_role WHERE id = user.id
    │       ↓
    │       Check user.status:
    │       │
    │       ├─ status = 'aktif':
    │       │   ├─ Store user data in context/state
    │       │   ├─ Store auth token
    │       │   ├─ Fetch permissions untuk role user
    │       │   ├─ Store permissions in context
    │       │   └─ Redirect ke /dashboard
    │       │
    │       └─ status = 'nonaktif':
    │           ├─ Sign out immediately
    │           ├─ Show error: "Akun Anda telah dinonaktifkan"
    │           └─ Stay di login page
    │
    └─ Error (400/401):
        ├─ Invalid credentials:
        │   └─ Show error: "Email atau password salah"
        │
        ├─ Email not confirmed:
        │   └─ Show error: "Email belum diverifikasi"
        │
        └─ Other error:
            └─ Show error: "Gagal login. Coba lagi."
```

**Business Rules**:
- User dengan status='nonaktif' tidak bisa login
- Login gagal 5x berturut-turut → temporary lock (handled by Supabase)
- Session expire setelah 1 jam inactive
- Remember Me: Session 7 hari (optional checkbox)

---

### 1.2 Forgot Password

```
[Login Page]
    ↓
Klik "Lupa Password?"
    ↓
┌─────────────────────────────────┐
│ RESET PASSWORD                  │
├─────────────────────────────────┤
│ Masukkan email Anda:            │
│                                 │
│ Email: [___________________]    │
│                                 │
│ [Batal]  [Kirim Reset Link]     │
└─────────────────────────────────┘
    ↓
User submit email
    ↓
Call Supabase Auth API:
supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://sim-ami.example.com/reset-password'
})
    ↓
Supabase sends email with magic link
    ↓
Show success message:
"Link reset password telah dikirim ke email Anda.
Silakan cek inbox atau spam folder."
    ↓
[User cek email]
    ↓
[User klik link di email]
    ↓
Redirect ke /reset-password?token=xxx
    ↓
┌─────────────────────────────────┐
│ PASSWORD BARU                   │
├─────────────────────────────────┤
│ Password Baru:                  │
│ [_________________________]     │
│                                 │
│ Konfirmasi Password:            │
│ [_________________________]     │
│                                 │
│ [Update Password]               │
└─────────────────────────────────┘
    ↓
User submit new password
    ↓
Validasi:
├─ Min 6 karakter
├─ Password match with confirm
└─ Not same as old password (optional)
    ↓
Call Supabase Auth API:
supabase.auth.updateUser({password: newPassword})
    ↓
Success:
    ├─ Show toast: "Password berhasil diubah"
    ├─ Auto sign in
    └─ Redirect ke /dashboard
```

---

### 1.3 Logout

```
[User di Dashboard]
    ↓
Klik user menu → Logout
    ↓
Dialog Konfirmasi:
┌─────────────────────────────────┐
│ Logout dari sistem?             │
│                                 │
│ [Batal]  [Ya, Logout]           │
└─────────────────────────────────┘
    ↓
Call Supabase Auth API:
supabase.auth.signOut()
    ↓
Clear local state:
├─ Remove user data from context
├─ Remove permissions from context
├─ Clear auth token
└─ Clear any cached data
    ↓
Redirect ke /login
    ↓
Show toast: "Anda telah logout"
```

---

## 2. WORKFLOW CRUD USER

### 2.1 Create User Baru

```
[Admin GPM Login]
    ↓
Menu User Management → Users
    ↓
Klik "Tambah User"
    ↓
┌─────────────────────────────────┐
│ FORM TAMBAH USER                │
├─────────────────────────────────┤
│ Nama Lengkap: [______________]  │
│                                 │
│ Email: [____________________]   │
│                                 │
│ Password: [_________________]   │
│ (Min 6 karakter)                │
│                                 │
│ Role: [Pilih Role ▼]            │
│   ○ Admin GPM                   │
│   ○ Auditor                     │
│   ○ PIC Unit                    │
│   ○ Pimpinan                    │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Jika Role = PIC Unit:     │   │
│ │                           │   │
│ │ Unit Kerja: [Multi-select]│   │
│ │ ☑ DPAI                    │   │
│ │ ☐ MPAI                    │   │
│ │ ☑ MM                      │   │
│ │ ☐ MH                      │   │
│ └───────────────────────────┘   │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
User submit form
    ↓
Validasi Client:
├─ Nama: required, min 3 char
├─ Email: required, valid format, unique
├─ Password: required, min 6 char
├─ Role: required
└─ If role=pic_unit: min 1 unit selected
    ↓
Step 1: Create Auth User
supabase.auth.admin.createUser({
  email: email,
  password: password,
  email_confirm: true
})
    ↓
Success → Get auth_user.id
    ↓
Step 2: Insert to users table
INSERT INTO users (id, nama, email, role_id, status)
VALUES (auth_user.id, nama, email, role_id, 'aktif')
    ↓
Success → Get user.id
    ↓
Step 3: If role=pic_unit, insert to user_unit
INSERT INTO user_unit (user_id, unit_kerja_id)
VALUES (user.id, unit1), (user.id, unit2), ...
    ↓
Success:
    ├─ Log activity: "User [nama] dibuat"
    ├─ Send email welcome (optional)
    ├─ Show toast: "User berhasil ditambahkan"
    └─ Redirect ke list users
    ↓
[Selesai]

Error Handling:
├─ Email duplicate:
│   └─ "Email sudah digunakan"
│
├─ Auth creation failed:
│   └─ "Gagal membuat akun. Coba lagi."
│
└─ Database error:
    └─ Rollback: Delete auth user jika sudah dibuat
```

**Business Rules**:
- Email harus unique di seluruh sistem
- Password auto-generated boleh (optional feature)
- Default status = 'aktif'
- PIC Unit WAJIB di-assign ke minimal 1 unit
- Admin GPM, Auditor, Pimpinan TIDAK perlu unit assignment

---

### 2.2 View List Users

```
[Admin GPM di Dashboard]
    ↓
Menu User Management → Users
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ MANAJEMEN USER                                   [+ Tambah User] │
├──────────────────────────────────────────────────────────────────┤
│ Filter:                                                          │
│ [Role: Semua ▼] [Status: Semua ▼] [Search: _______] [🔍 Cari]   │
├──────────────────────────────────────────────────────────────────┤
│ Nama          │ Email            │ Role     │ Status │ Aksi     │
├───────────────┼──────────────────┼──────────┼────────┼──────────┤
│ Ahmad Zaki    │ zaki@uika.ac.id  │ Admin GPM│ Aktif  │ [⋮]     │
├───────────────┼──────────────────┼──────────┼────────┼──────────┤
│ Siti Aminah   │ siti@uika.ac.id  │ Auditor  │ Aktif  │ [⋮]     │
├───────────────┼──────────────────┼──────────┼────────┼──────────┤
│ Budi Santoso  │ budi@uika.ac.id  │ PIC Unit │ Aktif  │ [⋮]     │
│               │                  │ (DPAI,MM)│        │         │
├───────────────┼──────────────────┼──────────┼────────┼──────────┤
│ Dr. Hadi      │ hadi@uika.ac.id  │ Pimpinan │ Aktif  │ [⋮]     │
└──────────────────────────────────────────────────────────────────┘
│ Showing 4 of 12 entries                [◄] [1] [2] [►]          │
└──────────────────────────────────────────────────────────────────┘
```

**Features**:
- Filter by role (dropdown)
- Filter by status (aktif/nonaktif)
- Search by nama atau email (real-time)
- Sortable columns (klik header)
- Pagination (10/25/50 per page)
- Action menu (Edit, Toggle Status, View Units, Reset Password)

**Permission**:
- Admin GPM: Full access
- Others: No access (menu hidden)

---

### 2.3 Edit User

```
[Admin GPM di List Users]
    ↓
Klik Action → Edit
    ↓
┌─────────────────────────────────┐
│ EDIT USER: Ahmad Zaki           │
├─────────────────────────────────┤
│ Nama Lengkap: [Ahmad Zaki___]   │
│                                 │
│ Email: [zaki@uika.ac.id]        │
│ (Read-only, tidak bisa diubah)  │
│                                 │
│ Role: [Admin GPM ▼]             │
│                                 │
│ Status: [Aktif ▼]               │
│   ○ Aktif                       │
│   ○ Nonaktif                    │
│                                 │
│ ┌───────────────────────────┐   │
│ │ Unit Kerja (jika PIC):    │   │
│ │ [Disabled karena bukan PIC]│  │
│ └───────────────────────────┘   │
│                                 │
│ [Batal]  [Update]               │
└─────────────────────────────────┘
    ↓
User update fields
    ↓
Klik "Update"
    ↓
Validasi:
├─ Nama: required, min 3 char
├─ Role: required
└─ If role changed to pic_unit:
    └─ Redirect ke unit assignment page
    ↓
UPDATE users SET
  nama = new_nama,
  role_id = new_role_id,
  status = new_status,
  updated_at = NOW()
WHERE id = user_id
    ↓
If role changed FROM pic_unit TO other:
    └─ DELETE FROM user_unit WHERE user_id = user_id
    ↓
Success:
    ├─ Log activity: "User [nama] diupdate"
    ├─ Show toast: "User berhasil diupdate"
    └─ Redirect ke list users
```

**Business Rules**:
- Email TIDAK BISA diubah (immutable)
- User tidak bisa edit diri sendiri (harus via Profile page)
- Admin GPM tidak bisa nonaktifkan diri sendiri
- Minimal harus ada 1 admin_gpm aktif di sistem

---

### 2.4 Toggle Status User

```
[Admin GPM di List Users]
    ↓
Klik Action → Nonaktifkan
    ↓
Dialog Konfirmasi:
┌──────────────────────────────────────┐
│ Nonaktifkan User?                    │
├──────────────────────────────────────┤
│ User: Ahmad Zaki                     │
│ Email: zaki@uika.ac.id               │
│                                      │
│ User yang dinonaktifkan tidak bisa   │
│ login ke sistem. Data user tetap     │
│ tersimpan untuk keperluan audit.     │
│                                      │
│ Yakin nonaktifkan user ini?          │
│                                      │
│     [Batal]  [Ya, Nonaktifkan]       │
└──────────────────────────────────────┘
    ↓
Klik "Ya, Nonaktifkan"
    ↓
Check: Is this user the last active admin_gpm?
    │
    ├─ YES:
    │   └─ Show error:
    │       "Tidak bisa nonaktifkan admin terakhir.
    │        Minimal harus ada 1 admin aktif."
    │   └─ Abort
    │
    └─ NO:
        └─ Proceed
            ↓
UPDATE users SET status='nonaktif', updated_at=NOW()
WHERE id = user_id
    ↓
If user currently logged in:
    └─ Force sign out user
        (via trigger or background job)
    ↓
Success:
    ├─ Log activity: "User [nama] dinonaktifkan"
    ├─ Show toast: "User berhasil dinonaktifkan"
    └─ Refresh list
```

---

### 2.5 Assign Unit Kerja (PIC Unit)

```
[Admin GPM di List Users]
    ↓
Klik Action → Kelola Unit
    ↓
┌─────────────────────────────────┐
│ ASSIGN UNIT KERJA               │
│ User: Budi Santoso (PIC Unit)   │
├─────────────────────────────────┤
│ Unit yang di-assign:            │
│                                 │
│ ☑ DPAI                          │
│   Program Studi Doktor PAI      │
│                                 │
│ ☐ MPAI                          │
│   Program Studi Magister PAI    │
│                                 │
│ ☑ MM                            │
│   Program Studi Magister Manaj. │
│                                 │
│ ☐ MH                            │
│   Program Studi Magister Hukum  │
│                                 │
│ ☐ LAB-SPS                       │
│   Laboratorium SPS              │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
User toggle checkboxes
    ↓
Klik "Simpan"
    ↓
Step 1: Delete existing assignments
DELETE FROM user_unit WHERE user_id = user_id
    ↓
Step 2: Insert new assignments
INSERT INTO user_unit (user_id, unit_kerja_id)
VALUES 
  (user_id, unit1_id),
  (user_id, unit2_id),
  ...
    ↓
Success:
    ├─ Log activity: "Unit user [nama] diupdate"
    ├─ Show toast: "Unit kerja berhasil diupdate"
    └─ Close dialog
```

**Business Rules**:
- Hanya untuk role=pic_unit
- Min 1 unit harus dipilih
- User bisa di-assign ke multiple units
- Assignment bisa diubah kapan saja

---

## 3. WORKFLOW ROLE & PERMISSION MANAGEMENT

### 3.1 View Permission Matrix

```
[Admin GPM]
    ↓
Menu User Management → Roles & Permissions
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ PERMISSION MATRIX                                                │
├──────────────────────────────────────────────────────────────────┤
│ Role: [Admin GPM ▼]  (Pilih role untuk lihat permission)        │
├──────────────────────────────────────────────────────────────────┤
│ Modul             │ Create │ Read │ Update │ Delete │ [Edit]    │
├───────────────────┼────────┼──────┼────────┼────────┼───────────┤
│ Users             │   ✓    │  ✓   │   ✓    │   ✓    │ [Edit]   │
│ Roles & Permission│   ✓    │  ✓   │   ✓    │   ✓    │ [Edit]   │
│ LAM               │   ✓    │  ✓   │   ✓    │   -    │ [Edit]   │
│ Unit Kerja        │   ✓    │  ✓   │   ✓    │   -    │ [Edit]   │
│ Periode Audit     │   ✓    │  ✓   │   ✓    │   -    │ [Edit]   │
│ Standar Mutu      │   ✓    │  ✓   │   ✓    │   -    │ [Edit]   │
│ ...               │   ...  │ ...  │   ...  │   ...  │ [Edit]   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Edit Permission Matrix

```
[Admin GPM]
    ↓
Klik "Edit" pada row modul
    ↓
┌─────────────────────────────────┐
│ EDIT PERMISSION                 │
│ Role: Admin GPM                 │
│ Modul: Temuan                   │
├─────────────────────────────────┤
│ ☑ Create (Tambah Temuan)        │
│ ☑ Read (Lihat Temuan)           │
│ ☑ Update (Edit Temuan)          │
│ ☐ Delete (Hapus Temuan)         │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
Toggle checkboxes
    ↓
Klik "Simpan"
    ↓
UPDATE permissions SET
  can_create = [bool],
  can_read = [bool],
  can_update = [bool],
  can_delete = [bool]
WHERE role_id = [id] AND modul = [modul]
    ↓
Success:
    ├─ Log activity: "Permission [role]-[modul] diupdate"
    ├─ Show toast: "Permission berhasil diupdate"
    └─ Refresh matrix
```

---

## 4. WORKFLOW USER PROFILE

### 4.1 View Own Profile

```
[Any User Login]
    ↓
Klik user avatar → Profile
    ↓
┌─────────────────────────────────┐
│ PROFIL SAYA                     │
├─────────────────────────────────┤
│ Nama: Ahmad Zaki                │
│                                 │
│ Email: zaki@uika.ac.id          │
│ (Tidak bisa diubah)             │
│                                 │
│ Role: Admin GPM                 │
│ (Tidak bisa diubah)             │
│                                 │
│ Status: Aktif                   │
│                                 │
│ [Edit Profil]  [Ubah Password]  │
└─────────────────────────────────┘
```

### 4.2 Edit Own Profile

```
[User di Profile Page]
    ↓
Klik "Edit Profil"
    ↓
┌─────────────────────────────────┐
│ EDIT PROFIL                     │
├─────────────────────────────────┤
│ Nama Lengkap: [Ahmad Zaki___]   │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
UPDATE users SET nama=[new], updated_at=NOW()
WHERE id = auth.uid()
    ↓
Success:
    ├─ Update context/state
    └─ Show toast: "Profil berhasil diupdate"
```

### 4.3 Change Own Password

```
[User di Profile Page]
    ↓
Klik "Ubah Password"
    ↓
┌─────────────────────────────────┐
│ UBAH PASSWORD                   │
├─────────────────────────────────┤
│ Password Lama:                  │
│ [_________________________]     │
│                                 │
│ Password Baru:                  │
│ [_________________________]     │
│ (Min 6 karakter)                │
│                                 │
│ Konfirmasi Password Baru:       │
│ [_________________________]     │
│                                 │
│ [Batal]  [Update Password]      │
└─────────────────────────────────┘
    ↓
Validasi:
├─ Password lama correct (re-auth)
├─ Password baru min 6 char
└─ Password baru match confirm
    ↓
Call Supabase:
supabase.auth.updateUser({password: newPassword})
    ↓
Success:
    ├─ Log activity: "Password diubah"
    ├─ Show toast: "Password berhasil diubah"
    └─ Close dialog
```

---

## 5. INTEGRATION POINTS

### 5.1 User Context Provider

```typescript
// Global context untuk user yang login
interface UserContext {
  user: {
    id: string;
    nama: string;
    email: string;
    role: string;
    status: string;
  };
  permissions: {
    [modul: string]: {
      can_create: boolean;
      can_read: boolean;
      can_update: boolean;
      can_delete: boolean;
    };
  };
  units: UnitKerja[]; // Untuk PIC Unit
}

// Fetch saat login
const { data: userData } = await supabase
  .from('v_users_with_role')
  .select('*')
  .eq('id', authUser.id)
  .single();

const { data: permissions } = await supabase
  .from('permissions')
  .select('*')
  .eq('role_id', userData.role_id);

if (userData.role_nama === 'pic_unit') {
  const { data: units } = await supabase
    .from('v_user_units_detail')
    .select('*')
    .eq('user_id', userData.id);
}
```

### 5.2 Permission Check Helper

```typescript
function canAccess(modul: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
  const perm = permissions[modul];
  if (!perm) return false;
  
  switch(action) {
    case 'create': return perm.can_create;
    case 'read': return perm.can_read;
    case 'update': return perm.can_update;
    case 'delete': return perm.can_delete;
  }
}

// Usage:
if (!canAccess('temuan', 'create')) {
  return <NoAccess />;
}
```

### 5.3 Protected Route Wrapper

```typescript
function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission 
}: Props) {
  const { user, permissions } = useUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.status !== 'aktif') {
    return <AccountDeactivated />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <NoAccess />;
  }
  
  if (requiredPermission) {
    const [modul, action] = requiredPermission.split(':');
    if (!canAccess(modul, action)) {
      return <NoAccess />;
    }
  }
  
  return children;
}
```

---

## 6. STATE DIAGRAM

```
┌────────────────┐
│ USER NOT EXIST │
└───────┬────────┘
        │ Admin GPM Create
        ↓
┌────────────────┐
│  USER AKTIF    │ ← Can login
└───────┬────────┘
        │
        ├───→ Edit nama/role ───→ Tetap AKTIF
        │
        ├───→ Toggle Status ───→ ┌──────────────────┐
        │                        │  USER NONAKTIF   │ ← Cannot login
        │                        └────────┬─────────┘
        │                                 │
        │                                 │ Toggle Status kembali
        └←────────────────────────────────┘
```

---

## 7. AUDIT TRAIL

Semua operasi user di-log:

```sql
-- User created
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'create', 'users', [new_user_id], 
  jsonb_build_object('new', to_jsonb(NEW)));

-- User updated
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'update', 'users', [user_id],
  jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));

-- Permission updated
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'update', 'permissions', [perm_id],
  jsonb_build_object('role', [role_name], 'modul', [modul_name], 'changes', [changes]));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
