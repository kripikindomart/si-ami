# Workflow - Modul Rekomendasi

## 1. CREATE REKOMENDASI

```
[Auditor/Admin GPM]
    ↓
Detail Temuan → Tab Rekomendasi → [+ Tambah]
    ↓
Form Input:
├─ Temuan: [Auto-filled from context]
├─ Standar Mutu: [Multi-select] * (min 1)
│   └─ Same filter as temuan (by unit LAM)
├─ Deskripsi Rekomendasi: [Rich text area] *
├─ Tanggal: [Date picker, default: today]
└─ Evidence: [File upload, optional]
    ↓
Validasi:
├─ Min 1 standar
└─ Deskripsi wajib
    ↓
Save:
├─ Auto-generate nomor: 154/PM.10/KPMA/2025
├─ Insert rekomendasi
├─ Insert rekomendasi_standar (multiple)
└─ Upload evidence (if any)
```

---

## 2. EDIT REKOMENDASI

```
[Auditor/Admin GPM]
    ↓
Detail Rekomendasi → [Edit]
    ↓
Validasi:
└─ Temuan status RTL = DRAFT (editable)
    ↓
Update rekomendasi + standar + evidence
```

---

## 3. VIEW REKOMENDASI (By Role)

### Admin GPM
```
Can see ALL rekomendasi
Filter: Periode, Unit, Temuan
```

### Auditor
```
Can see rekomendasi from their sesi
Grouped by temuan
```

### PIC Unit
```
Can see rekomendasi for their unit temuan
Read only
Used as reference for RTL
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
