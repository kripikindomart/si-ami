# Workflow - Modul Periode Audit

## 1. CREATE PERIODE AUDIT

```
[Admin GPM]
    ↓
Menu Master Data → Periode Audit → Tambah
    ↓
Form:
├─ Nama: [AMI 2026___]
├─ Tahun: [2026]
├─ Tanggal Mulai: [2026-01-15]
├─ Tanggal Selesai: [2026-06-30]
└─ Deskripsi: [____]
    ↓
Validasi:
├─ Nama required
├─ Tanggal selesai > tanggal mulai
└─ Tahun 2020-2100
    ↓
INSERT periode_audit (status='draft')
    ↓
Toast: "Periode AMI 2026 berhasil dibuat"
```

---

## 2. SET PERIODE AKTIF

```
[Admin GPM di List Periode]
    ↓
Klik "Aktifkan" pada periode draft
    ↓
Dialog Konfirmasi:
"Aktifkan periode AMI 2026?
Periode aktif saat ini (AMI 2025) akan
otomatis dinonaktifkan."
    ↓
Call: set_periode_aktif(periode_id)
    ↓
UPDATE all periode: status='draft' WHERE status='aktif'
UPDATE target periode: status='aktif'
    ↓
Toast: "Periode AMI 2026 sekarang aktif"
```

**Business Rule**: Hanya 1 periode aktif bersamaan

---

## 3. CLOSE PERIODE

```
[Admin GPM]
    ↓
Klik "Close Periode" pada periode aktif
    ↓
Validasi:
├─ Check: Apakah semua RTL completed?
└─ If NO: Show warning, tapi tetap boleh close
    ↓
Dialog Konfirmasi:
"Close periode AMI 2025?
Progress:
- 10/10 unit selesai diaudit
- 45/50 RTL completed (90%)

Periode yang di-close tidak bisa
diubah lagi."
    ↓
Call: close_periode(periode_id)
    ↓
UPDATE periode: status='selesai'
    ↓
Toast: "Periode AMI 2025 berhasil di-close"
```

---

## 4. EDIT PERIODE

```
[Admin GPM]
    ↓
Klik "Edit" pada periode
    ↓
Check status:
├─ draft/aktif: Boleh edit
└─ selesai: TIDAK BOLEH (read-only)
    ↓
Form Edit:
├─ Nama (editable)
├─ Tahun (editable jika draft)
├─ Tanggal mulai (editable)
├─ Tanggal selesai (editable)
└─ Deskripsi (editable)
    ↓
UPDATE periode_audit
    ↓
Toast: "Periode berhasil diupdate"
```

---

## 5. VIEW PROGRESS PERIODE

```
[User Login]
    ↓
Dashboard → Select Periode: [AMI 2025 ▼]
    ↓
Query: SELECT * FROM v_periode_audit_progress WHERE id=periode_id
    ↓
Tampilkan:
├─ Progress audit: 8/10 unit (80%)
├─ Total temuan: 42
├─ Total rekomendasi: 35
├─ RTL completed: 30/35 (85.7%)
└─ Timeline: 2025-01-20 s/d 2025-06-30
```

---

## 6. STATE DIAGRAM

```
┌────────┐
│ DRAFT  │ ← Created
└───┬────┘
    │ Aktifkan
    ↓
┌────────┐
│ AKTIF  │ ← Only 1 periode aktif
└───┬────┘
    │ Close
    ↓
┌─────────┐
│ SELESAI │ ← Immutable
└─────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
