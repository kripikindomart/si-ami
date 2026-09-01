# Rancangan Modul Aplikasi SIM-AMI

Stack: Next.js + Supabase (Postgres, Auth, Storage, RLS)

---

## A. MODUL CORE & MASTER DATA

Fondasi aplikasi — harus jadi yang pertama dibangun karena modul lain bergantung ke sini.

### A.1 Manajemen User, Role & Permission
- CRUD user (nama, email, unit terkait, status aktif/nonaktif)
- Role: `admin_gpm`, `auditor`, `pic_unit`, `pimpinan` (bisa nambah role lain nanti, mis. `dosen`)
- Permission matrix per role (siapa boleh create/read/update/delete di modul apa)
- Assign user ke satu atau lebih Unit/Prodi (relevan buat PIC Unit yang mungkin pegang lebih dari satu prodi)
- Diimplementasikan pakai Supabase Auth + tabel `users` (role) + Row Level Security di tiap tabel

**Tabel:** `users`, `roles`, `permissions`, `user_unit` (pivot)

### A.2 Manajemen Program Studi / Unit Kerja
- Master data seluruh unit yang bisa diaudit: Direktur/Wadir, tiap Prodi (DESy, DPAI, MESy, MPAI, MM, MTP, MKPI), Lab, UPT Jurnal, Perpustakaan, GPM, Pusat Studi Sains
- Field: kode unit, nama, jenis (Direktorat/Prodi/Unit Penunjang), status aktif
- Jadi rujukan dropdown di semua modul lain — kalau ada prodi baru dibuka, tinggal tambah di sini tanpa ubah kode

**Tabel:** `unit_kerja` (id, kode, nama, jenis, status)

### A.3 Manajemen Tahun Audit / Periode
- Setiap siklus AMI = 1 periode (mis. "AMI 2025", "AMI 2026")
- Status periode: Draft / Berjalan / Selesai / Diarsipkan
- Semua data temuan/nilai positif/rekomendasi terikat ke periode ini → basis perbandingan tren antar tahun

**Tabel:** `periode_audit` (id, tahun, nama, tanggal_mulai, tanggal_selesai, status)

### A.4 Manajemen Standar Mutu / Referensi
- Master daftar standar yang dipakai sebagai acuan temuan (mis. "Standar 1.4", "Lamdik 10", "Matriks Penilaian UPPS LAMDIK 27")
- Berguna supaya input temuan konsisten (dropdown, bukan ketik bebas) dan bisa direkap "standar mana yang paling sering jadi temuan lintas prodi"

**Tabel:** `standar_mutu` (id, kode, deskripsi, kategori_lamdik)

### A.5 Manajemen Auditor & Auditee
- Master data auditor (bisa dosen/staf internal) — dipakai saat penugasan audit per unit per periode
- Auditee dicatat per sesi audit (jabatan + nama), sifatnya lebih ke data pelengkap laporan daripada user aplikasi

**Tabel:** `auditor` (id, nama, gelar), `sesi_audit` (id, unit_kerja_id, periode_audit_id, tanggal_audit), `sesi_audit_auditor` (pivot), `sesi_audit_auditee` (nama, jabatan)

### A.6 Pengaturan Aplikasi
- Kategori temuan (Minor/Mayor/Observasi) — bisa dibuat master data juga kalau ke depan mau nambah kategori
- Status tindak lanjut (Belum Ditindaklanjuti/Dalam Proses/Selesai/Perlu Revisi)
- Konfigurasi format nomor PM otomatis (mis. `{urut}/PM.10/KPMA/{tahun}`) — biar nggak input manual dan nggak bentrok nomor

---

## B. MODUL TRANSAKSIONAL (INTI AMI)

### B.1 Modul Temuan (Ketidaksesuaian)
- CRUD temuan per sesi audit: referensi standar, deskripsi, kategori, nomor PM (auto-generate)
- Status keseluruhan temuan mengikuti status tindak lanjut terakhirnya
- Filter/search by unit, periode, kategori, standar

**Tabel:** `temuan` (id, sesi_audit_id, standar_mutu_id, deskripsi, kategori, nomor_pm)

### B.2 Modul Nilai Positif
- CRUD nilai positif per sesi audit — sederhana, cuma daftar poin per unit
- Bisa dijadikan bahan "best practice" yang direplikasi ke unit lain (fitur nice-to-have: tandai nilai positif sebagai "layak dicontoh unit lain")

**Tabel:** `nilai_positif` (id, sesi_audit_id, deskripsi)

### B.3 Modul Rekomendasi & Peluang Perbaikan
- Mirip temuan, tapi sifatnya preventif (nomor PM Pencegahan, bukan Perbaikan)
- Struktur sama dengan Temuan agar bisa dipakai ulang komponennya

**Tabel:** `rekomendasi` (id, sesi_audit_id, standar_mutu_id, deskripsi, nomor_pm_pencegahan)

### B.4 Modul Tindak Lanjut (RTL) — inti dari kebutuhan awal
- Riwayat status untuk tiap Temuan maupun Rekomendasi (polymorphic: bisa nempel ke keduanya)
- Field: status, penanggung jawab, target selesai, tanggal update, bukti fisik (upload ke Supabase Storage), catatan progres
- Hanya PIC Unit terkait & Admin GPM yang bisa update (ditegakkan via RLS)
- History tidak boleh dihapus — tiap update jadi entri baru (log tidak mutable) supaya audit trail-nya sendiri kuat

**Tabel:** `tindak_lanjut` (id, entitas_type [`temuan`|`rekomendasi`], entitas_id, status, penanggung_jawab, target_selesai, bukti_url, catatan, created_by, created_at)

---

## C. MODUL PENDUKUNG

### C.1 Dashboard & Rekap Analitik
- Ringkasan per periode: total temuan per kategori, % RTL selesai per unit dan keseluruhan
- Grafik tren temuan antar periode per unit/per standar (temuan yang berulang tiap tahun jadi sinyal masalah sistemik)
- Widget "temuan Mayor yang masih terbuka" untuk perhatian pimpinan

### C.2 Notifikasi & Reminder
- In-app + email (Supabase Edge Function + `pg_cron`, terjadwal harian) untuk RTL yang mendekati/lewat `target_selesai`
- Notifikasi ke PIC Unit terkait, ringkasan mingguan ke Admin GPM

### C.3 Laporan & Ekspor
- Generate ulang laporan resmi per unit/per periode dalam format yang mirip dokumen asli (docx/pdf), lengkap dengan status RTL terkini
- Export rekap keseluruhan (Excel) untuk kebutuhan akreditasi/LAMDIK

### C.4 Log Aktivitas (Audit Trail Sistem)
- Siapa mengubah apa dan kapan, di seluruh modul — penting karena ini aplikasi buat kepatuhan/audit, jadi jejaknya sendiri harus bisa diaudit
- Cukup satu tabel generik: `activity_log` (user_id, aksi, tabel, record_id, perubahan, created_at)

---

## D. Urutan Pembangunan yang Disarankan

1. **Core & Master Data** (A.1–A.6) — wajib duluan, semua modul lain bergantung ke sini
2. **Modul Transaksional** (B.1–B.4) + import data AMI 2025 yang sudah ada
3. **Dashboard & Rekap** (C.1) — supaya cepat kelihatan "hasil" buat pimpinan
4. **Laporan & Ekspor** (C.3)
5. **Notifikasi** (C.2) + **Log Aktivitas** (C.4) — pemanis di akhir, bukan blocker fitur inti
