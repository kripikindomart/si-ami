# Workflow - Modul Notifikasi

## 1. CREATE NOTIFICATION (System Event)

```
[System Event Triggered]
├─ RTL Submitted
├─ RTL Approved/Rejected
├─ Deadline Reminder
└─ Sesi Assigned
    ↓
Identify target users (based on event type)
    ↓
Create in-app notification:
├─ Insert into notifikasi table
└─ Real-time update via Supabase Realtime
    ↓
IF email_enabled:
  Queue email notification
    ↓
  Background job:
  ├─ Get email template
  ├─ Render template with data
  ├─ Send email via SMTP
  └─ Log result to notifikasi_log
```

---

## 2. VIEW NOTIFICATIONS (User)

```
[User]
    ↓
Notification Badge: Show unread count
    ↓
Click Notification Icon
    ↓
Notification Center opens
    ↓
List notifications (latest first)
    ↓
Click notification item:
├─ Mark as read
└─ Navigate to related link
```

---

## 3. MARK AS READ

```
[User clicks notification]
    ↓
Update notifikasi:
├─ is_read = TRUE
└─ read_at = NOW()
    ↓
Update badge count
```

---

## 4. DAILY REMINDER JOB

```
[Cron Job: Every day at 08:00]
    ↓
Get RTL dengan deadline upcoming:
├─ Deadline = 3 days from now
├─ Deadline = 1 day from now
└─ Deadline < today (overdue)
    ↓
For each RTL:
  Get PIC Unit user_id
    ↓
  Create notification + send email
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
