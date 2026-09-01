# GitHub Issues Template - SIM-AMI

Template untuk membuat GitHub Issues dengan format konsisten.

---

## Format Issue Standar

```markdown
# [MODUL] Judul Task Spesifik

## Tujuan
[Jelaskan tujuan task ini dengan bahasa sederhana dalam 1-2 kalimat]

## Deskripsi
[Detail apa yang harus dikerjakan, step by step jika perlu]

## Acceptance Criteria
- [ ] Kriteria 1 yang harus dipenuhi
- [ ] Kriteria 2 yang harus dipenuhi
- [ ] Kriteria 3 yang harus dipenuhi

## Technical Details
- **Tabel/Database**: [nama tabel jika ada]
- **API Endpoint**: [endpoint jika ada]
- **Component**: [component React jika ada]
- **Dependencies**: [library/modul yang dibutuhkan]

## Referensi
- [Link ke dokumentasi modul]
- [Link ke wireframe jika ada]
- [Link ke schema jika ada]

## Estimasi
[XS / S / M / L / XL]

## Catatan
[Catatan tambahan untuk implementor, edge case, atau hal penting lainnya]
```

---

## Label yang Tersedia

### Modul Labels:
- `modul:core` - Core & Master Data
- `modul:transaksional` - Temuan, RTL, dll
- `modul:support` - Dashboard, Laporan, dll
- `modul:setup` - Setup project

### Priority Labels:
- `priority:critical` - Blocking, harus segera
- `priority:high` - Penting
- `priority:medium` - Normal
- `priority:low` - Bisa nanti

### Type Labels:
- `type:feature` - Fitur baru
- `type:bug` - Bug fix
- `type:refactor` - Refactoring
- `type:docs` - Dokumentasi
- `type:test` - Testing

### Status Labels:
- `status:ready` - Siap dikerjakan
- `status:blocked` - Terblokir
- `status:in-progress` - Sedang dikerjakan
- `status:review` - Perlu review
- `status:done` - Selesai

### Size Labels:
- `size:xs` - < 2 jam
- `size:s` - 2-4 jam
- `size:m` - 1-2 hari
- `size:l` - 3-5 hari
- `size:xl` - > 1 minggu

---

## Contoh Issues per Phase

## Phase 1: Foundation & Setup

### Issue #1

```markdown
# [SETUP] Initialize Next.js Project dengan TypeScript

## Tujuan
Setup project Next.js 14+ dengan TypeScript, Tailwind CSS, dan konfigurasi awal

## Deskripsi
1. Run `npx create-next-app@latest` dengan options:
   - TypeScript: Yes
   - ESLint: Yes
   - Tailwind CSS: Yes
   - src/ directory: Yes
   - App Router: Yes
   - Import alias: Yes (@/*)
2. Install dependencies tambahan:
   - @supabase/supabase-js
   - @supabase/auth-helpers-nextjs
   - zustand (state management)
   - react-hook-form
   - zod
   - date-fns
3. Setup folder structure:
   - src/app/(auth)/
   - src/app/(dashboard)/
   - src/components/
   - src/lib/
   - src/types/
4. Configure environment variables (.env.local)
5. Test dev server running

## Acceptance Criteria
- [ ] Next.js project created dengan TypeScript
- [ ] Dev server berjalan di localhost:3000
- [ ] Dependencies terinstall
- [ ] Folder structure sesuai konvensi
- [ ] No errors di console

## Technical Details
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Dependencies**: Listed above

## Referensi
- https://nextjs.org/docs
- docs/00-PROJECT-RULES.md

## Estimasi
S (2-3 jam)

## Catatan
Pastikan gunakan Node.js versi 18+ dan npm/yarn terbaru
```

**Labels**: `modul:setup`, `priority:critical`, `type:feature`, `status:ready`, `size:s`

---

### Issue #2

```markdown
# [SETUP] Install dan Configure shadcn/ui

## Tujuan
Install shadcn/ui dan setup component library untuk UI

## Deskripsi
1. Install shadcn/ui:
   ```bash
   npx shadcn-ui@latest init
   ```
2. Configure theme (default, zinc, neutral)
3. Install component yang akan sering dipakai:
   - button
   - input
   - label
   - form
   - table
   - dialog
   - dropdown-menu
   - select
   - checkbox
   - card
   - badge
   - toast
4. Test render component di page test

## Acceptance Criteria
- [ ] shadcn/ui terinstall
- [ ] components.json configured
- [ ] Essential components installed
- [ ] Test page dengan component working
- [ ] Theme konsisten

## Technical Details
- **UI Library**: shadcn/ui (Radix UI + Tailwind)
- **Components**: Listed above

## Referensi
- https://ui.shadcn.com/docs/installation/next
- docs/00-PROJECT-RULES.md (wajib pakai shadcn/ui)

## Estimasi
XS (1-2 jam)

## Catatan
Jangan buat component manual, selalu gunakan shadcn/ui
```

**Labels**: `modul:setup`, `priority:critical`, `type:feature`, `status:ready`, `size:xs`

---

### Issue #3

```markdown
# [SETUP] Setup Supabase Project dan Database Migration

## Tujuan
Create Supabase project, setup database, dan run migration untuk semua tables

## Deskripsi
1. Create Supabase project di dashboard
2. Copy project URL dan anon key
3. Setup Supabase client di Next.js
4. Create migration files dari docs/01-database-schema.md
5. Run migration secara sequential:
   - Core tables (users, roles, permissions, lam, unit_kerja, dll)
   - Transactional tables (sesi_audit, temuan, rekomendasi, dll)
   - Supporting tables (activity_log, notifikasi)
   - Views (v_standar_by_unit, v_temuan_with_status, dll)
   - Functions (generate_nomor_pm, generate_nomor_sesi)
   - Triggers (update_updated_at, log_activity)
   - RLS policies
6. Seed master data:
   - LAM (4 records)
   - Kategori temuan (3 records)
   - Status RTL (4 records)
   - Roles (4 records)
7. Test connection dari Next.js

## Acceptance Criteria
- [ ] Supabase project created
- [ ] Database migration berhasil (semua 22+ tables)
- [ ] Views created
- [ ] Functions & triggers working
- [ ] RLS policies enabled
- [ ] Seed data inserted
- [ ] Supabase client connected dari Next.js
- [ ] Query test berhasil

## Technical Details
- **Database**: PostgreSQL via Supabase
- **Tables**: 22+ tables (see schema doc)
- **Connection**: @supabase/supabase-js

## Referensi
- docs/01-database-schema.md (complete schema)
- https://supabase.com/docs/guides/database

## Estimasi
M (1 hari)

## Catatan
Run migration step by step, jangan langsung semua. Cek setiap step apakah berhasil sebelum lanjut.
```

**Labels**: `modul:setup`, `priority:critical`, `type:feature`, `status:ready`, `size:m`

---

## Phase 2: Core Modules

### Issue #4

```markdown
# [CORE] Implementasi Modul LAM - CRUD

## Tujuan
Implementasi CRUD untuk master data LAM (Lembaga Akreditasi Mandiri)

## Deskripsi
1. Create page /dashboard/master/lam
2. LAM List:
   - Table dengan kolom: Kode, Nama, Status, Aksi
   - Filter by status (aktif/nonaktif)
   - Search by kode atau nama
   - Pagination
3. Create LAM:
   - Form: kode (uppercase auto), nama, deskripsi
   - Validasi kode unique
   - Default status = aktif
4. Update LAM:
   - Edit form dengan data existing
   - Bisa update semua field kecuali kode
5. Toggle status:
   - Aktif ↔ Nonaktif
   - Confirm dialog
6. Cannot delete LAM (hanya nonaktif)

## Acceptance Criteria
- [ ] Page /dashboard/master/lam accessible by admin_gpm
- [ ] Table menampilkan list LAM dari database
- [ ] Create LAM form working dengan validasi
- [ ] Update LAM form working
- [ ] Toggle status working
- [ ] Search & filter working
- [ ] RLS policy enforced (hanya admin_gpm bisa edit)

## Technical Details
- **Tabel**: lam
- **API Endpoint**: 
  - GET /api/lam (list)
  - POST /api/lam (create)
  - PUT /api/lam/:id (update)
  - PATCH /api/lam/:id/status (toggle)
- **Component**: 
  - LAMList (table)
  - LAMForm (create/edit dialog)
  - LAMStatusToggle
- **Dependencies**: shadcn/ui (table, dialog, form, button, input)

## Referensi
- docs/modules/lam/README.md
- docs/modules/lam/01-schema.md

## Estimasi
S (3-4 jam)

## Catatan
Kode LAM harus selalu uppercase. Gunakan text-transform atau toUpperCase() di form.
```

**Labels**: `modul:core`, `priority:high`, `type:feature`, `status:ready`, `size:s`

---

### Issue #5

```markdown
# [CORE] Implementasi Modul Unit Kerja dengan LAM Assignment

## Tujuan
Implementasi CRUD unit kerja dengan fitur assign LAM ke prodi

## Deskripsi
1. Create page /dashboard/master/unit-kerja
2. Unit Kerja List:
   - Table: Kode, Nama, Jenis, LAM, Status, Aksi
   - Filter by jenis (prodi/direktorat/unit penunjang/lab)
   - Filter by LAM
   - Search
3. Create Unit Kerja:
   - Form: kode, nama, jenis, lam_id (dropdown), parent_id (optional)
   - LAM dropdown: hanya tampil jika jenis = 'prodi'
   - Validasi kode unique
4. Update Unit Kerja:
   - Edit dengan data existing
   - Bisa ganti LAM assignment
5. Toggle status
6. Cannot delete jika sudah digunakan di sesi_audit

## Acceptance Criteria
- [ ] Page accessible by admin_gpm
- [ ] Table menampilkan list unit dengan LAM name
- [ ] Create form working dengan conditional LAM field
- [ ] LAM dropdown hanya untuk prodi
- [ ] Update working termasuk ganti LAM
- [ ] Toggle status working
- [ ] Validation: cannot delete if used
- [ ] RLS enforced

## Technical Details
- **Tabel**: unit_kerja (join lam untuk display)
- **API Endpoint**: REST for unit_kerja
- **Component**: UnitKerjaList, UnitKerjaForm
- **Dependencies**: shadcn/ui (form, select, table)

## Referensi
- docs/modules/unit-kerja/ (will be created)
- docs/01-database-schema.md (unit_kerja table)

## Estimasi
M (4-5 jam)

## Catatan
LAM assignment critical untuk filter standar. Pastikan UI jelas: LAM hanya untuk prodi.
```

**Labels**: `modul:core`, `priority:high`, `type:feature`, `status:ready`, `size:m`

---

## Total Issues Estimate

Berdasarkan roadmap, estimasi total issues:
- **Phase 1 (Setup)**: ~10 issues
- **Phase 2 (Core)**: ~25 issues
- **Phase 3 (Transactional)**: ~30 issues
- **Phase 4 (Supporting)**: ~20 issues
- **Phase 5 (Testing)**: ~10 issues
- **Phase 6 (Deployment)**: ~5 issues

**Total**: ~100 issues

---

## Cara Menggunakan Template

1. Copy template di atas
2. Ganti [MODUL] dengan modul yang sesuai
3. Isi semua section dengan detail
4. Tambahkan label yang sesuai
5. Assign ke developer
6. Track progress dengan checklist di Acceptance Criteria

---

## ATURAN WAJIB untuk AI/Developer

### 1. MEMBUAT ISSUE
- **WAJIB** menggunakan template format lengkap di atas
- **WAJIB** isi semua section: Tujuan, Deskripsi, Acceptance Criteria, Technical Details, Referensi, Estimasi
- **WAJIB** tambahkan label yang sesuai (modul, priority, type, status, size)
- Walaupun di dokumentasi module sudah ada breakdown task, **TETAP WAJIB** buat issue dengan format template lengkap
- **JANGAN** buat issue setengah-setengah atau skip section

### 2. MENGERJAKAN ISSUE
- **WAJIB** update label `status:in-progress` sebelum mulai coding
- Kerjakan sesuai Acceptance Criteria yang ada
- Jika ada perubahan scope, update issue description dan criteria

### 3. MENUTUP ISSUE
- **WAJIB** close issue dengan comment detail pengerjaan
- Format comment close issue:

```markdown
## ✅ DONE

### Dikerjakan:
- [x] Item 1 yang dikerjakan dengan detail
- [x] Item 2 yang dikerjakan dengan detail
- [x] Item 3 yang dikerjakan dengan detail

### File yang Dibuat/Diubah:
- `path/to/file1.ts` - [deskripsi perubahan]
- `path/to/file2.tsx` - [deskripsi perubahan]
- `path/to/file3.sql` - [deskripsi perubahan]

### Testing:
- [x] Unit test passed
- [x] Manual test: [scenario yang ditest]
- [x] No console errors

### Acceptance Criteria Status:
- [x] Kriteria 1 ✅
- [x] Kriteria 2 ✅
- [x] Kriteria 3 ✅

### Notes:
[Catatan tambahan jika ada, perubahan dari plan awal, trade-offs, dll]

### Commit:
Commit hash: `abc1234`
Branch: `master`
```

- **JANGAN** close issue dengan comment singkat atau tanpa detail
- **JANGAN** langsung close tanpa menjelaskan apa yang dikerjakan

### 4. TRACKING PROGRESS
- Setiap selesai 1 issue, update progress di dokumentasi roadmap
- Check dependencies: apakah issue ini unblock issue lain?
- Update label `status:blocked` → `status:ready` untuk issue yang ter-unblock

---

## Contoh BAIK vs BURUK

### ❌ BURUK - Membuat Issue:
```markdown
# User Management

buat user management
```

### ✅ BAIK - Membuat Issue:
```markdown
# [User Management] Create Database Schema dan RLS Policies

## Tujuan
Create database tables untuk user management dengan RLS policies

## Deskripsi
1. Create tables: users, roles, permissions, user_unit
2. Add relations dan foreign keys
3. Create indexes untuk performa
4. Setup RLS policies untuk setiap table
...
[Lengkap sesuai template]
```

### ❌ BURUK - Close Issue:
```markdown
done
```

### ✅ BAIK - Close Issue:
```markdown
## ✅ DONE

### Dikerjakan:
- [x] Create users table dengan UUID primary key
- [x] Create roles table dengan unique constraint pada nama
- [x] Create permissions table dengan composite unique (role_id, modul)
...
[Lengkap dengan detail]
```

---

**Version**: 1.1
**Last Updated**: 2026-09-01
**Changes**: Add mandatory rules untuk AI/Developer
