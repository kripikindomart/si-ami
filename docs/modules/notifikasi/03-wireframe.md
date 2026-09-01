# Wireframe - Modul Notifikasi

## 1. COMPONENT: Notification Badge (Header)

```
┌────────────────────────────────────────┐
│ SIM-AMI           [🔔 5]    [Profile] │
└────────────────────────────────────────┘
                     ↑
                Unread count badge
```

---

## 2. PANEL: Notification Center

```
┌──────────────────────────────────────────────────┐
│ NOTIFIKASI                   [Mark All as Read]  │
├──────────────────────────────────────────────────┤
│                                                  │
│ ⚪ RTL Submitted untuk Review                    │
│    Temuan #151 - DPAI telah submit RTL          │
│    2 jam yang lalu                      [View]   │
│                                                  │
│ ⚫ RTL Deadline < 3 Days                         │
│    Temuan #148 - MM deadline 2 hari lagi        │
│    5 jam yang lalu                      [View]   │
│                                                  │
│ ⚫ Sesi Audit Assigned                           │
│    Anda ditugaskan sebagai Ketua Auditor        │
│    Sesi SA/2025/005 - DPAI                      │
│    Yesterday                            [View]   │
│                                                  │
│ ⚫ RTL Overdue                                   │
│    Temuan #145 - S2 Hukum sudah overdue        │
│    2 days ago                           [View]   │
│                                                  │
│               [Load More...]                     │
└──────────────────────────────────────────────────┘

Legend:
⚪ = Unread
⚫ = Read
```

---

## 3. EMAIL TEMPLATE: RTL Submitted

```
Subject: [SIM-AMI] RTL Submitted untuk Review

Kepada Admin GPM,

PIC Unit DPAI telah submit Tindak Lanjut untuk review.

Temuan: 151/PM.10/KPMA/2025
Unit: S3 DPAI
Deadline: 09 April 2025

Silakan review RTL di link berikut:
http://localhost:3000/temuan/151

---
SIM-AMI SPs UIKA
```

---

## 4. EMAIL TEMPLATE: Deadline Reminder

```
Subject: [SIM-AMI] Reminder: RTL Deadline Mendekat

Kepada PIC Unit DPAI,

Reminder bahwa deadline Tindak Lanjut akan segera berakhir.

Temuan: 151/PM.10/KPMA/2025
Kategori: MAJOR
Deadline: 09 April 2025 (2 hari lagi)
Status: DRAFT

Silakan segera submit RTL:
http://localhost:3000/temuan/151

---
SIM-AMI SPs UIKA
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
