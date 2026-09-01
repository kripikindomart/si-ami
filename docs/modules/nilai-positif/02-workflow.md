# Workflow - Modul Nilai Positif

## 1. CREATE NILAI POSITIF

```
[Auditor/Admin GPM]
    ↓
Detail Sesi Audit → Tab Nilai Positif → [+ Tambah]
    ↓
Form Input:
├─ Deskripsi: [Rich text area] *
├─ Tanggal: [Date picker, default: today]
└─ Evidence: [File upload multiple]
    ↓
Validasi:
└─ Deskripsi wajib
    ↓
Save:
├─ Insert nilai_positif
├─ Upload evidence to Supabase Storage
└─ Insert nilai_positif_evidence records
```

---

## 2. EDIT NILAI POSITIF

```
[Auditor/Admin GPM]
    ↓
Detail Nilai Positif → [Edit]
    ↓
Update deskripsi + evidence
```

---

## 3. VIEW NILAI POSITIF (By Role)

### Admin GPM
```
Can see ALL nilai positif
Filter: Periode, Unit
```

### Auditor
```
Can see nilai positif from their sesi
My Nilai Positif list
```

### PIC Unit
```
Can see nilai positif for their unit
Read only
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
