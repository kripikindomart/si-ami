# Workflow - Modul Unit Kerja

## Overview
Workflow untuk mengelola master data unit kerja yang mencakup program studi, laboratorium, dan unit struktural.

---

## 1. WORKFLOW CREATE UNIT KERJA

### 1.1 Create Prodi (dengan LAM)

```
[Admin GPM Login]
    ↓
Menu Master Data → Unit Kerja
    ↓
Klik "Tambah Unit Kerja"
    ↓
┌─────────────────────────────────┐
│ FORM TAMBAH UNIT KERJA          │
├─────────────────────────────────┤
│ Kode: [DPAI________]            │
│ (Uppercase, contoh: DPAI, MM)   │
│                                 │
│ Nama: [Program Studi Doktor___]│
│ [Pendidikan Agama Islam]        │
│                                 │
│ Jenis: [Prodi ▼]                │
│   ● Prodi                       │
│   ○ Lab                         │
│   ○ Direktur                    │
│   ○ Wakil                       │
│   ○ Unit Lain                   │
│                                 │
│ ┌───────────────────────────┐   │
│ │ LAM: (Wajib untuk Prodi)  │   │
│ │ [LAMDIK ▼]                │   │
│ │   ○ LAMDIK                │   │
│ │   ○ LAMDIKTI              │   │
│ │   ○ LAMDIKES              │   │
│ └───────────────────────────┘   │
│                                 │
│ Parent Unit: [Opsional ▼]       │
│                                 │
│ Deskripsi: [________________]   │
│ [Program S3 PAI]                │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
User submit form
    ↓
Validasi:
├─ Kode: required, unique, uppercase
├─ Nama: required, min 5 char
├─ Jenis: required
├─ LAM: required jika jenis=prodi
└─ LAM: must be null jika jenis!=prodi
    ↓
Jika Valid:
    ├─ INSERT ke unit_kerja
    ├─ Status default = 'aktif'
    └─ Redirect ke list
    ↓
Toast Success: "Unit Kerja [Kode] berhasil ditambahkan"
```

**Business Rules**:
- Kode auto-uppercase
- Prodi WAJIB pilih LAM
- Non-prodi TIDAK boleh punya LAM
- Status default: aktif

---

### 1.2 Create Non-Prodi (tanpa LAM)

```
[Admin GPM di Form]
    ↓
Pilih Jenis: Lab/Direktur/Wakil/Unit Lain
    ↓
Field LAM hidden/disabled (auto null)
    ↓
Simpan
    ↓
INSERT unit_kerja dengan lam_id = NULL
```

---

## 2. WORKFLOW VIEW LIST UNIT KERJA

```
[User Login]
    ↓
Menu Master Data → Unit Kerja
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ MASTER DATA UNIT KERJA                       [+ Tambah Unit]     │
├──────────────────────────────────────────────────────────────────┤
│ Filter:                                                          │
│ [Jenis: Semua ▼] [LAM: Semua ▼] [Status: Semua ▼] [Search: __] │
├──────────────────────────────────────────────────────────────────┤
│ Kode  │ Nama                  │ Jenis│ LAM     │ PIC │ Status│  │
├───────┼───────────────────────┼──────┼─────────┼─────┼───────┤  │
│ DPAI  │ Prodi Doktor PAI      │ Prodi│ LAMDIK  │  2  │ Aktif │  │
├───────┼───────────────────────┼──────┼─────────┼─────┼───────┤  │
│ MM    │ Prodi Magister Manaj. │ Prodi│ LAMDIKTI│  1  │ Aktif │  │
├───────┼───────────────────────┼──────┼─────────┼─────┼───────┤  │
│LAB-SPS│ Laboratorium SPs      │ Lab  │    -    │  0  │ Aktif │  │
└──────────────────────────────────────────────────────────────────┘
```

**Features**:
- Filter by jenis (dropdown)
- Filter by LAM (dropdown, hanya prodi)
- Filter by status
- Search by kode/nama
- Show PIC count
- Sortable columns

---

## 3. WORKFLOW EDIT UNIT KERJA

```
[Admin GPM di List]
    ↓
Klik "Edit" pada row unit
    ↓
┌─────────────────────────────────┐
│ EDIT UNIT KERJA: DPAI           │
├─────────────────────────────────┤
│ Kode: [DPAI]                    │
│ (Read-only, tidak bisa diubah)  │
│                                 │
│ Nama: [Program Studi Doktor___]│
│ [Pendidikan Agama Islam]        │
│                                 │
│ Jenis: [Prodi ▼]                │
│ (Bisa diubah, tapi LAM adjust)  │
│                                 │
│ LAM: [LAMDIK ▼]                 │
│ (Show jika jenis=prodi)         │
│                                 │
│ Status: [Aktif ▼]               │
│                                 │
│ [Batal]  [Update]               │
└─────────────────────────────────┘
    ↓
Update fields
    ↓
Jika jenis diubah dari prodi → non-prodi:
    └─ Set lam_id = NULL
    ↓
Jika jenis diubah dari non-prodi → prodi:
    └─ LAM wajib dipilih
    ↓
UPDATE unit_kerja
    ↓
Toast Success: "Unit Kerja berhasil diupdate"
```

**Business Rules**:
- Kode TIDAK BISA diubah (immutable)
- Jenis bisa diubah (dengan validasi LAM)
- LAM adjustment otomatis based on jenis

---

## 4. WORKFLOW TOGGLE STATUS

```
[Admin GPM di List]
    ↓
Klik "Toggle Status"
    ↓
Dialog Konfirmasi:
┌──────────────────────────────────────┐
│ Nonaktifkan Unit Kerja?              │
├──────────────────────────────────────┤
│ Unit: DPAI                           │
│ Nama: Prodi Doktor PAI               │
│                                      │
│ Unit ini digunakan di:               │
│ - 3 Sesi Audit (2024, 2025, 2026)   │
│ - 8 Temuan                           │
│ - 2 PIC User                         │
│                                      │
│ Unit nonaktif tidak bisa dipilih     │
│ untuk audit baru, tapi data existing │
│ tetap bisa diakses.                  │
│                                      │
│     [Batal]  [Ya, Nonaktifkan]       │
└──────────────────────────────────────┘
    ↓
UPDATE unit_kerja SET status='nonaktif'
    ↓
Toast Success: "Unit Kerja berhasil dinonaktifkan"
```

---

## 5. WORKFLOW ASSIGN PIC

(Dilakukan di modul User Management, tapi unit sebagai target)

```
[Admin GPM di User Management]
    ↓
Edit User dengan role=pic_unit
    ↓
Klik "Kelola Unit"
    ↓
┌─────────────────────────────────┐
│ ASSIGN UNIT KERJA               │
│ User: Budi (PIC Unit)           │
├─────────────────────────────────┤
│ ☑ DPAI - Prodi Doktor PAI       │
│ ☐ MPAI - Prodi Magister PAI     │
│ ☑ MM - Prodi Magister Manajemen │
│ ☐ LAB-SPS - Laboratorium        │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
INSERT/UPDATE user_unit
```

---

## 6. INTEGRATION POINTS

### 6.1 Dropdown Unit di Sesi Audit

```
[Auditor Create Sesi Audit]
    ↓
Form Sesi Audit
    ↓
Field "Unit yang Diaudit": [Dropdown]
    ↓
Query: SELECT * FROM unit_kerja WHERE status='aktif' ORDER BY kode
    ↓
Tampilkan dropdown unit aktif
    ↓
User pilih unit
    ↓
Save sesi_audit dengan unit_kerja_id
```

### 6.2 Filter Standar by Unit LAM

```
[Auditor Input Temuan]
    ↓
Pilih Unit yang diaudit (dari sesi_audit)
    ↓
Get unit.lam_id
    ↓
Filter Standar:
    SELECT * FROM standar_mutu
    WHERE scope='global' 
       OR (scope='specific' AND lam_id = unit.lam_id)
    ↓
Tampilkan dropdown standar yang sudah di-filter
```

---

## 7. STATE DIAGRAM

```
┌────────────────┐
│ UNIT NOT EXIST │
└───────┬────────┘
        │ Admin GPM Create
        ↓
┌────────────────┐
│  UNIT AKTIF    │ ← Bisa dipilih untuk audit baru
└───────┬────────┘
        │
        ├───→ Edit (nama/lam/jenis) ───→ Tetap AKTIF
        │
        ├───→ Toggle Status ───→ ┌──────────────────┐
        │                        │  UNIT NONAKTIF   │ ← Tidak bisa untuk audit baru
        │                        └────────┬─────────┘
        │                                 │
        │                                 │ Toggle Status kembali
        └←────────────────────────────────┘
```

---

## 8. AUDIT TRAIL

```sql
-- Unit created
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'create', 'unit_kerja', [new_id], 
  jsonb_build_object('new', to_jsonb(NEW)));

-- Unit updated
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'update', 'unit_kerja', [id],
  jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
