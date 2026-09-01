# Workflow - Modul Auditor

## 1. CREATE AUDITOR

```
[Admin GPM]
    ↓
Menu Master Data → Auditor → Tambah
    ↓
Form:
├─ NIP: [198001012020]
├─ Nama: [Dr. Ahmad Zaki, M.Pd]
├─ Email: [zaki@uika.ac.id]
├─ Telepon: [08123456789]
├─ Sertifikasi: [Auditor Internal Bersertifikat]
└─ Link ke User: [Optional - dropdown user]
    ↓
Validasi:
├─ NIP unique
├─ Nama required
└─ Email valid format
    ↓
INSERT auditor (status='aktif')
    ↓
Toast: "Auditor berhasil ditambahkan"
```

---

## 2. ASSIGN AUDITOR KE SESI AUDIT

```
[Admin GPM Create Sesi Audit]
    ↓
Form Sesi Audit:
    ├─ ...
    ├─ Ketua Auditor: [Dropdown auditor aktif]
    └─ Anggota Tim: [Multi-select auditor aktif]
    ↓
Save:
    ├─ INSERT sesi_audit
    ├─ INSERT sesi_auditor (ketua)
    └─ INSERT sesi_auditor (anggota1, anggota2, ...)
```

---

## 3. VIEW WORKLOAD AUDITOR

```
[Admin GPM]
    ↓
Menu Auditor → View Workload
    ↓
Query: SELECT * FROM v_auditor_workload
    ↓
Tampilkan table:
├─ Nama: Dr. Ahmad Zaki
├─ Total Sesi: 5
├─ Sesi Ketua: 3
└─ Sesi Anggota: 2
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
