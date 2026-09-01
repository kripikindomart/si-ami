# Workflow Diagram - SIM-AMI

## Overview
Dokumen ini menjelaskan alur kerja (workflow) dari setiap proses utama dalam aplikasi SIM-AMI.

---

## 1. WORKFLOW SETUP AWAL SISTEM

```
[Admin GPM] 
    ↓
1. Setup Master Data
    ├─ Buat/Import Unit Kerja
    ├─ Buat/Import Standar Mutu
    ├─ Buat/Import Auditor
    └─ Setup Kategori Temuan & Status RTL
    ↓
2. Setup Users & Roles
    ├─ Buat User (dengan role)
    ├─ Assign User ke Unit (user_unit)
    └─ Set Permissions per Role
    ↓
3. Buat Periode Audit Baru
    ├─ Input Tahun, Nama, Tanggal
    ├─ Status: Draft
    └─ Aktivasi: Status → Berjalan
    ↓
[Sistem Siap Digunakan]
```

---

## 2. WORKFLOW PROSES AUDIT

```
[Admin GPM / Auditor]
    ↓
TAHAP 1: PERSIAPAN AUDIT
    ├─ Pilih Periode Audit (yang sedang Berjalan)
    ├─ Pilih Unit Kerja yang akan diaudit
    ├─ Buat Sesi Audit (tanggal, waktu, tempat)
    ├─ Assign Auditor ke Sesi (sesi_audit_auditor)
    └─ Input Data Auditee (nama, jabatan)
    ↓
TAHAP 2: PELAKSANAAN AUDIT
    ├─ Auditor melakukan desk evaluation & visit
    └─ [Lihat Workflow Input Hasil Audit]
    ↓
TAHAP 3: INPUT HASIL AUDIT
    ├─ Input Temuan (kategori, standar, deskripsi)
    │   └─ Sistem auto-generate nomor PM
    ├─ Input Nilai Positif
    └─ Input Rekomendasi
        └─ Sistem auto-generate nomor PM Pencegahan
    ↓
TAHAP 4: FINALISASI
    ├─ Review semua input
    ├─ Generate Laporan Audit (per unit)
    └─ Notifikasi ke PIC Unit
    ↓
[Selesai - Menunggu Tindak Lanjut dari PIC Unit]
```

### Workflow Detail: Input Hasil Audit

```
[Auditor pada Sesi Audit]
    ↓
┌─────────────────────────────────────┐
│ INPUT TEMUAN                        │
├─────────────────────────────────────┤
│ 1. Pilih Sesi Audit                 │
│ 2. Klik "Tambah Temuan"             │
│ 3. Form Input:                      │
│    - Pilih Standar Mutu (dropdown)  │
│    - Pilih Kategori (Mayor/Minor/   │
│      Observasi)                     │
│    - Isi Deskripsi Temuan          │
│ 4. Submit                           │
│    → Sistem generate Nomor PM       │
│    → Temuan tersimpan               │
│ 5. Ulangi untuk temuan lainnya      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ INPUT NILAI POSITIF                 │
├─────────────────────────────────────┤
│ 1. Pada Sesi Audit yang sama        │
│ 2. Klik "Tambah Nilai Positif"      │
│ 3. Isi Deskripsi                    │
│ 4. (Opsional) Tandai sebagai        │
│    Best Practice                    │
│ 5. Submit                           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ INPUT REKOMENDASI                   │
├─────────────────────────────────────┤
│ 1. Pada Sesi Audit yang sama        │
│ 2. Klik "Tambah Rekomendasi"        │
│ 3. Form Input:                      │
│    - Pilih Standar Mutu             │
│    - Isi Deskripsi Rekomendasi      │
│ 4. Submit                           │
│    → Sistem generate Nomor PM       │
│      Pencegahan                     │
└─────────────────────────────────────┘
    ↓
[Hasil Audit Terinput - Siap untuk RTL]
```

---

## 3. WORKFLOW TINDAK LANJUT (RTL)

```
[PIC Unit / Admin GPM]
    ↓
TAHAP 1: MELIHAT TEMUAN/REKOMENDASI
    ├─ Login sebagai PIC Unit
    ├─ Dashboard menampilkan:
    │   ├─ Temuan untuk unit saya
    │   ├─ Rekomendasi untuk unit saya
    │   └─ Status RTL masing-masing
    └─ Filter: Periode, Status, Kategori
    ↓
TAHAP 2: MULAI TINDAK LANJUT
    ├─ Pilih Temuan/Rekomendasi
    ├─ Klik "Update Tindak Lanjut"
    ├─ Form Input:
    │   ├─ Pilih Status (Belum/Dalam Proses/
    │   │   Perlu Revisi/Selesai)
    │   ├─ Nama Penanggung Jawab
    │   ├─ Target Selesai (tanggal)
    │   ├─ Catatan Progress
    │   └─ Upload Bukti (PDF/Image/Docx)
    ├─ Submit
    └─ Sistem:
        ├─ Simpan sebagai record baru di 
        │   tabel tindak_lanjut (immutable log)
        ├─ Update view status terbaru
        └─ Log activity
    ↓
TAHAP 3: MONITORING & UPDATE BERKALA
    ├─ PIC bisa update status berkala
    ├─ Setiap update = record baru (history)
    ├─ Admin GPM monitor progress semua unit
    └─ Sistem kirim reminder jika mendekati
        deadline
    ↓
TAHAP 4: SELESAI
    ├─ PIC update status → "Selesai"
    ├─ Upload bukti final
    ├─ Admin GPM review & approve
    └─ Temuan/Rekomendasi dianggap closed
    ↓
[RTL Completed]
```

### State Diagram: Status Tindak Lanjut

```
┌─────────────────────────┐
│ Belum Ditindaklanjuti   │ (Default awal)
└───────────┬─────────────┘
            │ PIC mulai mengerjakan
            ↓
┌─────────────────────────┐
│ Dalam Proses            │
└───────────┬─────────────┘
            │
            ├───→ Progress normal ───→┐
            │                         │
            └───→ Ada koreksi ────→   │
                        ↓             │
            ┌─────────────────────┐   │
            │ Perlu Revisi        │   │
            └──────────┬──────────┘   │
                       │              │
                       └──────────────┤
                                      ↓
                        ┌─────────────────────┐
                        │ Selesai             │
                        └─────────────────────┘
                                (Final state)
```

---

## 4. WORKFLOW NOTIFIKASI & REMINDER

```
[Sistem - Scheduled Job via pg_cron / Edge Function]
    ↓
SETIAP HARI (misalnya jam 08:00):
    ↓
1. Query Temuan/Rekomendasi dengan:
    ├─ Status ≠ "Selesai"
    └─ target_selesai - CURRENT_DATE <= N hari
       (N dari konfigurasi, misal 7 hari)
    ↓
2. Untuk setiap item:
    ├─ Ambil PIC Unit terkait (dari user_unit)
    ├─ Generate notifikasi:
    │   ├─ In-app (tabel notifikasi)
    │   └─ Email (via Supabase Edge Function + SMTP)
    ├─ Isi pesan:
    │   ├─ Nomor PM
    │   ├─ Deskripsi singkat
    │   ├─ Deadline
    │   └─ Link ke halaman RTL
    └─ Kirim
    ↓
3. Log pengiriman notifikasi
    ↓
[Selesai]

USER FLOW:
    ↓
PIC Unit login
    ↓
Melihat badge notifikasi (unread count)
    ↓
Klik notifikasi
    ↓
Redirect ke halaman RTL item terkait
    ↓
Update status → notifikasi marked as read
```

---

## 5. WORKFLOW DASHBOARD & REPORTING

### 5.1 Dashboard View (Role-based)

```
USER LOGIN
    ↓
┌──────────────────────────────────────┐
│ ROLE: Admin GPM                      │
├──────────────────────────────────────┤
│ Dashboard Menampilkan:               │
│ ├─ Total Temuan per Kategori         │
│ │   (Mayor/Minor/Observasi)          │
│ ├─ % RTL Selesai (keseluruhan)       │
│ ├─ Grafik Tren Temuan per Periode    │
│ ├─ Top 5 Standar paling sering       │
│ │   dilanggar                        │
│ ├─ Daftar Temuan Mayor yang masih    │
│ │   terbuka                          │
│ └─ Progress RTL per Unit (table)     │
│                                      │
│ Filter:                              │
│ ├─ Periode                           │
│ ├─ Unit Kerja                        │
│ └─ Status                            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ROLE: PIC Unit                       │
├──────────────────────────────────────┤
│ Dashboard Menampilkan:               │
│ ├─ Temuan untuk unit saya            │
│ ├─ Rekomendasi untuk unit saya       │
│ ├─ % RTL Selesai (unit saya)         │
│ ├─ RTL yang mendekati deadline       │
│ └─ History audit unit saya           │
│                                      │
│ (Hanya data unit terkait - enforced  │
│  by RLS)                             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ROLE: Pimpinan                       │
├──────────────────────────────────────┤
│ Dashboard Menampilkan:               │
│ ├─ Executive Summary (high-level)    │
│ ├─ Perbandingan antar unit           │
│ ├─ Tren peningkatan/penurunan        │
│ │   temuan                           │
│ └─ Grafik visual (charts)            │
│                                      │
│ (Read-only, fokus analitik)          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ROLE: Auditor                        │
├──────────────────────────────────────┤
│ Dashboard Menampilkan:               │
│ ├─ Sesi audit yang saya tangani      │
│ ├─ Temuan/rekomendasi yang saya      │
│ │   input                            │
│ └─ Jadwal audit mendatang            │
└──────────────────────────────────────┘
```

### 5.2 Generate Laporan

```
[User dengan permission]
    ↓
1. Pilih Jenis Laporan:
    ├─ Laporan Audit per Unit per Periode
    ├─ Rekap Temuan Keseluruhan
    ├─ Status RTL per Unit
    └─ Analisis Tren (antar periode)
    ↓
2. Filter Parameter:
    ├─ Periode Audit
    ├─ Unit Kerja (bisa multiple)
    ├─ Tanggal Range (opsional)
    └─ Status RTL (opsional)
    ↓
3. Pilih Format Export:
    ├─ PDF (formal, untuk arsip)
    ├─ DOCX (editable)
    └─ XLSX (data tabular, untuk analisis)
    ↓
4. Klik "Generate"
    ↓
5. Sistem:
    ├─ Query data sesuai filter
    ├─ Generate file (backend process)
    ├─ Upload ke Supabase Storage (bucket: laporan)
    └─ Return download link
    ↓
6. User download file
    ↓
7. Log activity (siapa download apa kapan)
    ↓
[Selesai]
```

---

## 6. WORKFLOW EXPORT DATA (untuk Akreditasi/LAMDIK)

```
[Admin GPM]
    ↓
1. Pilih "Export Data Komprehensif"
    ↓
2. Pilih Periode Audit
    ↓
3. Sistem compile data:
    ├─ Semua temuan (dengan status RTL)
    ├─ Semua rekomendasi (dengan status RTL)
    ├─ Nilai positif per unit
    ├─ Summary statistik
    └─ Mapping ke standar LAMDIK
    ↓
4. Generate Excel workbook dengan sheets:
    ├─ Sheet 1: Daftar Temuan
    ├─ Sheet 2: Daftar Rekomendasi
    ├─ Sheet 3: Nilai Positif
    ├─ Sheet 4: Summary per Unit
    └─ Sheet 5: Mapping Standar LAMDIK
    ↓
5. Download
    ↓
[File siap digunakan untuk submission akreditasi]
```

---

## 7. WORKFLOW IMPORT DATA EXISTING (AMI 2025)

```
[Admin GPM - One-time Setup]
    ↓
1. Siapkan file Excel/CSV dengan format:
    ├─ Sheet: Unit Kerja
    ├─ Sheet: Sesi Audit
    ├─ Sheet: Temuan (dengan nomor PM)
    ├─ Sheet: Rekomendasi
    └─ Sheet: Nilai Positif
    ↓
2. Upload file via form import
    ↓
3. Sistem validasi:
    ├─ Cek format kolom
    ├─ Cek referential integrity
    │   (unit_kerja ada? periode ada?)
    └─ Show preview data (200 rows)
    ↓
4. User confirm import
    ↓
5. Sistem execute import:
    ├─ Begin transaction
    ├─ Insert data per sheet (urutan dependency)
    ├─ Log hasil (success/failed per row)
    └─ Commit jika semua berhasil
    ↓
6. Show summary:
    ├─ Total records imported
    ├─ Failed records (dengan alasan)
    └─ Download error log (jika ada)
    ↓
[Data existing berhasil di-migrate]
```

---

## 8. WORKFLOW PERUBAHAN PERIODE AUDIT

```
[Admin GPM]
    ↓
SKENARIO A: TUTUP PERIODE BERJALAN
    ├─ Pilih periode dengan status "Berjalan"
    ├─ Klik "Selesaikan Periode"
    ├─ Sistem cek:
    │   ├─ Apakah semua RTL sudah selesai?
    │   └─ (Jika belum, tampilkan warning)
    ├─ Confirm penutupan
    └─ Status periode → "Selesai"
    ↓
SKENARIO B: BUAT PERIODE BARU
    ├─ Klik "Buat Periode Baru"
    ├─ Input: Tahun, Nama, Tanggal mulai/selesai
    ├─ Status awal: "Draft"
    ├─ Submit
    └─ Periode tersimpan
    ↓
SKENARIO C: AKTIVASI PERIODE
    ├─ Pilih periode "Draft"
    ├─ Klik "Aktifkan"
    ├─ Sistem cek:
    │   └─ Apakah ada periode lain yang "Berjalan"?
    │       (Hanya boleh 1 periode berjalan)
    ├─ Jika aman, status → "Berjalan"
    └─ Notifikasi ke semua user bahwa periode baru dimulai
    ↓
SKENARIO D: ARSIPKAN PERIODE LAMA
    ├─ Pilih periode "Selesai"
    ├─ Klik "Arsipkan"
    ├─ Status → "Diarsipkan"
    └─ (Data tetap ada, tapi tidak muncul di filter default)
    ↓
[Periode Management Selesai]
```

---

## 9. WORKFLOW ROLE & PERMISSION MANAGEMENT

```
[Admin GPM]
    ↓
KELOLA ROLE:
    ├─ Lihat daftar role existing
    ├─ (Opsional) Tambah role baru
    │   └─ Input nama & deskripsi
    └─ (Opsional) Edit/Hapus role
    ↓
KELOLA PERMISSION PER ROLE:
    ├─ Pilih role (mis. "PIC Unit")
    ├─ Tampilkan matrix permission:
    │   
    │   Modul          | Create | Read | Update | Delete
    │   ─────────────────────────────────────────────────
    │   Temuan         |   ☐    |  ☑   |   ☐    |   ☐
    │   Rekomendasi    |   ☐    |  ☑   |   ☐    |   ☐
    │   RTL            |   ☑    |  ☑   |   ☑    |   ☐
    │   Dashboard      |   ☐    |  ☑   |   ☐    |   ☐
    │   ...
    │
    ├─ Toggle checkbox sesuai kebutuhan
    ├─ Submit
    └─ Sistem update tabel permissions
    ↓
ASSIGN USER KE ROLE:
    ├─ Pilih user
    ├─ Dropdown pilih role
    ├─ Submit
    └─ Update users.role_id
    ↓
ASSIGN USER KE UNIT (untuk PIC):
    ├─ Pilih user
    ├─ Multi-select unit kerja
    ├─ Submit
    └─ Insert/update tabel user_unit
    ↓
[Permission Setup Selesai]
```

---

## 10. WORKFLOW ACTIVITY LOG & AUDIT TRAIL

```
[Otomatis oleh Trigger Database]
    ↓
Setiap kali ada:
    ├─ INSERT
    ├─ UPDATE
    └─ DELETE
di tabel penting (temuan, rekomendasi, tindak_lanjut, dll)
    ↓
Trigger log_activity() executed:
    ├─ Capture user_id (auth.uid())
    ├─ Capture aksi (INSERT/UPDATE/DELETE)
    ├─ Capture tabel & record_id
    ├─ Capture perubahan (old vs new value in JSONB)
    ├─ (Opsional) Capture IP & User Agent dari client
    └─ Insert ke activity_log
    ↓
[Log tersimpan - immutable]

VIEWING LOG:
    ↓
[Admin GPM / Auditor Internal]
    ↓
Menu "Activity Log"
    ├─ Filter by:
    │   ├─ User
    │   ├─ Tabel
    │   ├─ Tanggal range
    │   └─ Aksi
    ├─ Tampilkan list log
    ├─ Detail view: show JSONB diff
    └─ Export log (untuk audit eksternal)
    ↓
[Audit Trail Complete]
```

---

## 11. DECISION FLOW: Siapa Bisa Apa?

```
┌─────────────────────────────────────────────────────────┐
│ USER LOGIN → Sistem cek role dari users.role_id         │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
   [Admin GPM]  [Auditor]   [PIC Unit]  [Pimpinan]
        │            │            │            │
        │            │            │            │
   Full Access   Input Audit   Update RTL   Read Only
        │            │            │            │
        ├─ CRUD     ├─ CRUD      ├─ Read      ├─ View
        │  semua    │  temuan    │  temuan/   │  Dashboard
        │  modul    ├─ CRUD      │  rekomendasi│
        │           │  rekomendasi│  (unit     ├─ View
        ├─ Kelola  ├─ CRUD      │  sendiri)  │  Laporan
        │  user     │  nilai_pos │            │
        │           │            ├─ CRUD      └─ Export
        ├─ Kelola  ├─ Read      │  RTL       
        │  master   │  dashboard │  (unit     
        │  data     │            │  sendiri)  
        │           │            │            
        ├─ Setup   └─ Read      └─ View      
        │  periode      laporan     Dashboard
        │                          (unit      
        ├─ Monitor                  sendiri)   
        │  semua RTL                           
        │                                      
        └─ Generate                            
           laporan                             
```

**Enforcement:** RLS policies di database + middleware di API layer

---

## Summary

Workflow di atas mencakup:
1. ✅ Setup awal sistem (master data, user, periode)
2. ✅ Proses audit lengkap (persiapan → input → finalisasi)
3. ✅ Tindak lanjut (RTL) dengan state management
4. ✅ Notifikasi & reminder otomatis
5. ✅ Dashboard & reporting (role-based views)
6. ✅ Export untuk akreditasi/LAMDIK
7. ✅ Import data existing (AMI 2025)
8. ✅ Management periode audit
9. ✅ Role & permission management
10. ✅ Activity logging & audit trail
11. ✅ Decision matrix (siapa bisa apa)

Setiap workflow sudah disesuaikan dengan:
- Role & permission system
- RLS di database level
- Audit trail untuk compliance
- User experience yang intuitif

---

**Next:** Lihat dokumen Issues & Tasks untuk breakdown implementasi per fitur.
