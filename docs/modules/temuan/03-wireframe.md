# Wireframe - Modul Temuan

## 1. PAGE: List Temuan

```
┌────────────────────────────────────────────────────────────────────┐
│ TEMUAN - PERIODE AMI 2025                       [+ Tambah Temuan]  │
├────────────────────────────────────────────────────────────────────┤
│ Filter: [Unit ▼] [Kategori ▼] [Status RTL ▼]        [Search...]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Nomor             │ Unit  │ Kategori │ Standar      │ Status │ ⚠  │
│───────────────────┼───────┼──────────┼──────────────┼────────┼────│
│ 151/PM.10/        │ DPAI  │ [MAJOR]  │ Standar 5.1, │ [🟠]   │ 🔴 │
│ KPMA/2025         │       │          │ Lamdik 39    │ON PROG │    │
│ Ketidaksesuaian..│       │          │              │Deadline│    │
│                   │       │          │              │5 days  │    │
│───────────────────┼───────┼──────────┼──────────────┼────────┼────│
│ 152/PM.10/        │ MM    │ [MINOR]  │ Standar 3.2  │ [✓]    │    │
│ KPMA/2025         │       │          │              │COMPLETE│    │
│ Kekurangan SDM    │       │          │              │        │    │
│───────────────────┼───────┼──────────┼──────────────┼────────┼────│
│ 153/PM.10/        │ S2    │ [OFI]    │ Standar 8.1  │ [⚪]   │    │
│ KPMA/2025         │Hukum  │          │              │DRAFT   │    │
│ Improvement...    │       │          │              │        │    │
└────────────────────────────────────────────────────────────────────┘

Legend:
🔴 = Overdue deadline
🟡 = Deadline < 7 days
```

---

## 2. PAGE: Form Tambah/Edit Temuan

```
┌────────────────────────────────────────────────────────────────┐
│ TAMBAH TEMUAN - SESI SA/2025/001 (DPAI)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Nomor Temuan (Auto-Generate)                                   │
│ [151/PM.10/KPMA/2025__________________] (disabled)             │
│                                                                │
│ Kategori Temuan *                                              │
│ ( ) MAJOR  ( ) MINOR  ( ) OFI                                  │
│                                                                │
│ Standar Mutu Rujukan * (min. 1, dapat lebih)                   │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ [x] Standar 5.1 (Global)                                 │ │
│ │ [x] Lamdik 39 - Sistem Pembelajaran (Specific - LAMDIK) │ │
│ │ [ ] Standar 3.2 (Global)                                 │ │
│ │ [ ] Lamdik 12 - SDM (Specific - LAMDIK)                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Selected: Standar 5.1, Lamdik 39                               │
│                                                                │
│ Deskripsi Temuan *                                             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Ketidaksesuaian antara dokumen kurikulum dengan         │ │
│ │ implementasi di lapangan. Beberapa mata kuliah yang     │ │
│ │ tercantum dalam dokumen tidak dilaksanakan sesuai       │ │
│ │ dengan RPS yang telah ditetapkan.                       │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                                │
│ Lokasi Temuan                                                  │
│ [Ruang Perkuliahan Gedung A_____________________]             │
│                                                                │
│ Tanggal Temuan        Deadline RTL (auto: +30 hari)           │
│ [10/03/2025 📅]       [09/04/2025 📅]                         │
│                                                                │
│ Evidence/Bukti                                                 │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ [📎 Upload Files] (Max 10 files, 5MB each)              │ │
│ │                                                          │ │
│ │ Uploaded:                                                │ │
│ │ - 📄 dokumen-kurikulum.pdf (2.3MB)       [x Remove]     │ │
│ │ - 📷 foto-kelas.jpg (1.8MB)              [x Remove]     │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                                │
│                                 [Batal]  [Simpan]              │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. PAGE: Detail Temuan

```
┌────────────────────────────────────────────────────────────────┐
│ TEMUAN: 151/PM.10/KPMA/2025                   [Edit] [Delete]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Informasi Temuan                                            ││
│ │ Nomor         : 151/PM.10/KPMA/2025                         ││
│ │ Sesi Audit    : SA/2025/001 - DPAI                          ││
│ │ Kategori      : [MAJOR]                                     ││
│ │ Tanggal       : 10 Maret 2025                               ││
│ │ Deadline RTL  : 09 April 2025 (29 hari lagi) 🟡            ││
│ │ Status RTL    : [🟠 On Progress]         [Update Status ▼] ││
│ │                                                             ││
│ │ Standar Mutu Rujukan:                                       ││
│ │ - Standar 5.1 (Global)                                      ││
│ │ - Lamdik 39 - Sistem Pembelajaran (Specific - LAMDIK)      ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Deskripsi Temuan                                            ││
│ │ Ketidaksesuaian antara dokumen kurikulum dengan            ││
│ │ implementasi di lapangan. Beberapa mata kuliah yang        ││
│ │ tercantum dalam dokumen tidak dilaksanakan sesuai dengan   ││
│ │ RPS yang telah ditetapkan.                                 ││
│ │                                                             ││
│ │ Lokasi: Ruang Perkuliahan Gedung A                         ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌──────────────────┬─────────────────┬───────────────────────┐│
│ │ [Evidence]       │ [Rekomendasi]   │ [Tindak Lanjut]       ││
│ ├──────────────────┴─────────────────┴───────────────────────┤│
│ │                                                             ││
│ │ Evidence (2 files)                      [+ Upload]          ││
│ │ ┌──────────────────────────────────────────────────────┐  ││
│ │ │ 📄 dokumen-kurikulum.pdf (2.3MB)      [👁] [⬇] [🗑]  │  ││
│ │ │ Uploaded by: Dr. Ali - 10 Mar 2025                   │  ││
│ │ │                                                      │  ││
│ │ │ 📷 foto-kelas.jpg (1.8MB)             [👁] [⬇] [🗑]  │  ││
│ │ │ Uploaded by: Dr. Ali - 10 Mar 2025                   │  ││
│ │ └──────────────────────────────────────────────────────┘  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. COMPONENT: Standar Multi-Select (with LAM Filter)

```
┌──────────────────────────────────────────────────────────┐
│ Standar Mutu untuk Unit: DPAI (LAM: LAMDIK)             │
├──────────────────────────────────────────────────────────┤
│ [x] Standar 5.1 (Global) ✓ All LAM                      │
│ [x] Lamdik 39 - Sistem Pembelajaran (LAMDIK)            │
│ [ ] Lamdik 12 - SDM (LAMDIK)                             │
│ [ ] Standar 3.2 (Global) ✓ All LAM                      │
│                                                          │
│ ❌ Filtered out (not shown):                             │
│    - Lamdikti 15 (LAMDIKTI) - not matching unit LAM     │
│    - Lamdikes 8 (LAMDIKES) - not matching unit LAM      │
└──────────────────────────────────────────────────────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
