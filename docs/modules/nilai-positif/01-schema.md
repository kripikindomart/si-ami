# Schema Database - Modul Nilai Positif

## 1. Tabel: nilai_positif

```sql
CREATE TABLE nilai_positif (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID NOT NULL REFERENCES sesi_audit(id) ON DELETE CASCADE,
  deskripsi TEXT NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nilai_positif_sesi ON nilai_positif(sesi_audit_id);
CREATE INDEX idx_nilai_positif_tanggal ON nilai_positif(tanggal);
```

---

## 2. Tabel: nilai_positif_evidence

```sql
CREATE TABLE nilai_positif_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nilai_positif_id UUID NOT NULL REFERENCES nilai_positif(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nilai_positif_evidence ON nilai_positif_evidence(nilai_positif_id);
```

---

## 3. View: v_nilai_positif_detail

```sql
CREATE OR REPLACE VIEW v_nilai_positif_detail AS
SELECT 
  np.id,
  np.deskripsi,
  np.tanggal,
  sa.nomor AS sesi_nomor,
  sa.tanggal_mulai AS sesi_tanggal,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  COUNT(DISTINCT npe.id) AS jumlah_evidence,
  np.created_at
FROM nilai_positif np
JOIN sesi_audit sa ON np.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
LEFT JOIN nilai_positif_evidence npe ON np.id = npe.nilai_positif_id
GROUP BY np.id, sa.id, uk.id;
```

---

## 4. RLS Policies

```sql
ALTER TABLE nilai_positif ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilai_positif_evidence ENABLE ROW LEVEL SECURITY;

-- Admin GPM: Full access
CREATE POLICY admin_nilai_positif_full ON nilai_positif FOR ALL
  USING (check_role('admin_gpm'));

-- Auditor: Full access for their sesi
CREATE POLICY auditor_nilai_positif_full ON nilai_positif FOR ALL
  USING (
    check_role('auditor') AND
    sesi_audit_id IN (
      SELECT sa.id FROM sesi_audit sa
      JOIN sesi_auditor sau ON sa.id = sau.sesi_audit_id
      JOIN auditor a ON sau.auditor_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- PIC Unit: Read nilai positif for their unit
CREATE POLICY pic_nilai_positif_read ON nilai_positif FOR SELECT
  USING (
    check_role('pic_unit') AND
    sesi_audit_id IN (
      SELECT id FROM sesi_audit 
      WHERE unit_kerja_id IN (
        SELECT unit_kerja_id FROM unit_kerja_pic WHERE user_id = auth.uid()
      )
    )
  );

-- Evidence inherit from nilai_positif
CREATE POLICY all_nilai_positif_evidence ON nilai_positif_evidence FOR ALL
  USING (nilai_positif_id IN (SELECT id FROM nilai_positif));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
