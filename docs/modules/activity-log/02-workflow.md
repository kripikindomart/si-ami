# Workflow - Modul Activity Log

## 1. AUTO-LOGGING (System)

```
[User performs action]
    ↓
Trigger/Middleware detects:
├─ CREATE: New record
├─ UPDATE: Record change
├─ DELETE: Record deletion
├─ APPROVE: Status approval
└─ REJECT: Status rejection
    ↓
Capture:
├─ User ID (from auth)
├─ Action type
├─ Resource (type + ID)
├─ Changes (before/after)
├─ IP Address
└─ User Agent
    ↓
Insert to activity_log table
```

---

## 2. VIEW LOGS (Admin)

```
[Admin GPM]
    ↓
Menu Activity Log
    ↓
Filter:
├─ User
├─ Action
├─ Module
└─ Date range
    ↓
Display logs table
    ↓
Click row → View detail modal
```

---

## 3. VIEW RESOURCE HISTORY

```
[Any User]
    ↓
Detail Temuan/RTL/Sesi
    ↓
Tab "History" → Show activity timeline
    ↓
Display chronological events:
├─ Who did what
├─ When
└─ Changes made
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
