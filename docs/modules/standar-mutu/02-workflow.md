# Workflow - Modul Standar Mutu

## 1. CREATE STANDAR GLOBAL

```
[Admin GPM]
    ↓
Tambah Standar → Pilih Scope: Global
    ↓
Form:
├─ Kode: [Standar 1.1]
├─ Nama: [Visi, Misi, Tujuan]
├─ Scope: ● Global ○ Specific
├─ LAM: [Hidden/Disabled]
├─ Nomor Urut: [1]
└─ Deskripsi: [___]
    ↓
Validasi:
├─ scope=global → lam_id HARUS null
└─ Kode required
    ↓
INSERT standar_mutu (lam_id=null)
    ↓
Toast: "Standar berhasil ditambahkan"
```

---

## 2. CREATE STANDAR SPECIFIC (per LAM)

```
[Admin GPM]
    ↓
Tambah Standar → Pilih Scope: Specific
    ↓
Form:
├─ Kode: [Lamdik 5]
├─ Nama: [Standar Isi Pembelajaran]
├─ Scope: ○ Global ● Specific
├─ LAM: [LAMDIK ▼] ← Muncul & wajib diisi
├─ Nomor Urut: [5]
└─ Deskripsi: [___]
    ↓
Validasi:
├─ scope=specific → lam_id WAJIB diisi
└─ Kombinasi kode+lam_id unique
    ↓
INSERT standar_mutu (lam_id=selected)
    ↓
Toast: "Standar LAMDIK berhasil ditambahkan"
```

---

## 3. FILTER STANDAR BY UNIT (untuk Input Temuan)

```
[Auditor Input Temuan]
    ↓
Pilih Unit yang diaudit: DPAI (LAM=LAMDIK)
    ↓
Get unit.lam_id
    ↓
Query standar:
SELECT * FROM standar_mutu
WHERE status='aktif'
  AND (scope='global' OR (scope='specific' AND lam_id=unit.lam_id))
ORDER BY nomor_urut
    ↓
Tampilkan dropdown standar:
├─ Standar 1.1 (global)
├─ Standar 5.1 (global)
├─ Lamdik 1 (LAMDIK specific)
├─ Lamdik 5 (LAMDIK specific)
└─ Lamdik 39 (LAMDIK specific)
    ↓
User multi-select: "Standar 5.1" + "Lamdik 39"
    ↓
Insert ke temuan_standar (2 records)
```

---

## 4. EDIT STANDAR

```
[Admin GPM]
    ↓
Edit Standar
    ↓
Form:
├─ Kode: [Editable]
├─ Nama: [Editable]
├─ Scope: [Editable - adjustment LAM jika diubah]
├─ LAM: [Show/hide based on scope]
└─ Nomor Urut: [Editable]
    ↓
Jika scope diubah global→specific:
    └─ LAM wajib dipilih
    ↓
Jika scope diubah specific→global:
    └─ LAM auto null
    ↓
UPDATE standar_mutu
```

---

## 5. TOGGLE STATUS STANDAR

```
[Admin GPM]
    ↓
Toggle Status Standar
    ↓
Check: Apakah standar digunakan di temuan/rekomendasi?
├─ YES: Show warning, tapi tetap boleh nonaktifkan
└─ NO: Langsung nonaktifkan
    ↓
UPDATE status='nonaktif'
    ↓
Toast: "Standar berhasil dinonaktifkan"
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
