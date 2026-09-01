# Modul Standar Mutu

## Overview
Modul Standar Mutu mengelola master data standar/kriteria yang digunakan sebagai acuan audit. Standar mutu dapat bersifat global (berlaku untuk semua prodi) atau spesifik per LAM.

---

## Deskripsi
Standar Mutu adalah kriteria/butir audit yang menjadi rujukan penilaian dalam proses AMI. Setiap standar memiliki:
- Kode standar (contoh: "Standar 1.1", "Lamdik 5")
- Nama/deskripsi standar
- Scope (global atau specific per LAM)
- Status aktif/nonaktif

---

## Fitur Utama

### 1. Master Data Standar Mutu
- CRUD standar mutu
- Scope management (global vs specific LAM)
- Kategorisasi standar per LAM
- Import standar bulk (optional)

### 2. Scope Management
- **Global**: Standar berlaku untuk semua prodi (lam_id=null)
- **Specific**: Standar berlaku hanya untuk prodi dengan LAM tertentu

### 3. Integration dengan LAM
- Filter standar by unit LAM
- Multi-select standar untuk temuan/rekomendasi
- Auto-filter standar based on unit yang diaudit

---

## Data Structure

### Fields
- **Kode**: Kode standar (contoh: "Standar 1.1", "Lamdik 5")
- **Nama**: Nama/deskripsi standar lengkap
- **Scope**: global / specific
- **LAM**: Reference ke LAM (wajib jika scope=specific)
- **Nomor Urut**: Untuk sorting
- **Status**: Aktif/Nonaktif

---

## Business Rules

1. **Scope Validation**:
   - scope=global → lam_id HARUS null
   - scope=specific → lam_id WAJIB diisi

2. **Filter by Unit**:
   - Unit dengan LAM tertentu → dapat standar global + standar specific LAM tersebut
   - Contoh: Unit DPAI (LAM=LAMDIK) → dapat standar global + standar LAMDIK

3. **Multiple Standar per Temuan**: 1 temuan bisa punya banyak standar rujukan

4. **Kode Format**: Bebas, tapi konsisten per LAM (contoh: "Lamdik 1", "Lamdik 2")

---

## User Stories

### Admin GPM
- Tambah standar mutu baru (global atau per LAM)
- Edit standar mutu
- Nonaktifkan standar yang sudah tidak dipakai
- Import standar dari file Excel

### Auditor
- Lihat daftar standar (read-only)
- Pilih standar rujukan saat input temuan/rekomendasi
- Filter standar by unit yang sedang diaudit

### PIC Unit
- Lihat standar yang berlaku untuk unit mereka

### Pimpinan
- View standar mutu per LAM
- Laporan temuan per standar

---

## Integration Points

### Input dari Modul Lain
- **LAM**: Dropdown LAM untuk scope=specific

### Output ke Modul Lain
- **Temuan**: Multi-select standar rujukan (via temuan_standar)
- **Rekomendasi**: Multi-select standar rujukan (via rekomendasi_standar)
- **Laporan**: Grouping temuan per standar

---

## Example Data (Real dari AMI 2025)

```
Standar Global:
- Standar 1.1: Visi, Misi, Tujuan
- Standar 1.2: Tata Pamong
- Standar 1.3: Kepemimpinan
(berlaku untuk semua prodi)

Standar LAMDIK (specific):
- Lamdik 1: Standar Kompetensi Lulusan
- Lamdik 5: Kurikulum
- Lamdik 39: Penelitian
(hanya untuk prodi dengan LAM=LAMDIK)

Standar LAMDIKTI (specific):
- Standard 1: Vision and Mission
- Standard 5: Curriculum
(hanya untuk prodi dengan LAM=LAMDIKTI)

Contoh usage:
Temuan #151 di DPAI (LAM=LAMDIK):
- Standar rujukan: "Standar 5.1" (global) + "Lamdik 39" (specific)
```

---

## Related Documents
- Schema: `01-schema.md`
- Workflow: `02-workflow.md`
- Wireframe: `03-wireframe.md`
- Issues: `04-issues.md`
- API Endpoints: `05-api-endpoints.md`

---

**Version**: 1.0  
**Last Updated**: 2026-09-01
