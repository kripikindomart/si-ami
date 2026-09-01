# Wireframe - Modul Periode Audit

## 1. PAGE: List Periode Audit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MASTER DATA PERIODE AUDIT                         [+ Tambah Periode]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter: [Status: Semua ▼] [Search: ______]                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Nama       │Tahun│Periode           │Progress   │Status  │Aksi            │
├────────────┼─────┼──────────────────┼───────────┼────────┼────────────────┤
│ AMI 2026   │2026 │15 Jan - 30 Jun   │ 0/10 (0%) │ Draft  │[Edit][Aktifkan]│
├────────────┼─────┼──────────────────┼───────────┼────────┼────────────────┤
│ AMI 2025   │2025 │20 Jan - 30 Jun   │8/10 (80%) │✓ Aktif │[Edit][Close]   │
├────────────┼─────┼──────────────────┼───────────┼────────┼────────────────┤
│ AMI 2024   │2024 │15 Jan - 30 Jun   │10/10(100%)│Selesai │[Lihat]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Action Buttons**:
- Draft: Edit, Aktifkan, Hapus
- Aktif: Edit, Close
- Selesai: Lihat (read-only)

---

## 2. DIALOG: Create Periode

```
┌──────────────────────────────────────────────────┐
│ Tambah Periode Audit                    [✕]     │
├──────────────────────────────────────────────────┤
│  Nama Periode *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ AMI 2026                                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Tahun *                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ 2026                                       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Tanggal Mulai *          Tanggal Selesai *      │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │ 📅 15 Jan 2026   │    │ 📅 30 Jun 2026   │   │
│  └──────────────────┘    └──────────────────┘   │
│                                                  │
│  Deskripsi                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ Audit Mutu Internal Tahun 2026            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

---

## 3. DIALOG: Set Aktif Confirmation

```
┌──────────────────────────────────────────────┐
│ ⚠ Aktifkan Periode?                 [✕]     │
├──────────────────────────────────────────────┤
│  Anda akan mengaktifkan:                     │
│  • AMI 2026 (15 Jan - 30 Jun 2026)          │
│                                              │
│  Periode aktif saat ini:                     │
│  • AMI 2025 akan otomatis dinonaktifkan      │
│                                              │
│  Hanya bisa ada 1 periode aktif.             │
│                                              │
│           [Batal]  [Ya, Aktifkan]            │
└──────────────────────────────────────────────┘
```

---

## 4. DIALOG: Close Periode

```
┌──────────────────────────────────────────────┐
│ ⚠ Close Periode?                    [✕]     │
├──────────────────────────────────────────────┤
│  Periode: AMI 2025                           │
│                                              │
│  Progress saat ini:                          │
│  ✓ 10/10 unit selesai diaudit (100%)        │
│  ⚠ 45/50 RTL completed (90%)                │
│                                              │
│  Periode yang di-close:                      │
│  • Tidak bisa diubah lagi (immutable)        │
│  • Tetap bisa dilihat untuk laporan          │
│                                              │
│  Yakin close periode ini?                    │
│                                              │
│           [Batal]  [Ya, Close]               │
└──────────────────────────────────────────────┘
```

---

## 5. CARD: Periode Progress (Dashboard)

```
┌────────────────────────────────────────┐
│ AMI 2025                    [Details▼] │
├────────────────────────────────────────┤
│ Timeline:                              │
│ 20 Jan 2025 ━━━━━━━━━━━━━━ 30 Jun 2025│
│          [████████░░] 80% berlalu      │
│                                        │
│ Progress Audit:                        │
│ 8/10 unit (80%) [███████░░░]          │
│                                        │
│ Temuan & Rekomendasi:                  │
│ • 42 Temuan                            │
│ • 35 Rekomendasi                       │
│ • 30/35 RTL Completed (85.7%)          │
└────────────────────────────────────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
