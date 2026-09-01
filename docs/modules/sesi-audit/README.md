# Modul Sesi Audit

## Overview
Modul Sesi Audit mengelola jadwal dan pelaksanaan sesi audit ke unit kerja dalam periode audit aktif.

---

## Fitur

### 1. Penjadwalan Sesi
- Nomor otomatis: SA/2025/001
- Periode audit aktif
- Unit kerja yang diaudit
- Tanggal pelaksanaan
- Tim auditor (ketua + anggota)

### 2. Status Sesi
- SCHEDULED: Dijadwalkan
- IN_PROGRESS: Sedang berlangsung
- COMPLETED: Selesai
- CANCELLED: Dibatalkan

### 3. Relasi
- 1 sesi → 1 periode audit
- 1 sesi → 1 unit kerja
- 1 sesi → N auditor (via sesi_auditor)
- 1 sesi → N temuan
- 1 sesi → N nilai positif

---

## Business Rules

1. Sesi hanya bisa dibuat di periode aktif
2. 1 unit tidak bisa punya 2 sesi SCHEDULED/IN_PROGRESS bersamaan
3. Ketua auditor wajib ada (minimal 1)
4. Nomor sesi auto-generate dari config
5. Sesi COMPLETED tidak bisa diubah

---

**Version**: 1.0
**Last Updated**: 2026-09-01
