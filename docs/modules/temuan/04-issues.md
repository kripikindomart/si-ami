# GitHub Issues - Modul Temuan

## ISSUE #1: Database Schema

**Title**: Create Tables temuan, temuan_standar, temuan_evidence

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel temuan dengan FKs
- [ ] Tabel temuan_standar (many-to-many pivot)
- [ ] Tabel temuan_evidence
- [ ] Function generate_nomor_temuan()
- [ ] Trigger auto-generate nomor + deadline RTL
- [ ] View v_temuan_detail
- [ ] RLS policies per role

**Estimate**: 5 jam

---

## ISSUE #2: Supabase Storage Setup

**Title**: Setup Storage Bucket untuk Temuan Evidence

**Labels**: `storage`, `infrastructure`, `high-priority`

**Acceptance Criteria**:
- [ ] Create bucket 'temuan-evidence'
- [ ] Public read, authenticated write
- [ ] Max file size: 5MB
- [ ] Allowed types: image/*, application/pdf, application/msword
- [ ] Folder structure: {temuan_id}/{filename}

**Estimate**: 1 jam

---

## ISSUE #3: Service Singleton

**Title**: TemuanService dengan CRUD dan File Upload

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] TemuanService.create(data, standarIds, files)
- [ ] TemuanService.update(id, data, standarIds)
- [ ] TemuanService.delete(id) - cascade delete files
- [ ] TemuanService.getById(id) - with standar, evidence, rekomendasi, rtl
- [ ] TemuanService.getAll(filters) - sesi, unit, kategori, status
- [ ] TemuanService.uploadEvidence(temuanId, files)
- [ ] TemuanService.deleteEvidence(evidenceId)
- [ ] TemuanService.updateStatusRtl(id, statusId)
- [ ] Validation: min 1 standar, kategori wajib

**Estimate**: 8 jam

---

## ISSUE #4: Standar Filter Logic

**Title**: Get Standar by Unit LAM untuk Form Temuan

**Labels**: `api`, `business-logic`, `high-priority`

**Acceptance Criteria**:
- [ ] StandarMutuService.getByUnitForTemuan(unitId)
- [ ] Logic: IF prodi → global + specific(unit.lam), ELSE → global only
- [ ] Return standar grouped by scope
- [ ] Used in form temuan dropdown

**Estimate**: 3 jam

---

## ISSUE #5: List Page

**Title**: Temuan List dengan Filter dan Deadline Indicator

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Table list temuan: nomor, unit, kategori, standar, status RTL, deadline
- [ ] Filter: unit, kategori, status RTL
- [ ] Search by nomor/deskripsi
- [ ] Deadline indicator: overdue (red), soon (<7 days, yellow)
- [ ] Badge: kategori, status RTL
- [ ] Pagination

**Estimate**: 6 jam

---

## ISSUE #6: Form Create/Edit

**Title**: Form Tambah dan Edit Temuan dengan Multi-Select Standar

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Form fields: kategori, standar (multi), deskripsi, lokasi, tanggal, deadline, evidence
- [ ] Auto-generate nomor (display only)
- [ ] Multi-select standar with LAM filter
- [ ] Rich text editor for deskripsi
- [ ] File upload multiple (drag & drop)
- [ ] Auto-calculate deadline (config: rtl_deadline_days)
- [ ] Validation: kategori wajib, min 1 standar, deskripsi wajib

**Estimate**: 8 jam

---

## ISSUE #7: Detail Page

**Title**: Detail Temuan dengan Tab Evidence/Rekomendasi/RTL

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Display info temuan: nomor, sesi, kategori, tanggal, deadline, status RTL
- [ ] Display standar list (can be multiple)
- [ ] Tab Evidence: list files dengan preview, upload, delete
- [ ] Tab Rekomendasi: list rekomendasi (from Rekomendasi module)
- [ ] Tab Tindak Lanjut: list RTL (from RTL module)
- [ ] Button: Edit, Delete, Update Status RTL

**Estimate**: 8 jam

---

## ISSUE #8: File Upload Component

**Title**: Reusable File Upload Component dengan Preview

**Labels**: `frontend`, `ui`, `component`, `medium-priority`

**Acceptance Criteria**:
- [ ] Drag & drop zone
- [ ] Multiple files
- [ ] Preview: image thumbnail, PDF icon
- [ ] Progress bar upload
- [ ] Validation: max size 5MB, allowed types
- [ ] Used in Temuan, Rekomendasi, RTL

**Estimate**: 4 jam

---

## ISSUE #9: Evidence Management

**Title**: Upload, View, Delete Evidence Files

**Labels**: `frontend`, `backend`, `storage`, `high-priority`

**Acceptance Criteria**:
- [ ] Upload files to Supabase Storage
- [ ] Save metadata to temuan_evidence
- [ ] View evidence list dengan preview
- [ ] Download file
- [ ] Delete file (Storage + DB) - validation: only DRAFT status

**Estimate**: 5 jam

---

## ISSUE #10: Status RTL Update Flow

**Title**: Update Status RTL dari RTL Module

**Labels**: `integration`, `workflow`, `medium-priority`

**Acceptance Criteria**:
- [ ] API endpoint updateStatusRtl(temuanId, statusId)
- [ ] Called from RTL module on status change
- [ ] Validation: status flow must be sequential
- [ ] Notifikasi on status change

**Estimate**: 2 jam

---

## ISSUE #11: Deadline Notification

**Title**: Notifikasi Deadline RTL Mendekat/Overdue

**Labels**: `notification`, `cron`, `medium-priority`

**Acceptance Criteria**:
- [ ] Daily cron job check deadline
- [ ] Notify PIC Unit: deadline <7 days, overdue
- [ ] Notify Admin GPM: overdue summary
- [ ] Email + in-app notification

**Estimate**: 4 jam

---

## ISSUE #12: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 55 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
