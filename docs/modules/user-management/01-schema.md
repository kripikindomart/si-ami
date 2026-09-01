# Schema Database - Modul User Management

## Overview
Modul User Management menggunakan **Supabase Auth** untuk authentication, ditambah custom tables untuk role, permission, dan assignment user ke unit.

---

## 1. Tabel: users

**Note**: Extends dari `auth.users` (built-in Supabase)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role_id UUID REFERENCES roles(id),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
```

### Field Description

| Field | Type | Description | Validation | Source |
|-------|------|-------------|------------|---------|
| id | UUID | PK, FK to auth.users | Required | Supabase Auth |
| nama | VARCHAR(255) | Nama lengkap user | Required, min 3 char | Custom |
| email | VARCHAR(255) | Email user (for login) | Required, unique, valid email | Supabase Auth + Custom |
| role_id | UUID | FK to roles | Required | Custom |
| status | VARCHAR(20) | Status user | aktif/nonaktif | Custom |
| created_at | TIMESTAMP | Tanggal dibuat | Auto | Custom |
| updated_at | TIMESTAMP | Tanggal diupdate | Auto | Custom |

**Note**: Password disimpan di `auth.users` (hashed by Supabase), tidak ada di table custom.

---

## 2. Tabel: roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) UNIQUE NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data roles
INSERT INTO roles (nama, deskripsi) VALUES
  ('admin_gpm', 'Administrator GPM - akses penuh sistem'),
  ('auditor', 'Auditor Internal - input hasil audit'),
  ('pic_unit', 'PIC Unit/Prodi - kelola tindak lanjut'),
  ('pimpinan', 'Pimpinan - view dashboard & laporan read-only');
```

### Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto-generated |
| nama | VARCHAR(50) | Nama role (admin_gpm, auditor, dll) | Required, unique, lowercase |
| deskripsi | TEXT | Deskripsi role | Optional |
| created_at | TIMESTAMP | Tanggal dibuat | Auto |

### Role Definition

| Role | Akses | Use Case |
|------|-------|----------|
| **admin_gpm** | Full CRUD semua modul | Admin GPM yang manage sistem |
| **auditor** | CRUD sesi audit, temuan, rekomendasi, nilai positif | Auditor yang input hasil audit |
| **pic_unit** | View temuan unit sendiri, CRUD RTL unit sendiri | PIC Unit yang update tindak lanjut |
| **pimpinan** | Read-only dashboard & laporan | Pimpinan yang monitor progress |

---

## 3. Tabel: permissions

Permission matrix per role per modul

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  modul VARCHAR(50) NOT NULL,
  can_create BOOLEAN DEFAULT FALSE,
  can_read BOOLEAN DEFAULT FALSE,
  can_update BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, modul)
);

CREATE INDEX idx_permissions_role ON permissions(role_id);
CREATE INDEX idx_permissions_modul ON permissions(modul);
```

### Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto-generated |
| role_id | UUID | FK to roles | Required |
| modul | VARCHAR(50) | Nama modul (users, temuan, rtl, dll) | Required |
| can_create | BOOLEAN | Permission create | Default false |
| can_read | BOOLEAN | Permission read | Default false |
| can_update | BOOLEAN | Permission update | Default false |
| can_delete | BOOLEAN | Permission delete | Default false |
| created_at | TIMESTAMP | Tanggal dibuat | Auto |

### Seed Permission Matrix

```sql
-- Admin GPM: Full access semua modul
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete)
SELECT 
  (SELECT id FROM roles WHERE nama = 'admin_gpm'),
  modul,
  true, true, true, true
FROM (VALUES 
  ('users'), ('roles'), ('permissions'), ('lam'), ('unit_kerja'), 
  ('periode_audit'), ('standar_mutu'), ('auditor'), ('kategori_temuan'),
  ('sesi_audit'), ('temuan'), ('nilai_positif'), ('rekomendasi'), ('tindak_lanjut'),
  ('dashboard'), ('laporan'), ('notifikasi'), ('activity_log')
) AS modules(modul);

-- Auditor: CRUD audit data
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
  ((SELECT id FROM roles WHERE nama='auditor'), 'sesi_audit', true, true, true, false),
  ((SELECT id FROM roles WHERE nama='auditor'), 'temuan', true, true, true, false),
  ((SELECT id FROM roles WHERE nama='auditor'), 'nilai_positif', true, true, true, false),
  ((SELECT id FROM roles WHERE nama='auditor'), 'rekomendasi', true, true, true, false),
  ((SELECT id FROM roles WHERE nama='auditor'), 'dashboard', false, true, false, false),
  ((SELECT id FROM roles WHERE nama='auditor'), 'laporan', false, true, false, false);

-- PIC Unit: View temuan, CRUD RTL
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
  ((SELECT id FROM roles WHERE nama='pic_unit'), 'temuan', false, true, false, false),
  ((SELECT id FROM roles WHERE nama='pic_unit'), 'rekomendasi', false, true, false, false),
  ((SELECT id FROM roles WHERE nama='pic_unit'), 'tindak_lanjut', true, true, true, false),
  ((SELECT id FROM roles WHERE nama='pic_unit'), 'dashboard', false, true, false, false),
  ((SELECT id FROM roles WHERE nama='pic_unit'), 'laporan', false, true, false, false);

-- Pimpinan: Read-only everything
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete)
SELECT 
  (SELECT id FROM roles WHERE nama = 'pimpinan'),
  modul,
  false, true, false, false
FROM (VALUES 
  ('dashboard'), ('laporan'), ('temuan'), ('rekomendasi'), 
  ('tindak_lanjut'), ('sesi_audit'), ('activity_log')
) AS modules(modul);
```

---

## 4. Tabel: user_unit

Pivot table untuk assign user ke multiple unit (untuk PIC Unit)

```sql
CREATE TABLE user_unit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unit_kerja_id UUID REFERENCES unit_kerja(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, unit_kerja_id)
);

CREATE INDEX idx_user_unit_user ON user_unit(user_id);
CREATE INDEX idx_user_unit_unit ON user_unit(unit_kerja_id);
```

### Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto-generated |
| user_id | UUID | FK to users | Required |
| unit_kerja_id | UUID | FK to unit_kerja | Required |
| created_at | TIMESTAMP | Tanggal assigned | Auto |

### Business Rules

1. **Multiple Units per User**: Satu PIC Unit bisa di-assign ke multiple prodi/unit
2. **Multiple Users per Unit**: Satu unit bisa punya multiple PIC
3. **Unique Pair**: Kombinasi user_id + unit_kerja_id harus unique
4. **Only for PIC Unit**: Assignment ini hanya untuk role=pic_unit
5. **Used by RLS**: Filter data berdasarkan unit assignment

---

## 5. Relationships

### ER Diagram (Text)

```
auth.users (Supabase)
    ║
    ║ 1:1 (id)
    ║
    ▼
users ────┐
    │     │
    │ M:1 │
    │     │
    ▼     │
roles     │
    │     │
    │ 1:M │
    │     │
    ▼     │
permissions
          │
          │ M:N
          │
          ▼
     user_unit ────M:1───> unit_kerja
```

### Relationship Details

1. `users.id` → `auth.users(id)` (1:1, CASCADE DELETE)
2. `users.role_id` → `roles(id)` (M:1)
3. `permissions.role_id` → `roles(id)` (1:M, CASCADE DELETE)
4. `user_unit.user_id` → `users(id)` (M:N pivot, CASCADE DELETE)
5. `user_unit.unit_kerja_id` → `unit_kerja(id)` (M:N pivot, CASCADE DELETE)

---

## 6. RLS (Row Level Security)

### Policy untuk users table

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_users_full ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );

-- All users: Read own profile
CREATE POLICY users_read_own ON users
  FOR SELECT
  USING (id = auth.uid());

-- All users: Update own profile (nama only)
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND 
    role_id = (SELECT role_id FROM users WHERE id = auth.uid()) -- Cannot change own role
  );
```

### Policy untuk permissions table

```sql
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_permissions_full ON permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );

-- All users: Read own role permissions
CREATE POLICY users_read_own_permissions ON permissions
  FOR SELECT
  USING (
    role_id = (SELECT role_id FROM users WHERE id = auth.uid())
  );
```

### Policy untuk user_unit table

```sql
ALTER TABLE user_unit ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_user_unit_full ON user_unit
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );

-- PIC Unit: Read own unit assignment
CREATE POLICY pic_read_own_units ON user_unit
  FOR SELECT
  USING (user_id = auth.uid());
```

---

## 7. Functions & Triggers

### Function: Check Permission

```sql
CREATE OR REPLACE FUNCTION check_permission(
  p_user_id UUID,
  p_modul VARCHAR(50),
  p_action VARCHAR(10) -- 'create', 'read', 'update', 'delete'
)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN;
BEGIN
  SELECT 
    CASE p_action
      WHEN 'create' THEN p.can_create
      WHEN 'read' THEN p.can_read
      WHEN 'update' THEN p.can_update
      WHEN 'delete' THEN p.can_delete
      ELSE FALSE
    END INTO has_permission
  FROM users u
  JOIN permissions p ON u.role_id = p.role_id
  WHERE u.id = p_user_id AND p.modul = p_modul;
  
  RETURN COALESCE(has_permission, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage example:
-- SELECT check_permission(auth.uid(), 'temuan', 'create');
```

### Trigger: Auto-update updated_at

```sql
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Sync email from auth.users

```sql
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_auth_user_email
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();
```

---

## 8. Views

### View: users_with_role

```sql
CREATE VIEW v_users_with_role AS
SELECT 
  u.id,
  u.nama,
  u.email,
  u.status,
  r.nama as role_nama,
  r.deskripsi as role_deskripsi,
  u.created_at,
  u.updated_at
FROM users u
JOIN roles r ON u.role_id = r.id;
```

### View: user_units_detail

```sql
CREATE VIEW v_user_units_detail AS
SELECT 
  uu.id,
  uu.user_id,
  u.nama as user_nama,
  u.email as user_email,
  uu.unit_kerja_id,
  uk.kode as unit_kode,
  uk.nama as unit_nama,
  uk.jenis as unit_jenis,
  uu.created_at
FROM user_unit uu
JOIN users u ON uu.user_id = u.id
JOIN unit_kerja uk ON uu.unit_kerja_id = uk.id;
```

---

## 9. Constraints & Business Rules

### Constraints

1. **Email Unique**: Tidak boleh ada 2 user dengan email sama
2. **Role Required**: User wajib punya role
3. **Status Check**: Hanya 'aktif' atau 'nonaktif'
4. **Cascade Delete**: Jika user dihapus dari auth.users, otomatis terhapus dari users table
5. **Unique User-Unit**: Satu user tidak bisa di-assign 2x ke unit yang sama

### Business Rules

1. **Cannot Delete Self**: User tidak bisa delete account sendiri
2. **Cannot Change Own Role**: User tidak bisa ubah role sendiri
3. **Admin GPM Required**: Minimal harus ada 1 admin_gpm aktif di sistem
4. **PIC Unit Assignment**: Hanya user dengan role=pic_unit yang perlu unit assignment
5. **Password Policy** (enforced by Supabase):
   - Min 6 karakter
   - (Bisa ditambah policy lebih strict di Supabase dashboard)

---

## 10. Migration Strategy

### Phase 1: Create Tables
```sql
-- 1. roles (no dependencies)
-- 2. users (depends on auth.users & roles)
-- 3. permissions (depends on roles)
-- 4. user_unit (depends on users & unit_kerja)
```

### Phase 2: Seed Data
```sql
-- 1. Seed roles (4 roles)
-- 2. Seed permissions (matrix per role)
-- 3. Create first admin_gpm user (manual via Supabase Auth)
```

### Phase 3: Enable RLS
```sql
-- 1. Enable RLS on all tables
-- 2. Create policies
-- 3. Test access per role
```

---

## 11. Integration dengan Supabase Auth

### Sign Up Flow

```typescript
// 1. Sign up via Supabase Auth
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// 2. Insert to custom users table (via trigger or manual)
const { error: userError } = await supabase
  .from('users')
  .insert({
    id: authData.user.id, // Same as auth.users.id
    nama: 'Nama User',
    email: 'user@example.com',
    role_id: selectedRoleId,
    status: 'aktif',
  });
```

### Sign In Flow

```typescript
// 1. Sign in via Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// 2. Get user data with role
const { data: userData } = await supabase
  .from('v_users_with_role')
  .select('*')
  .eq('id', data.user.id)
  .single();

// 3. Check if user is active
if (userData.status !== 'aktif') {
  // Reject login
}

// 4. Store user data in state/context
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
