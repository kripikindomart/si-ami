# Workflow - Modul LAM

## Overview
Workflow untuk mengelola master data LAM (Lembaga Akreditasi Mandiri) yang digunakan untuk kategorisasi standar mutu per program studi.

---

## 1. WORKFLOW CRUD LAM

### 1.1 Create LAM Baru

```
[Admin GPM Login]
    ↓
Menu Master Data → LAM
    ↓
Klik "Tambah LAM"
    ↓
┌─────────────────────────────────┐
│ FORM CREATE LAM                 │
├─────────────────────────────────┤
│ Kode LAM: [______]              │
│ (Auto uppercase, contoh: LAMDIK)│
│                                 │
│ Nama LAM: [___________________] │
│ (Contoh: LAM Pendidikan Tinggi  │
│  Keagamaan Islam)               │
│                                 │
│ Deskripsi: [__________________] │
│ [____________________________]  │
│ (Opsional, penjelasan LAM)      │
│                                 │
│ [Batal]  [Simpan]               │
└─────────────────────────────────┘
    ↓
Klik "Simpan"
    ↓
Validasi:
├─ Kode tidak boleh kosong
├─ Kode harus unique (belum ada di database)
├─ Kode auto convert ke UPPERCASE
├─ Nama tidak boleh kosong
└─ Deskripsi opsional
    ↓
Jika Valid:
    ├─ INSERT ke tabel lam
    ├─ Status default = 'aktif'
    ├─ Timestamp created_at = NOW()
    ├─ Timestamp updated_at = NOW()
    └─ Redirect ke list LAM
    ↓
Toast Success: "LAM [Kode] berhasil ditambahkan"
    ↓
[Selesai]

Jika Invalid:
    ├─ Tampilkan error message
    ├─ Highlight field yang error
    └─ Form tetap terbuka dengan data
```

**Business Rules**:
- Kode wajib unique
- Kode otomatis UPPERCASE
- Status default aktif
- Tidak ada approval workflow (langsung masuk)

---

### 1.2 View List LAM

```
[User Login: Admin GPM / Auditor / PIC / Pimpinan]
    ↓
Menu Master Data → LAM
    ↓
┌──────────────────────────────────────────────────────────────┐
│ MASTER DATA LAM                                [+ Tambah LAM] │
├──────────────────────────────────────────────────────────────┤
│ Filter: [Status: Semua ▼] [Search: _________] [🔍 Cari]      │
├──────────────────────────────────────────────────────────────┤
│ Kode    │ Nama LAM                        │ Status │ Aksi    │
├─────────┼─────────────────────────────────┼────────┼─────────┤
│ LAMDIK  │ LAM Pendidikan Tinggi Keagamaan │ Aktif  │ [Edit]  │
│         │ Islam                           │        │ [Toggle]│
├─────────┼─────────────────────────────────┼────────┼─────────┤
│ LAMDIKTI│ LAM Pendidikan Tinggi          │ Aktif  │ [Edit]  │
│         │                                 │        │ [Toggle]│
├─────────┼─────────────────────────────────┼────────┼─────────┤
│ LAMDIKES│ LAM Pendidikan Tinggi Kesehatan│ Aktif  │ [Edit]  │
│         │                                 │        │ [Toggle]│
├─────────┼─────────────────────────────────┼────────┼─────────┤
│ GLOBAL  │ Standar Global                 │ Aktif  │ [Edit]  │
│         │                                 │        │ [Toggle]│
└──────────────────────────────────────────────────────────────┘
│ Showing 4 entries                          [1] [2] [Next >]  │
└──────────────────────────────────────────────────────────────┘
```

**Features**:
- Table dengan sorting (klik header kolom)
- Filter by status (Aktif / Nonaktif / Semua)
- Search by kode atau nama (real-time)
- Pagination (default 10 per page)
- Action buttons: Edit, Toggle Status

**Permission**:
- Admin GPM: Full access (view, create, edit, toggle)
- Others: Read-only (view saja, no buttons)

---

### 1.3 Edit LAM

```
[Admin GPM di List LAM]
    ↓
Klik "Edit" pada row LAM
    ↓
┌─────────────────────────────────┐
│ FORM EDIT LAM                   │
├─────────────────────────────────┤
│ Kode LAM: [LAMDIK]              │
│ (Read-only, tidak bisa diubah)  │
│                                 │
│ Nama LAM: [LAM Pendidikan Ting-]│
│ [gi Keagamaan Islam]            │
│                                 │
│ Deskripsi: [LAM untuk perguruan]│
│ [tinggi keislaman]              │
│                                 │
│ [Batal]  [Update]               │
└─────────────────────────────────┘
    ↓
Update field yang mau diubah
    ↓
Klik "Update"
    ↓
Validasi:
├─ Nama tidak boleh kosong
└─ Deskripsi opsional
    ↓
Jika Valid:
    ├─ UPDATE tabel lam
    ├─ updated_at = NOW()
    └─ Redirect ke list LAM
    ↓
Toast Success: "LAM [Kode] berhasil diupdate"
    ↓
[Selesai]
```

**Business Rules**:
- Kode LAM TIDAK BISA diubah (read-only)
- Hanya nama dan deskripsi yang bisa diupdate
- Tidak perlu approval

---

### 1.4 Toggle Status LAM

```
[Admin GPM di List LAM]
    ↓
Klik "Toggle Status" pada row LAM
    ↓
Dialog Konfirmasi:
┌──────────────────────────────────────┐
│ Nonaktifkan LAM LAMDIK?              │
├──────────────────────────────────────┤
│ LAM ini digunakan oleh:              │
│ - 2 Prodi (DPAI, MPAI)               │
│ - 12 Standar Mutu (Lamdik 1-12)      │
│                                      │
│ LAM akan nonaktif tapi prodi dan     │
│ standar tetap memiliki referensi.    │
│                                      │
│ Yakin nonaktifkan?                   │
│                                      │
│     [Batal]  [Ya, Nonaktifkan]       │
└──────────────────────────────────────┘
    ↓
Klik "Ya, Nonaktifkan"
    ↓
UPDATE lam SET status = 'nonaktif' WHERE id = [id]
    ↓
Toast Success: "LAM LAMDIK berhasil dinonaktifkan"
    ↓
List LAM refresh
    ↓
[Selesai]

ATAU

Dialog Konfirmasi (untuk Aktifkan kembali):
┌──────────────────────────────────────┐
│ Aktifkan LAM LAMDIK?                 │
├──────────────────────────────────────┤
│ LAM akan aktif kembali dan bisa      │
│ digunakan untuk prodi baru.          │
│                                      │
│     [Batal]  [Ya, Aktifkan]          │
└──────────────────────────────────────┘
```

**Business Rules**:
- Nonaktif: LAM tidak bisa dipilih untuk prodi/standar BARU
- Nonaktif: Prodi/standar yang sudah assign tetap punya referensi (tidak berubah)
- Aktif: LAM bisa dipilih kembali
- Tidak bisa DELETE LAM (hanya toggle status)

---

## 2. WORKFLOW ASSIGNMENT LAM KE PRODI

(Ini dilakukan di Modul Unit Kerja, tapi LAM harus sudah ada)

```
[Admin GPM Create/Edit Prodi]
    ↓
Isi form Unit Kerja:
    ├─ Kode: DPAI
    ├─ Nama: Program Studi Doktor Pendidikan Agama Islam
    ├─ Jenis: Prodi
    └─ LAM: [Dropdown - pilih LAM]
        ↓
┌──────────────────────────────────┐
│ Pilih LAM untuk Prodi:           │
├──────────────────────────────────┤
│ ○ LAMDIK                         │
│   LAM Pendidikan Tinggi Keagamaan│
│   Islam                          │
│                                  │
│ ○ LAMDIKTI                       │
│   LAM Pendidikan Tinggi         │
│                                  │
│ ○ LAMDIKES                       │
│   LAM Pendidikan Tinggi Kesehatan│
│                                  │
│ (GLOBAL tidak ditampilkan        │
│  karena bukan untuk assignment)  │
└──────────────────────────────────┘
    ↓
Pilih LAMDIK
    ↓
Simpan Prodi
    ↓
unit_kerja.lam_id = [id LAMDIK]
```

**Business Rules**:
- LAM hanya untuk prodi (jenis='prodi')
- LAM wajib dipilih untuk prodi
- Unit non-prodi (Direktur, Lab, dll) tidak perlu LAM

---

## 3. STATE DIAGRAM

```
┌────────────────┐
│ LAM TIDAK ADA  │
└───────┬────────┘
        │ Admin GPM Create
        ↓
┌────────────────┐
│   LAM AKTIF    │ ← State default setelah create
└───────┬────────┘
        │
        ├───→ Edit (update nama/deskripsi) ───→ Tetap AKTIF
        │
        ├───→ Toggle Status ───→ ┌──────────────────┐
        │                        │  LAM NONAKTIF    │
        │                        └────────┬─────────┘
        │                                 │
        │                                 │ Toggle Status kembali
        └←────────────────────────────────┘
```

**Notes**:
- LAM tidak pernah dihapus (no DELETE)
- Hanya ada 2 state: Aktif dan Nonaktif
- Nonaktif = archived, tetap bisa diquery untuk historical data

---

## 4. DECISION TREE: Boleh Nonaktifkan LAM?

```
LAM mau dinonaktifkan?
    ↓
Cek: Apakah LAM digunakan oleh prodi?
    │
    ├─ YA → Tampilkan warning:
    │       "LAM ini digunakan oleh X prodi"
    │       ↓
    │       Boleh nonaktifkan?
    │       ├─ YA → Nonaktifkan (prodi tetap punya referensi)
    │       └─ TIDAK → Batal
    │
    └─ TIDAK → Cek: Apakah LAM digunakan oleh standar?
            │
            ├─ YA → Tampilkan warning:
            │       "LAM ini digunakan oleh X standar"
            │       ↓
            │       Boleh nonaktifkan?
            │       ├─ YA → Nonaktifkan (standar tetap punya referensi)
            │       └─ TIDAK → Batal
            │
            └─ TIDAK → Langsung nonaktifkan (aman, tidak digunakan)
```

**Catatan Penting**:
- Nonaktifkan LAM TIDAK mengubah assignment di prodi/standar existing
- Hanya mencegah LAM dipilih untuk prodi/standar BARU
- Untuk data integrity & historical tracking

---

## 5. INTEGRATION POINTS

### 5.1 Dengan Modul Unit Kerja
```
Unit Kerja (Prodi) Create/Edit
    ↓
Butuh list LAM aktif untuk dropdown
    ↓
Query: SELECT * FROM lam WHERE status='aktif' AND kode != 'GLOBAL'
    ↓
Tampilkan di dropdown "Pilih LAM"
```

### 5.2 Dengan Modul Standar Mutu
```
Standar Mutu Create/Edit (scope=specific)
    ↓
Butuh list LAM aktif untuk dropdown
    ↓
Query: SELECT * FROM lam WHERE status='aktif'
    ↓
Tampilkan di dropdown "Pilih LAM"
```

### 5.3 Dengan Modul Temuan (Filter Standar)
```
Input Temuan - Pilih Standar Rujukan
    ↓
Ambil unit yang diaudit → unit.lam_id
    ↓
Filter standar:
    - scope = 'global' (semua standar global)
    - OR lam_id = unit.lam_id (standar specific untuk LAM unit)
    ↓
Tampilkan dropdown standar yang sudah di-filter
```

---

## 6. ERROR HANDLING

### Error: Kode Duplicate
```
User input kode "LAMDIK" yang sudah ada
    ↓
Validasi gagal: Kode sudah digunakan
    ↓
Tampilkan error message:
"Kode LAM 'LAMDIK' sudah digunakan. Gunakan kode lain."
    ↓
Form tetap terbuka, user bisa edit
```

### Error: Nama Kosong
```
User submit form dengan nama kosong
    ↓
Validasi gagal: Nama wajib diisi
    ↓
Tampilkan error message:
"Nama LAM wajib diisi"
    ↓
Highlight field "Nama" dengan border merah
```

### Error: Network/Database
```
Request gagal (500, timeout, connection error)
    ↓
Tampilkan error toast:
"Terjadi kesalahan. Silakan coba lagi."
    ↓
Form tetap terbuka, data tidak hilang
    ↓
User bisa retry
```

---

## 7. PERFORMANCE CONSIDERATIONS

### Caching
- List LAM aktif bisa di-cache (jarang berubah)
- Cache invalidation saat ada create/update/toggle

### Query Optimization
- Index pada `status` untuk filter cepat
- Index pada `kode` untuk search cepat

### Pagination
- Default 10 items per page
- Adjustable (10, 25, 50, 100)

---

## 8. AUDIT TRAIL

Semua operasi LAM di-log ke `activity_log`:

```sql
-- Create LAM
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'create', 'lam', [new_id], jsonb_build_object('new', to_jsonb(NEW)));

-- Update LAM
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'update', 'lam', [id], jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));

-- Toggle Status
INSERT INTO activity_log (user_id, aksi, tabel, record_id, perubahan)
VALUES (auth.uid(), 'update', 'lam', [id], jsonb_build_object('old', {'status': 'aktif'}, 'new', {'status': 'nonaktif'}));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
