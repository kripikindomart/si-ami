# Modul Auditor

## Overview
Modul Auditor mengelola master data auditor internal yang melakukan audit di SPs UIKA. Auditor berbeda dengan User role=auditor (User adalah account login, Auditor adalah master data orang).

---

## Deskripsi
Auditor adalah personel yang ditugaskan melakukan audit mutu internal. Setiap auditor memiliki:
- Data personal (NIP, nama, email, kontak)
- Sertifikasi/kompetensi (optional)
- Status aktif/nonaktif
- Assignment ke sesi audit (many-to-many)

---

## Fitur Utama

### 1. Master Data Auditor
- CRUD auditor
- Link auditor ke user account (optional)
- Status aktif/nonaktif
- Sertifikasi/kompetensi tracking

### 2. Assignment ke Sesi Audit
- 1 sesi audit bisa punya multiple auditor (ketua + anggota)
- 1 auditor bisa handle multiple sesi audit
- Tracking workload auditor per periode

---

## Data Structure

### Fields
- **NIP**: Nomor Induk Pegawai (unique)
- **Nama**: Nama lengkap auditor
- **Email**: Email auditor
- **Telepon**: Nomor telepon
- **Sertifikasi**: Sertifikat auditor (optional)
- **User ID**: Link ke user account (optional)
- **Status**: Aktif/Nonaktif

---

## Business Rules

1. **NIP Unique**: Tidak boleh duplicate
2. **Link to User Optional**: Auditor bisa linked ke user atau tidak
3. **Multiple Auditor per Sesi**: Sesi audit bisa punya tim auditor
4. **Workload Tracking**: Track berapa sesi audit per auditor per periode

---

## User Stories

### Admin GPM
- Tambah auditor baru ke pool
- Edit data auditor
- Nonaktifkan auditor yang sudah tidak aktif
- View workload auditor per periode

### Auditor (User)
- View profil auditor sendiri
- View riwayat sesi audit yang di-handle

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
