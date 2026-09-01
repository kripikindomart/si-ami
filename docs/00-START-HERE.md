# START HERE - Context Index untuk AI

File ini berisi instruksi file mana saja yang WAJIB dibaca untuk melanjutkan pekerjaan proyek SIM-AMI.

---

## 📋 WAJIB BACA (Priority Order)

### 1. Project Rules & Aturan Kerja
**File**: `docs/00-PROJECT-RULES.md`
**Wajib baca untuk**: Memahami workflow, tech stack, aturan coding, dan instruksi management
**Isi**:
- Workflow: Modul → Schema → Workflow → Wireframe → Issue → API → Frontend
- Tech Stack: Next.js 14+, Supabase, TypeScript, shadcn/ui
- Aturan: NO EMOJI, NO AI SLOP, gunakan shadcn/ui untuk UI
- Instruksi management: simpan instruksi baru, tunggu konfirmasi

### 2. Task Tracking
**Files**: 
- `docs/TASK-COMPLETED.md` - Task yang sudah selesai
- `docs/TASK-PENDING.md` - Task yang menunggu dikerjakan
- `docs/TASK-NOTES.md` - Instruksi baru & konteks penting

**Wajib baca untuk**: Tahu progress apa yang sudah dikerjakan dan apa yang pending
**Action**: Baca ketiganya untuk konteks lengkap

### 3. Database Schema (KRITIS)
**File**: `docs/01-database-schema.md`
**Wajib baca untuk**: Memahami struktur database lengkap
**Isi Penting**:
- ✅ Tabel `lam` - Master LAM (LAMDIK, LAMDIKTI, dll)
- ✅ Tabel `unit_kerja` - Field `lam_id` untuk assign LAM ke prodi
- ✅ Tabel `standar_mutu` - Field `scope` & `lam_id` untuk kategorisasi
- ✅ Tabel `temuan_standar` & `rekomendasi_standar` - Many-to-many (1 temuan bisa multiple standar)
- ✅ 22+ tables total dengan RLS, triggers, functions

**CATATAN PENTING**:
- Setiap prodi bisa punya LAM berbeda (DPAI & MPAI = LAMDIK, MM & MTP = LAMDIKTI)
- Standar mutu ada 2 jenis: GLOBAL (semua unit) & SPECIFIC (per LAM)
- 1 temuan/rekomendasi bisa punya MULTIPLE standar rujukan (contoh: Standar 5.1 + Lamdik 39)

### 4. Workflow Diagram
**File**: `docs/02-workflow-diagram.md`
**Wajib baca untuk**: Memahami alur kerja aplikasi
**Isi**: 9 workflow utama dari setup sampai reporting

### 5. Daftar Modul
**File**: `docs/MODULES-LIST.md`
**Wajib baca untuk**: Tahu modul apa saja yang harus dibangun (17 modul total)
**Struktur**: 
- A. Core & Master Data (8 modul) - termasuk **Modul LAM baru**
- B. Transaksional (5 modul)
- C. Supporting (5 modul)

### 6. Data Real AMI 2025
**File**: `docs/laporan_ami_2025.txt`
**Wajib baca untuk**: Referensi data real untuk seed data
**Isi**: 
- 13 sesi audit
- 70+ temuan dengan nomor PM
- Contoh standar rujukan per unit

---

## 🎯 QUICK START (Jika Konteks Baru)

Jika kamu AI baru yang melanjutkan proyek ini, **BACA FILE INI DULU** dalam urutan:

```
1. docs/00-PROJECT-RULES.md          ← Aturan kerja
2. docs/TASK-COMPLETED.md            ← Apa yang sudah dikerjakan
3. docs/TASK-PENDING.md              ← Apa yang harus dikerjakan
4. docs/TASK-NOTES.md                ← Instruksi penting yang belum dieksekusi
5. docs/01-database-schema.md        ← Schema database (KRITIS)
6. docs/MODULES-LIST.md              ← Daftar modul
7. docs/00-START-HERE.md             ← File ini (untuk double check)
```

**Estimasi waktu baca**: ~10-15 menit untuk konteks lengkap

---

## 🔑 KEY DECISIONS (Harus Tahu!)

### Decision 1: LAM per Prodi
- Setiap prodi bisa punya LAM berbeda
- Assignment LAM dilakukan oleh Admin GPM saat setup unit
- Contoh: DPAI & MPAI pakai LAMDIK, MM & MTP pakai LAMDIKTI

### Decision 2: Standar Global vs Specific
- **Global**: Standar 1.3, 1.4, 2.1, dll (berlaku untuk semua unit)
- **Specific**: Lamdik 1, Lamdik 2, dll (hanya untuk unit dengan LAM tertentu)
- Auto-filter standar saat input temuan berdasarkan LAM unit

### Decision 3: Multiple Standar per Temuan
- 1 temuan/rekomendasi bisa punya 2+ standar rujukan
- Contoh real: Temuan DPAI #151 → "Standar 5.1" + "Lamdik 39"
- Implementasi: Many-to-many via `temuan_standar` & `rekomendasi_standar`

### Decision 4: Nomor Otomatis
- Nomor Sesi: SA/YYYY/XXX (contoh: SA/2025/001)
- Nomor PM Temuan: XXX/PM.10/KPMA/YYYY (contoh: 151/PM.10/KPMA/2025)
- Nomor PM Rekomendasi: XXX/PM.10/KPMA/YYYY (contoh: 155/PM.10/KPMA/2025)
- Auto-generate via database functions

### Decision 5: Immutable Audit Trail
- Tindak lanjut (RTL) history tidak boleh dihapus atau diupdate
- Setiap update status = insert record baru
- Untuk compliance & audit trail yang kuat

---

## 📁 Struktur Folder Project

```
si-ami/
├── docs/
│   ├── 00-START-HERE.md              ← File ini
│   ├── 00-PROJECT-RULES.md           ← Aturan kerja
│   ├── 01-database-schema.md         ← Schema database
│   ├── 02-workflow-diagram.md        ← Workflow
│   ├── MODULES-LIST.md               ← Daftar modul
│   ├── TASK-COMPLETED.md             ← Task selesai
│   ├── TASK-PENDING.md               ← Task pending
│   ├── TASK-NOTES.md                 ← Instruksi & konteks
│   ├── laporan_ami_2025.txt          ← Data real AMI 2025
│   ├── Laporan AMI 2025.pdf          ← PDF original
│   ├── Modul_Aplikasi_SIM_AMI.md     ← Requirements awal
│   └── modules/                      ← Dokumentasi per modul
│       ├── user-management/
│       │   ├── README.md
│       │   ├── 01-schema.md
│       │   ├── 02-workflow.md
│       │   ├── 03-wireframe.md
│       │   ├── 04-issues.md
│       │   └── 05-api-endpoints.md
│       └── ... (modul lainnya)
├── .kiro/
│   ├── hooks/
│   │   └── auto-approve-tools.json   ← Hook auto-approve
│   └── skills/
│       └── pdf.md                    ← PDF processing skill
└── .git/                             ← Git repo
```

---

## 🚀 Next Steps (Untuk Melanjutkan)

1. **Jika melanjutkan dokumentasi**:
   - Buat dokumentasi per modul di `docs/modules/[nama-modul]/`
   - Ikuti template: 01-schema.md, 02-workflow.md, 03-wireframe.md, 04-issues.md, 05-api-endpoints.md

2. **Jika mau mulai coding**:
   - Setup Next.js project (tunggu konfirmasi user)
   - Setup Supabase project (tunggu konfirmasi user)
   - Jalankan migration database

3. **Jika ada instruksi baru**:
   - JANGAN langsung eksekusi
   - Simpan di `docs/TASK-NOTES.md`
   - Tunggu konfirmasi user

---

## ⚠️ PENTING: Hal yang TIDAK BOLEH Dilakukan

1. ❌ **JANGAN pakai EMOJI** di kodingan, dokumentasi, atau issue
2. ❌ **JANGAN buat UI component manual** - gunakan shadcn/ui
3. ❌ **JANGAN langsung eksekusi instruksi baru** - simpan dulu di TASK-NOTES
4. ❌ **JANGAN skip baca schema** - schema adalah source of truth
5. ❌ **JANGAN lupa update TASK-COMPLETED** setelah selesai task

---

## 📊 Progress Summary (Terakhir Update: 2026-09-01)

✅ **Selesai**:
- Repository setup & git remote
- Database schema lengkap (22+ tables, views, functions, triggers, RLS)
- Workflow diagram (9 workflows)
- Project rules & tracking system
- PDF processing skill
- Modul LAM untuk kategorisasi standar
- Support multiple standar per temuan/rekomendasi

🔄 **In Progress**:
- Dokumentasi per modul (baru user-management)

⏳ **Pending**:
- ERD Diagram
- Wireframe design
- GitHub Issues creation
- API Endpoints spec
- Setup Next.js project (tunggu konfirmasi)
- Setup Supabase project (tunggu konfirmasi)

---

## 💡 Tips untuk AI yang Melanjutkan

1. **Selalu baca TASK-NOTES dulu** - ada instruksi penting yang belum dieksekusi
2. **Cek TASK-PENDING** - tahu task mana yang priority
3. **Update TASK-COMPLETED** - tracking progress penting untuk user
4. **Tanya jika tidak jelas** - lebih baik tanya daripada salah asumsi
5. **Ikuti aturan di PROJECT-RULES** - konsistensi penting untuk project jangka panjang

---

**Versi**: 1.0
**Last Updated**: 2026-09-01 16:00
**Updated By**: Kiro AI (Claude Sonnet 4.5)

---

**CATATAN UNTUK USER**: 
File ini akan selalu diupdate setiap ada perubahan signifikan. Untuk AI baru yang melanjutkan, instruksikan untuk baca file ini dulu sebelum mulai kerja.
