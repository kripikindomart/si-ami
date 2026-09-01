# ATURAN PROJECT SIM-AMI

## Workflow Pembangunan Aplikasi

```
Modul → Schema & ERD → Workflow → Wireframe → Issue → API Endpoint → Frontend
```

## Struktur Folder Per Modul

Setiap modul WAJIB punya folder sendiri di `docs/modules/[nama-modul]/`:

```
docs/
├── modules/
│   ├── user-management/
│   │   ├── 01-schema.md          # Database schema untuk modul ini
│   │   ├── 02-workflow.md        # Workflow & business logic
│   │   ├── 03-wireframe.md       # UI mockup & component
│   │   ├── 04-issues.md          # Template issue untuk modul ini
│   │   └── 05-api-endpoints.md   # API spec modul ini
│   ├── unit-kerja/
│   │   ├── 01-schema.md
│   │   ├── 02-workflow.md
│   │   ├── 03-wireframe.md
│   │   ├── 04-issues.md
│   │   └── 05-api-endpoints.md
│   └── ... (modul lainnya)
```

### 1. Rancangan Per Modul
- Buat rancangan detail per modul
- Setiap modul harus punya: tujuan, fitur, dan batasan scope
- Semua dokumentasi modul HARUS di folder `docs/modules/[nama-modul]/`

### 2. Schema & ERD
- Database schema lengkap dengan semua field
- ERD visual untuk relasi antar tabel
- Include constraints, indexes, dan triggers

### 3. Workflow
- Flow proses bisnis per modul
- State diagram untuk status
- Decision tree untuk logic

### 4. Wireframe
- Mockup UI/UX per halaman
- Component breakdown
- User interaction flow

### 5. Issue (GitHub)
- **WAJIB** gunakan format template lengkap di `docs/04-github-issues-template.md`
- **WAJIB** isi semua section: Tujuan, Deskripsi, Acceptance Criteria, Technical Details, Referensi, Estimasi
- **WAJIB** tambahkan label yang sesuai (modul, priority, type, status, size)
- Walaupun di dokumentasi module sudah ada breakdown task, **TETAP WAJIB** buat issue dengan format template lengkap
- Bahasa Indonesia yang jelas (untuk junior programmer & AI murah)
- **TIDAK BOLEH ADA EMOJI**
- Setiap issue = 1 task spesifik
- **WAJIB** close issue dengan comment detail pengerjaan (lihat template close issue)

### 6. API Endpoint
- REST API spec lengkap
- Request/Response format
- Error handling
- Authentication & authorization

### 7. Frontend
- Implementation sesuai wireframe
- Component-based architecture
- Clean code, no AI slop

---

## Aturan Coding

### ❌ DILARANG:
1. **EMOJI** di kodingan, dokumentasi, atau issue
2. **AI Slop** (kode yang terlalu verbose, comment berlebihan)
3. **Buat UI component manual** (button, input, dll) - gunakan shadcn/ui
4. **Hardcode** - semua harus dynamic & configurable

### ✅ WAJIB:
1. **shadcn/ui** untuk semua component UI
2. **Install dependency** via package manager (npm/yarn)
3. **Clean code** - readable, maintainable
4. **TypeScript** - type safety
5. **Supabase** - untuk backend (database, auth, storage)

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand / React Context
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Date**: date-fns
- **HTTP Client**: Supabase client

---

## Instruksi Management

### Saat Ada Instruksi Baru:
1. **JANGAN LANGSUNG EKSEKUSI** kecuali diminta
2. **SIMPAN** di catatan (file TASK-NOTES.md)
3. **TANDAI** relasi ke issue yang ada, atau buat issue baru
4. **TUNGGU** konfirmasi untuk eksekusi

### Format Catatan Instruksi:
```markdown
## [YYYY-MM-DD HH:MM] - Instruksi Baru

**Dari**: User
**Konteks**: [situasi saat instruksi diberikan]
**Instruksi**: [detail instruksi]
**Status**: PENDING / IN_PROGRESS / DONE
**Relasi Issue**: #XXX (jika ada)
**Catatan**: [catatan tambahan]
```

---

## Task Tracking

### File Tracking:
- `docs/TASK-COMPLETED.md` - Task yang sudah selesai
- `docs/TASK-PENDING.md` - Task yang menunggu eksekusi
- `docs/TASK-NOTES.md` - Catatan instruksi & konteks

### Format Task Completed:
```markdown
## [YYYY-MM-DD] Task Title

**Issue**: #XXX
**Modul**: [nama modul]
**Deskripsi**: [apa yang dikerjakan]
**Files Changed**:
- path/to/file1.ts
- path/to/file2.tsx

**Result**: [hasil/output]
**Notes**: [catatan penting]
```

---

## Issue Template (GitHub)

### Format Issue:

```markdown
# [MODUL] Judul Task

## Tujuan
[Jelaskan tujuan task ini dengan bahasa sederhana]

## Deskripsi
[Detail apa yang harus dikerjakan]

## Acceptance Criteria
- [ ] Kriteria 1
- [ ] Kriteria 2
- [ ] Kriteria 3

## Technical Details
- **Tabel/Database**: [jika ada]
- **API Endpoint**: [jika ada]
- **Component**: [jika ada]
- **Dependencies**: [library yang dibutuhkan]

## Referensi
- Link ke dokumentasi
- Link ke wireframe
- Link ke schema

## Estimasi
[XS / S / M / L / XL]

## Catatan
[Catatan tambahan untuk implementor]
```

### Label Issue:
- `modul:core` - Core & Master Data
- `modul:transaksional` - Temuan, RTL, dll
- `modul:support` - Dashboard, Laporan, dll
- `priority:high` - Urgent
- `priority:medium` - Normal
- `priority:low` - Bisa nanti
- `type:feature` - Fitur baru
- `type:bug` - Bug fix
- `type:refactor` - Refactoring
- `type:docs` - Dokumentasi
- `status:ready` - Siap dikerjakan
- `status:blocked` - Terblokir
- `status:in-progress` - Sedang dikerjakan
- `status:review` - Perlu review

---

## Catatan Penting

1. **Konteks adalah raja** - Selalu simpan konteks di file tracking
2. **Komunikasi jelas** - Tanya jika tidak jelas
3. **Incremental** - Build step by step, jangan skip
4. **Test as you go** - Test setiap fitur sebelum lanjut
5. **Documentation** - Update docs setelah implementasi

---

**Last Updated**: 2026-09-01
