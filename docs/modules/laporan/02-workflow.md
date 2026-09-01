# Workflow - Modul Laporan

## 1. GENERATE LAPORAN

```
[User]
    ↓
Menu Laporan → Pilih Jenis Laporan
    ↓
Form Parameter:
├─ Periode Audit (required)
├─ Unit Kerja (optional filter)
├─ Range Tanggal (optional)
└─ Format Export: PDF / Excel
    ↓
[Generate Laporan]
    ↓
Backend:
├─ Query data from views
├─ Generate document (PDF/Excel)
└─ Return file URL/download
    ↓
User download file
```

---

## 2. LAPORAN SESI AUDIT

```
Input: sesi_id
    ↓
Get data:
├─ Sesi info (nomor, tanggal, unit, auditor)
├─ Temuan list with kategori & status RTL
├─ Rekomendasi per temuan
├─ Nilai positif list
└─ Summary statistik
    ↓
Generate PDF/Excel
```

---

## 3. LAPORAN KOMPREHENSIF PERIODE

```
Input: periode_id
    ↓
Get data:
├─ Statistik umum (get_statistik_periode)
├─ Temuan by unit (v_temuan_by_unit)
├─ Temuan by kategori (aggregation)
├─ RTL progress by unit
└─ Top temuan (most frequent standar/kategori)
    ↓
Generate PDF dengan charts + tables
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
