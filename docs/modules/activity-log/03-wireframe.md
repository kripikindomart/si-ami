# Wireframe - Modul Activity Log

## 1. PAGE: Activity Log (Admin)

```
┌────────────────────────────────────────────────────────────┐
│ ACTIVITY LOG                                               │
├────────────────────────────────────────────────────────────┤
│ Filter: [User ▼] [Action ▼] [Module ▼]  [Date Range]      │
│         [All] [CREATE] [UPDATE] [DELETE]                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Time          │ User        │ Action │ Resource  │ Details│
│───────────────┼─────────────┼────────┼───────────┼────────│
│ 2 mins ago    │ admin@uika  │ APPROVE│ RTL #151  │ [View]│
│ 10:45 AM      │             │        │           │        │
│───────────────┼─────────────┼────────┼───────────┼────────│
│ 15 mins ago   │ pic@dpai    │ UPDATE │ RTL #151  │ [View]│
│ 10:30 AM      │             │        │           │        │
│───────────────┼─────────────┼────────┼───────────┼────────│
│ 1 hour ago    │ auditor@    │ CREATE │ Temuan    │ [View]│
│ 09:45 AM      │             │        │ #152      │        │
│───────────────┼─────────────┼────────┼───────────┼────────│
│ Yesterday     │ admin@uika  │ LOGIN  │ Session   │ [View]│
│ 08:30 AM      │             │        │           │        │
└────────────────────────────────────────────────────────────┘
```

---

## 2. MODAL: Log Detail

```
┌────────────────────────────────────────────────┐
│ ACTIVITY DETAIL                       [✕]      │
├────────────────────────────────────────────────┤
│                                                │
│ Time: 2025-03-15 10:45:23                      │
│ User: pic@dpai.uika.ac.id (PIC Unit DPAI)     │
│ Action: UPDATE                                 │
│ Resource: tindak_lanjut #151                   │
│                                                │
│ Description:                                   │
│ Updated status RTL from DRAFT to SUBMITTED     │
│                                                │
│ Changes:                                       │
│ ┌──────────────────────────────────────────┐ │
│ │ Before:                                  │ │
│ │ status_rtl_id: uuid-draft                │ │
│ │                                          │ │
│ │ After:                                   │ │
│ │ status_rtl_id: uuid-submitted            │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ Metadata:                                      │
│ IP Address: 192.168.1.100                      │
│ User Agent: Chrome 120.0.0                     │
│                                                │
│                          [Close]               │
└────────────────────────────────────────────────┘
```

---

## 3. COMPONENT: Recent Activity (Dashboard)

```
┌────────────────────────────────────────────┐
│ RECENT ACTIVITY                            │
├────────────────────────────────────────────┤
│ 🟢 admin@uika approved RTL #151            │
│    2 minutes ago                           │
│                                            │
│ 📝 pic@dpai updated RTL #151               │
│    15 minutes ago                          │
│                                            │
│ ➕ auditor@uika created Temuan #152        │
│    1 hour ago                              │
│                                            │
│ 🔑 admin@uika logged in                    │
│    Yesterday at 08:30                      │
│                                            │
│            [View All Activity]             │
└────────────────────────────────────────────┘
```

---

## 4. SECTION: Resource History (in Detail Page)

```
┌────────────────────────────────────────────────────────────┐
│ TEMUAN: 151/PM.10/KPMA/2025                                │
├────────────────────────────────────────────────────────────┤
│ ...                                                        │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ [History] (Activity Timeline)                          ││
│ ├────────────────────────────────────────────────────────┤│
│ │                                                        ││
│ │ 🟢 15 Mar 2025, 10:45                                  ││
│ │    Admin GPM approved RTL                             ││
│ │    Status: SUBMITTED → ON_PROGRESS                    ││
│ │                                                        ││
│ │ 📝 15 Mar 2025, 10:30                                  ││
│ │    PIC Unit DPAI submitted RTL for review             ││
│ │    Status: DRAFT → SUBMITTED                          ││
│ │    Uploaded 2 evidence files                          ││
│ │                                                        ││
│ │ ➕ 10 Mar 2025, 14:20                                  ││
│ │    Auditor created temuan                             ││
│ │    Kategori: MINOR, Standar: Standar 5.1, Lamdik 39  ││
│ │                                                        ││
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
