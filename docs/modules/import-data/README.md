# Modul Import AAR (After Action Review)

## Overview
Modul Import AAR untuk import data audit lama (tahun sebelumnya) yang belum masuk sistem, dari dokumen PDF/Word laporan AMI menjadi record database.

---

## Fitur

### 1. Parse Dokumen AAR
- Upload PDF/Word laporan AMI tahun sebelumnya
- Extract data menggunakan Tesseract OCR + AI:
  - **Tesseract OCR**: Extract text dari scanned PDF/images
  - **GPT-4 (optional)**: Structure text ke JSON format
  - **Regex parser (free alternative)**: Parse tanpa GPT-4
- Extract:
  - Nama unit/prodi
  - Temuan (nomor, kategori, deskripsi, standar)
  - Rekomendasi
  - Nilai positif
- Preview extracted data sebelum import

### 2. Import ke Database
- Create temuan historis dengan flag `is_imported=true`
- Link ke periode tahun sebelumnya
- Status RTL otomatis `VERIFIED` (sudah selesai)
- Attach original PDF as evidence

### 3. Use Case
- Migrasi data AMI 2024, 2023, dst
- Record keeping untuk audit trail
- Laporan komprehensif multi-tahun

---

## Business Rules

1. Imported data bersifat read-only (tidak bisa diedit)
2. Tidak ada workflow RTL (langsung status VERIFIED)
3. Hanya Admin GPM yang bisa import
4. Original PDF disimpan sebagai evidence

---

**Version**: 1.0
**Last Updated**: 2026-09-01
