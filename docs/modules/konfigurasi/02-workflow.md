# Workflow - Modul Konfigurasi

## 1. READ CONFIG (All Users)

```
[Any User]
    ↓
App loads → KonfigurasiService.getAll()
    ↓
Cache config in memory/localStorage
    ↓
Use config throughout app
```

---

## 2. UPDATE CONFIG (Admin GPM)

```
[Admin GPM]
    ↓
Menu Settings → Konfigurasi Sistem
    ↓
Edit config:
├─ General Settings
├─ Email Settings
├─ Notification Settings
└─ Numbering Format
    ↓
Save → Validate → Update DB
    ↓
Broadcast to all active sessions (optional real-time)
```

---

## 3. CONFIG USAGE EXAMPLES

### RTL Deadline
```
[System Auto-Calculate]
    ↓
Get: rtl_deadline_days = 30
    ↓
RTL deadline = tanggal_temuan + 30 hari
```

### Email Notification
```
[System Send Email]
    ↓
Check: notif_email_enabled = true
    ↓
Get SMTP config → Send email
```

### Auto Numbering
```
[Create Sesi Audit]
    ↓
Get: nomor_format_sesi = "SA/{tahun}/{urut:3}"
    ↓
Generate: SA/2025/001
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
