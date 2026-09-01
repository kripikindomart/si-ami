# GitHub Issues - Modul Rekomendasi

## ISSUE #1: Database Schema

**Title**: Create Tables rekomendasi, rekomendasi_standar, rekomendasi_evidence

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel rekomendasi
- [ ] Tabel rekomendasi_standar (many-to-many)
- [ ] Tabel rekomendasi_evidence
- [ ] Function generate_nomor_rekomendasi()
- [ ] Trigger auto-generate nomor
- [ ] View v_rekomendasi_detail
- [ ] RLS policies

**Estimate**: 4 jam

---

## ISSUE #2: Storage Bucket

**Title**: Setup Bucket rekomendasi-evidence

**Labels**: `storage`, `infrastructure`, `medium-priority`

**Estimate**: 0.5 jam

---

## ISSUE #3: Service Singleton

**Title**: RekomendasiService dengan CRUD Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] RekomendasiService.create(data, standarIds, files)
- [ ] RekomendasiService.update(id, data, standarIds)
- [ ] RekomendasiService.delete(id)
- [ ] RekomendasiService.getById(id)
- [ ] RekomendasiService.getByTemuan(temuanId)
- [ ] RekomendasiService.uploadEvidence(id, files)
- [ ] RekomendasiService.deleteEvidence(evidenceId)
- [ ] Validation: min 1 standar

**Estimate**: 6 jam

---

## ISSUE #4: UI Components in Temuan Detail

**Title**: Tab Rekomendasi di Detail Temuan

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Tab Rekomendasi in Detail Temuan
- [ ] List rekomendasi dengan accordion/cards
- [ ] Form tambah/edit modal
- [ ] Multi-select standar (reuse from Temuan)
- [ ] File upload (optional)
- [ ] Evidence preview

**Estimate**: 6 jam

---

## ISSUE #5: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 17.5 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
