# Modul Periode Audit

## Overview
Modul Periode Audit mengelola periode/tahun pelaksanaan Audit Mutu Internal (AMI). Setiap periode audit merupakan siklus tahunan yang menjadi kontainer untuk semua sesi audit di tahun tersebut.

---

## Deskripsi
Periode Audit adalah entitas yang mendefinisikan waktu pelaksanaan AMI dalam satu tahun akademik atau kalender. Setiap periode memiliki:
- Nama periode (contoh: "AMI 2025", "AMI Tahun Akademik 2025/2026")
- Tanggal mulai dan selesai
- Status (draft/aktif/selesai)
- Target completion dan actual completion

---

## Fitur Utama

### 1. Master Data Periode Audit
- CRUD periode audit (Create, Read, Update, Deactivate)
- Set periode aktif (hanya 1 periode aktif di satu waktu)
- Tracking progress audit per periode
- Close periode setelah semua audit selesai

### 2. Status Management
- **Draft**: Periode baru dibuat, belum mulai
- **Aktif**: Periode sedang berjalan (hanya 1 periode aktif)
- **Selesai**: Periode sudah closed, tidak bisa edit

### 3. Progress Tracking
- Total unit yang harus diaudit
- Total unit yang sudah diaudit
- Persentase completion
- Timeline mulai dan target selesai

---

## Data Structure

### Fields
- **Nama**: Nama periode (contoh: "AMI 2025")
- **Tahun**: Tahun periode (2025, 2026)
- **Tanggal Mulai**: Start date periode
- **Tanggal Selesai**: End date (target)
- **Status**: draft/aktif/selesai
- **Deskripsi**: Optional description

---

## Business Rules

1. **Hanya 1 Periode Aktif**: Tidak boleh ada 2 periode dengan status=aktif bersamaan
2. **Draft → Aktif → Selesai**: Flow status one-way
3. **Cannot Edit Closed Period**: Periode selesai tidak bisa diubah
4. **Close Validation**: Periode hanya bisa di-close jika semua RTL sudah completed (optional strict mode)
5. **Auto-generate Nama**: Bisa auto-generate "AMI {tahun}" jika tidak diisi custom

---

## User Stories

### Admin GPM
- Buat periode audit baru untuk tahun depan
- Set periode aktif saat audit dimulai
- Monitor progress audit per periode
- Close periode setelah semua selesai
- View laporan per periode

### Auditor
- Lihat periode aktif saat ini
- Buat sesi audit di periode aktif
- View target deadline periode

### PIC Unit
- Lihat periode audit yang berkaitan dengan unit
- Track deadline RTL per periode

### Pimpinan
- View progress audit per periode
- Compare antar periode (trend analysis)

---

## Integration Points

### Input dari Modul Lain
- (None - periode adalah master data mandiri)

### Output ke Modul Lain
- **Sesi Audit**: Setiap sesi audit assigned ke 1 periode
- **Dashboard**: Filter data by periode
- **Laporan**: Generate laporan per periode
- **Notifikasi**: Reminder based on periode deadline

---

## Example Data (Real dari AMI 2025)

```
Periode Audit:

1. AMI 2024
   - Tahun: 2024
   - Mulai: 2024-01-15
   - Selesai: 2024-06-30
   - Status: Selesai
   - Progress: 10/10 unit (100%)

2. AMI 2025
   - Tahun: 2025
   - Mulai: 2025-01-20
   - Selesai: 2025-06-30
   - Status: Aktif
   - Progress: 8/10 unit (80%)

3. AMI 2026
   - Tahun: 2026
   - Mulai: 2026-01-15
   - Selesai: 2026-06-30
   - Status: Draft
   - Progress: 0/10 unit (0%)
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
