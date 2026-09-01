-- ============================================
-- SEED DATA: ROLES
-- ============================================

INSERT INTO roles (id, nama, deskripsi) VALUES
('11111111-1111-1111-1111-111111111111', 'admin_gpm', 'Administrator Gugus Penjaminan Mutu - Full access ke semua modul'),
('22222222-2222-2222-2222-222222222222', 'auditor', 'Auditor Internal - Melakukan audit dan buat temuan/rekomendasi'),
('33333333-3333-3333-3333-333333333333', 'pic_unit', 'Penanggung Jawab Unit Kerja - Kelola tindak lanjut dan upload bukti'),
('44444444-4444-4444-4444-444444444444', 'pimpinan', 'Pimpinan Unit - View laporan dan monitoring progres');

-- ============================================
-- SEED DATA: PERMISSIONS MATRIX
-- ============================================

-- Modul yang akan ada di sistem:
-- user_management, unit_kerja, standar_mutu, periode_audit, kategori_status
-- auditor, sesi_audit, temuan, rekomendasi, tindak_lanjut, nilai_positif
-- lam, laporan, dashboard, konfigurasi, import_data, activity_log, notifikasi

-- ADMIN_GPM: Full access semua modul
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
('11111111-1111-1111-1111-111111111111', 'user_management', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'unit_kerja', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'standar_mutu', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'periode_audit', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'kategori_status', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'auditor', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'sesi_audit', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'temuan', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'rekomendasi', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'tindak_lanjut', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'nilai_positif', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'lam', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'laporan', true, true, true, true),
('11111111-1111-1111-1111-111111111111', 'dashboard', false, true, false, false),
('11111111-1111-1111-1111-111111111111', 'konfigurasi', false, true, true, false),
('11111111-1111-1111-1111-111111111111', 'import_data', true, true, false, false),
('11111111-1111-1111-1111-111111111111', 'activity_log', false, true, false, false),
('11111111-1111-1111-1111-111111111111', 'notifikasi', false, true, true, false);

-- AUDITOR: Kelola audit, temuan, rekomendasi
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
('22222222-2222-2222-2222-222222222222', 'user_management', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'unit_kerja', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'standar_mutu', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'periode_audit', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'kategori_status', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'auditor', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'sesi_audit', true, true, true, false),
('22222222-2222-2222-2222-222222222222', 'temuan', true, true, true, false),
('22222222-2222-2222-2222-222222222222', 'rekomendasi', true, true, true, false),
('22222222-2222-2222-2222-222222222222', 'tindak_lanjut', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'nilai_positif', true, true, true, false),
('22222222-2222-2222-2222-222222222222', 'lam', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'laporan', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'dashboard', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'konfigurasi', false, true, false, false),
('22222222-2222-2222-2222-222222222222', 'import_data', false, false, false, false),
('22222222-2222-2222-2222-222222222222', 'activity_log', false, false, false, false),
('22222222-2222-2222-2222-222222222222', 'notifikasi', false, true, true, false);

-- PIC_UNIT: Kelola tindak lanjut unit-nya
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
('33333333-3333-3333-3333-333333333333', 'user_management', false, false, false, false),
('33333333-3333-3333-3333-333333333333', 'unit_kerja', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'standar_mutu', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'periode_audit', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'kategori_status', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'auditor', false, false, false, false),
('33333333-3333-3333-3333-333333333333', 'sesi_audit', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'temuan', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'rekomendasi', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'tindak_lanjut', true, true, true, false),
('33333333-3333-3333-3333-333333333333', 'nilai_positif', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'lam', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'laporan', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'dashboard', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'konfigurasi', false, true, false, false),
('33333333-3333-3333-3333-333333333333', 'import_data', false, false, false, false),
('33333333-3333-3333-3333-333333333333', 'activity_log', false, false, false, false),
('33333333-3333-3333-3333-333333333333', 'notifikasi', false, true, true, false);

-- PIMPINAN: View only, akses laporan
INSERT INTO permissions (role_id, modul, can_create, can_read, can_update, can_delete) VALUES
('44444444-4444-4444-4444-444444444444', 'user_management', false, false, false, false),
('44444444-4444-4444-4444-444444444444', 'unit_kerja', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'standar_mutu', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'periode_audit', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'kategori_status', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'auditor', false, false, false, false),
('44444444-4444-4444-4444-444444444444', 'sesi_audit', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'temuan', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'rekomendasi', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'tindak_lanjut', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'nilai_positif', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'lam', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'laporan', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'dashboard', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'konfigurasi', false, true, false, false),
('44444444-4444-4444-4444-444444444444', 'import_data', false, false, false, false),
('44444444-4444-4444-4444-444444444444', 'activity_log', false, false, false, false),
('44444444-4444-4444-4444-444444444444', 'notifikasi', false, true, false, false);
