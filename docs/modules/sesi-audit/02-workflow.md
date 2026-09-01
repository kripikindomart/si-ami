# Workflow - Modul Sesi Audit

## 1. CREATE SESI AUDIT

```
[Admin GPM]
    ↓
Menu Sesi Audit → Tambah Sesi
    ↓
Form Input:
├─ Unit Kerja: [Dropdown unit aktif]
├─ Tanggal Mulai: [Date picker]
├─ Tanggal Selesai: [Date picker, optional]
├─ Ketua Auditor: [Dropdown auditor, wajib]
├─ Anggota Auditor: [Multi-select auditor]
└─ Keterangan: [Text area]
    ↓
Validasi:
├─ Check periode aktif exists
├─ Check unit tidak punya sesi SCHEDULED/IN_PROGRESS
├─ Check ketua auditor tidak null
└─ Check tanggal selesai >= tanggal mulai
    ↓
Save:
├─ Auto-generate nomor: SA/2025/001
├─ Insert sesi_audit (status: SCHEDULED)
└─ Insert sesi_auditor (ketua + anggota)
    ↓
Success → Redirect to detail
```

---

## 2. UPDATE STATUS SESI

```
[Admin GPM / Ketua Auditor]
    ↓
Detail Sesi → Change Status
    ↓
Status Flow:
SCHEDULED → IN_PROGRESS → COMPLETED
     ↓
 CANCELLED (any time)
    ↓
Validasi:
├─ SCHEDULED → IN_PROGRESS: Check tanggal mulai <= today
├─ IN_PROGRESS → COMPLETED: Check semua temuan sudah terisi
└─ COMPLETED: Cannot change (immutable)
    ↓
Update status + updated_at
```

---

## 3. VIEW SESI (By Role)

### Admin GPM
```
Can see ALL sesi
Filter: Periode, Unit, Status, Auditor
```

### Auditor
```
Can see sesi where assigned (ketua/anggota)
My Sesi list:
├─ Upcoming (SCHEDULED)
├─ In Progress (IN_PROGRESS)
└─ Completed (COMPLETED)
```

### PIC Unit
```
Can see sesi for their unit
Unit Sesi list:
├─ Current (IN_PROGRESS)
├─ Scheduled (SCHEDULED)
└─ History (COMPLETED)
```

---

## 4. EDIT TIM AUDITOR

```
[Admin GPM]
    ↓
Detail Sesi → Edit Tim Auditor
    ↓
Validasi:
├─ Status != COMPLETED
└─ Ketua auditor wajib ada
    ↓
Update sesi_auditor:
├─ Delete old assignments
└─ Insert new assignments
```

---

## 5. CANCEL SESI

```
[Admin GPM]
    ↓
Detail Sesi → Cancel
    ↓
Confirm: "Batalkan sesi ini?"
    ↓
Validasi:
├─ Status != COMPLETED
└─ Check no temuan/nilai_positif exists (or cascade delete)
    ↓
Update status = CANCELLED
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
