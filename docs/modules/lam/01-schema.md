# Schema Database - Modul LAM

## Tabel: lam

```sql
CREATE TABLE lam (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lam_kode ON lam(kode);
CREATE INDEX idx_lam_status ON lam(status);
```

## Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto-generated |
| kode | VARCHAR(20) | Kode unik LAM (LAMDIK, LAMDIKTI, dll) | Required, Unique, Uppercase |
| nama | VARCHAR(255) | Nama lengkap LAM | Required |
| deskripsi | TEXT | Deskripsi & penjelasan LAM | Optional |
| status | VARCHAR(20) | Status aktif/nonaktif | Default 'aktif' |
| created_at | TIMESTAMP | Tanggal dibuat | Auto |
| updated_at | TIMESTAMP | Tanggal diupdate | Auto |

## Relationships

### Outgoing (tabel ini digunakan oleh):
- `unit_kerja.lam_id` → Prodi menggunakan LAM tertentu
- `standar_mutu.lam_id` → Standar specific per LAM

### Incoming (tabel ini menggunakan):
- None (master data independen)

## Seed Data

```sql
INSERT INTO lam (kode, nama, deskripsi) VALUES
  ('LAMDIK', 'LAM Pendidikan Tinggi Keagamaan Islam', 'LAM untuk perguruan tinggi keislaman'),
  ('LAMDIKTI', 'LAM Pendidikan Tinggi', 'LAM Dikti untuk prodi umum'),
  ('LAMDIKES', 'LAM Pendidikan Tinggi Kesehatan', 'LAM untuk prodi kesehatan'),
  ('GLOBAL', 'Standar Global', 'Standar yang berlaku untuk semua unit');
```

## Constraints

1. **Unique Kode**: Tidak boleh ada 2 LAM dengan kode sama
2. **Status Check**: Hanya boleh 'aktif' atau 'nonaktif'

## Indexes

1. **idx_lam_kode**: Index pada kode untuk query cepat
2. **idx_lam_status**: Index pada status untuk filter

## RLS (Row Level Security)

```sql
-- Enable RLS
ALTER TABLE lam ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_lam_full ON lam
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );

-- Others: Read only
CREATE POLICY others_lam_read ON lam
  FOR SELECT
  USING (true);
```

## Triggers

```sql
-- Auto-update updated_at
CREATE TRIGGER update_lam_updated_at 
  BEFORE UPDATE ON lam
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## Business Rules

1. **Kode Uppercase**: Kode selalu uppercase (enforce di aplikasi)
2. **Soft Delete**: Tidak boleh hard delete, hanya set status = 'nonaktif'
3. **Cannot Delete if Used**: Tidak bisa delete LAM yang sudah digunakan oleh prodi atau standar
4. **Activation**: LAM nonaktif masih bisa diquery untuk historical data

## Migration Strategy

### Phase 1: Create Table
```sql
-- Run migration untuk create table lam
```

### Phase 2: Seed Data
```sql
-- Insert data master LAM
```

### Phase 3: Add Relationships
```sql
-- Setelah tabel unit_kerja & standar_mutu dibuat,
-- add foreign key lam_id ke kedua tabel tersebut
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
