# Modul Notifikasi

## Overview
Modul Notifikasi mengelola notifikasi in-app dan email untuk berbagai event dalam sistem audit.

---

## Fitur

### 1. In-App Notification
- Real-time notification badge
- Notification center dengan list
- Mark as read/unread
- Notification type dengan icon

### 2. Email Notification
- Configurable (enable/disable)
- Template per event type
- Background job untuk kirim email
- SMTP config dari modul Konfigurasi

### 3. Event Types
- RTL Submitted → notify Admin GPM
- RTL Approved/Rejected → notify PIC Unit
- RTL Completed → notify Admin GPM
- RTL Verified → notify PIC Unit
- Deadline RTL reminder (3 days, 1 day, overdue)
- New Sesi Audit assigned → notify Auditor
- Temuan Input → notify PIC Unit

---

**Version**: 1.0
**Last Updated**: 2026-09-01
