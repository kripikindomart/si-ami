# Schema Database - Modul Unit Kerja

## Overview
Schema database untuk master data unit kerja yang mencakup program studi, laboratorium, dan unit struktural lainnya.

---

## 1. Tabel: unit_kerja

```sql
CREATE TABLE unit_kerja (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('prodi', 'lab', 'direktur', 'wakil', 'unit_lain')),
  lam_id UUID REFERENCES lam(id),
  parent_id UUID REFERENCES unit_kerja(id),
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT prodi_must_have_lam CHECK (
    (jenis = 'prodi' AND lam_id IS NOT NULL) OR
    (jenis != 'prodi')
  )
);

CREATE INDEX idx_unit_kerja_kode ON unit_kerja(kode);
CREATE INDEX idx_unit_kerja_jenis ON unit_kerja(jenis);
CREATE INDEX idx_unit_kerja_lam ON unit_kerja(lam_id);
CREATE INDEX idx_unit_kerja_parent ON unit_kerja(parent_id);
CREATE INDEX idx_unit_kerja_status ON unit_kerja(status);
```

### Field Description

| Field | Type | Description | Validation | Example |
|-------|------|-------------|------------|---------|
| id | UUID | Primary key | Auto-generated | uuid-123 |
| kode | VARCHAR(50) | Kode unit unique | Required, unique, uppercase | DPAI, MM, LAB-SPS |
| nama | VARCHAR(255) | Nama lengkap unit | Required | Program Studi Doktor PAI |
| jenis | VARCHAR(20) | Jenis unit | prodi/lab/direktur/wakil/unit_lain | prodi |
| lam_id | UUID | FK to lam | Required jika jenis=prodi | uuid-lam-lamdik |
| parent_id | UUID | FK to unit_kerja (self) | Optional, untuk hirarki | uuid-parent |
| deskripsi | TEXT | Deskripsi unit | Optional | Prodi S3 Pendidikan Agama Islam |
| status | VARCHAR(20) | Status unit | aktif/nonaktif | aktif |
| created_at | TIMESTAMP | Tanggal dibuat | Auto | 2026-09-01T10:00:00Z |
| updated_at | TIMESTAMP | Tanggal diupdate | Auto | 2026-09-01T10:00:00Z |

### Jenis Unit

| Jenis | Deskripsi | Butuh LAM? | Contoh |
|-------|-----------|------------|--------|
| prodi | Program Studi | YA (wajib) | DPAI, MM, MS |
| lab | Laboratorium | TIDAK | LAB-SPS |
| direktur | Direktur | TIDAK | Direktur SPs |
| wakil | Wakil Direktur | TIDAK | Wakil Direktur |
| unit_lain | Unit lainnya | TIDAK | Perpustakaan, IT |

---

## 2. Relationships

### ER Diagram (Text)

```
lam ──────┐
          │ 1:M (hanya untuk prodi)
          ▼
unit_kerja ◄────┐ 1:M (parent-child, optional)
    │           │
    └───────────┘
    │
    │ 1:M
    ▼
user_unit ───M:1──► users (PIC Unit)
    │
    │ 1:M
    ▼
sesi_audit (unit yang diaudit)
```

### Relationship Details

1. `unit_kerja.lam_id` → `lam(id)` (M:1, optional, wajib untuk prodi)
2. `unit_kerja.parent_id` → `unit_kerja(id)` (self-reference, optional)
3. `user_unit.unit_kerja_id` → `unit_kerja(id)` (1:M)
4. `sesi_audit.unit_kerja_id` → `unit_kerja(id)` (M:1)

---

## 3. Constraints & Business Rules

### Database Constraints

```sql
-- 1. Kode unique
ALTER TABLE unit_kerja ADD CONSTRAINT unique_kode UNIQUE (kode);

-- 2. Prodi wajib punya LAM
ALTER TABLE unit_kerja ADD CONSTRAINT prodi_must_have_lam CHECK (
  (jenis = 'prodi' AND lam_id IS NOT NULL) OR
  (jenis != 'prodi')
);

-- 3. Kode uppercase only (optional, bisa enforce di app level)
ALTER TABLE unit_kerja ADD CONSTRAINT kode_uppercase CHECK (kode = UPPER(kode));
```

### Application-Level Rules

1. **Kode Format**: Uppercase, no spaces, dash allowed (DPAI, LAB-SPS)
2. **LAM Assignment**: 
   - Jenis=prodi → LAM wajib
   - Jenis lain → LAM harus NULL
3. **Parent-Child**: 
   - Maksimal 2 level (tidak boleh nested terlalu dalam)
   - Tidak boleh circular reference
4. **Deactivate**:
   - Unit bisa dinonaktifkan
   - Unit nonaktif tidak bisa dipilih untuk audit baru
   - Audit lama tetap bisa lihat unit yang sudah nonaktif

---

## 4. Views

### 4.1 View: v_unit_kerja_detail

```sql
CREATE VIEW v_unit_kerja_detail AS
SELECT 
  uk.id,
  uk.kode,
  uk.nama,
  uk.jenis,
  uk.deskripsi,
  uk.status,
  uk.lam_id,
  l.kode as lam_kode,
  l.nama as lam_nama,
  uk.parent_id,
  p.kode as parent_kode,
  p.nama as parent_nama,
  uk.created_at,
  uk.updated_at
FROM unit_kerja uk
LEFT JOIN lam l ON uk.lam_id = l.id
LEFT JOIN unit_kerja p ON uk.parent_id = p.id;
```

**Usage**: List unit kerja dengan info LAM dan parent unit

---

### 4.2 View: v_unit_kerja_with_pic

```sql
CREATE VIEW v_unit_kerja_with_pic AS
SELECT 
  uk.id as unit_id,
  uk.kode as unit_kode,
  uk.nama as unit_nama,
  uk.jenis,
  uk.status,
  COUNT(uu.user_id) as pic_count,
  STRING_AGG(u.nama, ', ') as pic_names
FROM unit_kerja uk
LEFT JOIN user_unit uu ON uk.id = uu.unit_kerja_id
LEFT JOIN users u ON uu.user_id = u.id
GROUP BY uk.id, uk.kode, uk.nama, uk.jenis, uk.status;
```

**Usage**: List unit dengan info jumlah PIC dan nama PIC

---

## 5. RLS (Row Level Security)

### Policy: Admin GPM Full Access

```sql
ALTER TABLE unit_kerja ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_unit_kerja_full ON unit_kerja
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );
```

### Policy: All Users Read Unit

```sql
CREATE POLICY users_unit_kerja_read ON unit_kerja
  FOR SELECT
  USING (true); -- All authenticated users can read
```

### Policy: PIC Unit Update Own Unit (Optional)

```sql
CREATE POLICY pic_unit_kerja_update_own ON unit_kerja
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_unit uu
      WHERE uu.unit_kerja_id = unit_kerja.id
        AND uu.user_id = auth.uid()
    )
  )
  WITH CHECK (
    -- PIC hanya bisa update deskripsi, tidak bisa ubah kode/nama/lam
    kode = (SELECT kode FROM unit_kerja WHERE id = unit_kerja.id) AND
    nama = (SELECT nama FROM unit_kerja WHERE id = unit_kerja.id) AND
    lam_id = (SELECT lam_id FROM unit_kerja WHERE id = unit_kerja.id)
  );
```

---

## 6. Functions & Triggers

### Trigger: Auto-update updated_at

```sql
CREATE TRIGGER update_unit_kerja_updated_at 
  BEFORE UPDATE ON unit_kerja
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Function: Get Unit Hierarchy

```sql
CREATE OR REPLACE FUNCTION get_unit_hierarchy(p_unit_id UUID)
RETURNS TABLE (
  level INT,
  unit_id UUID,
  unit_kode VARCHAR,
  unit_nama VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE hierarchy AS (
    -- Base case: unit yang diminta
    SELECT 
      1 as level,
      uk.id,
      uk.kode,
      uk.nama,
      uk.parent_id
    FROM unit_kerja uk
    WHERE uk.id = p_unit_id
    
    UNION ALL
    
    -- Recursive case: parent unit
    SELECT 
      h.level + 1,
      uk.id,
      uk.kode,
      uk.nama,
      uk.parent_id
    FROM unit_kerja uk
    JOIN hierarchy h ON uk.id = h.parent_id
    WHERE h.level < 5 -- Limit depth untuk prevent infinite loop
  )
  SELECT level, id, kode, nama FROM hierarchy ORDER BY level DESC;
END;
$$ LANGUAGE plpgsql;
```

**Usage**: Ambil hirarki unit (dari unit sampai root parent)

---

## 7. Seed Data

### Prodi di SPs UIKA (berdasarkan AMI 2025)

```sql
-- Insert LAM dulu (assume already exists from LAM module)

-- Insert Prodi
INSERT INTO unit_kerja (kode, nama, jenis, lam_id, deskripsi) VALUES
  (
    'DPAI',
    'Program Studi Doktor Pendidikan Agama Islam',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIK'),
    'Program Studi S3 Pendidikan Agama Islam'
  ),
  (
    'MPAI',
    'Program Studi Magister Pendidikan Agama Islam',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIK'),
    'Program Studi S2 Pendidikan Agama Islam'
  ),
  (
    'MTP',
    'Program Studi Magister Tafsir Hadis',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIK'),
    'Program Studi S2 Tafsir Hadis'
  ),
  (
    'MM',
    'Program Studi Magister Manajemen',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIKTI'),
    'Program Studi S2 Manajemen'
  ),
  (
    'MS',
    'Program Studi Magister Syariah',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIK'),
    'Program Studi S2 Hukum Islam'
  ),
  (
    'MH',
    'Program Studi Magister Hukum',
    'prodi',
    (SELECT id FROM lam WHERE kode = 'LAMDIKTI'),
    'Program Studi S2 Hukum'
  );

-- Insert Unit Struktural
INSERT INTO unit_kerja (kode, nama, jenis, deskripsi) VALUES
  ('DIREKTUR-SPS', 'Direktur Sekolah Pascasarjana', 'direktur', 'Direktur SPs UIKA'),
  ('WAKIL-DIREKTUR', 'Wakil Direktur SPs', 'wakil', 'Wakil Direktur SPs UIKA');

-- Insert Unit Penunjang
INSERT INTO unit_kerja (kode, nama, jenis, deskripsi) VALUES
  ('LAB-SPS', 'Laboratorium SPs', 'lab', 'Laboratorium Sekolah Pascasarjana'),
  ('PERPUS-SPS', 'Perpustakaan SPs', 'unit_lain', 'Perpustakaan Sekolah Pascasarjana');
```

---

## 8. Migration Strategy

### Phase 1: Create Table
```sql
CREATE TABLE unit_kerja (...);
CREATE INDEX ...;
```

### Phase 2: Add Constraints
```sql
ALTER TABLE unit_kerja ADD CONSTRAINT ...;
```

### Phase 3: Create Views
```sql
CREATE VIEW v_unit_kerja_detail ...;
CREATE VIEW v_unit_kerja_with_pic ...;
```

### Phase 4: Create Functions & Triggers
```sql
CREATE FUNCTION get_unit_hierarchy ...;
CREATE TRIGGER update_unit_kerja_updated_at ...;
```

### Phase 5: Enable RLS
```sql
ALTER TABLE unit_kerja ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;
```

### Phase 6: Seed Data
```sql
INSERT INTO unit_kerja ...;
```

---

## 9. Query Examples

### Get All Prodi with LAM

```sql
SELECT 
  uk.kode,
  uk.nama,
  l.kode as lam_kode,
  l.nama as lam_nama
FROM unit_kerja uk
JOIN lam l ON uk.lam_id = l.id
WHERE uk.jenis = 'prodi' AND uk.status = 'aktif'
ORDER BY uk.kode;
```

### Get Units by Jenis

```sql
SELECT * FROM unit_kerja
WHERE jenis = 'lab' AND status = 'aktif'
ORDER BY kode;
```

### Get Unit with PIC Count

```sql
SELECT 
  uk.*,
  COUNT(uu.user_id) as pic_count
FROM unit_kerja uk
LEFT JOIN user_unit uu ON uk.id = uu.unit_kerja_id
GROUP BY uk.id
HAVING COUNT(uu.user_id) > 0;
```

---

## 10. Integration dengan Modul Lain

### Dengan LAM Module

```sql
-- Get prodi by LAM
SELECT uk.* 
FROM unit_kerja uk
JOIN lam l ON uk.lam_id = l.id
WHERE l.kode = 'LAMDIK' AND uk.jenis = 'prodi';
```

### Dengan User Management (PIC)

```sql
-- Get units assigned to specific user
SELECT uk.*
FROM unit_kerja uk
JOIN user_unit uu ON uk.id = uu.unit_kerja_id
WHERE uu.user_id = 'user-uuid';
```

### Dengan Sesi Audit

```sql
-- Get units that have been audited
SELECT DISTINCT uk.*
FROM unit_kerja uk
JOIN sesi_audit sa ON uk.id = sa.unit_kerja_id
WHERE sa.periode_audit_id = 'periode-uuid';
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
