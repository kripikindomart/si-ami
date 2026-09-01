# Schema Database - Modul Temuan

## 1. Tabel: temuan

```sql
CREATE TABLE temuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor VARCHAR(50) UNIQUE NOT NULL,
  sesi_audit_id UUID NOT NULL REFERENCES sesi_audit(id) ON DELETE CASCADE,
  kategori_temuan_id UUID NOT NULL REFERENCES kategori_temuan(id),
  deskripsi TEXT NOT NULL,
  lokasi TEXT,
  status_rtl_id UUID NOT NULL REFERENCES status_rtl(id),
  deadline_rtl DATE,
  tanggal_temuan DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_temuan_sesi ON temuan(sesi_audit_id);
CREATE INDEX idx_temuan_kategori ON temuan(kategori_temuan_id);
CREATE INDEX idx_temuan_status ON temuan(status_rtl_id);
CREATE INDEX idx_temuan_tanggal ON temuan(tanggal_temuan);
```

---

## 2. Tabel: temuan_standar (Many-to-Many)

```sql
CREATE TABLE temuan_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temuan_id UUID NOT NULL REFERENCES temuan(id) ON DELETE CASCADE,
  standar_mutu_id UUID NOT NULL REFERENCES standar_mutu(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(temuan_id, standar_mutu_id)
);

CREATE INDEX idx_temuan_standar_temuan ON temuan_standar(temuan_id);
CREATE INDEX idx_temuan_standar_standar ON temuan_standar(standar_mutu_id);
```

---

## 3. Tabel: temuan_evidence

```sql
CREATE TABLE temuan_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temuan_id UUID NOT NULL REFERENCES temuan(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_temuan_evidence_temuan ON temuan_evidence(temuan_id);
```

---

## 4. Function: Generate Nomor Temuan

```sql
CREATE OR REPLACE FUNCTION generate_nomor_temuan(tahun INTEGER)
RETURNS VARCHAR AS $$
DECLARE
  urutan INTEGER;
  format_nomor VARCHAR;
BEGIN
  -- Get next urutan for this year
  SELECT COALESCE(MAX(CAST(
    SUBSTRING(nomor FROM '^\d+') AS INTEGER
  )), 150) + 1
  INTO urutan
  FROM temuan
  WHERE EXTRACT(YEAR FROM tanggal_temuan) = tahun;

  -- Get format from config
  SELECT get_config('nomor_format_temuan') INTO format_nomor;
  
  -- Replace placeholders: {urut:3}/PM.10/KPMA/{tahun}
  format_nomor := REPLACE(format_nomor, '{tahun}', tahun::VARCHAR);
  format_nomor := REGEXP_REPLACE(format_nomor, '\{urut:(\d+)\}', LPAD(urutan::VARCHAR, 3, '0'));

  RETURN format_nomor;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Trigger: Auto-Generate Nomor & Deadline

```sql
CREATE OR REPLACE FUNCTION set_nomor_and_deadline_temuan()
RETURNS TRIGGER AS $$
DECLARE
  deadline_days INTEGER;
BEGIN
  -- Auto-generate nomor
  IF NEW.nomor IS NULL OR NEW.nomor = '' THEN
    NEW.nomor := generate_nomor_temuan(EXTRACT(YEAR FROM NEW.tanggal_temuan)::INTEGER);
  END IF;

  -- Auto-calculate deadline RTL
  IF NEW.deadline_rtl IS NULL THEN
    SELECT CAST(get_config('rtl_deadline_days') AS INTEGER) INTO deadline_days;
    NEW.deadline_rtl := NEW.tanggal_temuan + (deadline_days || ' days')::INTERVAL;
  END IF;

  -- Default status RTL: DRAFT
  IF NEW.status_rtl_id IS NULL THEN
    SELECT id INTO NEW.status_rtl_id FROM status_rtl WHERE kode = 'DRAFT' LIMIT 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_nomor_temuan
  BEFORE INSERT ON temuan
  FOR EACH ROW
  EXECUTE FUNCTION set_nomor_and_deadline_temuan();
```

---

## 6. View: v_temuan_detail

```sql
CREATE OR REPLACE VIEW v_temuan_detail AS
SELECT 
  t.id,
  t.nomor,
  t.deskripsi,
  t.lokasi,
  t.tanggal_temuan,
  t.deadline_rtl,
  sa.nomor AS sesi_nomor,
  sa.tanggal_mulai AS sesi_tanggal,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  kt.kode AS kategori_kode,
  kt.nama AS kategori_nama,
  kt.warna AS kategori_warna,
  sr.kode AS status_rtl_kode,
  sr.nama AS status_rtl_nama,
  sr.warna AS status_rtl_warna,
  STRING_AGG(sm.nama, ', ') AS standar_nama,
  COUNT(DISTINCT te.id) AS jumlah_evidence,
  COUNT(DISTINCT r.id) AS jumlah_rekomendasi,
  COUNT(DISTINCT rtl.id) AS jumlah_rtl,
  t.created_at
FROM temuan t
JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
JOIN status_rtl sr ON t.status_rtl_id = sr.id
LEFT JOIN temuan_standar ts ON t.id = ts.temuan_id
LEFT JOIN standar_mutu sm ON ts.standar_mutu_id = sm.id
LEFT JOIN temuan_evidence te ON t.id = te.temuan_id
LEFT JOIN rekomendasi r ON t.id = r.temuan_id
LEFT JOIN tindak_lanjut rtl ON t.id = rtl.temuan_id
GROUP BY t.id, sa.id, uk.id, kt.id, sr.id;
```

---

## 7. RLS Policies

```sql
ALTER TABLE temuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE temuan_standar ENABLE ROW LEVEL SECURITY;
ALTER TABLE temuan_evidence ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_temuan_full ON temuan FOR ALL
  USING (check_role('admin_gpm'));

-- Auditor: Full access for their sesi
CREATE POLICY auditor_temuan_full ON temuan FOR ALL
  USING (
    check_role('auditor') AND
    sesi_audit_id IN (
      SELECT sa.id FROM sesi_audit sa
      JOIN sesi_auditor sau ON sa.id = sau.sesi_audit_id
      JOIN auditor a ON sau.auditor_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- PIC Unit: Read temuan for their unit
CREATE POLICY pic_temuan_read ON temuan FOR SELECT
  USING (
    check_role('pic_unit') AND
    sesi_audit_id IN (
      SELECT id FROM sesi_audit 
      WHERE unit_kerja_id IN (
        SELECT unit_kerja_id FROM unit_kerja_pic WHERE user_id = auth.uid()
      )
    )
  );

-- Pivot & Evidence inherit from temuan
CREATE POLICY all_temuan_standar ON temuan_standar FOR ALL
  USING (
    temuan_id IN (SELECT id FROM temuan)
  );

CREATE POLICY all_temuan_evidence ON temuan_evidence FOR ALL
  USING (
    temuan_id IN (SELECT id FROM temuan)
  );
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
