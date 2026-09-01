# Modul Rekomendasi

## Overview
Modul Rekomendasi mengelola saran perbaikan dari auditor untuk setiap temuan yang ditemukan.

---

## Fitur

### 1. Input Rekomendasi
- Nomor otomatis: XXX/PM.10/KPMA/YYYY
- Relasi ke temuan
- Multiple standar mutu rujukan (many-to-many)
- Deskripsi rekomendasi
- Evidence (optional)

### 2. Business Rules
- 1 temuan → N rekomendasi
- Rekomendasi harus punya minimal 1 standar (bisa sama atau beda dengan temuan)
- Nomor format sama dengan temuan

---

**Version**: 1.0
**Last Updated**: 2026-09-01
