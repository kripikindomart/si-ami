# Wireframe - Modul Standar Mutu

## 1. PAGE: List Standar Mutu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MASTER DATA STANDAR MUTU                          [+ Tambah Standar]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter: [Scope: Semua ▼] [LAM: Semua ▼] [Status: Aktif ▼] [Search: ___]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Kode        │ Nama Standar            │ Scope    │ LAM     │ Status │ Aksi │
├─────────────┼─────────────────────────┼──────────┼─────────┼────────┼──────┤
│ Standar 1.1 │ Visi, Misi, Tujuan     │ Global   │    -    │ Aktif  │ [⋮] │
├─────────────┼─────────────────────────┼──────────┼─────────┼────────┼──────┤
│ Lamdik 5    │ Standar Isi Pembelajar.│ Specific │ LAMDIK  │ Aktif  │ [⋮] │
├─────────────┼─────────────────────────┼──────────┼─────────┼────────┼──────┤
│ Standard 1  │ Vision, Mission        │ Specific │ LAMDIKTI│ Aktif  │ [⋮] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DIALOG: Create Standar (Global)

```
┌──────────────────────────────────────────────────┐
│ Tambah Standar Mutu                     [✕]     │
├──────────────────────────────────────────────────┤
│  Kode Standar *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Standar 1.1                                │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Nama Standar *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Visi, Misi, Tujuan, dan Strategi          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Scope *                                         │
│  ┌──────────────────────────────────────────┐   │
│  │ ● Global (berlaku untuk semua prodi)     │   │
│  │ ○ Specific (berlaku untuk LAM tertentu)  │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  Nomor Urut                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ 1                                          │ │
│  └────────────────────────────────────────────┘ │
│  Untuk sorting                                   │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

---

## 3. DIALOG: Create Standar (Specific - LAM Muncul)

```
┌──────────────────────────────────────────────────┐
│ Tambah Standar Mutu                     [✕]     │
├──────────────────────────────────────────────────┤
│  Kode Standar *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Lamdik 5                                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Nama Standar *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Standar Isi Pembelajaran                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Scope *                                         │
│  ┌──────────────────────────────────────────┐   │
│  │ ○ Global                                  │   │
│  │ ● Specific (berlaku untuk LAM tertentu)   │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM (Wajib untuk Specific) *               │ │
│  ├────────────────────────────────────────────┤ │
│  │ [LAMDIK ▼]                                 │ │
│  │   ○ LAMDIK                                 │ │
│  │   ○ LAMDIKTI                               │ │
│  │   ○ LAMDIKES                               │ │
│  │   ○ GLOBAL                                 │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Nomor Urut: [5]                                 │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

**Conditional Logic**:
- Jika Scope=Global → Hide LAM field, set lam_id=null
- Jika Scope=Specific → Show LAM field, LAM wajib dipilih

---

## 4. MULTI-SELECT: Pilih Standar di Form Temuan

```
┌──────────────────────────────────────────────────┐
│ INPUT TEMUAN                                     │
├──────────────────────────────────────────────────┤
│  Unit yang Diaudit: DPAI (LAM: LAMDIK)          │
│                                                  │
│  Standar Rujukan * (Multi-select)               │
│  ┌────────────────────────────────────────────┐ │
│  │ ☑ Standar 1.1 - Visi, Misi, Tujuan        │ │
│  │ ☐ Standar 1.2 - Tata Pamong               │ │
│  │ ☐ Standar 5.1 - Kurikulum                 │ │
│  │ ☑ Lamdik 5 - Standar Isi Pembelajaran     │ │
│  │ ☐ Lamdik 39 - Standar Penelitian          │ │
│  └────────────────────────────────────────────┘ │
│  (Hanya standar global + LAMDIK yang muncul)     │
│                                                  │
│  Selected: Standar 1.1, Lamdik 5                 │
└──────────────────────────────────────────────────┘
```

**Auto-Filter Logic**:
- Query: `scope=global OR (scope=specific AND lam_id=unit.lam_id)`
- Result: Standar global + standar specific untuk LAM unit tersebut

---

**Version**: 1.0
**Last Updated**: 2026-09-01
