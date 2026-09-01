# Workflow - Modul Tindak Lanjut

## 1. PIC UNIT: DRAFT RTL

```
[PIC Unit]
    ↓
Detail Temuan → Tab Tindak Lanjut
    ↓
IF no RTL exists:
  Auto-create RTL record (status: DRAFT)
    ↓
[Edit RTL]
    ↓
Form Input:
├─ Deskripsi RTL: [Rich text] *
├─ Target Penyelesaian: [Date picker] *
└─ Evidence Awal: [File upload] (optional)
    ↓
Save Draft (can edit anytime)
```

---

## 2. PIC UNIT: SUBMIT RTL

```
[PIC Unit]
    ↓
RTL Draft → [Submit untuk Review]
    ↓
Validasi:
├─ Deskripsi RTL wajib
├─ Target penyelesaian wajib
└─ Min 1 evidence wajib (submit stage)
    ↓
Confirm: "Submit RTL untuk review Admin GPM?"
    ↓
Update:
├─ Status: DRAFT → SUBMITTED
├─ tanggal_submit: NOW()
└─ submitted_by: current user
    ↓
Notifikasi Admin GPM
```

---

## 3. ADMIN GPM: REVIEW & APPROVE RTL

```
[Admin GPM]
    ↓
List RTL → Filter: SUBMITTED
    ↓
Detail RTL → Review
    ↓
Decision:
├─ [Approve] → Status: SUBMITTED → ON_PROGRESS
│   ├─ tanggal_approved: NOW()
│   ├─ approved_by: admin
│   └─ Notifikasi PIC Unit: "RTL approved, silakan kerjakan"
│
└─ [Reject] → Status: SUBMITTED → DRAFT
    ├─ catatan_reject: [Text input wajib]
    └─ Notifikasi PIC Unit: "RTL perlu revisi"
```

---

## 4. PIC UNIT: WORK ON RTL (ON_PROGRESS)

```
[PIC Unit]
    ↓
RTL ON_PROGRESS
    ↓
Work on tindak lanjut
    ↓
Upload progress evidence (optional, stage: complete)
```

---

## 5. PIC UNIT: MARK COMPLETED

```
[PIC Unit]
    ↓
RTL ON_PROGRESS → [Mark as Completed]
    ↓
Validasi:
└─ Min 1 evidence final wajib (complete stage)
    ↓
Upload Evidence Final → [Submit Complete]
    ↓
Update:
├─ Status: ON_PROGRESS → COMPLETED
└─ tanggal_completed: NOW()
    ↓
Notifikasi Admin GPM untuk verifikasi
```

---

## 6. ADMIN GPM: VERIFY COMPLETED RTL

```
[Admin GPM]
    ↓
List RTL → Filter: COMPLETED
    ↓
Detail RTL → Review Evidence
    ↓
Decision:
├─ [Verify] → Status: COMPLETED → VERIFIED
│   ├─ tanggal_verified: NOW()
│   ├─ verified_by: admin
│   └─ Notifikasi PIC Unit: "RTL verified, temuan closed"
│
└─ [Reject] → Status: COMPLETED → ON_PROGRESS
    ├─ catatan_reject: [Text input wajib]
    └─ Notifikasi PIC Unit: "RTL perlu perbaikan"
```

---

## 7. STATUS FLOW DIAGRAM

```
DRAFT
  ↓ (PIC submit)
SUBMITTED
  ↓ (Admin approve)
ON_PROGRESS
  ↓ (PIC mark done)
COMPLETED
  ↓ (Admin verify)
VERIFIED ✓

Reject flows:
- SUBMITTED → DRAFT (Admin reject submit)
- COMPLETED → ON_PROGRESS (Admin reject completion)
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
