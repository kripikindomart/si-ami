# Modul Temuan

## Overview
Modul Temuan mengelola hasil audit berupa ketidaksesuaian/temuan yang ditemukan auditor saat sesi audit.

---

## Fitur

### 1. Input Temuan
- Nomor otomatis: 151/PM.10/KPMA/2025
- Relasi sesi audit
- Multiple standar mutu rujukan (many-to-many)
- Kategori temuan (MAJOR/MINOR/OFI)
- Deskripsi masalah + lokasi
- Evidence (file upload multiple)

### 2. Status RTL
- Tracking tindak lanjut
- Status: DRAFT → SUBMITTED → ON_PROGRESS → COMPLETED → VERIFIED
- Deadline RTL auto-calculate (config: rtl_deadline_days)

### 3. Evidence Management
- Multiple file upload (foto/dokumen)
- Stored in Supabase Storage
- Preview & download

---

## Business Rules

1. Temuan harus punya minimal 1 standar rujukan (real case: DPAI Temuan #151 ada 2 standar)
2. Kategori wajib (MAJOR/MINOR/OFI)
3. Status RTL default: DRAFT
4. Deadline RTL = tanggal_temuan + config.rtl_deadline_days
5. Auto-filter standar by unit LAM (global + specific)

---

**Version**: 1.0
**Last Updated**: 2026-09-01
