# API Endpoints - Modul Periode Audit

## 1. SERVICE METHODS

### 1.1 Get All Periode

```typescript
const response = await periodeAuditService.getAll();
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "nama": "AMI 2025",
      "tahun": 2025,
      "tanggal_mulai": "2025-01-20",
      "tanggal_selesai": "2025-06-30",
      "status": "aktif",
      "deskripsi": "Audit Mutu Internal 2025"
    }
  ]
}
```

---

### 1.2 Get Periode Aktif

```typescript
const response = await periodeAuditService.getActive();
```

**Response**: Single periode dengan status='aktif'

---

### 1.3 Create Periode

```typescript
const response = await periodeAuditService.create({
  nama: "AMI 2026",
  tahun: 2026,
  tanggal_mulai: "2026-01-15",
  tanggal_selesai: "2026-06-30",
  deskripsi: "Audit 2026"
});
```

**Error - Date Invalid**:
```json
{
  "success": false,
  "errors": {
    "tanggal_selesai": ["Tanggal selesai harus lebih besar dari tanggal mulai"]
  }
}
```

---

### 1.4 Set Periode Aktif

```typescript
const response = await periodeAuditService.setPeriodeAktif(periodeId);
```

**Behavior**:
- Set all periode to draft (where status=aktif)
- Set target periode to aktif

**Response**:
```json
{
  "success": true,
  "message": "Periode AMI 2026 sekarang aktif"
}
```

---

### 1.5 Close Periode

```typescript
const response = await periodeAuditService.closePeriode(periodeId);
```

**Validation**: Hanya periode aktif yang bisa di-close

**Response**:
```json
{
  "success": true,
  "message": "Periode AMI 2025 berhasil di-close"
}
```

**Error - Not Aktif**:
```json
{
  "success": false,
  "errors": {
    "_general": ["Hanya periode aktif yang bisa di-close"]
  }
}
```

---

### 1.6 Get Progress

```typescript
const response = await periodeAuditService.getProgress(periodeId);
```

**Response**:
```json
{
  "success": true,
  "data": {
    "periode_id": "uuid-1",
    "nama": "AMI 2025",
    "total_unit_audited": 8,
    "total_sesi": 8,
    "sesi_selesai": 6,
    "total_temuan": 42,
    "total_rekomendasi": 35,
    "rtl_completed": 30,
    "total_rtl": 35,
    "rtl_completion_pct": 85.7
  }
}
```

---

## 2. INTEGRATION

### Dropdown di Sesi Audit

```typescript
const { data: periodeAktif } = await periodeAuditService.getActive();

// Use in form
<Select>
  <SelectItem value={periodeAktif.id}>{periodeAktif.nama}</SelectItem>
</Select>
```

---

## 3. TYPESCRIPT TYPES

```typescript
export interface PeriodeAudit {
  id: string;
  nama: string;
  tahun: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: 'draft' | 'aktif' | 'selesai';
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}

export interface PeriodeProgress {
  periode_id: string;
  nama: string;
  total_unit_audited: number;
  total_sesi: number;
  sesi_selesai: number;
  total_temuan: number;
  total_rekomendasi: number;
  rtl_completed: number;
  total_rtl: number;
  rtl_completion_pct: number;
}
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
