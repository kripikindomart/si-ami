# Modul: User Management

## Tujuan
Mengelola user, role, permission, dan assignment user ke unit kerja untuk sistem authorization yang granular.

## Fitur Utama
1. **CRUD Users**
   - Create user baru dengan role
   - Update profile user
   - Activate/deactivate user
   - Delete user (soft delete)

2. **Role Management**
   - Manage roles (admin_gpm, auditor, pic_unit, pimpinan)
   - Custom roles (jika diperlukan)

3. **Permission Matrix**
   - Set permission per role per modul
   - CRUD matrix (Create, Read, Update, Delete)
   - Apply permission ke multiple modules

4. **User-Unit Assignment**
   - Assign user ke satu atau multiple unit (untuk PIC Unit)
   - Unassign unit dari user
   - View unit assignment per user

5. **Profile Management**
   - User bisa update profile sendiri
   - Change password
   - View activity history

## Scope & Batasan
### In Scope:
- Authentication menggunakan Supabase Auth
- Role-based access control (RBAC)
- Multi-unit assignment untuk PIC Unit
- Row Level Security (RLS) di database level

### Out of Scope:
- Social login (Google, Facebook) - fase 2
- Two-factor authentication (2FA) - fase 2
- Advanced audit log per user - handled by Activity Log module

## Dependencies
- **Supabase Auth**: Email/password authentication
- **Database**: `users`, `roles`, `permissions`, `user_unit` tables
- **RLS Policies**: Enforce authorization di database level

## User Roles & Permissions

### 1. admin_gpm (Administrator GPM)
- Full access ke semua modul
- Manage users, roles, permissions
- Manage master data
- Monitor semua unit
- Generate laporan semua unit

### 2. auditor (Auditor Internal)
- CRUD sesi audit
- CRUD temuan, rekomendasi, nilai positif
- View dashboard audit
- View laporan (read-only)
- No access to user management

### 3. pic_unit (PIC Unit/Prodi)
- View temuan & rekomendasi untuk unit assigned
- CRUD tindak lanjut (RTL) untuk unit assigned
- View dashboard unit assigned
- Download laporan unit assigned
- No access to other units

### 4. pimpinan (Pimpinan)
- View-only access
- Dashboard executive summary
- View semua laporan
- Export data untuk analisis
- No edit/delete access

## Database Schema
Lihat: `01-schema.md`

## Workflow
Lihat: `02-workflow.md`

## Wireframe
Lihat: `03-wireframe.md`

## GitHub Issues
Lihat: `04-issues.md`

## API Endpoints
Lihat: `05-api-endpoints.md`

---

**Status**: Ready for development
**Priority**: P0 (Highest - blocking other modules)
**Estimated Effort**: 2 weeks
