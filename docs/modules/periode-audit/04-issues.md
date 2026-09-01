# GitHub Issues - Modul Periode Audit

## ISSUE #1: Database Schema Periode Audit

**Title**: Create Table periode_audit dengan Unique Aktif Constraint

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel periode_audit dengan constraint
- [ ] Unique index untuk status=aktif (hanya 1 periode aktif)
- [ ] View v_periode_audit_progress (with stats)
- [ ] Function get_periode_aktif(), set_periode_aktif(), close_periode()
- [ ] RLS policies
- [ ] Seed data 3 periode (2024 selesai, 2025 aktif, 2026 draft)

**Estimate**: 3 jam

---

## ISSUE #2: Periode Audit Service Singleton

**Title**: PeriodeAuditService dengan Status Management

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] File `lib/api/periode-audit.service.ts`
- [ ] Singleton pattern
- [ ] Method getAll(), getActive(), getById()
- [ ] Method create(), update()
- [ ] Method setPeriodeAktif(id) - set periode jadi aktif
- [ ] Method closePeriode(id) - close periode
- [ ] Method getProgress(id) - get stats periode
- [ ] Validation: hanya 1 periode aktif
- [ ] Error handling JSON per field

**Estimate**: 4 jam

---

## ISSUE #3: Validation Schema

**Title**: Zod Schema untuk Periode Audit

**Labels**: `validation`, `frontend`, `medium-priority`

**Acceptance Criteria**:
- [ ] Schema createPeriodeSchema
- [ ] Schema updatePeriodeSchema
- [ ] Validation: tanggal_selesai > tanggal_mulai
- [ ] Validation: tahun 2020-2100

**Estimate**: 1 jam

---

## ISSUE #4: Periode Audit List Page

**Title**: List Periode dengan Progress Bar

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Page `/dashboard/master/periode-audit`
- [ ] Table dengan progress bar per periode
- [ ] Filter by status
- [ ] Action buttons: Edit, Aktifkan, Close, Lihat
- [ ] Conditional actions by status

**Estimate**: 5 jam

---

## ISSUE #5: Create/Edit Periode Dialog

**Title**: Dialog Create dan Edit Periode

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Dialog create periode
- [ ] Dialog edit periode
- [ ] Date picker untuk tanggal mulai/selesai
- [ ] Disable edit untuk periode selesai
- [ ] Validation per field

**Estimate**: 4 jam

---

## ISSUE #6: Set Aktif & Close Periode

**Title**: Confirmation Dialogs untuk Status Change

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Dialog set aktif dengan warning periode aktif lama
- [ ] Dialog close dengan progress info
- [ ] Call service methods
- [ ] Success/error feedback

**Estimate**: 3 jam

---

## ISSUE #7: Periode Progress Component

**Title**: Card Component untuk Progress Periode di Dashboard

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Card show periode aktif
- [ ] Progress bars (timeline, unit audited, RTL)
- [ ] Stats (temuan, rekomendasi, RTL)
- [ ] Link ke detail

**Estimate**: 3 jam

---

## ISSUE #8: Integration Dropdown

**Title**: Dropdown Periode di Sesi Audit & Dashboard

**Labels**: `integration`, `frontend`, `medium-priority`

**Acceptance Criteria**:
- [ ] Di form Sesi Audit: dropdown periode aktif
- [ ] Di Dashboard: dropdown pilih periode untuk filter

**Estimate**: 2 jam

---

## ISSUE #9: Unit Tests

**Title**: Unit Tests untuk PeriodeAuditService

**Labels**: `testing`, `low-priority`

**Acceptance Criteria**:
- [ ] Test create periode
- [ ] Test set aktif (only 1 aktif)
- [ ] Test close periode
- [ ] Test validation

**Estimate**: 3 jam

---

## ISSUE #10: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 29 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
