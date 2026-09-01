# Workflow - Modul Temuan

## 1. CREATE TEMUAN (Auditor)

```
[Auditor/Admin GPM]
    ↓
Detail Sesi Audit → Tab Temuan → [+ Tambah Temuan]
    ↓
Form Input:
├─ Kategori Temuan: [Dropdown MAJOR/MINOR/OFI] *
├─ Standar Mutu: [Multi-select standar] * (min 1)
│   └─ Auto-filter: standar global + standar by unit LAM
├─ Deskripsi Temuan: [Rich text area] *
├─ Lokasi: [Text input]
├─ Tanggal Temuan: [Date picker, default: today]
├─ Evidence: [File upload multiple]
│   └─ Max 10 files, 5MB each
└─ Deadline RTL: [Date, auto-calculate, editable]
    ↓
Validasi:
├─ Kategori wajib
├─ Minimal 1 standar
├─ Deskripsi wajib
└─ Deadline >= tanggal temuan
    ↓
Save:
├─ Auto-generate nomor: 151/PM.10/KPMA/2025
├─ Insert temuan (status_rtl: DRAFT)
├─ Insert temuan_standar (multiple)
├─ Upload evidence to Supabase Storage
└─ Insert temuan_evidence records
    ↓
Success → Notifikasi PIC Unit
```

---

## 2. EDIT TEMUAN (Before RTL Submitted)

```
[Auditor/Admin GPM]
    ↓
Detail Temuan → [Edit]
    ↓
Validasi:
├─ Status RTL = DRAFT (editable)
└─ Status RTL != DRAFT (read-only, hanya bisa update evidence)
    ↓
Update temuan + standar + evidence
```

---

## 3. VIEW TEMUAN (By Role)

### Admin GPM
```
Can see ALL temuan
Filter: Periode, Unit, Kategori, Status RTL
```

### Auditor
```
Can see temuan from their sesi
My Temuan list (grouped by sesi)
```

### PIC Unit
```
Can see temuan for their unit
Unit Temuan list:
├─ Filter by status RTL
├─ Highlight: Deadline soon
└─ Action: Submit RTL
```

---

## 4. UPDATE STATUS RTL (Auto from RTL Module)

```
[PIC Unit Submit RTL]
    ↓
Status RTL: DRAFT → SUBMITTED
    ↓
[Admin GPM Review RTL]
    ↓
Status RTL: SUBMITTED → ON_PROGRESS
    ↓
[PIC Unit Complete RTL]
    ↓
Status RTL: ON_PROGRESS → COMPLETED
    ↓
[Admin GPM Verify]
    ↓
Status RTL: COMPLETED → VERIFIED
```

---

## 5. EVIDENCE MANAGEMENT

### Upload Evidence
```
[Auditor/PIC Unit]
    ↓
Detail Temuan → Tab Evidence → [Upload]
    ↓
Select files (multiple) → Upload to Storage
    ↓
Create temuan_evidence records
```

### View/Download Evidence
```
[Any User with access]
    ↓
Detail Temuan → Tab Evidence
    ↓
List evidence dengan preview
    ↓
Click → Download file
```

### Delete Evidence
```
[Auditor/Admin GPM]
    ↓
Evidence list → [Delete]
    ↓
Validasi: Status RTL = DRAFT
    ↓
Delete file from Storage + DB record
```

---

## 6. STANDAR SELECTION LOGIC

```
[Form Temuan]
    ↓
Get unit_kerja from sesi_audit
    ↓
IF unit is prodi:
    Get unit LAM
    Filter standar:
    ├─ Scope = global (all LAM)
    └─ Scope = specific AND lam_id = unit.lam_id
ELSE (non-prodi):
    Filter standar:
    └─ Scope = global only
    ↓
Display filtered standar in multi-select
```

**Example**: DPAI (prodi, LAM: LAMDIK)
- Available standar:
  - "Standar 5.1" (global)
  - "Lamdik 39" (specific, LAM: LAMDIK)
  - ❌ "Lamdikti 12" (specific, LAM: LAMDIKTI) - filtered out

---

**Version**: 1.0
**Last Updated**: 2026-09-01
