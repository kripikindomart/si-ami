# Schema Database - Modul Laporan

## 1. View: v_laporan_sesi_audit

```sql
CREATE OR REPLACE VIEW v_laporan_sesi_audit AS
SELECT 
  sa.id AS sesi_id,
  sa.nomor AS sesi_nomor,
  pa.nama AS periode_nama,
  pa.tahun AS periode_tahun,
  uk.kode AS unit_kode,
  uk.nama AS unit_nama,
  sa.tanggal_mulai,
  sa.tanggal_selesai,
  sa.status AS sesi_status,
  STRING_AGG(DISTINCT CASE WHEN sau.peran = 'ketua' THEN a.nama END, ', ') AS ketua_auditor,
  STRING_AGG(DISTINCT CASE WHEN sau.peran = 'anggota' THEN a.nama END, ', ') AS anggota_auditor,
  COUNT(DISTINCT t.id) AS jumlah_temuan,
  COUNT(DISTINCT CASE WHEN kt.kode = 'MAJOR' THEN t.id END) AS temuan_major,
  COUNT(DISTINCT CASE WHEN kt.kode = 'MINOR' THEN t.id END) AS temuan_minor,
  COUNT(DISTINCT CASE WHEN kt.kode = 'OFI' THEN t.id END) AS temuan_ofi,
  COUNT(DISTINCT np.id) AS jumlah_nilai_positif,
  COUNT(DISTINCT CASE WHEN sr.kode = 'VERIFIED' THEN tl.id END) AS rtl_verified
FROM sesi_audit sa
JOIN periode_audit pa ON sa.periode_audit_id = pa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
LEFT JOIN sesi_auditor sau ON sa.id = sau.sesi_audit_id
LEFT JOIN auditor a ON sau.auditor_id = a.id
LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
LEFT JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
LEFT JOIN nilai_positif np ON sa.id = np.sesi_audit_id
LEFT JOIN tindak_lanjut tl ON t.id = tl.temuan_id
LEFT JOIN status_rtl sr ON tl.status_rtl_id = sr.id
GROUP BY sa.id, pa.id, uk.id;
```

---

## 2. View: v_laporan_temuan_detail

```sql
CREATE OR REPLACE VIEW v_laporan_temuan_detail AS
SELECT 
  t.id AS temuan_id,
  t.nomor AS temuan_nomor,
  t.deskripsi,
  t.lokasi,
  t.tanggal_temuan,
  t.deadline_rtl,
  sa.nomor AS sesi_nomor,
  pa.nama AS periode_nama,
  uk.kode AS unit_kode,
  uk.nama AS unit_nama,
  kt.kode AS kategori_kode,
  kt.nama AS kategori_nama,
  sr.kode AS status_rtl_kode,
  sr.nama AS status_rtl_nama,
  STRING_AGG(DISTINCT sm.nama, ', ') AS standar_nama,
  COUNT(DISTINCT r.id) AS jumlah_rekomendasi,
  tl.deskripsi_rtl,
  tl.target_penyelesaian,
  tl.tanggal_verified
FROM temuan t
JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
JOIN periode_audit pa ON sa.periode_audit_id = pa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
JOIN status_rtl sr ON t.status_rtl_id = sr.id
LEFT JOIN temuan_standar ts ON t.id = ts.temuan_id
LEFT JOIN standar_mutu sm ON ts.standar_mutu_id = sm.id
LEFT JOIN rekomendasi r ON t.id = r.temuan_id
LEFT JOIN tindak_lanjut tl ON t.id = tl.temuan_id
GROUP BY t.id, sa.id, pa.id, uk.id, kt.id, sr.id, tl.id;
```

---

## 3. Function: Get Statistik Periode

```sql
CREATE OR REPLACE FUNCTION get_statistik_periode(periode_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_unit', COUNT(DISTINCT uk.id),
    'total_sesi', COUNT(DISTINCT sa.id),
    'sesi_completed', COUNT(DISTINCT CASE WHEN sa.status = 'COMPLETED' THEN sa.id END),
    'total_temuan', COUNT(DISTINCT t.id),
    'temuan_major', COUNT(DISTINCT CASE WHEN kt.kode = 'MAJOR' THEN t.id END),
    'temuan_minor', COUNT(DISTINCT CASE WHEN kt.kode = 'MINOR' THEN t.id END),
    'temuan_ofi', COUNT(DISTINCT CASE WHEN kt.kode = 'OFI' THEN t.id END),
    'total_rekomendasi', COUNT(DISTINCT r.id),
    'total_nilai_positif', COUNT(DISTINCT np.id),
    'rtl_verified', COUNT(DISTINCT CASE WHEN sr.kode = 'VERIFIED' THEN tl.id END),
    'rtl_on_progress', COUNT(DISTINCT CASE WHEN sr.kode = 'ON_PROGRESS' THEN tl.id END),
    'rtl_overdue', COUNT(DISTINCT CASE WHEN t.deadline_rtl < CURRENT_DATE AND sr.kode != 'VERIFIED' THEN t.id END)
  )
  INTO result
  FROM sesi_audit sa
  JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
  LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
  LEFT JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
  LEFT JOIN rekomendasi r ON t.id = r.temuan_id
  LEFT JOIN nilai_positif np ON sa.id = np.sesi_audit_id
  LEFT JOIN tindak_lanjut tl ON t.id = tl.temuan_id
  LEFT JOIN status_rtl sr ON tl.status_rtl_id = sr.id
  WHERE sa.periode_audit_id = periode_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
