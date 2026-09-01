# GitHub Issues - Modul Notifikasi

## ISSUE #1: Database Schema

**Title**: Create Tables notifikasi dan notifikasi_log

**Labels**: `database`, `schema`, `medium-priority`

**Acceptance Criteria**:
- [ ] Tabel notifikasi
- [ ] Tabel notifikasi_log
- [ ] Function create_notification()
- [ ] RLS policies

**Estimate**: 2 jam

---

## ISSUE #2: Notification Service

**Title**: NotificationService dengan Create & Send Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] NotificationService.create(userId, data)
- [ ] NotificationService.getByUser(userId, limit)
- [ ] NotificationService.markAsRead(id)
- [ ] NotificationService.markAllAsRead(userId)
- [ ] NotificationService.getUnreadCount(userId)
- [ ] NotificationService.delete(id)

**Estimate**: 4 jam

---

## ISSUE #3: Email Service

**Title**: EmailService dengan Template Support

**Labels**: `backend`, `email`, `high-priority`

**Acceptance Criteria**:
- [ ] EmailService.send(to, subject, body)
- [ ] EmailService.sendTemplate(to, templateName, data)
- [ ] Email templates: rtl_submitted, rtl_approved, rtl_rejected, deadline_reminder
- [ ] Read SMTP config dari Konfigurasi module
- [ ] Queue email (background job)
- [ ] Log to notifikasi_log

**Estimate**: 6 jam

---

## ISSUE #4: Notification UI Component

**Title**: Notification Badge dan Center Component

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] NotificationBadge component (header)
- [ ] NotificationCenter dropdown panel
- [ ] Real-time update via Supabase Realtime
- [ ] Mark as read on click
- [ ] Navigate to related link
- [ ] Unread count badge
- [ ] Pagination/infinite scroll

**Estimate**: 6 jam

---

## ISSUE #5: Event Triggers Integration

**Title**: Integrate Notification dengan Event System

**Labels**: `backend`, `integration`, `high-priority`

**Acceptance Criteria**:
- [ ] Trigger on RTL submit → notify Admin GPM
- [ ] Trigger on RTL approve/reject → notify PIC Unit
- [ ] Trigger on RTL complete → notify Admin GPM
- [ ] Trigger on RTL verify → notify PIC Unit
- [ ] Trigger on Sesi assign → notify Auditor
- [ ] Trigger on Temuan input → notify PIC Unit

**Estimate**: 5 jam

---

## ISSUE #6: Daily Reminder Cron Job

**Title**: Cron Job untuk Deadline Reminder

**Labels**: `backend`, `cron`, `medium-priority`

**Acceptance Criteria**:
- [ ] Daily cron job (08:00 AM)
- [ ] Check RTL deadline: 3 days, 1 day, overdue
- [ ] Send notification + email to PIC Unit
- [ ] Send summary to Admin GPM (overdue list)

**Estimate**: 4 jam

---

## ISSUE #7: Notification Settings

**Title**: User Notification Preferences

**Labels**: `frontend`, `ui`, `low-priority`

**Acceptance Criteria**:
- [ ] Settings page: enable/disable email notification
- [ ] Settings page: notification type preferences
- [ ] Store preferences in user_metadata

**Estimate**: 3 jam

---

## ISSUE #8: Documentation

**Title**: Notification API Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 31 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
