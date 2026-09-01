# Schema Database - Modul Periode Audit

## Overview
Schema database untuk master data periode audit (tahun pelaksanaan AMI).

---

## 1. Tabel: periode_audit

```sql
CREATE TABLE periode_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL,
  tahun INTEGER NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'aktif', 'selesai')),
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (tanggal_selesai > tanggal_mulai),
  CONSTRAINT valid_tahun CHECK (tahun >= 2020 AND tahun <= 2100)
);

CREATE INDEX idx_periode_audit_tahun ON periode_audit(tahun);
CREATE INDEX idx_periode_audit_status ON periode_audit(status);
CREATE UNIQUE INDEX idx_periode_audit_aktif ON periode_audit(status) WHERE status = 'aktif';
```

### Field Description

| Field | Type | Description | Validation | Example |
|-------|------|-------------|------------|---------|
| id | UUID | Primary key | Auto-generated | uuid-123 |
| nama | VARCHAR(100) | Nama periode | Required | AMI 2025 |
| tahun | INTEGER | Tahun periode | Required, 2020-2100 | 2025 |
| tanggal_mulai | DATE | Start date | Required | 2025-01-20 |
| tanggal_selesai | DATE | End date (target) | Required, > mulai | 2025-06-30 |
| status | VARCHAR(20) | Status periode | draft/aktif/selesai | aktif |
| deskripsi | TEXT | Deskripsi | Optional | Audit tahun 2025 |
| created_at | TIMESTAMP | Tanggal dibuat | Auto | 2026-09-01T10:00:00Z |
| updated_at | TIMESTAMP | Tanggal diupdate | Auto | 2026-09-01T10:00:00Z |

### Status Flow

```
draft → aktif → selesai
```

- **draft**: Periode baru dibuat, belum mulai
- **aktif**: Periode sedang berjalan (HANYA 1 periode boleh aktif)
- **selesai**: Periode sudah closed, immutable

---

## 2. Constraints & Business Rules

### Unique Aktif Status

```sql
CREATE UNIQUE INDEX idx_periode_audit_aktif 
ON periode_audit(status) 
WHERE status = 'aktif';
```

**Purpose**: Memastikan hanya 1 periode dengan status='aktif' di database.

### Date Range Validation

```sql
CONSTRAINT valid_date_range CHECK (tanggal_selesai > tanggal_mulai)
```

### Tahun Validation

```sql
CONSTRAINT valid_tahun CHECK (tahun >= 2020 AND tahun <= 2100)
```

---

## 3. Views

### 3.1 View: v_periode_audit_progress

```sql
CREATE VIEW v_periode_audit_progress AS
SELECT 
  pa.id,
  pa.nama,
  pa.tahun,
  pa.tanggal_mulai,
  pa.tanggal_selesai,
  pa.status,
  COUNT(DISTINCT sa.unit_kerja_id) as total_unit_audited,
  COUNT(DISTINCT sa.id) as total_sesi,
  COUNT(DISTINCT CASE WHEN sa.status='selesai' THEN sa.id END) as sesi_selesai,
  COUNT(DISTINCT t.id) as total_temuan,
  COUNT(DISTINCT r.id) as total_rekomendasi,
  COUNT(DISTINCT CASE WHEN rtl.status='completed' THEN rtl.id END) as rtl_completed,
  COUNT(DISTINCT rtl.id) as total_rtl,
  pa.created_at,
  pa.updated_at
FROM periode_audit pa
LEFT JOIN sesi_audit sa ON pa.id = sa.periode_audit_id
LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
LEFT JOIN rekomendasi r ON sa.id = r.sesi_audit_id
LEFT JOIN tindak_lanjut rtl ON r.id = rtl.rekomendasi_id
GROUP BY pa.id;
```

**Usage**: Dashboard progress per periode

---

## 4. RLS (Row Level Security)

### Policy: Admin GPM Full Access

```sql
ALTER TABLE periode_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_periode_audit_full ON periode_audit
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );
```

### Policy: All Users Read

```sql
CREATE POLICY users_periode_audit_read ON periode_audit
  FOR SELECT
  USING (true);
```

---

## 5. Functions & Triggers

### Trigger: Auto-update updated_at

```sql
CREATE TRIGGER update_periode_audit_updated_at 
  BEFORE UPDATE ON periode_audit
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Function: Get Periode Aktif

```sql
CREATE OR REPLACE FUNCTION get_periode_aktif()
RETURNS TABLE (
  id UUID,
  nama VARCHAR,
  tahun INTEGER,
  tanggal_mulai DATE,
  tanggal_selesai DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.nama,
    pa.tahun,
    pa.tanggal_mulai,
    pa.tanggal_selesai
  FROM periode_audit pa
  WHERE pa.status = 'aktif'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

### Function: Set Periode Aktif

```sql
CREATE OR REPLACE FUNCTION set_periode_aktif(p_periode_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Set all periode to non-aktif
  UPDATE periode_audit SET status = 'draft' WHERE status = 'aktif';
  
  -- Set target periode to aktif
  UPDATE periode_audit 
  SET status = 'aktif', updated_at = NOW()
  WHERE id = p_periode_id AND status = 'draft';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### Function: Close Periode

```sql
CREATE OR REPLACE FUNCTION close_periode(p_periode_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_status VARCHAR;
BEGIN
  -- Check current status
  SELECT status INTO v_status FROM periode_audit WHERE id = p_periode_id;
  
  IF v_status != 'aktif' THEN
    RAISE EXCEPTION 'Hanya periode aktif yang bisa di-close';
  END IF;
  
  -- Close periode
  UPDATE periode_audit 
  SET status = 'selesai', updated_at = NOW()
  WHERE id = p_periode_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Relationships

### ER Diagram (Text)

```
periode_audit
    │
    │ 1:M
    ▼
sesi_audit ───┐
    │         │
    │ 1:M     │ 1:M
    ▼         ▼
temuan    rekomendasi ───1:M──► tindak_lanjut
```

### Relationship Details

1. `sesi_audit.periode_audit_id` → `periode_audit(id)` (M:1, required)
2. Cascade behavior: RESTRICT (tidak bisa delete periode jika ada sesi audit)

---

## 7. Seed Data

```sql
-- Seed periode historis
INSERT INTO periode_audit (nama, tahun, tanggal_mulai, tanggal_selesai, status, deskripsi) VALUES
  ('AMI 2024', 2024, '2024-01-15', '2024-06-30', 'selesai', 'Audit Mutu Internal Tahun 2024'),
  ('AMI 2025', 2025, '2025-01-20', '2025-06-30', 'aktif', 'Audit Mutu Internal Tahun 2025'),
  ('AMI 2026', 2026, '2026-01-15', '2026-06-30', 'draft', 'Audit Mutu Internal Tahun 2026');
```

---

## 8. Migration Strategy

### Phase 1: Create Table
```sql
CREATE TABLE periode_audit (...);
CREATE INDEX ...;
CREATE UNIQUE INDEX idx_periode_audit_aktif ...;
```

### Phase 2: Create Views
```sql
CREATE VIEW v_periode_audit_progress ...;
```

### Phase 3: Create Functions
```sql
CREATE FUNCTION get_periode_aktif() ...;
CREATE FUNCTION set_periode_aktif() ...;
CREATE FUNCTION close_periode() ...;
```

### Phase 4: Enable RLS
```sql
ALTER TABLE periode_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;
```

### Phase 5: Seed Data
```sql
INSERT INTO periode_audit ...;
```

---

## 9. Query Examples

### Get Periode Aktif

```sql
SELECT * FROM periode_audit WHERE status = 'aktif' LIMIT 1;
-- OR
SELECT * FROM get_periode_aktif();
```

### Get Progress per Periode

```sql
SELECT * FROM v_periode_audit_progress WHERE tahun = 2025;
```

### Compare Progress Antar Periode

```sql
SELECT 
  tahun,
  total_sesi,
  total_temuan,
  total_rekomendasi,
  ROUND(rtl_completed * 100.0 / NULLIF(total_rtl, 0), 2) as rtl_completion_pct
FROM v_periode_audit_progress
ORDER BY tahun DESC;
```

---

## 10. Integration dengan Modul Lain

### Dengan Sesi Audit

```sql
-- Get sesi audit per periode
SELECT sa.* 
FROM sesi_audit sa
WHERE sa.periode_audit_id = 'periode-uuid'
ORDER BY sa.created_at DESC;
```

### Dengan Dashboard

```sql
-- Dashboard data untuk periode aktif
SELECT * FROM v_periode_audit_progress 
WHERE status = 'aktif';
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
