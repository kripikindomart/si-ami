# Workflow - Modul Import AAR

## 1. UPLOAD & PARSE DOKUMEN

```
[Admin GPM]
    ↓
Menu Import AAR
    ↓
Upload PDF file (Laporan AMI 2024.pdf)
    ↓
Pilih source: [AAR_2024 ▼]
    ↓
[Parse Document] (AI processing)
    ↓
Backend:
├─ Detect PDF type:
│  ├─ Text-based PDF → pdf-parse
│  └─ Scanned PDF → Tesseract OCR
├─ Extract text
├─ GPT-4 or Regex: Parse structured data
│  ├─ Units (kode, nama, tanggal)
│  ├─ Temuan (nomor, kategori, deskripsi, standar)
│  ├─ Nilai positif
│  └─ Rekomendasi
└─ Return JSON
    ↓
Display preview table:
[Unit DPAI] 12 temuan, 5 nilai positif
[Unit MM] 8 temuan, 3 nilai positif
...
```

---

## 2. REVIEW & IMPORT

```
[Admin GPM]
    ↓
Review extracted data:
├─ Check unit names
├─ Check temuan details
└─ Edit if needed
    ↓
[Import to Database]
    ↓
Backend process:
├─ Create import_log (status: processing)
│
├─ For each unit:
│  ├─ Get/match unit_kerja by kode
│  ├─ Create sesi_audit (status: COMPLETED)
│  ├─ Create temuan (is_imported: true, status_rtl: VERIFIED)
│  ├─ Create tindak_lanjut (auto verified)
│  └─ Create nilai_positif
│
└─ Update import_log (status: completed)
    ↓
Show result:
✓ 12 units imported
✓ 95 temuan imported
✗ 2 errors (unit not found)
```

---

## 3. VIEW IMPORTED DATA

```
[Any User]
    ↓
Temuan List → Filter: [is_imported: true]
    ↓
Display imported temuan:
├─ Badge: "IMPORTED"
├─ Read-only (no edit/delete)
├─ Status RTL: VERIFIED
└─ Link to original PDF
```

---

## DATA FLOW DIAGRAM

```
PDF Document (Laporan AMI 2025.pdf)
    ↓
[pdf-parse] → Extract raw text
    ↓
[GPT-4 API] → Parse structured JSON
    ↓
{
  units: [
    { kode: "DPAI", nama: "...", temuan: [...] }
  ]
}
    ↓
[Preview UI] → Admin review
    ↓
[Import Service] → Create DB records
    ↓
Database:
├─ sesi_audit (status: COMPLETED)
├─ temuan (is_imported: true, status_rtl: VERIFIED)
├─ tindak_lanjut (verified)
├─ nilai_positif
└─ import_log (audit trail)
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
