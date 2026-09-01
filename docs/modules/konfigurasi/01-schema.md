# Schema Database - Modul Konfigurasi

## 1. Tabel: konfigurasi

```sql
CREATE TABLE konfigurasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  kategori VARCHAR(50),
  deskripsi TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_konfigurasi_key ON konfigurasi(key);
CREATE INDEX idx_konfigurasi_kategori ON konfigurasi(kategori);
```

---

## 2. Seed Data

```sql
INSERT INTO konfigurasi (key, value, type, kategori, deskripsi) VALUES
  -- General
  ('app_name', 'SIM-AMI SPs UIKA', 'string', 'general', 'Nama aplikasi'),
  ('institusi', 'Sekolah Pascasarjana UIKA', 'string', 'general', 'Nama institusi'),
  ('logo_url', '', 'string', 'general', 'URL logo aplikasi'),
  ('favicon_url', '', 'string', 'general', 'URL favicon'),
  
  -- Workflow
  ('rtl_deadline_days', '30', 'number', 'workflow', 'Default deadline RTL (hari)'),
  
  -- Email/SMTP
  ('smtp_host', '', 'string', 'email', 'SMTP host'),
  ('smtp_port', '587', 'number', 'email', 'SMTP port'),
  ('smtp_user', '', 'string', 'email', 'SMTP username'),
  ('smtp_pass', '', 'string', 'email', 'SMTP password'),
  ('smtp_from_email', 'noreply@uika.ac.id', 'string', 'email', 'Email pengirim'),
  ('smtp_from_name', 'SIM-AMI SPs UIKA', 'string', 'email', 'Nama pengirim'),
  
  -- Notification
  ('notif_enabled', 'true', 'boolean', 'notification', 'Enable notifikasi'),
  ('notif_email_enabled', 'true', 'boolean', 'notification', 'Notifikasi via email'),
  
  -- Numbering
  ('nomor_format_sesi', 'SA/{tahun}/{urut:3}', 'string', 'numbering', 'Format nomor sesi audit'),
  ('nomor_format_temuan', '{urut:3}/PM.10/KPMA/{tahun}', 'string', 'numbering', 'Format nomor temuan'),
  
  -- Storage
  ('storage_provider', 'supabase', 'string', 'storage', 'Provider storage: supabase atau google_drive'),
  ('storage_gdrive_client_id', '', 'string', 'storage', 'Google Drive OAuth Client ID'),
  ('storage_gdrive_client_secret', '', 'string', 'storage', 'Google Drive OAuth Client Secret'),
  ('storage_gdrive_refresh_token', '', 'string', 'storage', 'Google Drive Refresh Token'),
  ('storage_gdrive_folder_id', '', 'string', 'storage', 'Google Drive Folder ID untuk upload');
```

---

## 3. RLS Policies

```sql
ALTER TABLE konfigurasi ENABLE ROW LEVEL SECURITY;

-- Admin: Full access
CREATE POLICY admin_konfigurasi_full ON konfigurasi FOR ALL
  USING (check_role('admin_gpm'));

-- Others: Read only
CREATE POLICY users_konfigurasi_read ON konfigurasi FOR SELECT USING (true);
```

---

## 4. Helper Function

```sql
CREATE OR REPLACE FUNCTION get_config(config_key VARCHAR)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT value FROM konfigurasi WHERE key = config_key LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE;

-- Usage: SELECT get_config('app_name');
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
