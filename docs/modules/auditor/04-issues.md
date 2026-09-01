# GitHub Issues - Modul Auditor

## ISSUE #1: Database Schema Auditor

**Title**: Create Table auditor dan sesi_auditor

**Labels**: `database`, `schema`, `medium-priority`

**Acceptance Criteria**:
- [ ] Tabel auditor dengan NIP unique
- [ ] Tabel sesi_auditor (many-to-many dengan sesi_audit)
- [ ] View v_auditor_workload (count sesi per auditor)
- [ ] RLS policies
- [ ] Seed data 3 auditor

**Estimate**: 2 jam

---

## ISSUE #2: Auditor Service Singleton

**Title**: AuditorService dengan Workload Tracking

**Labels**: `api`, `service`, `medium-priority`

**Acceptance Criteria**:
- [ ] File `lib/api/auditor.service.ts`
- [ ] Singleton pattern
- [ ] Method getAll(), getActive()
- [ ] Method getWorkload(auditorId, periodeId) - count sesi
- [ ] Method create(), update(), toggleStatus()
- [ ] Error handling JSON per field

**Estimate**: 3 jam

---

## ISSUE #3: Validation Schema

**Title**: Zod Schema untuk Auditor

**Labels**: `validation`, `frontend`, `low-priority`

**Acceptance Criteria**:
- [ ] Schema createAuditorSchema
- [ ] Validation: NIP unique, email format
- [ ] Schema updateAuditorSchema

**Estimate**: 1 jam

---

## ISSUE #4: Auditor List Page

**Title**: List Auditor dengan Workload Count

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Page `/dashboard/master/auditor`
- [ ] Table dengan kolom: NIP, Nama, Email, Total Sesi, Status
- [ ] Filter by status
- [ ] Search by NIP/nama
- [ ] Action: Edit, Toggle Status, View Workload

**Estimate**: 4 jam

---

## ISSUE #5: Create/Edit Auditor Dialog

**Title**: Dialog CRUD Auditor dengan Link ke User

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Dialog create auditor
- [ ] Dialog edit auditor
- [ ] Optional: Link ke user account (dropdown)
- [ ] Validation per field

**Estimate**: 3 jam

---

## ISSUE #6: Multi-Select Auditor Component

**Title**: Multi-Select Auditor di Form Sesi Audit

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Dropdown pilih ketua auditor (single select)
- [ ] Multi-select anggota tim auditor (checkbox)
- [ ] Save to sesi_auditor table
- [ ] Min 1 ketua auditor wajib

**Estimate**: 3 jam

---

## ISSUE #7: Auditor Workload Report

**Title**: Page Workload Report per Auditor per Periode

**Labels**: `frontend`, `report`, `low-priority`

**Acceptance Criteria**:
- [ ] Page `/dashboard/reports/auditor-workload`
- [ ] Filter by periode
- [ ] Table: Auditor, Total Sesi, Sesi Ketua, Sesi Anggota
- [ ] Export to Excel

**Estimate**: 4 jam

---

## ISSUE #8: Unit Tests

**Title**: Unit Tests untuk AuditorService

**Labels**: `testing`, `low-priority`

**Estimate**: 2 jam

---

## ISSUE #9: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 23 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
