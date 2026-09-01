# GitHub Issues - Modul Unit Kerja

## Overview
Breakdown tasks untuk implementasi modul Unit Kerja dengan conditional LAM field dan integration dengan LAM module.

---

## ISSUE #1: Database Schema untuk Unit Kerja

**Title**: Create Table unit_kerja dengan Constraint LAM untuk Prodi

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel unit_kerja dengan fields sesuai schema
- [ ] Constraint: prodi_must_have_lam (prodi wajib punya lam_id)
- [ ] Constraint: kode unique, uppercase
- [ ] Index pada kode, jenis, lam_id, status
- [ ] RLS policies (Admin GPM full, others read)
- [ ] View v_unit_kerja_detail (with LAM & parent info)
- [ ] View v_unit_kerja_with_pic (with PIC count)
- [ ] Function get_unit_hierarchy() untuk parent-child
- [ ] Seed data 6 prodi + unit struktural/penunjang

**Dependencies**: LAM module database

**Estimate**: 3 jam

---

## ISSUE #2: Unit Kerja Service dengan Singleton Pattern

**Title**: Implementasi UnitKerjaService extends BaseApiService

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] File `lib/api/unit-kerja.service.ts`
- [ ] Singleton pattern
- [ ] Method getAll(), getActive() (filter status=aktif)
- [ ] Method getByJenis(jenis) untuk filter by jenis
- [ ] Method getProdi() untuk filter prodi saja
- [ ] Method getUsage(id) untuk count sesi/temuan
- [ ] Auto uppercase kode saat create
- [ ] Validation LAM: wajib jika prodi, null jika non-prodi
- [ ] Error handling JSON per field

**Dependencies**: Base API Service, LAM Service

**Estimate**: 4 jam

---

## ISSUE #3: Validation Schema dengan Conditional LAM

**Title**: Zod Schema dengan Conditional Validation untuk LAM

**Labels**: `validation`, `frontend`, `high-priority`

**Acceptance Criteria**:
- [ ] File `lib/validation/unit-kerja.schemas.ts`
- [ ] Schema createUnitKerjaSchema
- [ ] Schema updateUnitKerjaSchema
- [ ] Validation: jenis=prodi → lam_id required
- [ ] Validation: jenis!=prodi → lam_id must be null
- [ ] Kode uppercase transform

**Estimate**: 2 jam

---

## ISSUE #4: Unit Kerja List Page

**Title**: Halaman List Unit dengan Filter Jenis, LAM, Status

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Page `/dashboard/master/unit-kerja`
- [ ] Filter: Jenis (dropdown)
- [ ] Filter: LAM (dropdown, hanya prodi)
- [ ] Filter: Status (aktif/nonaktif)
- [ ] Search by kode/nama
- [ ] Show PIC count per unit
- [ ] Action: Edit, Lihat PIC, Toggle Status
- [ ] Responsive mobile (card layout)

**Dependencies**: Issue #2

**Estimate**: 6 jam

---

## ISSUE #5: Create Unit Dialog dengan Conditional LAM

**Title**: Dialog Create dengan LAM Field Conditional Based on Jenis

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Dialog create unit kerja
- [ ] Field LAM muncul hanya jika jenis=prodi
- [ ] LAM dropdown populate dari LamService.getActive()
- [ ] LAM validation: required jika prodi
- [ ] LAM auto null jika non-prodi
- [ ] Kode auto-uppercase on input
- [ ] Error display per field

**Dependencies**: Issue #2, #3, LAM Service

**Estimate**: 5 jam

---

## ISSUE #6: Edit Unit Dialog

**Title**: Edit Unit dengan Kode Read-only dan LAM Adjustment

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Dialog edit dengan kode read-only
- [ ] Jika jenis diubah prodi→non-prodi: LAM auto null
- [ ] Jika jenis diubah non-prodi→prodi: LAM wajib dipilih
- [ ] Update status (aktif/nonaktif)

**Dependencies**: Issue #4

**Estimate**: 4 jam

---

## ISSUE #7: Toggle Status dengan Usage Info

**Title**: Confirmation Dialog dengan Info Usage Unit

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Dialog konfirmasi toggle status
- [ ] Show usage: berapa sesi audit, temuan, PIC
- [ ] Explain impact nonaktif
- [ ] Call UnitKerjaService.getUsage()

**Dependencies**: Issue #2

**Estimate**: 3 jam

---

## ISSUE #8: View PIC Dialog

**Title**: Dialog List PIC per Unit Kerja

**Labels**: `frontend`, `ui`, `low-priority`

**Acceptance Criteria**:
- [ ] Dialog list PIC assigned ke unit
- [ ] Show nama, email, unit lain
- [ ] Info: edit PIC di User Management

**Dependencies**: User Management integration

**Estimate**: 2 jam

---

## ISSUE #9: Integration Dropdown di Sesi Audit

**Title**: Dropdown Unit Aktif di Form Sesi Audit

**Labels**: `integration`, `frontend`, `medium-priority`

**Acceptance Criteria**:
- [ ] Di form Sesi Audit, dropdown unit aktif
- [ ] Populate dari UnitKerjaService.getActive()
- [ ] Show: kode - nama (jenis)

**Dependencies**: Sesi Audit module

**Estimate**: 2 jam

---

## ISSUE #10: Unit Tests

**Title**: Unit Tests untuk UnitKerjaService

**Labels**: `testing`, `low-priority`

**Acceptance Criteria**:
- [ ] Test create prodi dengan LAM
- [ ] Test create non-prodi tanpa LAM
- [ ] Test validation LAM (prodi wajib, non-prodi tidak boleh)
- [ ] Test kode uppercase
- [ ] Test duplicate kode
- [ ] Coverage 80%

**Estimate**: 4 jam

---

## ISSUE #11: E2E Tests

**Title**: E2E Tests untuk CRUD Unit Kerja

**Labels**: `testing`, `e2e`, `low-priority`

**Acceptance Criteria**:
- [ ] Test create prodi dengan pilih LAM
- [ ] Test create lab tanpa LAM
- [ ] Test edit jenis prodi→lab (LAM auto null)
- [ ] Test search & filter
- [ ] Test toggle status

**Estimate**: 5 jam

---

## ISSUE #12: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Acceptance Criteria**:
- [ ] File `05-api-endpoints.md`
- [ ] All service methods documented
- [ ] Integration points documented

**Estimate**: 2 jam

---

**Total Estimate**: 42 jam (~1 week full-time)

**Priority Order**: #1 → #2 → #3 → #5 → #4 → #6 → #7 → #9 → #8 → #10 → #11 → #12

---

**Version**: 1.0
**Last Updated**: 2026-09-01
