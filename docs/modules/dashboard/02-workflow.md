# Workflow - Modul Dashboard

## 1. LOAD DASHBOARD DATA

```
[User Login]
    ↓
Route to dashboard based on role:
├─ admin_gpm → Dashboard Admin
├─ auditor → Dashboard Auditor
└─ pic_unit → Dashboard PIC Unit
    ↓
Fetch dashboard stats (API call)
    ↓
Display visualizations + alerts
```

---

## 2. FILTER DATA (Admin/Auditor)

```
[Select Period Filter]
    ↓
Reload dashboard stats for selected period
    ↓
Update charts & tables
```

---

## 3. QUICK ACTIONS

### Admin GPM
```
Click "Review RTL" → Navigate to RTL detail
Click Alert item → Navigate to relevant temuan/RTL
Click Unit row → Navigate to unit detail with temuan list
```

### Auditor
```
Click "View Details" sesi → Navigate to sesi detail
Click "Input Temuan" → Navigate to form tambah temuan
```

### PIC Unit
```
Click "Submit RTL" → Navigate to RTL form
Click Alert item → Navigate to temuan detail
Click Temuan row → Navigate to temuan detail
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
