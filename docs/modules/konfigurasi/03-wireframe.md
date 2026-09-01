# Wireframe - Modul Konfigurasi

## 1. PAGE: Settings (Admin Only)

```
┌────────────────────────────────────────────────────────────┐
│ KONFIGURASI SISTEM                            [Admin GPM]  │
├────────────────────────────────────────────────────────────┤
│ Tabs: [General] [Storage] [Email] [Workflow] [Numbering]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ === TAB: GENERAL ===                                       │
│                                                            │
│ [Branding]                                                 │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Logo Aplikasi                                          │ │
│ │ ┌──────────────┐                                       │ │
│ │ │   [LOGO]     │  [Upload Logo]                        │ │
│ │ │              │  Max 2MB (PNG/JPG)                    │ │
│ │ └──────────────┘                                       │ │
│ │                                                        │ │
│ │ Favicon                                                │ │
│ │ [🔲]  [Upload Favicon] Max 1MB (.ico/PNG)              │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [Informasi Institusi]                                      │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Nama Aplikasi                                          │ │
│ │ [SIM-AMI SPs UIKA_____________________________]        │ │
│ │                                                        │ │
│ │ Nama Institusi                                         │ │
│ │ [Sekolah Pascasarjana UIKA____________________]        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                           [Simpan Perubahan]               │
└────────────────────────────────────────────────────────────┘
```

---

## 2. TAB: Storage Settings

```
┌────────────────────────────────────────────────────────────┐
│ KONFIGURASI SISTEM                            [Admin GPM]  │
├────────────────────────────────────────────────────────────┤
│ Tabs: [General] [Storage] [Email] [Workflow] [Numbering]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ === TAB: STORAGE ===                                       │
│                                                            │
│ [Storage Provider]                                         │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Pilih Provider:                                        │ │
│ │ ◉ Supabase Storage (Default)                           │ │
│ │   ✓ Built-in                                           │ │
│ │   ✓ No config needed                                   │ │
│ │   ✓ RLS policies                                       │ │
│ │   ⚠ Free tier: 1GB                                     │ │
│ │                                                        │ │
│ │ ○ Google Drive (OAuth 2.0)                             │ │
│ │   ✓ Unlimited storage (workspace)                      │ │
│ │   ✓ Google account integration                         │ │
│ │   ⚠ Requires OAuth setup                               │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [Google Drive Configuration] (if selected)                 │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Status: ⚠ Not Connected                                │ │
│ │                                                        │ │
│ │ OAuth Client ID                                        │ │
│ │ [xxx.apps.googleusercontent.com_______________]        │ │
│ │                                                        │ │
│ │ OAuth Client Secret                                    │ │
│ │ [••••••••••••••••••••••••_________________]            │ │
│ │                                                        │ │
│ │ Folder ID (untuk upload)                               │ │
│ │ [1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms]         │ │
│ │                                                        │ │
│ │               [Connect Google Drive]                   │ │
│ │                                                        │ │
│ │ Help: [📖 Setup Guide]                                 │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [Connected Google Drive]                                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Status: ✓ Connected                                    │ │
│ │ Account: admin@uika.ac.id                              │ │
│ │ Folder: SIM-AMI Evidence Files                         │ │
│ │                                                        │ │
│ │               [Disconnect]  [Test Upload]              │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                           [Simpan Perubahan]               │
└────────────────────────────────────────────────────────────┘
```

---

## 3. TAB: Email Settings

```
┌────────────────────────────────────────────────────────────┐
│ === TAB: EMAIL ===                                         │
│                                                            │
│ [SMTP Configuration]                                       │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ SMTP Host                                              │ │
│ │ [smtp.gmail.com_______________________________]        │ │
│ │                                                        │ │
│ │ SMTP Port         Encryption                           │ │
│ │ [587___]          [TLS ▼]                              │ │
│ │                                                        │ │
│ │ Username                                               │ │
│ │ [admin@uika.ac.id_____________________________]        │ │
│ │                                                        │ │
│ │ Password                                               │ │
│ │ [••••••••••••••••_____________________________]        │ │
│ │                                                        │ │
│ │ From Email                                             │ │
│ │ [noreply@uika.ac.id___________________________]        │ │
│ │                                                        │ │
│ │ From Name                                              │ │
│ │ [SIM-AMI SPs UIKA_____________________________]        │ │
│ │                                                        │ │
│ │               [Test Connection]                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                           [Simpan Perubahan]               │
└────────────────────────────────────────────────────────────┘
```

---

## 4. TAB: Workflow Settings

```
┌────────────────────────────────────────────────────────────┐
│ === TAB: WORKFLOW ===                                      │
│                                                            │
│ [Deadline Settings]                                        │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Default RTL Deadline (hari setelah temuan dibuat)      │ │
│ │ [30___] hari                                           │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [Notification Settings]                                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ☑ Enable Notifikasi In-App                             │ │
│ │ ☑ Enable Email Notification                            │ │
│ │ ☑ Daily Reminder (deadline approaching)                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                           [Simpan Perubahan]               │
└────────────────────────────────────────────────────────────┘
```

---

## 5. TAB: Numbering Format

```
┌────────────────────────────────────────────────────────────┐
│ === TAB: NUMBERING ===                                     │
│                                                            │
│ [Auto Numbering Format]                                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Format Nomor Sesi Audit                                │ │
│ │ [SA/{tahun}/{urut:3}______________________________]    │ │
│ │ Preview: SA/2025/001                                   │ │
│ │                                                        │ │
│ │ Format Nomor Temuan                                    │ │
│ │ [{urut:3}/PM.10/KPMA/{tahun}______________________]    │ │
│ │ Preview: 151/PM.10/KPMA/2025                           │ │
│ │                                                        │ │
│ │ Format Nomor Rekomendasi                               │ │
│ │ [{urut:3}/PM.10/KPMA/{tahun}______________________]    │ │
│ │ Preview: 001/PM.10/KPMA/2025                           │ │
│ │                                                        │ │
│ │ Placeholders:                                          │ │
│ │ • {tahun} = Tahun (4 digit)                            │ │
│ │ • {urut:N} = Nomor urut (N digit padding)              │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                           [Simpan Perubahan]               │
└────────────────────────────────────────────────────────────┘
```

---

## 6. MODAL: Google Drive Setup Guide

```
┌────────────────────────────────────────────────────┐
│ GOOGLE DRIVE OAUTH SETUP                  [✕]     │
├────────────────────────────────────────────────────┤
│                                                    │
│ Step 1: Create OAuth App                          │
│ ┌────────────────────────────────────────────────┐ │
│ │ 1. Go to: console.cloud.google.com             │ │
│ │ 2. Create project "SIM-AMI"                    │ │
│ │ 3. Enable Google Drive API                     │ │
│ │ 4. Create OAuth 2.0 credentials                │ │
│ │ 5. Add redirect URI:                           │ │
│ │    http://localhost:3000/api/storage/          │ │
│ │    google-drive/callback                       │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Step 2: Copy Credentials                          │
│ ┌────────────────────────────────────────────────┐ │
│ │ Copy "Client ID" dan "Client Secret"           │ │
│ │ Paste ke form di tab Storage                   │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Step 3: Create Folder                             │
│ ┌────────────────────────────────────────────────┐ │
│ │ 1. Create folder di Google Drive               │ │
│ │    Name: "SIM-AMI Evidence Files"              │ │
│ │ 2. Copy Folder ID from URL                     │ │
│ │    drive.google.com/drive/folders/{FOLDER_ID}  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Step 4: Connect                                    │
│ ┌────────────────────────────────────────────────┐ │
│ │ Click "Connect Google Drive" button            │ │
│ │ → Authorize access                             │ │
│ │ → Done!                                        │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│                            [Close]                 │
└────────────────────────────────────────────────────┘
```

---

## 7. NAVBAR: Logo Display

```
┌────────────────────────────────────────────────────────────┐
│ [LOGO] SIM-AMI          [Dashboard] [Sesi] [Temuan]  [👤] │
└────────────────────────────────────────────────────────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
