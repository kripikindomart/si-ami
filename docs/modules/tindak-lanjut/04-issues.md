# GitHub Issues - Modul Tindak Lanjut

## ISSUE #1: Database Schema

**Title**: Create Tables tindak_lanjut, tindak_lanjut_evidence

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] Tabel tindak_lanjut dengan status flow fields
- [ ] Tabel tindak_lanjut_evidence dengan stage (submit/complete)
- [ ] Trigger sync status RTL ke temuan
- [ ] View v_tindak_lanjut_detail
- [ ] RLS policies per role

**Estimate**: 4 jam

---

## ISSUE #2: Storage Bucket

**Title**: Setup Bucket rtl-evidence

**Labels**: `storage`, `infrastructure`, `high-priority`

**Estimate**: 0.5 jam

---

## ISSUE #3: Service Singleton

**Title**: TindakLanjutService dengan Status Flow Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] TindakLanjutService.create(temuanId)
- [ ] TindakLanjutService.update(id, data)
- [ ] TindakLanjutService.submit(id) - DRAFT → SUBMITTED
- [ ] TindakLanjutService.approve(id) - SUBMITTED → ON_PROGRESS
- [ ] TindakLanjutService.reject(id, catatan) - back to previous status
- [ ] TindakLanjutService.markCompleted(id) - ON_PROGRESS → COMPLETED
- [ ] TindakLanjutService.verify(id) - COMPLETED → VERIFIED
- [ ] TindakLanjutService.uploadEvidence(id, files, stage)
- [ ] TindakLanjutService.getByTemuan(temuanId)
- [ ] Validation: evidence wajib saat submit/complete

**Estimate**: 8 jam

---

## ISSUE #4: UI Tab in Temuan Detail

**Title**: Tab Tindak Lanjut di Detail Temuan

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Tab Tindak Lanjut in Detail Temuan
- [ ] Display RTL info: deskripsi, target, timeline, evidence
- [ ] Timeline component: status history dengan tanggal
- [ ] Evidence list grouped by stage (submit/complete)
- [ ] Conditional actions based on role & status:
  - PIC Unit: Edit Draft, Submit, Upload Evidence, Mark Completed
  - Admin GPM: Approve, Reject, Verify
- [ ] Form edit RTL (PIC Unit)
- [ ] Modal reject dengan catatan (Admin GPM)

**Estimate**: 8 jam

---

## ISSUE #5: RTL Monitoring Dashboard

**Title**: Dashboard Monitoring RTL untuk Admin GPM

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] List RTL grouped by status
- [ ] Pending Review section (SUBMITTED)
- [ ] On Progress section dengan deadline indicator
- [ ] Need Verification section (COMPLETED)
- [ ] Quick actions: Review, Verify
- [ ] Filter: unit, periode, status
- [ ] Export to Excel

**Estimate**: 6 jam

---

## ISSUE #6: My RTL Dashboard

**Title**: Dashboard My RTL untuk PIC Unit

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] List RTL for my unit
- [ ] Grouped: Draft, Submitted, On Progress, Completed, Verified
- [ ] Deadline indicator: overdue, soon
- [ ] Quick actions: Edit, Submit, Upload Evidence
- [ ] Catatan reject display (if any)

**Estimate**: 5 jam

---

## ISSUE #7: Status Flow Validation

**Title**: Implement RTL Status Flow Business Rules

**Labels**: `backend`, `validation`, `high-priority`

**Acceptance Criteria**:
- [ ] Validate status transitions
- [ ] Evidence required: submit & complete stage
- [ ] Only allowed roles can change status
- [ ] Reject with catatan wajib
- [ ] Target penyelesaian <= deadline RTL

**Estimate**: 3 jam

---

## ISSUE #8: Notification Integration

**Title**: Notifikasi untuk RTL Events

**Labels**: `notification`, `integration`, `medium-priority`

**Acceptance Criteria**:
- [ ] PIC submit → notify Admin GPM
- [ ] Admin approve/reject → notify PIC
- [ ] PIC mark completed → notify Admin GPM
- [ ] Admin verify/reject → notify PIC
- [ ] Deadline reminder (3 days, 1 day, overdue)

**Estimate**: 4 jam

---

## ISSUE #9: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 39.5 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
