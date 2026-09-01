# GitHub Issues - Modul LAM

## Overview
Breakdown tasks untuk implementasi modul LAM (Lembaga Akreditasi Mandiri) untuk kategorisasi standar mutu per program studi.

---

## ISSUE #1: Database Schema untuk LAM

**Title**: Create Table LAM dengan Seed Data Default

**Labels**: `database`, `schema`, `high-priority`

**Description**:

Implementasi database schema untuk tabel LAM sesuai `docs/modules/lam/01-schema.md`.

**Acceptance Criteria**:
- [ ] Tabel `lam` dengan fields: id, kode, nama, deskripsi, status
- [ ] Constraint: kode unique, uppercase only
- [ ] Index pada kode dan status
- [ ] RLS policies untuk admin GPM (full) dan others (read-only)
- [ ] Trigger untuk auto-update updated_at
- [ ] Seed data 4 LAM default:
  - LAMDIK (LAM Pendidikan Tinggi Keagamaan Islam)
  - LAMDIKTI (LAM Pendidikan Tinggi)
  - LAMDIKES (LAM Pendidikan Tinggi Kesehatan)
  - GLOBAL (Standar Global)
- [ ] View `v_lam_usage` untuk tracking usage LAM di prodi/standar

**Migration File**:
```sql
-- File: supabase/migrations/002_lam.sql

CREATE TABLE lam (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL CHECK (kode = UPPER(kode)),
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO lam (kode, nama, deskripsi) VALUES
  ('LAMDIK', 'LAM Pendidikan Tinggi Keagamaan Islam', 'Untuk prodi keislaman'),
  ('LAMDIKTI', 'LAM Pendidikan Tinggi', 'Untuk prodi umum'),
  ('LAMDIKES', 'LAM Pendidikan Tinggi Kesehatan', 'Untuk prodi kesehatan'),
  ('GLOBAL', 'Standar Global', 'Standar berlaku untuk semua prodi');
```

**Dependencies**:
- User Management database (for RLS policies)

**Estimate**: 2 jam

---

## ISSUE #2: LAM Service dengan Singleton Pattern

**Title**: Implementasi LamService extends BaseApiService

**Labels**: `api`, `service`, `high-priority`

**Description**:

Buat LamService yang extends BaseApiService dengan method khusus untuk LAM management.

**Acceptance Criteria**:
- [ ] File `lib/api/lam.service.ts`
- [ ] Singleton pattern implementation
- [ ] Method `getAll()` - get all LAM (inherited dari base)
- [ ] Method `getActive()` - get LAM aktif only
- [ ] Method `getById()` - get LAM by ID (inherited dari base)
- [ ] Method `create()` - create LAM baru (inherited dari base)
- [ ] Method `update()` - update nama/deskripsi LAM (kode immutable)
- [ ] Method `toggleStatus()` - aktifkan/nonaktifkan LAM
- [ ] Method `getUsage()` - get info berapa prodi & standar yang pakai LAM ini
- [ ] Auto uppercase untuk kode saat create
- [ ] Error handling sesuai standar (JSON per field)

**Technical Details**:
```typescript
class LamService extends BaseApiService<Lam> {
  private static instance: LamService;
  
  public static getInstance(): LamService {
    if (!LamService.instance) {
      LamService.instance = new LamService();
    }
    return LamService.instance;
  }
  
  async getActive(): Promise<ApiResponse<Lam[]>> {
    const { data, error } = await supabase
      .from('lam')
      .select('*')
      .eq('status', 'aktif')
      .neq('kode', 'GLOBAL') // Exclude GLOBAL dari dropdown
      .order('kode', { ascending: true });
    // ...
  }
  
  async getUsage(lamId: string): Promise<ApiResponse<LamUsage>> {
    // Count prodi & standar yang pakai LAM ini
  }
}
```

**Dependencies**:
- Issue User Management #1 (Base API Infrastructure)
- Issue LAM #1 (Database)

**Estimate**: 3 jam

---

## ISSUE #3: Validation Schema untuk LAM

**Title**: Buat Zod Schema untuk LAM Forms

**Labels**: `validation`, `frontend`, `medium-priority`

**Description**:

Buat Zod schema untuk validasi form LAM dengan error messages yang jelas.

**Acceptance Criteria**:
- [ ] File `lib/validation/lam.schemas.ts`
- [ ] Schema `createLamSchema`:
  - kode: required, 2-20 char, uppercase only, no spaces
  - nama: required, 5-255 char
  - deskripsi: optional
- [ ] Schema `updateLamSchema`:
  - nama: required, 5-255 char
  - deskripsi: optional
  - kode tidak bisa diubah (exclude dari schema)

**Example**:
```typescript
export const createLamSchema = z.object({
  kode: z.string()
    .min(2, 'Kode minimal 2 karakter')
    .max(20, 'Kode maksimal 20 karakter')
    .regex(/^[A-Z]+$/, 'Kode hanya boleh huruf kapital tanpa spasi')
    .transform(val => val.toUpperCase()),
  nama: z.string()
    .min(5, 'Nama minimal 5 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  deskripsi: z.string().optional(),
});
```

**Dependencies**:
- Zod library

**Estimate**: 1 jam

---

## ISSUE #4: LAM List Page dengan Filter & Search

**Title**: Halaman List LAM dengan Filter Status dan Search

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Implementasi halaman list LAM dengan filter by status, search, dan action menu sesuai wireframe.

**Acceptance Criteria**:
- [ ] Page `/dashboard/master/lam`
- [ ] Data table dengan kolom: Kode, Nama LAM, Status, Aksi
- [ ] Filter dropdown: Status (semua/aktif/nonaktif)
- [ ] Search input (real-time search by kode atau nama)
- [ ] Sortable columns (klik header untuk sort)
- [ ] Pagination (10/25/50 per page)
- [ ] Action menu: Edit, Toggle Status
- [ ] Loading skeleton saat fetch data
- [ ] Empty state jika tidak ada data
- [ ] Responsive (mobile: card layout)
- [ ] Permission check: Admin GPM bisa edit, others read-only

**shadcn/ui Components**:
- Table
- Input (search)
- Select (filter)
- DropdownMenu (action)
- Button
- Badge (status)
- Skeleton

**Dependencies**:
- Issue LAM #2 (LAM service)

**Estimate**: 5 jam

---

## ISSUE #5: Create LAM Dialog

**Title**: Dialog Tambah LAM Baru dengan Auto-uppercase Kode

**Labels**: `frontend`, `ui`, `high-priority`

**Description**:

Implementasi dialog create LAM dengan auto-uppercase untuk field kode.

**Acceptance Criteria**:
- [ ] Dialog component dengan form
- [ ] Input: Kode (text, auto-uppercase on change)
- [ ] Input: Nama (text)
- [ ] Textarea: Deskripsi (optional)
- [ ] Validation per field (client-side dengan Zod)
- [ ] Error display per field (sesuai API response)
- [ ] Loading state saat submit
- [ ] Success toast setelah submit
- [ ] Reset form setelah success
- [ ] Show example di helper text: "Contoh: LAMDIK, LAMDIKTI"

**Validation**:
- Kode: required, 2-20 char, uppercase only, unique
- Nama: required, 5-255 char
- Deskripsi: optional

**Dependencies**:
- Issue LAM #2 (LAM service)
- Issue LAM #3 (Validation)
- shadcn/ui Dialog, Form, Input, Textarea

**Estimate**: 4 jam

---

## ISSUE #6: Edit LAM Dialog

**Title**: Dialog Edit LAM dengan Kode Read-only

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Dialog edit LAM dengan kode field read-only (tidak bisa diubah).

**Acceptance Criteria**:
- [ ] Dialog edit LAM dengan pre-filled data
- [ ] Kode field read-only (disabled/locked)
- [ ] Nama dan deskripsi bisa diubah
- [ ] Validation per field
- [ ] Error handling per field
- [ ] Success feedback

**UI Notes**:
- Show icon lock di field kode
- Helper text: "Kode tidak dapat diubah"

**Dependencies**:
- Issue LAM #2 (LAM service)
- Issue LAM #4 (LAM list)

**Estimate**: 3 jam

---

## ISSUE #7: Toggle Status LAM dengan Confirmation

**Title**: Dialog Konfirmasi Toggle Status LAM dengan Info Usage

**Labels**: `frontend`, `ui`, `medium-priority`

**Description**:

Dialog confirmation untuk toggle status LAM dengan informasi berapa prodi & standar yang menggunakan LAM tersebut.

**Acceptance Criteria**:
- [ ] Dialog confirmation dengan info usage
- [ ] Show berapa prodi yang pakai LAM ini
- [ ] Show berapa standar yang pakai LAM ini
- [ ] Explain impact: LAM nonaktif tidak bisa dipilih untuk prodi/standar baru, tapi existing tetap punya referensi
- [ ] Confirm button: "Ya, Nonaktifkan" atau "Ya, Aktifkan"
- [ ] Error handling
- [ ] Success feedback

**Example Message**:
```
LAM ini saat ini digunakan oleh:
- 2 Program Studi (DPAI, MPAI)
- 12 Standar Mutu

LAM akan dinonaktifkan, namun prodi dan standar 
yang sudah ada tetap memiliki referensi LAM ini.

LAM nonaktif tidak bisa dipilih untuk prodi 
atau standar baru.
```

**Dependencies**:
- Issue LAM #2 (LAM service - method getUsage)
- Issue LAM #4 (LAM list)

**Estimate**: 4 jam

---

## ISSUE #8: Integration dengan Unit Kerja Module

**Title**: Dropdown LAM di Form Unit Kerja (Prodi)

**Labels**: `integration`, `frontend`, `medium-priority`

**Description**:

Integrasi modul LAM dengan modul Unit Kerja untuk dropdown pilih LAM saat create/edit prodi.

**Acceptance Criteria**:
- [ ] Di form Unit Kerja (create/edit), jika jenis=prodi, tampilkan dropdown LAM
- [ ] Dropdown populate dari `LamService.getActive()` (exclude GLOBAL)
- [ ] LAM wajib dipilih untuk prodi
- [ ] LAM tidak tampil untuk unit non-prodi (Lab, Direktur, dll)
- [ ] Save lam_id ke tabel unit_kerja
- [ ] Show LAM name di detail prodi

**Dependencies**:
- Issue LAM #2 (LAM service)
- Unit Kerja module (create/edit form)

**Estimate**: 3 jam

---

## ISSUE #9: Integration dengan Standar Mutu Module

**Title**: Dropdown LAM di Form Standar Mutu (Scope Specific)

**Labels**: `integration`, `frontend`, `medium-priority`

**Description**:

Integrasi modul LAM dengan modul Standar Mutu untuk dropdown pilih LAM saat create/edit standar dengan scope=specific.

**Acceptance Criteria**:
- [ ] Di form Standar Mutu, jika scope=specific, tampilkan dropdown LAM
- [ ] Dropdown populate dari `LamService.getActive()` (include GLOBAL)
- [ ] LAM wajib dipilih untuk scope=specific
- [ ] LAM auto null untuk scope=global
- [ ] Save lam_id ke tabel standar_mutu
- [ ] Show LAM name di list standar

**Dependencies**:
- Issue LAM #2 (LAM service)
- Standar Mutu module (create/edit form)

**Estimate**: 3 jam

---

## ISSUE #10: Unit Tests untuk LAM Service

**Title**: Unit Tests untuk LamService Methods

**Labels**: `testing`, `backend`, `low-priority`

**Description**:

Buat unit tests untuk LamService method dan error handling.

**Acceptance Criteria**:
- [ ] File `__tests__/lam.service.test.ts`
- [ ] Test: getAll success
- [ ] Test: getActive (hanya aktif, exclude GLOBAL)
- [ ] Test: create dengan kode uppercase
- [ ] Test: create dengan kode lowercase (should auto-uppercase)
- [ ] Test: create dengan kode duplicate (should fail)
- [ ] Test: update (kode tidak berubah)
- [ ] Test: toggleStatus success
- [ ] Test: getUsage (count prodi & standar)
- [ ] Mock Supabase client
- [ ] Coverage minimal 80%

**Testing Framework**:
- Jest atau Vitest
- Mock Supabase

**Dependencies**:
- Issue LAM #2 (LAM service)

**Estimate**: 4 jam

---

## ISSUE #11: E2E Tests untuk LAM CRUD

**Title**: E2E Tests untuk LAM Create, Edit, Toggle Status

**Labels**: `testing`, `e2e`, `low-priority`

**Description**:

E2E tests untuk flow CRUD LAM.

**Acceptance Criteria**:
- [ ] File `e2e/lam.spec.ts`
- [ ] Test: Login sebagai Admin GPM
- [ ] Test: Navigate ke halaman LAM
- [ ] Test: Create LAM baru dengan kode lowercase (auto-uppercase)
- [ ] Test: Create LAM dengan kode duplicate (should show error)
- [ ] Test: Edit LAM (nama berhasil diubah, kode tetap)
- [ ] Test: Toggle status LAM (aktif → nonaktif → aktif)
- [ ] Test: Search LAM by kode/nama
- [ ] Test: Filter by status
- [ ] Test: Non-admin user tidak bisa edit (read-only)

**Testing Framework**:
- Playwright atau Cypress

**Dependencies**:
- Issue LAM #4, #5, #6, #7

**Estimate**: 6 jam

---

## ISSUE #12: Documentation API Endpoints LAM

**Title**: Dokumentasi API Endpoints untuk Modul LAM

**Labels**: `documentation`, `low-priority`

**Description**:

Buat dokumentasi lengkap API endpoints sesuai file `05-api-endpoints.md`.

**Acceptance Criteria**:
- [ ] File `docs/modules/lam/05-api-endpoints.md`
- [ ] List semua service methods dengan params, return type, response
- [ ] Example request/response untuk setiap method
- [ ] Error response examples per field
- [ ] Permission requirements (Admin GPM vs read-only)
- [ ] Integration notes (dengan Unit Kerja & Standar Mutu)

**Dependencies**:
- Issue LAM #2 (LAM service)

**Estimate**: 2 jam

---

## Task Priority & Timeline

### Sprint 1 (Week 1):
- Issue #1: Database Schema (HIGH) - 2 jam
- Issue #2: LAM Service (HIGH) - 3 jam
- Issue #3: Validation Schema (MEDIUM) - 1 jam

### Sprint 2 (Week 2):
- Issue #4: LAM List Page (MEDIUM) - 5 jam
- Issue #5: Create LAM Dialog (HIGH) - 4 jam
- Issue #6: Edit LAM Dialog (MEDIUM) - 3 jam

### Sprint 3 (Week 3):
- Issue #7: Toggle Status (MEDIUM) - 4 jam
- Issue #8: Integration Unit Kerja (MEDIUM) - 3 jam
- Issue #9: Integration Standar Mutu (MEDIUM) - 3 jam

### Sprint 4 (Week 4):
- Issue #10: Unit Tests (LOW) - 4 jam
- Issue #11: E2E Tests (LOW) - 6 jam
- Issue #12: Documentation (LOW) - 2 jam

**Total Estimate**: 40 jam (sekitar 1 minggu untuk 1 developer full-time, atau 2 minggu part-time)

---

## Dependencies Antar Modul

LAM module ini adalah dependency untuk:
- **Unit Kerja**: Prodi butuh pilih LAM
- **Standar Mutu**: Standar scope=specific butuh pilih LAM
- **Temuan**: Filter standar by LAM unit

LAM module depends on:
- **User Management**: Untuk RLS policies dan permission check

---

**Version**: 1.0
**Last Updated**: 2026-09-01
