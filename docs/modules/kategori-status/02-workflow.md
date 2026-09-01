# Workflow - Modul Kategori & Status

## 1. CRUD KATEGORI TEMUAN

```
[Admin GPM]
    ↓
Menu Master Data → Kategori Temuan
    ↓
CRUD operations:
├─ Create: Tambah kategori baru
├─ Edit: Update nama/warna
└─ Toggle: Aktif/Nonaktif
```

---

## 2. CRUD STATUS RTL

```
[Admin GPM]
    ↓
Menu Master Data → Status RTL
    ↓
CRUD operations:
├─ Create: Tambah status baru
├─ Edit: Update nama/warna/urutan
└─ Toggle: Aktif/Nonaktif
```

---

## 3. USAGE IN FORMS

### Kategori Temuan (Dropdown di Form Temuan)
```
[Auditor Input Temuan]
    ↓
Kategori: [Dropdown kategori aktif]
    ├─ Major
    ├─ Minor
    └─ OFI
```

### Status RTL (Auto-update di RTL Flow)
```
[PIC Unit Submit RTL]
    ↓
Status auto-update: DRAFT → SUBMITTED → ON_PROGRESS → COMPLETED → VERIFIED
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
