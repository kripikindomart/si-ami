# DAFTAR MODUL SIM-AMI

Setiap modul punya folder sendiri di `docs/modules/[nama-modul]/` dengan struktur:
- `01-schema.md` - Database schema
- `02-workflow.md` - Business logic & workflow
- `03-wireframe.md` - UI/UX design
- `04-issues.md` - GitHub issues template
- `05-api-endpoints.md` - API specification

---

## A. MODUL CORE & MASTER DATA

### A.1 User Management
**Folder**: `docs/modules/user-management/`
**Deskripsi**: Manajemen user, role, dan permission
**Fitur**:
- CRUD users
- Assign role ke user
- Assign unit ke user (PIC Unit bisa multiple unit)
- Permission matrix per role
- Profile management

**Tabel**: `users`, `roles`, `permissions`, `user_unit`

---

### A.2 LAM (Lembaga Akreditasi Mandiri)
**Folder**: `docs/modules/lam/`
**Deskripsi**: Master LAM untuk kategorisasi standar mutu per prodi
**Fitur**:
- CRUD LAM (LAM Dikti, LAM PTKes, LAM PTKeIs, dll)
- Status aktif/nonaktif
- Kode & deskripsi LAM

**Tabel**: `lam`

**Contoh Data**:
- LAMDIK (LAM Pendidikan Tinggi Keagamaan Islam) - untuk DPAI, MPAI
- LAMDIKTI (LAM Dikti) - untuk MM, MTP
- LAMDIKES (LAM Kesehatan) - untuk prodi kesehatan
- GLOBAL - untuk standar yang berlaku semua unit

---

### A.3 Unit Kerja
**Folder**: `docs/modules/unit-kerja/`
**Deskripsi**: Master data unit organisasi yang diaudit
**Fitur**:
- CRUD unit kerja
- **Assign LAM ke prodi** (wajib untuk prodi)
- Kategori unit (direktorat, prodi, unit penunjang, lab, pusat studi)
- Status aktif/nonaktif
- Hierarchical structure (jika ada parent-child)

**Tabel**: `unit_kerja`

**Assignment LAM Contoh**:
- DPAI → LAMDIK
- MPAI → LAMDIK  
- MM → LAMDIKTI
- MTP → LAMDIKTI
- Unit non-prodi (Direktur, Lab, GPM, dll) → NULL (tidak perlu LAM)

---

### A.4 Periode Audit
**Folder**: `docs/modules/periode-audit/`
**Deskripsi**: Manajemen siklus AMI tahunan
**Fitur**:
- CRUD periode audit
- Status periode (draft, berjalan, selesai, diarsipkan)
- Aktivasi periode (hanya 1 periode berjalan)
- Penutupan periode
- Archive periode lama

**Tabel**: `periode_audit`

---

### A.4 Periode Audit
**Folder**: `docs/modules/periode-audit/`
**Deskripsi**: Manajemen siklus AMI tahunan
**Fitur**:
- CRUD periode audit
- Status periode (draft, berjalan, selesai, diarsipkan)
- Aktivasi periode (hanya 1 periode berjalan)
- Penutupan periode
- Archive periode lama

**Tabel**: `periode_audit`

---

### A.5 Standar Mutu
**Folder**: `docs/modules/standar-mutu/`
**Deskripsi**: Master standar rujukan audit
**Fitur**:
- CRUD standar mutu
- **Scope: Global atau Specific per LAM**
- Auto-filter standar saat input temuan (berdasarkan unit & LAM-nya)
- Kategori (UPPS, Program Studi, dll)
- Search & filter

**Tabel**: `standar_mutu`

**Contoh Data**:
- Standar Global: "Standar 1.3", "Standar 1.4", "Standar 2.1" → tampil untuk semua unit
- Standar Specific LAMDIK: "Lamdik 1", "Lamdik 2", "Lamdik 39" → hanya tampil untuk prodi dengan LAM=LAMDIK (DPAI, MPAI)
- Standar Specific LAMDIKTI: (TBD) → hanya tampil untuk prodi dengan LAM=LAMDIKTI (MM, MTP)

---

### A.6 Auditor
**Folder**: `docs/modules/auditor/`
**Deskripsi**: Master data auditor internal
**Fitur**:
- CRUD auditor
- Status aktif/nonaktif
- Data kontak (email, HP)
- Gelar akademik
- History penugasan

**Tabel**: `auditor`

---

### A.6 Auditor
**Folder**: `docs/modules/auditor/`
**Deskripsi**: Master data auditor internal
**Fitur**:
- CRUD auditor
- Status aktif/nonaktif
- Data kontak (email, HP)
- Gelar akademik
- History penugasan

**Tabel**: `auditor`

---

### A.7 Kategori & Status
**Folder**: `docs/modules/kategori-status/`
**Deskripsi**: Master kategori temuan dan status RTL
**Fitur**:
- Manage kategori temuan (Mayor, Minor, Observasi)
- Manage status tindak lanjut (Belum, Dalam Proses, Perlu Revisi, Selesai)
- Bobot & warna untuk UI
- Urutan flow status

**Tabel**: `kategori_temuan`, `status_tindak_lanjut`

---

### A.8 Konfigurasi Aplikasi
**Folder**: `docs/modules/konfigurasi/`
**Deskripsi**: Pengaturan sistem
**Fitur**:
- Format nomor PM (temuan & rekomendasi)
- Email reminder settings
- System-wide config
- Key-value store

**Tabel**: `konfigurasi`

---

## B. MODUL TRANSAKSIONAL

### B.1 Sesi Audit
**Folder**: `docs/modules/sesi-audit/`
**Deskripsi**: Persiapan dan pelaksanaan audit per unit
**Fitur**:
- CRUD sesi audit
- Auto-generate nomor sesi (SA/YYYY/XXX)
- Assign auditor ke sesi
- Input auditee per sesi
- Jadwal audit (tanggal, waktu, tempat)
- Status sesi (draft, selesai)

**Tabel**: `sesi_audit`, `sesi_audit_auditor`, `sesi_audit_auditee`

---

### B.2 Temuan (Ketidaksesuaian)
**Folder**: `docs/modules/temuan/`
**Deskripsi**: Input dan kelola temuan audit
**Fitur**:
- CRUD temuan per sesi
- Auto-generate nomor PM (XXX/PM.10/KPMA/YYYY)
- Pilih kategori (Mayor/Minor/Observasi)
- Pilih standar mutu rujukan
- Status mengikuti RTL terbaru
- Search & filter

**Tabel**: `temuan`

---

### B.3 Nilai Positif
**Folder**: `docs/modules/nilai-positif/`
**Deskripsi**: Input dan kelola nilai positif per sesi
**Fitur**:
- CRUD nilai positif per sesi
- Tandai sebagai best practice
- Export nilai positif untuk sharing
- Search & filter

**Tabel**: `nilai_positif`

---

### B.4 Rekomendasi
**Folder**: `docs/modules/rekomendasi/`
**Deskripsi**: Input dan kelola rekomendasi (preventif)
**Fitur**:
- CRUD rekomendasi per sesi
- Auto-generate nomor PM Pencegahan (XXX/PM.10/KPMA/YYYY)
- Pilih standar mutu rujukan
- Status mengikuti RTL terbaru
- Search & filter

**Tabel**: `rekomendasi`

---

### B.5 Tindak Lanjut (RTL)
**Folder**: `docs/modules/tindak-lanjut/`
**Deskripsi**: Kelola tindak lanjut temuan & rekomendasi
**Fitur**:
- View temuan/rekomendasi unit saya
- Update status RTL (polymorphic: temuan OR rekomendasi)
- Input penanggung jawab & target selesai
- Upload bukti fisik (PDF/image/docx)
- Catatan progress
- History RTL (immutable log)
- Filter by status, deadline

**Tabel**: `tindak_lanjut`

---

## C. MODUL SUPPORTING

### C.1 Dashboard
**Folder**: `docs/modules/dashboard/`
**Deskripsi**: Dashboard analitik role-based
**Fitur**:
- Dashboard Admin GPM (overview semua unit)
- Dashboard PIC Unit (unit saya)
- Dashboard Auditor (audit saya)
- Dashboard Pimpinan (executive summary)
- Statistics & charts
- Widgets (temuan mayor terbuka, RTL deadline, dll)

**Tabel**: Views & aggregations

---

### C.2 Notifikasi
**Folder**: `docs/modules/notifikasi/`
**Deskripsi**: In-app notification & email reminder
**Fitur**:
- In-app notification list
- Badge unread count
- Mark as read
- Deep link ke item terkait
- Email reminder (via Supabase Edge Function)
- Scheduled job (pg_cron)

**Tabel**: `notifikasi`

---

### C.3 Laporan & Export
**Folder**: `docs/modules/laporan/`
**Deskripsi**: Generate & export laporan
**Fitur**:
- Generate laporan audit per unit (PDF/DOCX)
- Export rekap keseluruhan (Excel)
- Status RTL per unit (PDF)
- Analisis tren antar periode (Chart export)
- Download history
- Custom report builder

**Tabel**: Generate files to Supabase Storage

---

### C.4 Activity Log
**Folder**: `docs/modules/activity-log/`
**Deskripsi**: Audit trail sistem
**Fitur**:
- Auto-log semua create/update/delete
- View log (filter by user, table, date)
- Export log untuk audit eksternal
- Diff viewer (old vs new value)
- Search log

**Tabel**: `activity_log`

---

### C.5 Import Data
**Folder**: `docs/modules/import-data/`
**Deskripsi**: Import data existing (AMI 2025)
**Fitur**:
- Upload Excel template
- Validate data
- Preview before import
- Bulk insert with transaction
- Error logging
- Download failed records

**Tabel**: All tables (bulk insert)

---

## SUMMARY

**Total Modul**: 17
- **Core & Master Data**: 7 modul
- **Transaksional**: 5 modul
- **Supporting**: 5 modul

**Urutan Pembangunan (Priority)**:
1. A.1 User Management (auth & authorization)
2. A.2 Unit Kerja (master data)
3. A.3 Periode Audit (master data)
4. A.4 Standar Mutu (master data)
5. A.5 Auditor (master data)
6. A.6 Kategori & Status (master data)
7. A.7 Konfigurasi (system settings)
8. B.1 Sesi Audit (transactional core)
9. B.2 Temuan (transactional core)
10. B.3 Nilai Positif (transactional)
11. B.4 Rekomendasi (transactional)
12. B.5 Tindak Lanjut - RTL (transactional core - **PALING PENTING**)
13. C.1 Dashboard (analytics)
14. C.3 Laporan & Export (reporting)
15. C.2 Notifikasi (nice to have)
16. C.4 Activity Log (audit trail)
17. C.5 Import Data (data migration)

---

**Last Updated**: 2026-09-01
