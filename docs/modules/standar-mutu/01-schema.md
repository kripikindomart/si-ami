# Schema Database - Modul Standar Mutu

## 1. Tabel: standar_mutu

```sql
CREATE TABLE standar_mutu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) NOT NULL,
  nama TEXT NOT NULL,
  scope VARCHAR(20) NOT NULL CHECK (scope IN ('global', 'specific')),
  lam_id UUID REFERENCES lam(id),
  nomor_urut INTEGER,
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT scope_lam_validation CHECK (
    (scope = 'global' AND lam_id IS NULL) OR
    (scope = 'specific' AND lam_id IS NOT NULL)
  ),
  UNIQUE(kode, lam_id)
);

CREATE INDEX idx_standar_mutu_kode ON standar_mutu(kode);
CREATE INDEX idx_standar_mutu_scope ON standar_mutu(scope);
CREATE INDEX idx_standar_mutu_lam ON standar_mutu(lam_id);
CREATE INDEX idx_standar_mutu_status ON standar_mutu(status);
```

### Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto |
| kode | VARCHAR(50) | Kode standar | Required, unique per LAM |
| nama | TEXT | Nama/deskripsi standar | Required |
| scope | VARCHAR(20) | Scope standar | global/specific |
| lam_id | UUID | FK to lam | Required jika scope=specific |
| nomor_urut | INTEGER | Urutan untuk sorting | Optional |
| deskripsi | TEXT | Deskripsi detail | Optional |
| status | VARCHAR(20) | Status standar | aktif/nonaktif |
| created_at | TIMESTAMP | Tanggal dibuat | Auto |
| updated_at | TIMESTAMP | Tanggal diupdate | Auto |

### Scope Validation Constraint

```sql
CONSTRAINT scope_lam_validation CHECK (
  (scope = 'global' AND lam_id IS NULL) OR
  (scope = 'specific' AND lam_id IS NOT NULL)
)
```

**Meaning**:
- Global scope → TIDAK BOLEH punya lam_id
- Specific scope → WAJIB punya lam_id

---

## 2. Tabel: temuan_standar (Many-to-Many)

```sql
CREATE TABLE temuan_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temuan_id UUID REFERENCES temuan(id) ON DELETE CASCADE,
  standar_mutu_id UUID REFERENCES standar_mutu(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(temuan_id, standar_mutu_id)
);

CREATE INDEX idx_temuan_standar_temuan ON temuan_standar(temuan_id);
CREATE INDEX idx_temuan_standar_standar ON temuan_standar(standar_mutu_id);
```

**Purpose**: 1 temuan bisa punya multiple standar rujukan

---

## 3. Tabel: rekomendasi_standar (Many-to-Many)

```sql
CREATE TABLE rekomendasi_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rekomendasi_id UUID REFERENCES rekomendasi(id) ON DELETE CASCADE,
  standar_mutu_id UUID REFERENCES standar_mutu(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rekomendasi_id, standar_mutu_id)
);

CREATE INDEX idx_rekomendasi_standar_rekomendasi ON rekomendasi_standar(rekomendasi_id);
CREATE INDEX idx_rekomendasi_standar_standar ON rekomendasi_standar(standar_mutu_id);
```

**Purpose**: 1 rekomendasi bisa punya multiple standar rujukan

---

## 4. Views

### 4.1 View: v_standar_with_lam

```sql
CREATE VIEW v_standar_with_lam AS
SELECT 
  sm.id,
  sm.kode,
  sm.nama,
  sm.scope,
  sm.lam_id,
  l.kode as lam_kode,
  l.nama as lam_nama,
  sm.nomor_urut,
  sm.status,
  sm.created_at
FROM standar_mutu sm
LEFT JOIN lam l ON sm.lam_id = l.id;
```

---

### 4.2 View: v_standar_by_unit

```sql
CREATE VIEW v_standar_by_unit AS
SELECT 
  uk.id as unit_id,
  uk.kode as unit_kode,
  uk.nama as unit_nama,
  uk.lam_id as unit_lam_id,
  sm.id as standar_id,
  sm.kode as standar_kode,
  sm.nama as standar_nama,
  sm.scope
FROM unit_kerja uk
CROSS JOIN standar_mutu sm
WHERE sm.status = 'aktif'
  AND (
    sm.scope = 'global' OR 
    (sm.scope = 'specific' AND sm.lam_id = uk.lam_id)
  );
```

**Usage**: Filter standar yang berlaku untuk unit tertentu

---

## 5. RLS Policies

```sql
ALTER TABLE standar_mutu ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_standar_full ON standar_mutu
  FOR ALL
  USING (check_role('admin_gpm'));

-- All users: Read
CREATE POLICY users_standar_read ON standar_mutu
  FOR SELECT
  USING (true);
```

---

## 6. Functions

### Function: Get Standar by Unit

```sql
CREATE OR REPLACE FUNCTION get_standar_by_unit(p_unit_id UUID)
RETURNS TABLE (
  id UUID,
  kode VARCHAR,
  nama TEXT,
  scope VARCHAR,
  lam_kode VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sm.id,
    sm.kode,
    sm.nama,
    sm.scope,
    l.kode as lam_kode
  FROM standar_mutu sm
  LEFT JOIN lam l ON sm.lam_id = l.id
  WHERE sm.status = 'aktif'
    AND (
      sm.scope = 'global' OR
      (sm.scope = 'specific' AND sm.lam_id = (
        SELECT lam_id FROM unit_kerja WHERE id = p_unit_id
      ))
    )
  ORDER BY sm.nomor_urut, sm.kode;
END;
$$ LANGUAGE plpgsql;
```

---

## 7. Triggers

```sql
CREATE TRIGGER update_standar_mutu_updated_at 
  BEFORE UPDATE ON standar_mutu
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 8. Seed Data

```sql
-- Standar Global
INSERT INTO standar_mutu (kode, nama, scope, nomor_urut) VALUES
  ('Standar 1.1', 'Visi, Misi, Tujuan, dan Strategi', 'global', 1),
  ('Standar 1.2', 'Tata Pamong, Tata Kelola, dan Kerjasama', 'global', 2),
  ('Standar 1.3', 'Kemahasiswaan', 'global', 3),
  ('Standar 5.1', 'Kurikulum', 'global', 4);

-- Standar LAMDIK (specific)
INSERT INTO standar_mutu (kode, nama, scope, lam_id, nomor_urut) VALUES
  ('Lamdik 1', 'Standar Kompetensi Lulusan', 'specific', 
   (SELECT id FROM lam WHERE kode='LAMDIK'), 1),
  ('Lamdik 5', 'Standar Isi Pembelajaran', 'specific',
   (SELECT id FROM lam WHERE kode='LAMDIK'), 5),
  ('Lamdik 39', 'Standar Penelitian', 'specific',
   (SELECT id FROM lam WHERE kode='LAMDIK'), 39);

-- Standar LAMDIKTI (specific)
INSERT INTO standar_mutu (kode, nama, scope, lam_id, nomor_urut) VALUES
  ('Standard 1', 'Vision, Mission, Goals and Objectives', 'specific',
   (SELECT id FROM lam WHERE kode='LAMDIKTI'), 1),
  ('Standard 5', 'Curriculum and Learning', 'specific',
   (SELECT id FROM lam WHERE kode='LAMDIKTI'), 5);
```

---

## 9. Query Examples

### Get All Standar for Unit DPAI (LAM=LAMDIK)

```sql
SELECT * FROM get_standar_by_unit(
  (SELECT id FROM unit_kerja WHERE kode='DPAI')
);

-- Result: Standar global + Standar LAMDIK
```

### Get Standar Global Only

```sql
SELECT * FROM standar_mutu
WHERE scope='global' AND status='aktif'
ORDER BY nomor_urut;
```

### Get Standar by LAM

```sql
SELECT sm.* FROM standar_mutu sm
JOIN lam l ON sm.lam_id = l.id
WHERE l.kode = 'LAMDIK' AND sm.status='aktif'
ORDER BY sm.nomor_urut;
```

---

## 10. Integration dengan Modul Lain

### Dengan Temuan (Multiple Standar)

```sql
-- Get standar for temuan
SELECT 
  sm.kode,
  sm.nama
FROM temuan_standar ts
JOIN standar_mutu sm ON ts.standar_mutu_id = sm.id
WHERE ts.temuan_id = 'temuan-uuid';

-- Insert standar for temuan
INSERT INTO temuan_standar (temuan_id, standar_mutu_id)
VALUES ('temuan-uuid', 'standar-uuid-1'),
       ('temuan-uuid', 'standar-uuid-2');
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
