# Modul Unit Kerja

## Overview
Modul Unit Kerja mengelola master data unit organisasi yang akan diaudit dalam sistem AMI. Unit kerja mencakup program studi (prodi), laboratorium, dan unit struktural lainnya.

---

## Deskripsi
Unit Kerja adalah entitas yang menjadi objek audit dalam proses AMI. Setiap unit kerja memiliki karakteristik berbeda tergantung jenisnya:

- **Prodi**: Memiliki LAM untuk kategorisasi standar mutu
- **Laboratorium**: Unit penunjang akademik
- **Unit Struktural**: Direktur, Wakil Direktur, dll

---

## Fitur Utama

### 1. Master Data Unit Kerja
- CRUD unit kerja (Create, Read, Update, Deactivate)
- Multi jenis unit: Prodi, Lab, Direktur, dll
- Assignment LAM untuk prodi
- Hirarki unit (parent-child) - optional
- Status aktif/nonaktif

### 2. Assignment LAM
- Prodi wajib punya LAM
- Dropdown LAM aktif (exclude GLOBAL)
- Filter standar mutu by LAM unit

### 3. Integration dengan Modul Lain
- **Sesi Audit**: Unit sebagai target audit
- **Standar Mutu**: Filter standar by LAM unit
- **Temuan**: Unit yang diaudit
- **User Management**: PIC Unit assignment

---

## Data Structure

### Fields
- **Kode**: Kode unik unit (contoh: DPAI, MM, LAB-SPS)
- **Nama**: Nama lengkap unit
- **Jenis**: Tipe unit (prodi/lab/direktur/wakil/unit_lain)
- **LAM**: Reference ke LAM (wajib untuk prodi)
- **Parent Unit**: Optional, untuk hirarki
- **PIC**: Daftar user yang assigned sebagai PIC unit
- **Status**: Aktif/Nonaktif

---

## Business Rules

1. **Kode Unit Unique**: Tidak boleh ada 2 unit dengan kode sama
2. **LAM Required untuk Prodi**: Jenis=prodi wajib punya lam_id
3. **LAM Optional untuk Non-Prodi**: Lab/Direktur/dll tidak butuh LAM
4. **Multiple PIC**: 1 unit bisa punya multiple PIC
5. **Deactivate Unit**: Unit nonaktif tidak bisa dipilih untuk audit baru
6. **Existing Data Preserved**: Unit nonaktif tetap bisa dilihat di audit lama

---

## User Stories

### Admin GPM
- Tambah unit kerja baru (prodi/lab/dll)
- Edit data unit kerja
- Assign LAM ke prodi
- Nonaktifkan unit yang sudah tidak aktif
- Lihat daftar PIC per unit

### Auditor
- Lihat daftar unit kerja (read-only)
- Pilih unit saat buat sesi audit

### PIC Unit
- Lihat unit yang di-assign ke saya
- Update data unit (jika diberi permission)

### Pimpinan
- Lihat daftar unit kerja (read-only)
- Lihat struktur organisasi unit

---

## Integration Points

### Input dari Modul Lain
- **LAM**: Dropdown LAM aktif untuk prodi
- **User Management**: User dengan role=pic_unit untuk assignment

### Output ke Modul Lain
- **Sesi Audit**: Dropdown unit aktif untuk pilih unit yang diaudit
- **Standar Mutu**: Filter standar by unit.lam_id
- **Temuan**: Unit yang diaudit (read-only reference)
- **User Management**: Unit assignment untuk PIC

---

## Example Data (Real dari AMI 2025)

```
Unit Kerja di SPs UIKA:

Prodi:
- DPAI (Doktor PAI) → LAM: LAMDIK
- MPAI (Magister PAI) → LAM: LAMDIK
- MTP (Magister Tafsir) → LAM: LAMDIK
- MM (Magister Manajemen) → LAM: LAMDIKTI
- MS (Magister Syariah) → LAM: LAMDIK
- MH (Magister Hukum) → LAM: LAMDIKTI

Struktural:
- Direktur SPs
- Wakil Direktur
- Ketua Program Studi (per prodi)

Penunjang:
- LAB-SPS (Laboratorium SPs)
- Perpustakaan SPs
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
