# Schema Database - Modul Import AAR

## 1. Add Column: is_imported

```sql
-- Add to temuan table
ALTER TABLE temuan ADD COLUMN is_imported BOOLEAN DEFAULT FALSE;
ALTER TABLE temuan ADD COLUMN original_document_path VARCHAR(500);
ALTER TABLE temuan ADD COLUMN import_source VARCHAR(100); -- 'AAR_2024', 'AAR_2023', etc
ALTER TABLE temuan ADD COLUMN imported_by UUID REFERENCES auth.users(id);
ALTER TABLE temuan ADD COLUMN imported_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_temuan_is_imported ON temuan(is_imported);
```

---

## 2. Tabel: import_log

```sql
CREATE TABLE import_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  import_source VARCHAR(100), -- 'AAR_2024'
  status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_records INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_details JSONB,
  imported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_import_log_status ON import_log(status);
CREATE INDEX idx_import_log_source ON import_log(import_source);
```

---

## 3. Function: Create Imported Temuan

```sql
CREATE OR REPLACE FUNCTION create_imported_temuan(
  p_sesi_id UUID,
  p_temuan_data JSONB,
  p_original_pdf_path VARCHAR,
  p_import_source VARCHAR,
  p_imported_by UUID
)
RETURNS UUID AS $$
DECLARE
  temuan_id UUID;
  status_verified_id UUID;
BEGIN
  -- Get VERIFIED status
  SELECT id INTO status_verified_id FROM status_rtl WHERE kode = 'VERIFIED' LIMIT 1;

  -- Insert temuan
  INSERT INTO temuan (
    nomor, sesi_audit_id, kategori_temuan_id, deskripsi, lokasi,
    status_rtl_id, is_imported, original_document_path, import_source,
    imported_by, imported_at
  )
  VALUES (
    p_temuan_data->>'nomor', p_sesi_id, 
    (SELECT id FROM kategori_temuan WHERE kode = p_temuan_data->>'kategori'),
    p_temuan_data->>'deskripsi', p_temuan_data->>'lokasi',
    status_verified_id, TRUE, p_original_pdf_path, p_import_source,
    p_imported_by, NOW()
  )
  RETURNING id INTO temuan_id;

  -- Insert RTL (auto verified)
  INSERT INTO tindak_lanjut (
    temuan_id, status_rtl_id, deskripsi_rtl, tanggal_verified
  )
  VALUES (
    temuan_id, status_verified_id, 'Imported from AAR - already verified', NOW()
  );

  RETURN temuan_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. RLS Policies

```sql
-- Only Admin GPM can import
ALTER TABLE import_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_import_log_full ON import_log FOR ALL
  USING (check_role('admin_gpm'));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
