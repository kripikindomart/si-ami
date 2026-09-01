# Schema Database - Modul Tindak Lanjut

## 1. Tabel: tindak_lanjut

```sql
CREATE TABLE tindak_lanjut (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temuan_id UUID UNIQUE NOT NULL REFERENCES temuan(id) ON DELETE CASCADE,
  status_rtl_id UUID NOT NULL REFERENCES status_rtl(id),
  deskripsi_rtl TEXT,
  target_penyelesaian DATE,
  tanggal_submit TIMESTAMP WITH TIME ZONE,
  tanggal_approved TIMESTAMP WITH TIME ZONE,
  tanggal_completed TIMESTAMP WITH TIME ZONE,
  tanggal_verified TIMESTAMP WITH TIME ZONE,
  catatan_reject TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  verified_by UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rtl_temuan ON tindak_lanjut(temuan_id);
CREATE INDEX idx_rtl_status ON tindak_lanjut(status_rtl_id);
CREATE INDEX idx_rtl_target ON tindak_lanjut(target_penyelesaian);
```

---

## 2. Tabel: tindak_lanjut_evidence

```sql
CREATE TABLE tindak_lanjut_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tindak_lanjut_id UUID NOT NULL REFERENCES tindak_lanjut(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  stage VARCHAR(20) CHECK (stage IN ('submit', 'complete')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rtl_evidence ON tindak_lanjut_evidence(tindak_lanjut_id);
CREATE INDEX idx_rtl_evidence_stage ON tindak_lanjut_evidence(stage);
```

---

## 3. Trigger: Sync Status RTL ke Temuan

```sql
CREATE OR REPLACE FUNCTION sync_status_rtl_to_temuan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE temuan 
  SET status_rtl_id = NEW.status_rtl_id,
      updated_at = NOW()
  WHERE id = NEW.temuan_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_status_rtl
  AFTER INSERT OR UPDATE OF status_rtl_id ON tindak_lanjut
  FOR EACH ROW
  EXECUTE FUNCTION sync_status_rtl_to_temuan();
```

---

## 4. View: v_tindak_lanjut_detail

```sql
CREATE OR REPLACE VIEW v_tindak_lanjut_detail AS
SELECT 
  rtl.id,
  rtl.deskripsi_rtl,
  rtl.target_penyelesaian,
  rtl.tanggal_submit,
  rtl.tanggal_approved,
  rtl.tanggal_completed,
  rtl.tanggal_verified,
  rtl.catatan_reject,
  t.nomor AS temuan_nomor,
  t.deskripsi AS temuan_deskripsi,
  t.deadline_rtl AS temuan_deadline,
  sa.nomor AS sesi_nomor,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  kt.nama AS kategori_temuan_nama,
  kt.warna AS kategori_temuan_warna,
  sr.kode AS status_rtl_kode,
  sr.nama AS status_rtl_nama,
  sr.warna AS status_rtl_warna,
  COUNT(DISTINCT rtle.id) AS jumlah_evidence,
  rtl.created_at
FROM tindak_lanjut rtl
JOIN temuan t ON rtl.temuan_id = t.id
JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
JOIN status_rtl sr ON rtl.status_rtl_id = sr.id
LEFT JOIN tindak_lanjut_evidence rtle ON rtl.id = rtle.tindak_lanjut_id
GROUP BY rtl.id, t.id, sa.id, uk.id, kt.id, sr.id;
```

---

## 5. RLS Policies

```sql
ALTER TABLE tindak_lanjut ENABLE ROW LEVEL SECURITY;
ALTER TABLE tindak_lanjut_evidence ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_rtl_full ON tindak_lanjut FOR ALL
  USING (check_role('admin_gpm'));

-- PIC Unit: Full access for their unit temuan
CREATE POLICY pic_rtl_full ON tindak_lanjut FOR ALL
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

-- Auditor: Read RTL for their sesi
CREATE POLICY auditor_rtl_read ON tindak_lanjut FOR SELECT
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

-- Evidence inherit
CREATE POLICY all_rtl_evidence ON tindak_lanjut_evidence FOR ALL
  USING (tindak_lanjut_id IN (SELECT id FROM tindak_lanjut));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
