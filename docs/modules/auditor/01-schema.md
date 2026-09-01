# Schema Database - Modul Auditor

## 1. Tabel: auditor

```sql
CREATE TABLE auditor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nip VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telepon VARCHAR(20),
  sertifikasi TEXT,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auditor_nip ON auditor(nip);
CREATE INDEX idx_auditor_user ON auditor(user_id);
CREATE INDEX idx_auditor_status ON auditor(status);
```

### Field Description

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | UUID | Primary key | Auto |
| nip | VARCHAR(50) | Nomor Induk Pegawai | Required, unique |
| nama | VARCHAR(255) | Nama lengkap | Required |
| email | VARCHAR(255) | Email auditor | Optional |
| telepon | VARCHAR(20) | No telepon | Optional |
| sertifikasi | TEXT | Info sertifikat | Optional |
| user_id | UUID | FK to users | Optional (link ke account) |
| status | VARCHAR(20) | Status | aktif/nonaktif |

---

## 2. Tabel: sesi_auditor (Many-to-Many)

```sql
CREATE TABLE sesi_auditor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES auditor(id) ON DELETE CASCADE,
  peran VARCHAR(20) DEFAULT 'anggota' CHECK (peran IN ('ketua', 'anggota')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sesi_audit_id, auditor_id)
);

CREATE INDEX idx_sesi_auditor_sesi ON sesi_auditor(sesi_audit_id);
CREATE INDEX idx_sesi_auditor_auditor ON sesi_auditor(auditor_id);
```

**Purpose**: 1 sesi audit punya multiple auditor (ketua + anggota)

---

## 3. Views

### v_auditor_workload

```sql
CREATE VIEW v_auditor_workload AS
SELECT 
  a.id,
  a.nip,
  a.nama,
  a.status,
  COUNT(DISTINCT sa.sesi_audit_id) as total_sesi,
  COUNT(DISTINCT CASE WHEN sa.peran='ketua' THEN sa.sesi_audit_id END) as sesi_ketua,
  COUNT(DISTINCT CASE WHEN sa.peran='anggota' THEN sa.sesi_audit_id END) as sesi_anggota
FROM auditor a
LEFT JOIN sesi_auditor sa ON a.id = sa.auditor_id
GROUP BY a.id;
```

---

## 4. RLS Policies

```sql
ALTER TABLE auditor ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_auditor_full ON auditor FOR ALL
  USING (check_role('admin_gpm'));

-- All users: Read
CREATE POLICY users_auditor_read ON auditor FOR SELECT
  USING (true);
```

---

## 5. Seed Data

```sql
INSERT INTO auditor (nip, nama, email, telepon, sertifikasi) VALUES
  ('198001012020', 'Dr. Ahmad Zaki, M.Pd', 'zaki@uika.ac.id', '08123456789', 'Auditor Internal Bersertifikat'),
  ('198502152021', 'Siti Aminah, M.M', 'siti@uika.ac.id', '08129876543', 'ISO 9001 Lead Auditor'),
  ('199003202022', 'Budi Santoso, S.Pd', 'budi@uika.ac.id', '08135551234', NULL);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
