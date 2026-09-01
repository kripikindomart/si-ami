# Modul Tindak Lanjut (RTL)

## Overview
Modul Tindak Lanjut mengelola response dari PIC Unit terhadap temuan audit, tracking progress hingga verifikasi.

---

## Fitur

### 1. Submit RTL (PIC Unit)
- Deskripsi tindak lanjut
- Target penyelesaian
- Evidence (wajib)
- Status flow

### 2. Status Flow
- DRAFT: PIC Unit draft RTL
- SUBMITTED: PIC Unit submit untuk review
- ON_PROGRESS: Admin GPM approve, RTL dikerjakan
- COMPLETED: PIC Unit mark done, upload evidence final
- VERIFIED: Admin GPM verify completion

### 3. Approval & Review
- Admin GPM review submitted RTL
- Admin GPM verify completed RTL
- Reject: kembalikan ke DRAFT dengan catatan

---

## Business Rules

1. 1 temuan → 1 RTL
2. Status RTL sync ke temuan.status_rtl_id
3. Evidence wajib saat submit & complete
4. Only PIC Unit can edit DRAFT/ON_PROGRESS
5. Only Admin GPM can approve/verify/reject

---

**Version**: 1.0
**Last Updated**: 2026-09-01
