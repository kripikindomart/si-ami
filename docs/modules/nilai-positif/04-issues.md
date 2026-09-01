# GitHub Issues - Modul Nilai Positif

## ISSUE #1: Database Schema

**Title**: Create Tables nilai_positif dan nilai_positif_evidence

**Labels**: `database`, `schema`, `medium-priority`

**Acceptance Criteria**:
- [ ] Tabel nilai_positif
- [ ] Tabel nilai_positif_evidence
- [ ] View v_nilai_positif_detail
- [ ] RLS policies

**Estimate**: 2 jam

---

## ISSUE #2: Storage Bucket

**Title**: Setup Bucket untuk Nilai Positif Evidence

**Labels**: `storage`, `infrastructure`, `medium-priority`

**Acceptance Criteria**:
- [ ] Create bucket 'nilai-positif-evidence'
- [ ] Same config as temuan-evidence

**Estimate**: 0.5 jam

---

## ISSUE #3: Service Singleton

**Title**: NilaiPositifService dengan CRUD Methods

**Labels**: `api`, `service`, `medium-priority`

**Acceptance Criteria**:
- [ ] NilaiPositifService.create(data, files)
- [ ] NilaiPositifService.update(id, data)
- [ ] NilaiPositifService.delete(id)
- [ ] NilaiPositifService.getById(id)
- [ ] NilaiPositifService.getBySesi(sesiId)
- [ ] NilaiPositifService.uploadEvidence(id, files)
- [ ] NilaiPositifService.deleteEvidence(evidenceId)

**Estimate**: 4 jam

---

## ISSUE #4: UI Components in Sesi Detail

**Title**: Tab Nilai Positif di Detail Sesi Audit

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Tab Nilai Positif in Detail Sesi
- [ ] List nilai positif dengan accordion/cards
- [ ] Form tambah/edit modal
- [ ] File upload component (reuse dari Temuan)
- [ ] Evidence preview & download

**Estimate**: 5 jam

---

## ISSUE #5: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 12.5 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
