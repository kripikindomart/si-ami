# GitHub Issues - Modul Kategori & Status

## ISSUE #1: Database Schema

**Title**: Create Tables kategori_temuan dan status_rtl

**Labels**: `database`, `schema`, `low-priority`

**Acceptance Criteria**:
- [ ] Tabel kategori_temuan dengan seed data (MAJOR, MINOR, OFI)
- [ ] Tabel status_rtl dengan seed data (5 status)
- [ ] RLS policies

**Estimate**: 1 jam

---

## ISSUE #2: Service Singleton

**Title**: KategoriService dan StatusService

**Labels**: `api`, `service`, `low-priority`

**Acceptance Criteria**:
- [ ] KategoriTemuanService.getAll(), getActive()
- [ ] StatusRtlService.getAll(), getActive()
- [ ] CRUD methods (optional, jarang diubah)

**Estimate**: 2 jam

---

## ISSUE #3: List Pages

**Title**: List Kategori dan List Status

**Labels**: `frontend`, `ui`, `low-priority`

**Acceptance Criteria**:
- [ ] Page list kategori temuan
- [ ] Page list status RTL
- [ ] Badge color preview
- [ ] Sortable by urutan

**Estimate**: 3 jam

---

## ISSUE #4: Badge Component

**Title**: Reusable Badge Component dengan Color Variants

**Labels**: `frontend`, `ui`, `component`, `medium-priority`

**Acceptance Criteria**:
- [ ] Component `<Badge variant={color}>{text}</Badge>`
- [ ] Variants: red, yellow, blue, gray, orange, green, purple
- [ ] Used in Temuan/RTL list

**Estimate**: 2 jam

---

## ISSUE #5: Documentation

**Title**: API Endpoints Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 9 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
