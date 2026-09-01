# Modul Konfigurasi

## Overview
Modul Konfigurasi mengelola pengaturan sistem global dalam format key-value pair. Termasuk system branding, SMTP, storage provider, dan workflow settings.

---

## Fitur

### 1. General Settings
- App name dan institusi
- Logo upload (navbar, login page)
- Favicon
- Branding customization

### 2. Email Settings (SMTP)
- SMTP host, port, credentials
- From email dan name
- Test email connection

### 3. Storage Provider
- **Supabase Storage** (default)
- **Google Drive** (via OAuth 2.0)
- Auto-upload evidence files
- Configurable per file type

### 4. Workflow Settings
- RTL deadline default (days)
- Auto-numbering format (Sesi, Temuan)
- Notification preferences

### 5. Key-Value Store
- Flexible config storage
- Type-safe parsing (string, number, boolean, JSON)
- Cache-able config
- Kategori grouping

---

## Example Config

```
app_name: "SIM-AMI SPs UIKA"
institusi: "Sekolah Pascasarjana UIKA"
logo_url: "/storage/logo.png"
rtl_deadline_days: 30
smtp_host: "smtp.gmail.com"
notif_enabled: true
storage_provider: "google_drive"
```

---

## Storage Providers

### Supabase Storage (Default)
- No config needed
- Built-in with project
- RLS policies
- Free tier: 1GB

### Google Drive (OAuth 2.0)
- Setup OAuth app di Google Cloud Console
- User authorize access
- Upload to specific folder
- Unlimited storage (workspace account)

---

**Version**: 1.0
**Last Updated**: 2026-09-01
