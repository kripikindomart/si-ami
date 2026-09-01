# TASK PENDING - SIM-AMI

Track semua task yang menunggu untuk dikerjakan.

---

## Status Legend
- `[READY]` - Siap dikerjakan
- `[BLOCKED]` - Terblokir, menunggu sesuatu
- `[WAITING]` - Menunggu konfirmasi user

---

---

## [READY] Dokumentasi Lengkap Semua Modul (17 Modul)

**Priority**: Critical
**Modul**: All Modules
**Deskripsi**: Buat dokumentasi LENGKAP untuk semua 17 modul dengan desain yang benar dan detail

**Yang Harus Dibuat per Modul**:
Setiap modul WAJIB punya 5 file lengkap:
1. `README.md` - Overview: tujuan, fitur, use case, dependencies
2. `01-schema.md` - Database schema: field detail, relationships, constraints, RLS, triggers, seed data
3. `02-workflow.md` - Business logic & workflow: step by step, state diagram, decision tree
4. `03-wireframe.md` - UI/UX design: page layout, component, form, interaction
5. `04-issues.md` - GitHub issues breakdown: task per fitur dengan acceptance criteria
6. `05-api-endpoints.md` - API spec: endpoint, request/response, auth, error handling

**List 17 Modul** (priority order):
1. ✅ A.1 User Management (README done)
2. ✅ A.2 LAM (README + Schema done)
3. 🔄 A.3 Unit Kerja (Schema partial done)
4. ⏳ A.4 Periode Audit
5. ⏳ A.5 Standar Mutu
6. ⏳ A.6 Auditor
7. ⏳ A.7 Kategori & Status
8. ⏳ A.8 Konfigurasi
9. ⏳ B.1 Sesi Audit
10. ⏳ B.2 Temuan
11. ⏳ B.3 Nilai Positif
12. ⏳ B.4 Rekomendasi
13. ⏳ B.5 Tindak Lanjut (RTL) **PALING PENTING**
14. ⏳ C.1 Dashboard
15. ⏳ C.2 Notifikasi
16. ⏳ C.3 Laporan & Export
17. ⏳ C.4 Activity Log
18. ⏳ C.5 Import Data

**Output Expected**:
- 17 folder × 6 files = 102 files dokumentasi lengkap
- Semua desain benar, tidak minimal
- Detail field, validation, business rules
- UI mockup/wireframe untuk setiap page
- Issues breakdown siap untuk GitHub

**Notes**:
- JANGAN buat minimal - harus detail dan lengkap
- Setiap file minimal 100-200 baris (kecuali README bisa lebih pendek)
- Include real examples dari laporan AMI 2025
- Wireframe bisa text-based atau ASCII diagram
- API spec include authentication & authorization

**Estimasi**: 
- Per modul: 2-3 jam (semua 6 files)
- Total: ~40-50 jam untuk 17 modul
- Bisa dikerjakan bertahap per modul

**Dependencies**: 
- Database schema sudah final ✅
- MODULES-LIST.md sudah ada ✅
- Laporan AMI 2025 sudah extracted ✅

---

## [READY] ERD Diagram

**Priority**: High
**Modul**: Core - Database
**Deskripsi**: Buat ERD (Entity Relationship Diagram) visual untuk semua tabel database

**Dependencies**: 
- Database schema sudah selesai (01-database-schema.md)

**Output Expected**:
- File `docs/01-database-erd.png` atau `.svg`
- Visual relasi antar tabel
- Include cardinality (1:1, 1:N, N:M)

**Notes**:
- Bisa pakai tools seperti dbdiagram.io, draw.io, atau Mermaid
- Sesuaikan dengan schema yang sudah dibuat

---

## [READY] Rancangan Per Modul

**Priority**: High
**Modul**: All
**Deskripsi**: Breakdown detail setiap modul dengan:
- Tujuan modul
- Fitur-fitur
- Batasan scope
- Dependencies

**List Modul**:
1. Core - Manajemen User & Role
2. Core - Manajemen Unit Kerja
3. Core - Manajemen Periode Audit
4. Core - Manajemen Standar Mutu
5. Core - Manajemen Auditor
6. Transaksional - Sesi Audit
7. Transaksional - Temuan
8. Transaksional - Nilai Positif
9. Transaksional - Rekomendasi
10. Transaksional - Tindak Lanjut (RTL)
11. Supporting - Dashboard
12. Supporting - Notifikasi
13. Supporting - Laporan & Export
14. Supporting - Activity Log

**Output Expected**:
- File `docs/04-module-breakdown.md`
- Detail per modul dengan struktur konsisten

---

## [READY] Wireframe Design

**Priority**: Medium
**Modul**: All
**Deskripsi**: Buat wireframe/mockup UI untuk semua halaman

**List Halaman**:
1. Authentication (Login, Register, Forgot Password)
2. Dashboard (role-based: Admin, Auditor, PIC, Pimpinan)
3. Master Data (CRUD untuk semua master)
4. Sesi Audit (List, Create, Detail)
5. Input Temuan
6. Input Nilai Positif
7. Input Rekomendasi
8. Tindak Lanjut (RTL) - List & Form
9. Laporan (Generate & Download)
10. Settings & Profile

**Output Expected**:
- File `docs/05-wireframes.md` dengan screenshots atau link Figma
- Component breakdown per halaman

**Notes**:
- Gunakan referensi shadcn/ui components
- Responsive design (mobile-first)

---

## [READY] GitHub Issues Creation

**Priority**: High
**Modul**: Project Management
**Deskripsi**: Buat GitHub Issues untuk semua task implementasi berdasarkan:
- Module breakdown
- Workflow
- Wireframe

**Output Expected**:
- File `docs/06-github-issues-template.md` dengan template issue
- List issues yang harus dibuat (bisa di-export ke GitHub nanti)

**Format**:
- Satu issue = satu task spesifik
- Bahasa Indonesia
- NO EMOJI
- Include label, acceptance criteria, technical details

**Categories**:
1. Setup Project (Next.js + Supabase)
2. Database Setup (Migration, Seed)
3. Auth System
4. Master Data CRUD
5. Transactional Features
6. Supporting Features
7. Testing & Deployment

---

## [READY] API Endpoints Specification

**Priority**: Medium
**Modul**: Backend
**Deskripsi**: Dokumentasi lengkap semua API endpoints

**Output Expected**:
- File `docs/07-api-endpoints.md`
- Format: Method, Path, Request, Response, Auth, Error Handling

**Endpoints Categories**:
1. Authentication
2. Users & Roles
3. Master Data
4. Sesi Audit
5. Temuan & Rekomendasi
6. Tindak Lanjut (RTL)
7. Dashboard & Stats
8. Laporan & Export
9. Notifikasi

**Notes**:
- Gunakan Supabase client (tidak perlu manual REST API)
- Include RLS policies documentation

---

## [WAITING] Setup Next.js Project

**Priority**: High
**Modul**: Setup
**Deskripsi**: Initialize Next.js 14+ project dengan semua dependencies

**Waiting For**: Konfirmasi user untuk mulai coding

**Tasks**:
1. `npx create-next-app@latest` dengan TypeScript
2. Install shadcn/ui
3. Setup Tailwind CSS
4. Install dependencies (Supabase, Zustand, React Hook Form, Zod, TanStack Table, Recharts, date-fns)
5. Setup folder structure
6. Configure environment variables

---

## [WAITING] Setup Supabase Project

**Priority**: High
**Modul**: Backend
**Deskripsi**: Setup Supabase project dan database

**Waiting For**: Konfirmasi user untuk mulai setup backend

**Tasks**:
1. Create Supabase project
2. Run migration (semua tables)
3. Setup RLS policies
4. Setup Auth providers
5. Setup Storage buckets
6. Seed master data (unit_kerja, kategori_temuan, status_rtl, dll)
7. Configure Supabase client di Next.js

---

## [WAITING] Import Data AMI 2025

**Priority**: Medium
**Modul**: Data Migration
**Deskripsi**: Import data existing dari Laporan AMI 2025 ke database

**Waiting For**: Database sudah setup

**Tasks**:
1. Parse laporan_ami_2025.txt
2. Transform ke format database
3. Create Excel template untuk import
4. Import via script atau manual

**Data to Import**:
- 13 sesi audit
- 70+ temuan
- 60+ rekomendasi
- 110+ nilai positif
- Auditor data
- Auditee data per sesi

---

**Total Pending Tasks**: 9 (4 READY, 5 WAITING)
**Critical Next**: Dokumentasi Lengkap 17 Modul (estimasi 40-50 jam)
**Last Updated**: 2026-09-01 17:00
