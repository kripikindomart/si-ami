# Implementation Roadmap - SIM-AMI

Roadmap implementasi aplikasi SIM-AMI dari dokumentasi hingga deployment.

---

## Phase 1: Foundation & Setup (Week 1-2)

### Week 1: Project Setup
- [ ] Setup Next.js 14+ project dengan TypeScript
- [ ] Install & configure shadcn/ui
- [ ] Setup Supabase project
- [ ] Configure environment variables
- [ ] Setup folder structure
- [ ] Initialize git & first commit

### Week 2: Database & Auth
- [ ] Run database migration (semua tables)
- [ ] Setup RLS policies
- [ ] Implement Supabase Auth
- [ ] Seed master data (LAM, kategori temuan, status RTL)
- [ ] Test database connection
- [ ] Create auth layout & pages (login, register)

**Deliverables**: 
- Next.js project running
- Database ready dengan seed data
- Auth system working

---

## Phase 2: Core Modules - Master Data (Week 3-5)

### A.1 User Management (Week 3)
- [ ] User list page dengan table
- [ ] User CRUD forms
- [ ] Role assignment
- [ ] Unit assignment (multi-select)
- [ ] Permission matrix UI
- [ ] Profile page

### A.2 LAM Management (Day 1-2)
- [ ] LAM list page
- [ ] LAM CRUD forms
- [ ] Status toggle

### A.3 Unit Kerja (Day 3-4)
- [ ] Unit kerja list
- [ ] Unit kerja CRUD
- [ ] LAM assignment dropdown
- [ ] Hierarchical view (jika ada parent)

### A.4 Periode Audit (Day 5-6)
- [ ] Periode list
- [ ] Periode CRUD
- [ ] Aktivasi periode (hanya 1 aktif)
- [ ] Archive periode lama

### A.5 Standar Mutu (Week 4)
- [ ] Standar list dengan filter (scope, LAM)
- [ ] Standar CRUD
- [ ] Scope selector (global/specific)
- [ ] LAM selector (jika specific)
- [ ] Auto-filter standar by unit (untuk dropdown)

### A.6 Auditor (Day 1-2)
- [ ] Auditor list
- [ ] Auditor CRUD
- [ ] Status management

### A.7 Kategori & Status (Day 3)
- [ ] Manage kategori temuan
- [ ] Manage status RTL
- [ ] Bobot & warna configuration

### A.8 Konfigurasi (Day 4)
- [ ] Konfigurasi list
- [ ] Format nomor PM settings
- [ ] Email reminder settings

**Deliverables**: 
- Semua master data CRUD working
- Admin GPM bisa setup data

---

## Phase 3: Transactional Modules (Week 6-9)

### B.1 Sesi Audit (Week 6)
- [ ] Sesi list per periode
- [ ] Create sesi wizard:
  - Step 1: Pilih unit & tanggal
  - Step 2: Assign auditor (multi-select)
  - Step 3: Input auditee
- [ ] Auto-generate nomor sesi
- [ ] Sesi detail view
- [ ] Edit sesi

### B.2 Temuan (Week 7, Day 1-3)
- [ ] Temuan list per sesi
- [ ] Create temuan form:
  - Multi-select standar (filtered by unit LAM)
  - Pilih kategori
  - Input deskripsi
- [ ] Auto-generate nomor PM
- [ ] Edit temuan
- [ ] View temuan dengan standar rujukan

### B.3 Nilai Positif (Week 7, Day 4)
- [ ] Nilai positif list per sesi
- [ ] Create/edit nilai positif
- [ ] Toggle best practice

### B.4 Rekomendasi (Week 7, Day 5-6)
- [ ] Rekomendasi list per sesi
- [ ] Create rekomendasi (similar to temuan)
- [ ] Auto-generate nomor PM pencegahan

### B.5 Tindak Lanjut - RTL (Week 8-9) **PALING PENTING**
- [ ] Dashboard RTL per unit (PIC Unit view)
- [ ] List temuan/rekomendasi dengan status
- [ ] Update RTL form:
  - Pilih status
  - Input penanggung jawab
  - Target selesai
  - Upload bukti (Supabase Storage)
  - Catatan progress
- [ ] RTL history view (immutable log)
- [ ] Filter by status, deadline
- [ ] Bulk update status (nice to have)

**Deliverables**: 
- Auditor bisa input hasil audit
- PIC Unit bisa update RTL
- History RTL tracked

---

## Phase 4: Supporting Modules (Week 10-12)

### C.1 Dashboard (Week 10)
- [ ] Dashboard Admin GPM:
  - Statistics cards (total temuan, RTL %)
  - Charts (temuan per kategori, tren)
  - Top widgets (temuan mayor terbuka, deadline)
- [ ] Dashboard PIC Unit:
  - Unit saya statistics
  - My action items
- [ ] Dashboard Auditor:
  - Sesi saya
  - Temuan saya
- [ ] Dashboard Pimpinan:
  - Executive summary
  - Comparison charts

### C.2 Notifikasi (Week 11, Day 1-2)
- [ ] In-app notification list
- [ ] Mark as read
- [ ] Badge unread count
- [ ] Email reminder setup (Supabase Edge Function)
- [ ] Scheduled job (pg_cron)

### C.3 Laporan & Export (Week 11, Day 3-6)
- [ ] Generate laporan audit per unit (PDF)
- [ ] Export rekap Excel
- [ ] Status RTL PDF
- [ ] Download history
- [ ] Custom report builder (nice to have)

### C.4 Activity Log (Week 12, Day 1-2)
- [ ] Activity log list dengan filter
- [ ] Diff viewer (old vs new)
- [ ] Export log

### C.5 Import Data (Week 12, Day 3-5)
- [ ] Upload Excel template
- [ ] Validate & preview
- [ ] Bulk insert with transaction
- [ ] Error log download
- [ ] Import AMI 2025 data

**Deliverables**: 
- Dashboard analytics working
- Laporan bisa di-generate
- Data AMI 2025 ter-import

---

## Phase 5: Testing & Polish (Week 13-14)

### Week 13: Testing
- [ ] Unit tests untuk critical functions
- [ ] Integration tests
- [ ] Manual testing per role
- [ ] Bug fixing
- [ ] Performance optimization

### Week 14: Polish & Documentation
- [ ] UI/UX improvements
- [ ] Responsive design check
- [ ] User manual (Bahasa Indonesia)
- [ ] Admin guide
- [ ] API documentation
- [ ] Deployment guide

**Deliverables**: 
- App tested & bug-free
- Documentation complete

---

## Phase 6: Deployment & Training (Week 15-16)

### Week 15: Deployment
- [ ] Setup production Supabase
- [ ] Setup production Vercel/server
- [ ] Migration prod database
- [ ] Seed prod master data
- [ ] Import AMI 2025 to prod
- [ ] SSL & domain setup
- [ ] Backup strategy

### Week 16: Training & Handover
- [ ] Training Admin GPM
- [ ] Training Auditor
- [ ] Training PIC Unit
- [ ] Training Pimpinan
- [ ] Handover documentation
- [ ] Support plan

**Deliverables**: 
- App live in production
- Users trained
- Support ready

---

## Timeline Summary

| Phase | Duration | Weeks | Key Milestone |
|-------|----------|-------|---------------|
| Phase 1: Foundation | 2 weeks | 1-2 | Project setup & auth |
| Phase 2: Core Modules | 3 weeks | 3-5 | Master data CRUD |
| Phase 3: Transactional | 4 weeks | 6-9 | Audit & RTL system |
| Phase 4: Supporting | 3 weeks | 10-12 | Dashboard & reporting |
| Phase 5: Testing | 2 weeks | 13-14 | QA & polish |
| Phase 6: Deployment | 2 weeks | 15-16 | Go live & training |
| **TOTAL** | **16 weeks** | **~4 bulan** | Production ready |

---

## Critical Path

1. ✅ Database schema design
2. ✅ Project rules & structure
3. → Setup Next.js & Supabase
4. → User Management & Auth
5. → Master Data (LAM, Unit, Periode, Standar)
6. → Sesi Audit
7. → Temuan & Rekomendasi
8. → **Tindak Lanjut (RTL)** ← CORE FEATURE
9. → Dashboard & Laporan
10. → Import data existing
11. → Testing & deployment

---

## Resource Requirements

### Team:
- 1 Full-stack Developer (Next.js + Supabase)
- 1 UI/UX Designer (part-time, untuk wireframe & polish)
- 1 QA Tester (Week 13-14)
- 1 Project Manager / Admin GPM (untuk UAT & requirements)

### Tools:
- Supabase (Pro plan: $25/month)
- Vercel (Pro plan: $20/month)
- Domain & SSL
- Development tools (free)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Requirement change | High | Freeze requirements after Phase 1 |
| Data migration issue | High | Test import extensively in Phase 4 |
| Performance bottleneck | Medium | Monitor Supabase usage, optimize queries |
| User adoption | Medium | Training & user manual |
| Supabase downtime | Low | Backup strategy, monitoring |

---

## Success Criteria

1. ✅ Semua 17 modul implemented & working
2. ✅ Data AMI 2025 successfully imported
3. ✅ Auditor bisa input hasil audit dengan mudah
4. ✅ PIC Unit bisa update RTL & upload bukti
5. ✅ Admin GPM bisa monitor progress semua unit
6. ✅ Pimpinan bisa lihat dashboard & laporan
7. ✅ History RTL immutable & audit trail clear
8. ✅ App responsive & user-friendly
9. ✅ Performance: page load < 2 detik
10. ✅ Users trained & confident using app

---

**Version**: 1.0
**Last Updated**: 2026-09-01
**Status**: Ready for execution
