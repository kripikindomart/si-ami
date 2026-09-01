# Schema Database - Modul Dashboard

## 1. View: v_dashboard_admin

```sql
CREATE OR REPLACE VIEW v_dashboard_admin AS
SELECT 
  (SELECT COUNT(*) FROM sesi_audit WHERE status = 'SCHEDULED') AS sesi_scheduled,
  (SELECT COUNT(*) FROM sesi_audit WHERE status = 'IN_PROGRESS') AS sesi_in_progress,
  (SELECT COUNT(*) FROM sesi_audit WHERE status = 'COMPLETED') AS sesi_completed,
  (SELECT COUNT(*) FROM temuan) AS total_temuan,
  (SELECT COUNT(*) FROM temuan t JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id WHERE kt.kode = 'MAJOR') AS temuan_major,
  (SELECT COUNT(*) FROM temuan t JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id WHERE kt.kode = 'MINOR') AS temuan_minor,
  (SELECT COUNT(*) FROM temuan t JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id WHERE kt.kode = 'OFI') AS temuan_ofi,
  (SELECT COUNT(*) FROM tindak_lanjut tl JOIN status_rtl sr ON tl.status_rtl_id = sr.id WHERE sr.kode = 'SUBMITTED') AS rtl_pending_review,
  (SELECT COUNT(*) FROM tindak_lanjut tl JOIN status_rtl sr ON tl.status_rtl_id = sr.id WHERE sr.kode = 'ON_PROGRESS') AS rtl_on_progress,
  (SELECT COUNT(*) FROM tindak_lanjut tl JOIN status_rtl sr ON tl.status_rtl_id = sr.id WHERE sr.kode = 'COMPLETED') AS rtl_need_verification,
  (SELECT COUNT(*) FROM tindak_lanjut tl JOIN status_rtl sr ON tl.status_rtl_id = sr.id WHERE sr.kode = 'VERIFIED') AS rtl_verified,
  (SELECT COUNT(*) FROM temuan WHERE deadline_rtl < CURRENT_DATE) AS rtl_overdue;
```

---

## 2. View: v_temuan_by_unit

```sql
CREATE OR REPLACE VIEW v_temuan_by_unit AS
SELECT 
  uk.id AS unit_kerja_id,
  uk.nama AS unit_kerja_nama,
  uk.kode AS unit_kerja_kode,
  COUNT(DISTINCT t.id) AS total_temuan,
  COUNT(DISTINCT CASE WHEN kt.kode = 'MAJOR' THEN t.id END) AS temuan_major,
  COUNT(DISTINCT CASE WHEN kt.kode = 'MINOR' THEN t.id END) AS temuan_minor,
  COUNT(DISTINCT CASE WHEN kt.kode = 'OFI' THEN t.id END) AS temuan_ofi,
  COUNT(DISTINCT CASE WHEN sr.kode = 'VERIFIED' THEN tl.id END) AS rtl_verified,
  COUNT(DISTINCT CASE WHEN t.deadline_rtl < CURRENT_DATE THEN t.id END) AS rtl_overdue
FROM unit_kerja uk
LEFT JOIN sesi_audit sa ON uk.id = sa.unit_kerja_id
LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
LEFT JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
LEFT JOIN tindak_lanjut tl ON t.id = tl.temuan_id
LEFT JOIN status_rtl sr ON tl.status_rtl_id = sr.id
GROUP BY uk.id, uk.nama, uk.kode
ORDER BY total_temuan DESC;
```

---

## 3. Function: Get Dashboard Stats by Period

```sql
CREATE OR REPLACE FUNCTION get_dashboard_stats(periode_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'sesi_total', COUNT(DISTINCT sa.id),
    'sesi_completed', COUNT(DISTINCT CASE WHEN sa.status = 'COMPLETED' THEN sa.id END),
    'temuan_total', COUNT(DISTINCT t.id),
    'temuan_major', COUNT(DISTINCT CASE WHEN kt.kode = 'MAJOR' THEN t.id END),
    'rtl_verified', COUNT(DISTINCT CASE WHEN sr.kode = 'VERIFIED' THEN tl.id END),
    'completion_rate', ROUND(
      CAST(COUNT(DISTINCT CASE WHEN sr.kode = 'VERIFIED' THEN tl.id END) AS DECIMAL) / 
      NULLIF(COUNT(DISTINCT t.id), 0) * 100, 2
    )
  )
  INTO result
  FROM sesi_audit sa
  LEFT JOIN temuan t ON sa.id = t.sesi_audit_id
  LEFT JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
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
