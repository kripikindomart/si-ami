# Modul: LAM (Lembaga Akreditasi Mandiri)

## Tujuan
Mengelola master data LAM untuk kategorisasi standar mutu per program studi sesuai dengan akreditasi yang digunakan.

## Fitur Utama
1. **CRUD LAM**
   - Create LAM baru
   - View list LAM
   - Update LAM
   - Soft delete LAM (set status nonaktif)

2. **Kategorisasi**
   - Kode LAM (LAMDIK, LAMDIKTI, LAMDIKES, dll)
   - Nama lengkap LAM
   - Deskripsi LAM
   - Status aktif/nonaktif

## Scope & Batasan
### In Scope:
- CRUD basic LAM
- Assignment LAM ke prodi dilakukan di modul Unit Kerja
- LAM digunakan untuk filter standar mutu

### Out of Scope:
- Integrasi dengan sistem akreditasi external
- Tracking perubahan status akreditasi per prodi
- Document management akreditasi

## Data Master LAM

### LAM yang Umum Digunakan:
1. **LAMDIK** (LAM Pendidikan Tinggi Keagamaan Islam)
   - Untuk prodi keislaman: DPAI, MPAI, DESy, MESy, MKPI
   
2. **LAMDIKTI** (LAM Dikti)
   - Untuk prodi umum: MM, MTP
   
3. **LAMDIKES** (LAM Kesehatan)
   - Untuk prodi kesehatan (jika ada di masa depan)
   
4. **GLOBAL**
   - Pseudo-LAM untuk standar yang berlaku universal

## Use Case

### UC-1: Admin GPM Tambah LAM Baru
**Actor**: Admin GPM
**Flow**:
1. Masuk menu Master Data > LAM
2. Klik "Tambah LAM"
3. Input:
   - Kode (contoh: LAMDIKTI)
   - Nama (contoh: LAM Pendidikan Tinggi)
   - Deskripsi
4. Submit
5. Sistem validasi kode unique
6. LAM tersimpan dengan status aktif

### UC-2: View List LAM
**Actor**: Admin GPM, Auditor
**Flow**:
1. Masuk menu Master Data > LAM
2. Sistem tampilkan list LAM dalam tabel
3. Kolom: Kode, Nama, Status, Aksi
4. Filter by status (aktif/nonaktif)

### UC-3: Nonaktifkan LAM
**Actor**: Admin GPM
**Flow**:
1. Di list LAM, klik action "Nonaktifkan"
2. Konfirmasi: "LAM ini digunakan oleh X prodi. Yakin nonaktifkan?"
3. Jika ya, status → nonaktif
4. Prodi yang sudah assign tetap keep assignment (tidak berubah)

## Dependencies
- **Used by**: 
  - Modul Unit Kerja (field `lam_id`)
  - Modul Standar Mutu (field `lam_id`)
- **Depends on**: None (master data independen)

## Database Schema
Lihat: `01-schema.md`

## Workflow
Lihat: `02-workflow.md`

## Wireframe
Lihat: `03-wireframe.md`

## GitHub Issues
Lihat: `04-issues.md`

## API Endpoints
Lihat: `05-api-endpoints.md`

---

**Status**: Ready for development
**Priority**: P1 (High - diperlukan sebelum Unit Kerja & Standar Mutu)
**Estimated Effort**: 3 days
