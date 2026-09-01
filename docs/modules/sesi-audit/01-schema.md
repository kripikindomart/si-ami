# Schema Database - Modul Sesi Audit

## 1. Tabel: sesi_audit

```sql
CREATE TABLE sesi_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor VARCHAR(50) UNIQUE NOT NULL,
  periode_audit_id UUID NOT NULL REFERENCES periode_audit(id) ON DELETE CASCADE,
  unit_kerja_id UUID NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  keterangan TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sesi_periode ON sesi_audit(periode_audit_id);
CREATE INDEX idx_sesi_unit ON sesi_audit(unit_kerja_id);
CREATE INDEX idx_sesi_status ON sesi_audit(status);
CREATE UNIQUE INDEX idx_sesi_active_per_unit ON sesi_audit(unit_kerja_id, status) 
  WHERE status IN ('SCHEDULED', 'IN_PROGRESS');
```

---

## 2. Tabel: sesi_auditor (Many-to-Many)

```sql
CREATE TABLE sesi_auditor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID NOT NULL REFERENCES sesi_audit(id) ON DELETE CASCADE,
  auditor_id UUID NOT NULL REFERENCES auditor(id) ON DELETE CASCADE,
  peran VARCHAR(20) NOT NULL CHECK (peran IN ('ketua', 'anggota')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sesi_audit_id, auditor_id)
);

CREATE INDEX idx_sesi_auditor_sesi ON sesi_auditor(sesi_audit_id);
CREATE INDEX idx_sesi_auditor_auditor ON sesi_auditor(auditor_id);
```

---

## 3. Function: Generate Nomor Sesi

```sql
CREATE OR REPLACE FUNCTION generate_nomor_sesi(tahun INTEGER)
RETURNS VARCHAR AS $$
DECLARE
  urutan INTEGER;
  format_nomor VARCHAR;
BEGIN
  -- Get next urutan for this year
  SELECT COALESCE(MAX(CAST(
    SUBSTRING(nomor FROM '\d+$') AS INTEGER
  )), 0) + 1
  INTO urutan
  FROM sesi_audit
  WHERE EXTRACT(YEAR FROM tanggal_mulai) = tahun;

  -- Get format from config
  SELECT get_config('nomor_format_sesi') INTO format_nomor;
  
  -- Replace placeholders
  format_nomor := REPLACE(format_nomor, '{tahun}', tahun::VARCHAR);
  format_nomor := REGEXP_REPLACE(format_nomor, '\{urut:(\d+)\}', LPAD(urutan::VARCHAR, 3, '0'));

  RETURN format_nomor;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Trigger: Auto-Generate Nomor

```sql
CREATE OR REPLACE FUNCTION set_nomor_sesi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.nomor IS NULL OR NEW.nomor = '' THEN
    NEW.nomor := generate_nomor_sesi(EXTRACT(YEAR FROM NEW.tanggal_mulai)::INTEGER);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_nomor_sesi
  BEFORE INSERT ON sesi_audit
  FOR EACH ROW
  EXECUTE FUNCTION set_nomor_sesi();
```

---

## 5. View: v_sesi_audit_detail

```sql
CREATE OR REPLACE VIEW v_sesi_audit_detail AS
SELECT 
  sa.id,
  sa.nomor,
  sa.tanggal_mulai,
  sa.tanggal_selesai,
  sa.status,
  sa.keterangan,
  pa.nama AS periode_nama,
  pa.tahun AS periode_tahun,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  STRING_AGG(
    CASE WHEN sau.peran = 'ketua' THEN a.nama END, ', '
  ) AS ketua_auditor,
  STRING_AGG(
    CASE WHEN sau.peran = 'anggota' THEN a.nama END, ', '
  ) AS anggota_auditor,
  COUNT(DISTINCT t.id) AS jumlah_temuan,
  COUNT(DISTINCT np.id) AS jumlah_nilai_positif,
  sa.created_at
FROM sesi_audit sa
JOIN periode_audit pa ON sa.periode_audit_id = pa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
LEFT JOIN sesi_auditor sau ON sa.id = sau.sesi_audit_id
LEFT JOIN auditor a ON sau.auditor_id = a.id
LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
LEFT JOIN nilai_positif np ON sa.id = np.sesi_audit_id
GROUP BY sa.id, pa.id, uk.id;
```

---

## 6. RLS Policies

```sql
ALTER TABLE sesi_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesi_auditor ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_sesi_full ON sesi_audit FOR ALL
  USING (check_role('admin_gpm'));

CREATE POLICY admin_sesi_auditor_full ON sesi_auditor FOR ALL
  USING (check_role('admin_gpm'));

-- Auditor: Read sesi where they are assigned
CREATE POLICY auditor_sesi_read ON sesi_audit FOR SELECT
  USING (
    check_role('auditor') AND
    id IN (
      SELECT sesi_audit_id FROM sesi_auditor 
      WHERE auditor_id IN (
        SELECT id FROM auditor WHERE user_id = auth.uid()
      )
    )
  );

-- PIC Unit: Read sesi for their unit
CREATE POLICY pic_sesi_read ON sesi_audit FOR SELECT
  USING (
    check_role('pic_unit') AND
    unit_kerja_id IN (
      SELECT unit_kerja_id FROM unit_kerja_pic WHERE user_id = auth.uid()
    )
  );
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
