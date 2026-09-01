# GitHub Issues - Modul Sesi Audit

## ISSUE #1: Database Schema

**Title**: Create Tables sesi_audit, sesi_auditor, dan View Detail

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel sesi_audit dengan constraints
- [ ] Tabel sesi_auditor (many-to-many)
- [ ] UNIQUE INDEX untuk 1 sesi aktif per unit
- [ ] Function generate_nomor_sesi()
- [ ] Trigger auto-generate nomor
- [ ] View v_sesi_audit_detail
- [ ] RLS policies

**Estimate**: 4 jam

---

## ISSUE #2: Service Singleton

**Title**: SesiAuditService dengan CRUD Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] SesiAuditService.create(data, auditors)
- [ ] SesiAuditService.update(id, data)
- [ ] SesiAuditService.updateStatus(id, status)
- [ ] SesiAuditService.getById(id) - with auditors, temuan count
- [ ] SesiAuditService.getAll(filters) - periode, unit, status
- [ ] SesiAuditService.getMySesi(userId) - for auditor role
- [ ] SesiAuditService.getByUnit(unitId) - for PIC role
- [ ] Validation: periode aktif, duplicate active sesi per unit

**Estimate**: 6 jam

---

## ISSUE #3: List Page

**Title**: Sesi Audit List dengan Filter dan Pagination

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Table list sesi dengan columns: nomor, unit, tanggal, ketua, status
- [ ] Filter: unit kerja, status, auditor
- [ ] Search by nomor/unit
- [ ] Status badge dengan warna
- [ ] Pagination
- [ ] Button: Tambah, Edit, Detail, Cancel

**Estimate**: 5 jam

---

## ISSUE #4: Form Create/Edit

**Title**: Form Tambah dan Edit Sesi Audit

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Form fields: unit, tanggal mulai/selesai, ketua, anggota, keterangan
- [ ] Auto-generate nomor (display only)
- [ ] Multi-select anggota auditor
- [ ] Validation: ketua wajib, tanggal selesai >= mulai
- [ ] Error handling per field

**Estimate**: 5 jam

---

## ISSUE #5: Detail Page

**Title**: Detail Sesi Audit dengan Tab Temuan/Nilai Positif

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Display info sesi: nomor, periode, unit, tanggal, status
- [ ] Display tim auditor: ketua + anggota list
- [ ] Tab Temuan: list temuan dengan status RTL
- [ ] Tab Nilai Positif: list nilai positif
- [ ] Button: Edit, Change Status, Cancel Sesi
- [ ] Link to Temuan detail

**Estimate**: 6 jam

---

## ISSUE #6: Change Status Flow

**Title**: Update Status Sesi dengan Validasi

**Labels**: `frontend`, `backend`, `workflow`, `high-priority`

**Acceptance Criteria**:
- [ ] Status flow: SCHEDULED → IN_PROGRESS → COMPLETED
- [ ] Validation untuk setiap transition
- [ ] Immutable COMPLETED status
- [ ] Cancel sesi (any status except COMPLETED)

**Estimate**: 3 jam

---

## ISSUE #7: My Sesi Page (Auditor)

**Title**: Dashboard My Sesi untuk Role Auditor

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Show sesi where auditor assigned (ketua/anggota)
- [ ] Group: Upcoming, In Progress, Completed
- [ ] Quick action: View detail, Input temuan

**Estimate**: 4 jam

---

## ISSUE #8: Unit Sesi Page (PIC)

**Title**: Dashboard Unit Sesi untuk Role PIC Unit

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Show sesi for PIC's unit
- [ ] Current sesi highlight
- [ ] Show temuan & RTL status
- [ ] Quick action: View detail, Submit RTL

**Estimate**: 4 jam

---

## ISSUE #9: Validation Business Rules

**Title**: Implement Sesi Business Rules Validation

**Labels**: `backend`, `validation`, `high-priority`

**Acceptance Criteria**:
- [ ] Check periode aktif exists before create
- [ ] Check unit tidak punya 2 sesi SCHEDULED/IN_PROGRESS
- [ ] Check ketua auditor not null
- [ ] Prevent edit COMPLETED sesi

**Estimate**: 2 jam

---

## ISSUE #10: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 40 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
