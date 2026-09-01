# GitHub Issues - Modul Standar Mutu

## ISSUE #1: Database Schema Standar Mutu

**Title**: Create Table standar_mutu dengan Scope Validation

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel standar_mutu dengan constraint scope_lam_validation
- [ ] Tabel temuan_standar (many-to-many)
- [ ] Tabel rekomendasi_standar (many-to-many)
- [ ] View v_standar_with_lam
- [ ] View v_standar_by_unit (filter by unit LAM)
- [ ] Function get_standar_by_unit(unit_id)
- [ ] RLS policies
- [ ] Seed data: standar global + LAMDIK + LAMDIKTI

**Estimate**: 4 jam

---

## ISSUE #2: Standar Mutu Service Singleton

**Title**: StandarMutuService dengan Filter by Unit LAM

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] File `lib/api/standar-mutu.service.ts`
- [ ] Singleton pattern
- [ ] Method getAll(), getActive()
- [ ] Method getByScope(scope) - filter global/specific
- [ ] Method getByLam(lamId) - filter by LAM
- [ ] Method getByUnit(unitId) - filter by unit LAM (global + specific)
- [ ] Method create(), update()
- [ ] Validation: scope=global → lam_id null, scope=specific → lam_id required
- [ ] Error handling JSON per field

**Estimate**: 5 jam

---

## ISSUE #3: Validation Schema dengan Conditional LAM

**Title**: Zod Schema Conditional untuk Scope & LAM

**Labels**: `validation`, `frontend`, `high-priority`

**Acceptance Criteria**:
- [ ] Schema createStandarSchema
- [ ] Schema updateStandarSchema
- [ ] Validation: scope=global → lam_id must be null
- [ ] Validation: scope=specific → lam_id required
- [ ] Custom refine untuk conditional validation

**Estimate**: 2 jam

---

## ISSUE #4: Standar Mutu List Page

**Title**: List Standar dengan Filter Scope & LAM

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Page `/dashboard/master/standar-mutu`
- [ ] Filter: Scope (global/specific/semua)
- [ ] Filter: LAM (dropdown, hanya untuk specific)
- [ ] Filter: Status
- [ ] Search by kode/nama
- [ ] Show LAM column (jika specific)
- [ ] Action: Edit, Toggle Status

**Estimate**: 6 jam

---

## ISSUE #5: Create/Edit Standar Dialog dengan Conditional LAM

**Title**: Dialog dengan LAM Field Conditional Based on Scope

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Dialog create standar
- [ ] Dialog edit standar
- [ ] Radio button: Global vs Specific
- [ ] LAM field muncul hanya jika scope=specific
- [ ] LAM validation: required jika specific
- [ ] LAM auto null jika global
- [ ] Error display per field

**Estimate**: 5 jam

---

## ISSUE #6: Multi-Select Standar Component

**Title**: Multi-Select Component untuk Pilih Standar di Temuan/Rekomendasi

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Component multi-select standar dengan checkbox
- [ ] Auto-filter standar based on unit LAM
- [ ] Show selected standar count
- [ ] Min 1 standar harus dipilih
- [ ] Save to temuan_standar / rekomendasi_standar

**Estimate**: 5 jam

---

## ISSUE #7: Integration dengan Temuan & Rekomendasi

**Title**: Save Multiple Standar untuk Temuan/Rekomendasi

**Labels**: `integration`, `backend`, `high-priority`

**Acceptance Criteria**:
- [ ] Di TemuanService.create(): save multiple standar via temuan_standar
- [ ] Di RekomendasiService.create(): save multiple standar via rekomendasi_standar
- [ ] Delete old standar saat update
- [ ] Cascade delete on temuan/rekomendasi delete

**Estimate**: 3 jam

---

## ISSUE #8: Import Standar Bulk (Optional)

**Title**: Import Standar dari Excel

**Labels**: `feature`, `import`, `low-priority`

**Acceptance Criteria**:
- [ ] Upload Excel file
- [ ] Parse Excel (kode, nama, scope, lam_kode, nomor_urut)
- [ ] Validation per row
- [ ] Bulk insert
- [ ] Show success/error summary

**Estimate**: 6 jam

---

## ISSUE #9: Unit Tests

**Title**: Unit Tests untuk StandarMutuService

**Labels**: `testing`, `low-priority`

**Acceptance Criteria**:
- [ ] Test create global (lam_id=null)
- [ ] Test create specific (lam_id required)
- [ ] Test getByUnit (filter by unit LAM)
- [ ] Test scope validation
- [ ] Coverage 80%

**Estimate**: 4 jam

---

## ISSUE #10: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 2 jam

---

**Total Estimate**: 42 jam (~1 week full-time)

**Priority Order**: #1 → #2 → #3 → #5 → #4 → #6 → #7 → #9 → #8 → #10

---

**Version**: 1.0
**Last Updated**: 2026-09-01
