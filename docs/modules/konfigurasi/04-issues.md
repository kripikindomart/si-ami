# GitHub Issues - Modul Konfigurasi

## ISSUE #1: Database Schema Extension

**Title**: Extend konfigurasi Table dengan Logo, Storage, Email Configs

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] ALTER konfigurasi table (if needed)
- [ ] Seed data (logo_url, favicon_url, storage configs, email from/name)
- [ ] Helper function get_config()
- [ ] RLS policies

**Estimate**: 3 jam

---

## ISSUE #2: Service Singleton

**Title**: KonfigurasiService dengan Cache dan Type Casting

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] KonfigurasiService.getAll() dengan cache
- [ ] KonfigurasiService.get<T>(key) dengan type casting
- [ ] KonfigurasiService.update(key, value)
- [ ] KonfigurasiService.updateMany(updates)
- [ ] Cache invalidation on update

**Estimate**: 3 jam

---

## ISSUE #3: Storage Service (Multi-Provider)

**Title**: StorageService dengan Supabase & Google Drive Support

**Labels**: `backend`, `storage`, `api`, `high-priority`

**Acceptance Criteria**:
- [ ] StorageService.upload(file, path)
- [ ] StorageService.delete(path)
- [ ] Auto-detect provider from config
- [ ] Supabase Storage implementation
- [ ] Google Drive API implementation
- [ ] OAuth token refresh logic

**Estimate**: 8 jam

**Dependencies**: Google Drive API setup

---

## ISSUE #4: Google Drive OAuth Flow

**Title**: OAuth 2.0 Authorization untuk Google Drive

**Labels**: `backend`, `oauth`, `api`, `high-priority`

**Acceptance Criteria**:
- [ ] Endpoint /api/storage/google-drive/authorize
- [ ] Endpoint /api/storage/google-drive/callback
- [ ] Exchange code for refresh token
- [ ] Save refresh token to konfigurasi
- [ ] Access token refresh from refresh token

**Estimate**: 5 jam

---

## ISSUE #5: Logo Upload Service

**Title**: LogoService untuk Upload Logo & Favicon

**Labels**: `backend`, `service`, `medium-priority`

**Acceptance Criteria**:
- [ ] LogoService.uploadLogo(file)
- [ ] LogoService.uploadFavicon(file)
- [ ] Image validation (size, format)
- [ ] Update konfigurasi after upload
- [ ] Delete old logo on new upload

**Estimate**: 3 jam

---

## ISSUE #6: Settings Page (Frontend)

**Title**: Admin Settings Page dengan Multi-Tab UI

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Settings page dengan tabs: General, Storage, Email, Workflow, Numbering
- [ ] Tab General: Logo upload, app name, institusi
- [ ] Tab Storage: Provider selection, Google Drive OAuth UI
- [ ] Tab Email: SMTP form + test connection
- [ ] Tab Workflow: RTL deadline, notifications
- [ ] Tab Numbering: Format inputs + preview
- [ ] Form validation

**Estimate**: 10 jam

---

## ISSUE #7: Google Drive Connection UI

**Title**: Google Drive OAuth UI Flow

**Labels**: `frontend`, `ui`, `oauth`, `medium-priority`

**Acceptance Criteria**:
- [ ] OAuth credentials input form
- [ ] "Connect Google Drive" button
- [ ] Redirect to Google authorization
- [ ] Handle callback success/error
- [ ] Display connection status
- [ ] "Disconnect" button
- [ ] "Test Upload" button
- [ ] Setup guide modal

**Estimate**: 5 jam

---

## ISSUE #8: Config Context/Hook

**Title**: useConfig Hook untuk Global Config Access

**Labels**: `frontend`, `hooks`, `medium-priority`

**Acceptance Criteria**:
- [ ] ConfigContext provider
- [ ] useConfig() hook
- [ ] Load config on app init
- [ ] Cache in localStorage
- [ ] Logo display in navbar
- [ ] Favicon dynamic update

**Estimate**: 3 jam

---

## ISSUE #9: Auto Numbering Helper

**Title**: Helper Function untuk Generate Nomor Otomatis

**Labels**: `backend`, `utility`, `high-priority`

**Acceptance Criteria**:
- [ ] generateNumber(entity, urut, tahun)
- [ ] Parse format: {tahun}, {urut:N}
- [ ] Used in Sesi, Temuan, Rekomendasi services

**Estimate**: 3 jam

---

## ISSUE #10: Email Service

**Title**: Email Service menggunakan Config SMTP

**Labels**: `backend`, `email`, `medium-priority`

**Acceptance Criteria**:
- [ ] EmailService.send(to, subject, body, html)
- [ ] Read SMTP config dari konfigurasi
- [ ] Test connection endpoint
- [ ] From email/name from config

**Estimate**: 4 jam

---

## ISSUE #11: Storage Buckets Setup

**Title**: Setup Supabase Storage Buckets & RLS

**Labels**: `infrastructure`, `storage`, `high-priority`

**Acceptance Criteria**:
- [ ] Create bucket: evidence-files
- [ ] Create bucket: branding (public)
- [ ] RLS policies (authenticated users can upload)
- [ ] Public access for branding bucket

**Estimate**: 1 jam

---

## ISSUE #12: Documentation

**Title**: Konfigurasi Module Documentation & Setup Guide

**Labels**: `documentation`, `low-priority`

**Estimate**: 2 jam

---

**Total Estimate**: 50 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
