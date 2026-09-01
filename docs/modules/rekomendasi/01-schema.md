# Schema Database - Modul Rekomendasi

## 1. Tabel: rekomendasi

```sql
CREATE TABLE rekomendasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor VARCHAR(50) UNIQUE NOT NULL,
  temuan_id UUID NOT NULL REFERENCES temuan(id) ON DELETE CASCADE,
  deskripsi TEXT NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rekomendasi_temuan ON rekomendasi(temuan_id);
CREATE INDEX idx_rekomendasi_tanggal ON rekomendasi(tanggal);
```

---

## 2. Tabel: rekomendasi_standar (Many-to-Many)

```sql
CREATE TABLE rekomendasi_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rekomendasi_id UUID NOT NULL REFERENCES rekomendasi(id) ON DELETE CASCADE,
  standar_mutu_id UUID NOT NULL REFERENCES standar_mutu(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rekomendasi_id, standar_mutu_id)
);

CREATE INDEX idx_rekomendasi_standar_rekomendasi ON rekomendasi_standar(rekomendasi_id);
CREATE INDEX idx_rekomendasi_standar_standar ON rekomendasi_standar(standar_mutu_id);
```

---

## 3. Tabel: rekomendasi_evidence

```sql
CREATE TABLE rekomendasi_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rekomendasi_id UUID NOT NULL REFERENCES rekomendasi(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rekomendasi_evidence ON rekomendasi_evidence(rekomendasi_id);
```

---

## 4. Function: Generate Nomor Rekomendasi

```sql
CREATE OR REPLACE FUNCTION generate_nomor_rekomendasi(tahun INTEGER)
RETURNS VARCHAR AS $$
DECLARE
  urutan INTEGER;
  format_nomor VARCHAR;
BEGIN
  SELECT COALESCE(MAX(CAST(
    SUBSTRING(nomor FROM '^\d+') AS INTEGER
  )), 150) + 1
  INTO urutan
  FROM rekomendasi
  WHERE EXTRACT(YEAR FROM tanggal) = tahun;

  SELECT get_config('nomor_format_temuan') INTO format_nomor;
  format_nomor := REPLACE(format_nomor, '{tahun}', tahun::VARCHAR);
  format_nomor := REGEXP_REPLACE(format_nomor, '\{urut:(\d+)\}', LPAD(urutan::VARCHAR, 3, '0'));

  RETURN format_nomor;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Trigger: Auto-Generate Nomor

```sql
CREATE OR REPLACE FUNCTION set_nomor_rekomendasi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.nomor IS NULL OR NEW.nomor = '' THEN
    NEW.nomor := generate_nomor_rekomendasi(EXTRACT(YEAR FROM NEW.tanggal)::INTEGER);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_nomor_rekomendasi
  BEFORE INSERT ON rekomendasi
  FOR EACH ROW
  EXECUTE FUNCTION set_nomor_rekomendasi();
```

---

## 6. View: v_rekomendasi_detail

```sql
CREATE OR REPLACE VIEW v_rekomendasi_detail AS
SELECT 
  r.id,
  r.nomor,
  r.deskripsi,
  r.tanggal,
  t.nomor AS temuan_nomor,
  t.deskripsi AS temuan_deskripsi,
  sa.nomor AS sesi_nomor,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  STRING_AGG(sm.nama, ', ') AS standar_nama,
  COUNT(DISTINCT re.id) AS jumlah_evidence,
  r.created_at
FROM rekomendasi r
JOIN temuan t ON r.temuan_id = t.id
JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
LEFT JOIN rekomendasi_standar rs ON r.id = rs.rekomendasi_id
LEFT JOIN standar_mutu sm ON rs.standar_mutu_id = sm.id
LEFT JOIN rekomendasi_evidence re ON r.id = re.rekomendasi_id
GROUP BY r.id, t.id, sa.id, uk.id;
```

---

## 7. RLS Policies

```sql
ALTER TABLE rekomendasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE rekomendasi_standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE rekomendasi_evidence ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_rekomendasi_full ON rekomendasi FOR ALL
  USING (check_role('admin_gpm'));

-- Auditor: Full access for their sesi
CREATE POLICY auditor_rekomendasi_full ON rekomendasi FOR ALL
  USING (
    check_role('auditor') AND
    temuan_id IN (
      SELECT t.id FROM temuan t
      JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
      JOIN sesi_auditor sau ON sa.id = sau.sesi_audit_id
      JOIN auditor a ON sau.auditor_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- PIC Unit: Read rekomendasi for their unit
CREATE POLICY pic_rekomendasi_read ON rekomendasi FOR SELECT
  USING (
    check_role('pic_unit') AND
    temuan_id IN (
      SELECT t.id FROM temuan t
      JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
      WHERE sa.unit_kerja_id IN (
        SELECT unit_kerja_id FROM unit_kerja_pic WHERE user_id = auth.uid()
      )
    )
  );

-- Pivot & Evidence inherit
CREATE POLICY all_rekomendasi_standar ON rekomendasi_standar FOR ALL
  USING (rekomendasi_id IN (SELECT id FROM rekomendasi));

CREATE POLICY all_rekomendasi_evidence ON rekomendasi_evidence FOR ALL
  USING (rekomendasi_id IN (SELECT id FROM rekomendasi));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
