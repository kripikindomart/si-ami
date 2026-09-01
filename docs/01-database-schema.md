# Database Schema - SIM-AMI

## Overview
Database menggunakan PostgreSQL melalui Supabase dengan Row Level Security (RLS) untuk authorization.

---

## A. CORE & MASTER DATA TABLES

### 1. users
Extends Supabase Auth users dengan data tambahan
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role_id UUID REFERENCES roles(id),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
```

### 2. roles
Master role dalam sistem
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) UNIQUE NOT NULL, -- admin_gpm, auditor, pic_unit, pimpinan
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO roles (nama, deskripsi) VALUES
  ('admin_gpm', 'Administrator GPM - akses penuh'),
  ('auditor', 'Auditor Internal - input hasil audit'),
  ('pic_unit', 'PIC Unit/Prodi - kelola tindak lanjut'),
  ('pimpinan', 'Pimpinan - view dashboard & laporan');
```

### 3. permissions
Matrix permission per role per modul
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  modul VARCHAR(50) NOT NULL, -- temuan, rekomendasi, rtl, dll
  can_create BOOLEAN DEFAULT FALSE,
  can_read BOOLEAN DEFAULT FALSE,
  can_update BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, modul)
);

CREATE INDEX idx_permissions_role ON permissions(role_id);
```

### 4. lam
Master Lembaga Akreditasi Mandiri
```sql
CREATE TABLE lam (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL, -- LAMDIK, LAMDIKTI, LAMDIKES, dll
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lam_kode ON lam(kode);
CREATE INDEX idx_lam_status ON lam(status);

-- Seed data
INSERT INTO lam (kode, nama, deskripsi) VALUES
  ('LAMDIK', 'LAM Pendidikan Tinggi Keagamaan Islam', 'LAM untuk perguruan tinggi keislaman'),
  ('LAMDIKTI', 'LAM Pendidikan Tinggi', 'LAM Dikti untuk prodi umum'),
  ('LAMDIKES', 'LAM Pendidikan Tinggi Kesehatan', 'LAM untuk prodi kesehatan'),
  ('GLOBAL', 'Standar Global', 'Standar yang berlaku untuk semua unit');
```

### 5. unit_kerja
Master unit organisasi yang diaudit
```sql
CREATE TABLE unit_kerja (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  jenis VARCHAR(50) NOT NULL CHECK (jenis IN ('direktorat', 'prodi', 'unit_penunjang', 'lab', 'pusat_studi')),
  lam_id UUID REFERENCES lam(id), -- LAM yang digunakan (null untuk non-prodi)
  parent_id UUID REFERENCES unit_kerja(id), -- untuk hierarki jika diperlukan
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_unit_kerja_jenis ON unit_kerja(jenis);
CREATE INDEX idx_unit_kerja_lam ON unit_kerja(lam_id);
CREATE INDEX idx_unit_kerja_status ON unit_kerja(status);

-- Seed data contoh (dengan assignment LAM)
-- Note: LAM assignment akan di-set saat setup, ini contoh saja
INSERT INTO unit_kerja (kode, nama, jenis, lam_id) VALUES
  ('DIR', 'Direktur dan Wakil Direktur SPs', 'direktorat', NULL),
  ('DESY', 'Program Studi Doktor Ekonomi Syariah', 'prodi', NULL), -- TBD: LAM untuk ekonomi syariah
  ('DPAI', 'Program Studi Doktor Pendidikan Agama Islam', 'prodi', (SELECT id FROM lam WHERE kode='LAMDIK')),
  ('MESY', 'Program Studi Magister Ekonomi Syariah', 'prodi', NULL), -- TBD: LAM untuk ekonomi syariah
  ('MPAI', 'Program Studi Magister Pendidikan Agama Islam', 'prodi', (SELECT id FROM lam WHERE kode='LAMDIK')),
  ('MM', 'Program Studi Magister Manajemen', 'prodi', (SELECT id FROM lam WHERE kode='LAMDIKTI')),
  ('MTP', 'Program Studi Magister Teknologi Pendidikan', 'prodi', (SELECT id FROM lam WHERE kode='LAMDIKTI')),
  ('MKPI', 'Program Studi Magister Komunikasi dan Penyiaran Islam', 'prodi', NULL), -- TBD: LAM untuk komunikasi
  ('GPM', 'Gugus Penjaminan Mutu', 'unit_penunjang', NULL),
  ('PERP', 'Perpustakaan', 'unit_penunjang', NULL),
  ('JURNAL', 'UPT Jurnal', 'unit_penunjang', NULL),
  ('LAB', 'Laboratorium', 'lab', NULL),
  ('PSAINS', 'Pusat Studi Islamisasi Sains', 'pusat_studi', NULL);
```

### 5. user_unit
Pivot table: user dapat assign ke multiple unit (terutama PIC)
```sql
CREATE TABLE user_unit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unit_kerja_id UUID REFERENCES unit_kerja(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, unit_kerja_id)
);

CREATE INDEX idx_user_unit_user ON user_unit(user_id);
CREATE INDEX idx_user_unit_unit ON user_unit(unit_kerja_id);
```

### 6. periode_audit
Siklus AMI tahunan
```sql
CREATE TABLE periode_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun INTEGER NOT NULL,
  nama VARCHAR(100) NOT NULL, -- "AMI 2025"
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'berjalan', 'selesai', 'diarsipkan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tahun)
);

CREATE INDEX idx_periode_audit_status ON periode_audit(status);
CREATE INDEX idx_periode_audit_tahun ON periode_audit(tahun);
```

### 7. standar_mutu
Master standar rujukan
```sql
CREATE TABLE standar_mutu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(50) UNIQUE NOT NULL, -- "Standar 1.4", "Lamdik 10", dll
  deskripsi TEXT NOT NULL,
  scope VARCHAR(20) NOT NULL DEFAULT 'global' CHECK (scope IN ('global', 'specific')),
  lam_id UUID REFERENCES lam(id), -- NULL jika scope=global, filled jika scope=specific
  kategori VARCHAR(100), -- "UPPS", "Program Studi", dll (opsional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_lam_scope CHECK (
    (scope = 'global' AND lam_id IS NULL) OR 
    (scope = 'specific' AND lam_id IS NOT NULL)
  )
);

CREATE INDEX idx_standar_mutu_scope ON standar_mutu(scope);
CREATE INDEX idx_standar_mutu_lam ON standar_mutu(lam_id);
CREATE INDEX idx_standar_mutu_kategori ON standar_mutu(kategori_lamdik);

-- Seed data contoh
-- Standar Global (berlaku untuk semua)
INSERT INTO standar_mutu (kode, deskripsi, scope, lam_id, kategori) VALUES
  ('Standar 1.3', 'Visi, Misi, Tujuan dan Strategi', 'global', NULL, 'Umum'),
  ('Standar 1.4', 'Sosialisasi dan Evaluasi VMTS', 'global', NULL, 'Umum'),
  ('Standar 2.1', 'Tata Pamong dan Kepemimpinan', 'global', NULL, 'Umum'),
  ('Standar 5.1', 'Mahasiswa', 'global', NULL, 'Umum'),
  ('Standar 7.4', 'Evaluasi Pembelajaran', 'global', NULL, 'Umum'),
  ('Standar 13.1', 'Promosi dan Penerimaan', 'global', NULL, 'Umum'),
  ('Standar 15.1', 'Penelitian dan Pengabdian Masyarakat', 'global', NULL, 'Umum');

-- Standar Specific untuk LAM PTKeIs (LAMDIK)
INSERT INTO standar_mutu (kode, deskripsi, scope, lam_id, kategori) VALUES
  ('Lamdik 1', 'Visi Keilmuan dan Stakeholder', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 2', 'Sosialisasi VMTS Periodik', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 8', 'Evaluasi Rencana Operasional', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 10', 'Seleksi dan Daya Tampung Mahasiswa', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'Program Studi'),
  ('Lamdik 11', 'Layanan Mahasiswa', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'Program Studi'),
  ('Lamdik 27', 'Fasilitas K3L', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 36', 'Tracer Study', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 39', 'Masa Studi Lulusan', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'Program Studi'),
  ('Lamdik 45', 'Evaluasi Pembelajaran', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'Program Studi'),
  ('Lamdik 46', 'Roadmap Penelitian dan PkM', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'Program Studi'),
  ('Lamdik 56', 'Fungsi Penjaminan Mutu', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS'),
  ('Lamdik 58', 'Tindak Lanjut Temuan AMI', 'specific', (SELECT id FROM lam WHERE kode='LAMDIK'), 'UPPS');

-- Standar Specific untuk LAM Dikti (contoh, bisa ditambah nanti)
-- INSERT INTO standar_mutu (kode, deskripsi, scope, lam_id, kategori) VALUES
--   ('Lamdikti X', 'Deskripsi', 'specific', (SELECT id FROM lam WHERE kode='LAMDIKTI'), 'Kategori');
```

### 8. auditor
Master data auditor
```sql
CREATE TABLE auditor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  gelar VARCHAR(100),
  email VARCHAR(255),
  no_hp VARCHAR(20),
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auditor_status ON auditor(status);
```

### 9. kategori_temuan
Master kategori temuan
```sql
CREATE TABLE kategori_temuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) UNIQUE NOT NULL, -- Minor, Mayor, Observasi
  bobot INTEGER, -- untuk scoring jika diperlukan
  warna VARCHAR(20), -- untuk UI (red, yellow, blue)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO kategori_temuan (nama, bobot, warna) VALUES
  ('Mayor', 3, 'red'),
  ('Minor', 2, 'yellow'),
  ('Observasi', 1, 'blue');
```

### 10. status_tindak_lanjut
Master status RTL
```sql
CREATE TABLE status_tindak_lanjut (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) UNIQUE NOT NULL,
  urutan INTEGER, -- untuk flow status
  warna VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO status_tindak_lanjut (nama, urutan, warna) VALUES
  ('Belum Ditindaklanjuti', 1, 'gray'),
  ('Dalam Proses', 2, 'blue'),
  ('Perlu Revisi', 3, 'orange'),
  ('Selesai', 4, 'green');
```

### 11. konfigurasi
Pengaturan aplikasi
```sql
CREATE TABLE konfigurasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kunci VARCHAR(100) UNIQUE NOT NULL,
  nilai TEXT,
  tipe VARCHAR(20) DEFAULT 'string' CHECK (tipe IN ('string', 'number', 'boolean', 'json')),
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO konfigurasi (kunci, nilai, tipe, deskripsi) VALUES
  ('format_nomor_pm', '{urut}/PM.10/KPMA/{tahun}', 'string', 'Format auto-generate nomor PM'),
  ('format_nomor_pm_pencegahan', '{urut}/PM-P.10/KPMA/{tahun}', 'string', 'Format nomor PM Pencegahan'),
  ('email_reminder_days', '7', 'number', 'Kirim reminder berapa hari sebelum deadline');
```

---

## B. TRANSACTIONAL TABLES

### 12. sesi_audit
Sesi audit per unit per periode
```sql
CREATE TABLE sesi_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_sesi VARCHAR(50) UNIQUE NOT NULL, -- Format: SA/2025/001, SA/2025/002
  unit_kerja_id UUID REFERENCES unit_kerja(id) ON DELETE RESTRICT,
  periode_audit_id UUID REFERENCES periode_audit(id) ON DELETE RESTRICT,
  tanggal_audit DATE NOT NULL,
  waktu_mulai TIME,
  waktu_selesai TIME,
  tempat VARCHAR(255),
  catatan TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(unit_kerja_id, periode_audit_id, tanggal_audit)
);

CREATE INDEX idx_sesi_audit_nomor ON sesi_audit(nomor_sesi);
CREATE INDEX idx_sesi_audit_unit ON sesi_audit(unit_kerja_id);
CREATE INDEX idx_sesi_audit_periode ON sesi_audit(periode_audit_id);
CREATE INDEX idx_sesi_audit_tanggal ON sesi_audit(tanggal_audit);
```

### 13. sesi_audit_auditor
Pivot: auditor yang bertugas per sesi
```sql
CREATE TABLE sesi_audit_auditor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES auditor(id) ON DELETE RESTRICT,
  peran VARCHAR(50), -- ketua, anggota
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sesi_audit_id, auditor_id)
);

CREATE INDEX idx_sesi_audit_auditor_sesi ON sesi_audit_auditor(sesi_audit_id);
```

### 14. sesi_audit_auditee
Auditee yang hadir per sesi
```sql
CREATE TABLE sesi_audit_auditee (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE CASCADE,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sesi_audit_auditee_sesi ON sesi_audit_auditee(sesi_audit_id);
```

### 15. temuan
Temuan ketidaksesuaian
```sql
CREATE TABLE temuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE RESTRICT,
  kategori_temuan_id UUID REFERENCES kategori_temuan(id) ON DELETE RESTRICT,
  nomor_pm VARCHAR(100) UNIQUE NOT NULL, -- auto-generated
  deskripsi TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_temuan_sesi ON temuan(sesi_audit_id);
CREATE INDEX idx_temuan_kategori ON temuan(kategori_temuan_id);
CREATE INDEX idx_temuan_nomor_pm ON temuan(nomor_pm);
```

### 15a. temuan_standar
Relasi many-to-many: 1 temuan bisa punya multiple standar rujukan
```sql
CREATE TABLE temuan_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temuan_id UUID REFERENCES temuan(id) ON DELETE CASCADE,
  standar_mutu_id UUID REFERENCES standar_mutu(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(temuan_id, standar_mutu_id)
);

CREATE INDEX idx_temuan_standar_temuan ON temuan_standar(temuan_id);
CREATE INDEX idx_temuan_standar_standar ON temuan_standar(standar_mutu_id);
```

### 16. nilai_positif
Nilai positif per sesi audit
```sql
CREATE TABLE nilai_positif (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE RESTRICT,
  deskripsi TEXT NOT NULL,
  is_best_practice BOOLEAN DEFAULT FALSE, -- tandai sebagai layak dicontoh
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nilai_positif_sesi ON nilai_positif(sesi_audit_id);
CREATE INDEX idx_nilai_positif_best_practice ON nilai_positif(is_best_practice);
```

### 17. rekomendasi
Rekomendasi & peluang perbaikan (preventif)
```sql
CREATE TABLE rekomendasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_audit_id UUID REFERENCES sesi_audit(id) ON DELETE RESTRICT,
  nomor_pm_pencegahan VARCHAR(100) UNIQUE NOT NULL, -- auto-generated
  deskripsi TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rekomendasi_sesi ON rekomendasi(sesi_audit_id);
CREATE INDEX idx_rekomendasi_nomor_pm ON rekomendasi(nomor_pm_pencegahan);
```

### 17a. rekomendasi_standar
Relasi many-to-many: 1 rekomendasi bisa punya multiple standar rujukan
```sql
CREATE TABLE rekomendasi_standar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rekomendasi_id UUID REFERENCES rekomendasi(id) ON DELETE CASCADE,
  standar_mutu_id UUID REFERENCES standar_mutu(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rekomendasi_id, standar_mutu_id)
);

CREATE INDEX idx_rekomendasi_standar_rekomendasi ON rekomendasi_standar(rekomendasi_id);
CREATE INDEX idx_rekomendasi_standar_standar ON rekomendasi_standar(standar_mutu_id);
```

### 18. tindak_lanjut
History tindak lanjut (polymorphic: bisa untuk temuan atau rekomendasi)
```sql
CREATE TABLE tindak_lanjut (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entitas_type VARCHAR(20) NOT NULL CHECK (entitas_type IN ('temuan', 'rekomendasi')),
  entitas_id UUID NOT NULL, -- temuan.id atau rekomendasi.id
  status_id UUID REFERENCES status_tindak_lanjut(id) ON DELETE RESTRICT,
  penanggung_jawab VARCHAR(255) NOT NULL,
  target_selesai DATE,
  tanggal_selesai DATE,
  catatan TEXT,
  bukti_url TEXT, -- URL file di Supabase Storage
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- No update, no delete - immutable log
  CONSTRAINT check_tanggal_selesai CHECK (tanggal_selesai IS NULL OR tanggal_selesai >= target_selesai)
);

CREATE INDEX idx_tindak_lanjut_entitas ON tindak_lanjut(entitas_type, entitas_id);
CREATE INDEX idx_tindak_lanjut_status ON tindak_lanjut(status_id);
CREATE INDEX idx_tindak_lanjut_target ON tindak_lanjut(target_selesai);
CREATE INDEX idx_tindak_lanjut_created_at ON tindak_lanjut(created_at);

-- View untuk mendapatkan status terbaru per temuan/rekomendasi
CREATE VIEW v_status_tindak_lanjut_terbaru AS
SELECT DISTINCT ON (entitas_type, entitas_id)
  entitas_type,
  entitas_id,
  status_id,
  penanggung_jawab,
  target_selesai,
  tanggal_selesai,
  catatan,
  created_at as last_updated
FROM tindak_lanjut
ORDER BY entitas_type, entitas_id, created_at DESC;
```

---

## C. SUPPORTING TABLES

### 19. activity_log
Audit trail sistem
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  aksi VARCHAR(50) NOT NULL, -- create, update, delete, login, export, dll
  tabel VARCHAR(100),
  record_id UUID,
  perubahan JSONB, -- old value vs new value
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_tabel ON activity_log(tabel);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
```

### 20. notifikasi
In-app notifications
```sql
CREATE TABLE notifikasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  pesan TEXT NOT NULL,
  tipe VARCHAR(50), -- info, warning, urgent
  link VARCHAR(255), -- deep link ke halaman terkait
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifikasi_user ON notifikasi(user_id);
CREATE INDEX idx_notifikasi_is_read ON notifikasi(is_read);
CREATE INDEX idx_notifikasi_created_at ON notifikasi(created_at);
```

---

## D. VIEWS FOR REPORTING

### 21. v_standar_by_unit
View untuk mendapatkan standar yang applicable per unit (global + specific LAM unit)
```sql
CREATE VIEW v_standar_by_unit AS
SELECT 
  uk.id as unit_kerja_id,
  uk.kode as unit_kode,
  uk.nama as unit_nama,
  sm.id as standar_id,
  sm.kode as standar_kode,
  sm.deskripsi as standar_deskripsi,
  sm.scope,
  sm.kategori,
  l.nama as lam_nama
FROM unit_kerja uk
CROSS JOIN standar_mutu sm
LEFT JOIN lam l ON sm.lam_id = l.id
WHERE 
  sm.scope = 'global'  -- Semua standar global
  OR sm.lam_id = uk.lam_id  -- Atau standar specific yang sesuai LAM unit
ORDER BY uk.kode, sm.kode;

-- Contoh query: Standar untuk unit DPAI
-- SELECT * FROM v_standar_by_unit WHERE unit_kode = 'DPAI';
-- Akan return: semua standar global + standar Lamdik (karena DPAI pakai LAMDIK)
```

### 22. v_temuan_with_status
Temuan dengan status RTL terbaru
```sql
CREATE VIEW v_temuan_with_status AS
SELECT 
  t.id,
  t.nomor_pm,
  t.deskripsi,
  kt.nama as kategori,
  sm.kode as standar_kode,
  sm.deskripsi as standar_deskripsi,
  sa.tanggal_audit,
  uk.nama as unit_kerja,
  pa.tahun as periode_tahun,
  COALESCE(stl.nama, 'Belum Ditindaklanjuti') as status_tindak_lanjut,
  vsl.penanggung_jawab,
  vsl.target_selesai,
  vsl.last_updated
FROM temuan t
JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
JOIN periode_audit pa ON sa.periode_audit_id = pa.id
JOIN kategori_temuan kt ON t.kategori_temuan_id = kt.id
JOIN standar_mutu sm ON t.standar_mutu_id = sm.id
LEFT JOIN v_status_tindak_lanjut_terbaru vsl ON vsl.entitas_type = 'temuan' AND vsl.entitas_id = t.id
LEFT JOIN status_tindak_lanjut stl ON vsl.status_id = stl.id;
```

### 22. v_rekomendasi_with_status
Rekomendasi dengan status RTL terbaru
```sql
CREATE VIEW v_rekomendasi_with_status AS
SELECT 
  r.id,
  r.nomor_pm_pencegahan,
  r.deskripsi,
  sm.kode as standar_kode,
  sm.deskripsi as standar_deskripsi,
  sa.tanggal_audit,
  uk.nama as unit_kerja,
  pa.tahun as periode_tahun,
  COALESCE(stl.nama, 'Belum Ditindaklanjuti') as status_tindak_lanjut,
  vsl.penanggung_jawab,
  vsl.target_selesai,
  vsl.last_updated
FROM rekomendasi r
JOIN sesi_audit sa ON r.sesi_audit_id = sa.id
JOIN unit_kerja uk ON sa.unit_kerja_id = uk.id
JOIN periode_audit pa ON sa.periode_audit_id = pa.id
JOIN standar_mutu sm ON r.standar_mutu_id = sm.id
LEFT JOIN v_status_tindak_lanjut_terbaru vsl ON vsl.entitas_type = 'rekomendasi' AND vsl.entitas_id = r.id
LEFT JOIN status_tindak_lanjut stl ON vsl.status_id = stl.id;
```

---

## E. ROW LEVEL SECURITY (RLS) POLICIES

### General Pattern:
```sql
-- Enable RLS on all tables
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- Example untuk tabel temuan:
-- Admin GPM: full access
CREATE POLICY admin_full_access ON temuan
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );

-- PIC Unit: hanya data unit mereka
CREATE POLICY pic_unit_access ON temuan
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN user_unit uu ON u.id = uu.user_id
      JOIN sesi_audit sa ON sa.unit_kerja_id = uu.unit_kerja_id
      WHERE u.id = auth.uid() AND sa.id = temuan.sesi_audit_id
    )
  );

-- Auditor: data yang mereka input
CREATE POLICY auditor_own_data ON temuan
  FOR ALL
  USING (created_by = auth.uid());

-- Pimpinan: read-only semua
CREATE POLICY pimpinan_read_access ON temuan
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'pimpinan'
    )
  );
```

**Note:** Setiap tabel transaksional perlu RLS policy yang disesuaikan dengan role & scope akses.

---

## F. FUNCTIONS & TRIGGERS

### Auto-generate Nomor Sesi Audit
```sql
CREATE OR REPLACE FUNCTION generate_nomor_sesi(tahun_audit INTEGER)
RETURNS VARCHAR AS $$
DECLARE
  urut_terakhir INTEGER;
  nomor_baru VARCHAR;
BEGIN
  -- Hitung urutan terakhir di tahun ini
  SELECT COUNT(*) INTO urut_terakhir FROM sesi_audit sa
  JOIN periode_audit pa ON sa.periode_audit_id = pa.id
  WHERE pa.tahun = tahun_audit;
  
  urut_terakhir := urut_terakhir + 1;
  
  -- Format: SA/2025/001
  nomor_baru := 'SA/' || tahun_audit::TEXT || '/' || LPAD(urut_terakhir::TEXT, 3, '0');
  
  RETURN nomor_baru;
END;
$$ LANGUAGE plpgsql;
```

### Auto-generate Nomor PM
```sql
CREATE OR REPLACE FUNCTION generate_nomor_pm(tahun_audit INTEGER, is_pencegahan BOOLEAN DEFAULT FALSE)
RETURNS VARCHAR AS $$
DECLARE
  format_string VARCHAR;
  urut_terakhir INTEGER;
  nomor_baru VARCHAR;
BEGIN
  -- Ambil format dari konfigurasi
  IF is_pencegahan THEN
    SELECT nilai INTO format_string FROM konfigurasi WHERE kunci = 'format_nomor_pm_pencegahan';
  ELSE
    SELECT nilai INTO format_string FROM konfigurasi WHERE kunci = 'format_nomor_pm';
  END IF;
  
  -- Hitung urutan terakhir di tahun ini
  IF is_pencegahan THEN
    SELECT COUNT(*) INTO urut_terakhir FROM rekomendasi r
    JOIN sesi_audit sa ON r.sesi_audit_id = sa.id
    JOIN periode_audit pa ON sa.periode_audit_id = pa.id
    WHERE pa.tahun = tahun_audit;
  ELSE
    SELECT COUNT(*) INTO urut_terakhir FROM temuan t
    JOIN sesi_audit sa ON t.sesi_audit_id = sa.id
    JOIN periode_audit pa ON sa.periode_audit_id = pa.id
    WHERE pa.tahun = tahun_audit;
  END IF;
  
  urut_terakhir := urut_terakhir + 1;
  
  -- Replace placeholder
  nomor_baru := REPLACE(format_string, '{urut}', LPAD(urut_terakhir::TEXT, 3, '0'));
  nomor_baru := REPLACE(nomor_baru, '{tahun}', tahun_audit::TEXT);
  
  RETURN nomor_baru;
END;
$$ LANGUAGE plpgsql;
```

### Trigger untuk auto-update updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply ke semua tabel yang punya updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unit_kerja_updated_at BEFORE UPDATE ON unit_kerja
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... dst untuk tabel lain
```

### Log Activity Trigger
```sql
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply ke tabel-tabel penting
CREATE TRIGGER log_temuan_activity AFTER INSERT OR UPDATE OR DELETE ON temuan
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_tindak_lanjut_activity AFTER INSERT ON tindak_lanjut
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ... dst
```

---

## G. INDEXES SUMMARY

All indexes sudah tercantum di setiap definisi tabel di atas. Key indexes:
- Foreign keys (auto-indexed by PostgreSQL in most cases)
- Status fields (untuk filtering)
- Tanggal fields (untuk range queries)
- Composite indexes untuk queries kompleks (akan ditambahkan setelah monitoring query performance)

---

## H. STORAGE BUCKETS (Supabase Storage)

### Bucket: `bukti-rtl`
- Public: false
- File size limit: 10MB
- Allowed types: PDF, JPG, PNG, DOCX
- Path structure: `{tahun}/{unit_kerja_id}/{entitas_type}/{entitas_id}/{filename}`
- RLS: user hanya bisa upload untuk unit mereka, atau admin GPM

### Bucket: `laporan`
- Public: false
- File size limit: 20MB
- Generated reports (PDF, DOCX, XLSX)
- Path: `{periode_id}/{unit_kerja_id}/{report_type}/{filename}`

---

## I. MIGRATION STRATEGY

1. **Phase 1:** Core tables (users, roles, permissions, unit_kerja, periode_audit)
2. **Phase 2:** Master data (standar_mutu, auditor, kategori_temuan, status_tindak_lanjut, konfigurasi)
3. **Phase 3:** Transactional (sesi_audit, temuan, rekomendasi, nilai_positif)
4. **Phase 4:** Tindak lanjut system
5. **Phase 5:** Supporting (activity_log, notifikasi)
6. **Phase 6:** Views, functions, triggers
7. **Phase 7:** RLS policies
8. **Phase 8:** Seed data & import data existing AMI 2025

---

**End of Schema Document**
