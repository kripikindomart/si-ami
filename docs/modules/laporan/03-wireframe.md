# Wireframe - Modul Laporan

## 1. PAGE: Laporan List

```
┌────────────────────────────────────────────────────────────┐
│ LAPORAN AUDIT                                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Jenis Laporan                                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 📄 Laporan Sesi Audit                    [Generate]  │ │
│ │    Detail hasil audit per sesi                       │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ 📊 Laporan Temuan by Unit                [Generate]  │ │
│ │    Distribusi temuan per unit kerja                  │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ 📈 Laporan RTL Progress                  [Generate]  │ │
│ │    Progress tindak lanjut by unit                    │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ 📑 Laporan Komprehensif Periode          [Generate]  │ │
│ │    Laporan lengkap periode audit                     │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ 📉 Laporan Statistik                     [Generate]  │ │
│ │    Chart & statistik agregat                         │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                            │
│ Riwayat Laporan                                            │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Laporan Komprehensif AMI 2025      [Download PDF]   │ │
│ │ Generated: 20 Mar 2025 10:30                         │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ Laporan Temuan DPAI                [Download Excel]  │ │
│ │ Generated: 15 Mar 2025 14:20                         │ │
│ └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## 2. MODAL: Generate Laporan Form

```
┌────────────────────────────────────────────────┐
│ GENERATE LAPORAN SESI AUDIT                   │
├────────────────────────────────────────────────┤
│                                                │
│ Periode Audit *                                │
│ [AMI 2025____________________ ▼]               │
│                                                │
│ Sesi Audit *                                   │
│ [SA/2025/001 - DPAI__________ ▼]               │
│                                                │
│ Format Export *                                │
│ ( ) PDF  ( ) Excel                             │
│                                                │
│ Include Evidence Preview                       │
│ [ ] Include evidence thumbnails (PDF only)     │
│                                                │
│                   [Batal]  [Generate]          │
└────────────────────────────────────────────────┘
```

---

## 3. PDF OUTPUT: Laporan Sesi Audit

```
┌────────────────────────────────────────────────┐
│ LAPORAN HASIL AUDIT MUTU INTERNAL              │
│ SEKOLAH PASCASARJANA UIKA                      │
├────────────────────────────────────────────────┤
│                                                │
│ Nomor Sesi   : SA/2025/001                     │
│ Periode      : AMI 2025                        │
│ Unit Kerja   : S3 Doktoral PAI (DPAI)          │
│ Tanggal Audit: 10-15 Maret 2025                │
│                                                │
│ Tim Auditor:                                   │
│ - Ketua    : Dr. Ali Murtadho, M.Pd           │
│ - Anggota  : Dr. Budi Santoso, M.Si           │
│             Dr. Cici Amalia, M.M              │
│                                                │
├────────────────────────────────────────────────┤
│ RINGKASAN                                      │
│                                                │
│ Total Temuan         : 8                       │
│ - MAJOR             : 3                       │
│ - MINOR             : 3                       │
│ - OFI               : 2                       │
│                                                │
│ Nilai Positif        : 5                       │
│ RTL Verified         : 6                       │
│                                                │
├────────────────────────────────────────────────┤
│ DAFTAR TEMUAN                                  │
│                                                │
│ 1. Temuan #151 - Ketidaksesuaian dokumen      │
│    Kategori: MAJOR                             │
│    Standar: Standar 5.1, Lamdik 39            │
│    Deskripsi: ...                              │
│    Rekomendasi: ...                            │
│    Status RTL: VERIFIED                        │
│                                                │
│ [... more temuan ...]                          │
│                                                │
├────────────────────────────────────────────────┤
│ NILAI POSITIF                                  │
│                                                │
│ 1. Tim dosen sangat responsif...              │
│ 2. Fasilitas laboratorium lengkap...          │
│                                                │
└────────────────────────────────────────────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
