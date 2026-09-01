# API Endpoints - Modul Unit Kerja

## Overview
Dokumentasi API endpoints untuk modul Unit Kerja dengan conditional LAM validation.

---

## Base URL

```
Local: http://localhost:3000
Environment Variable: process.env.NEXT_PUBLIC_APP_URL
```

---

## 1. UNIT KERJA SERVICE METHODS

### 1.1 Get All Unit Kerja

**Service Method**:
```typescript
import { unitKerjaService } from '@/lib/api/unit-kerja.service';

const response = await unitKerjaService.getAll();
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "kode": "DPAI",
      "nama": "Program Studi Doktor Pendidikan Agama Islam",
      "jenis": "prodi",
      "lam_id": "uuid-lam-lamdik",
      "lam_kode": "LAMDIK",
      "lam_nama": "LAM Pendidikan Tinggi Keagamaan Islam",
      "parent_id": null,
      "deskripsi": "Program Studi S3 PAI",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "kode": "LAB-SPS",
      "nama": "Laboratorium Sekolah Pascasarjana",
      "jenis": "lab",
      "lam_id": null,
      "status": "aktif"
    }
  ],
  "message": "Data berhasil diambil"
}
```

---

### 1.2 Get Active Unit Kerja

**Service Method**:
```typescript
const response = await unitKerjaService.getActive();
```

**Filter**: `status = 'aktif'`

**Use Case**: Dropdown di form Sesi Audit

---

### 1.3 Get Unit Kerja by Jenis

**Service Method**:
```typescript
const response = await unitKerjaService.getByJenis('prodi');
```

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "kode": "DPAI",
      "nama": "Program Studi Doktor PAI",
      "jenis": "prodi",
      "lam_kode": "LAMDIK",
      "status": "aktif"
    }
  ],
  "message": "Data berhasil diambil"
}
```

---

### 1.4 Create Unit Kerja

**Service Method**:
```typescript
const response = await unitKerjaService.create({
  kode: string,      // Auto-uppercase
  nama: string,
  jenis: 'prodi' | 'lab' | 'direktur' | 'wakil' | 'unit_lain',
  lam_id?: string,   // Required jika jenis=prodi
  parent_id?: string,
  deskripsi?: string,
});
```

**Request Body - Prodi**:
```json
{
  "kode": "dpai",
  "nama": "Program Studi Doktor Pendidikan Agama Islam",
  "jenis": "prodi",
  "lam_id": "uuid-lam-lamdik",
  "deskripsi": "Program S3 PAI"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-new",
    "kode": "DPAI",
    "nama": "Program Studi Doktor Pendidikan Agama Islam",
    "jenis": "prodi",
    "lam_id": "uuid-lam-lamdik",
    "status": "aktif",
    "created_at": "2026-09-01T15:00:00Z"
  },
  "message": "Unit Kerja berhasil ditambahkan"
}
```

**Error Response - LAM Missing untuk Prodi** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "lam_id": ["LAM wajib dipilih untuk Program Studi"]
  }
}
```

**Error Response - LAM untuk Non-Prodi** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "lam_id": ["LAM hanya untuk Program Studi"]
  }
}
```

**Error Response - Duplicate Kode** (409):
```json
{
  "success": false,
  "data": null,
  "message": "Data duplikat",
  "errors": {
    "kode": ["Kode unit 'DPAI' sudah digunakan"]
  }
}
```

---

### 1.5 Update Unit Kerja

**Service Method**:
```typescript
const response = await unitKerjaService.update(unitId, {
  nama: string,
  jenis?: 'prodi' | 'lab' | ...,
  lam_id?: string | null,
  status?: 'aktif' | 'nonaktif',
  deskripsi?: string,
});
```

**Request Body**:
```json
{
  "nama": "Program Studi Doktor PAI Updated",
  "jenis": "prodi",
  "lam_id": "uuid-lam-lamdik",
  "status": "aktif"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "kode": "DPAI",
    "nama": "Program Studi Doktor PAI Updated",
    "updated_at": "2026-09-01T16:00:00Z"
  },
  "message": "Unit Kerja berhasil diupdate"
}
```

**Note**: 
- Kode TIDAK BISA diubah
- Jika jenis diubah dari prodi→non-prodi: lam_id harus null
- Jika jenis diubah dari non-prodi→prodi: lam_id wajib diisi

---

### 1.6 Toggle Status

**Service Method**:
```typescript
const response = await unitKerjaService.toggleStatus(unitId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "kode": "DPAI",
    "status": "nonaktif",
    "updated_at": "2026-09-01T17:00:00Z"
  },
  "message": "Unit Kerja DPAI berhasil dinonaktifkan"
}
```

---

### 1.7 Get Unit Usage

**Service Method**:
```typescript
const response = await unitKerjaService.getUsage(unitId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "unit_id": "uuid-1",
    "unit_kode": "DPAI",
    "usage": {
      "sesi_audit_count": 3,
      "temuan_count": 8,
      "rekomendasi_count": 5,
      "pic_count": 2,
      "pic_names": ["Budi Santoso", "Siti Rahma"]
    }
  },
  "message": "Data usage berhasil diambil"
}
```

---

## 2. INTEGRATION ENDPOINTS

### 2.1 Get Unit for Sesi Audit Dropdown

**Context**: Form Sesi Audit - pilih unit yang diaudit

**Service Method**:
```typescript
const { data } = await unitKerjaService.getActive();
```

**Usage in Component**:
```typescript
<Select>
  {unitOptions.map(unit => (
    <SelectItem value={unit.id}>
      {unit.kode} - {unit.nama} ({unit.jenis})
    </SelectItem>
  ))}
</Select>
```

---

### 2.2 Get Prodi with LAM for Filtering

**Context**: Filter standar mutu by unit LAM

**Service Method**:
```typescript
const { data: unit } = await unitKerjaService.getById(unitId);

// Get unit's LAM
const lamId = unit.lam_id;

// Filter standar
const { data: standar } = await supabase
  .from('standar_mutu')
  .select('*')
  .or(`scope.eq.global,and(scope.eq.specific,lam_id.eq.${lamId})`);
```

---

### 2.3 Get Unit with PIC

**Context**: List unit dengan info PIC

**Query**:
```sql
SELECT * FROM v_unit_kerja_with_pic ORDER BY kode;
```

**Response**:
```json
{
  "unit_id": "uuid-1",
  "unit_kode": "DPAI",
  "unit_nama": "Prodi Doktor PAI",
  "jenis": "prodi",
  "status": "aktif",
  "pic_count": 2,
  "pic_names": "Budi Santoso, Siti Rahma"
}
```

---

## 3. PERMISSION & AUTHORIZATION

### RLS Policies

**Admin GPM**: Full access
```sql
CREATE POLICY admin_unit_kerja_full ON unit_kerja
  FOR ALL
  USING (check_role('admin_gpm'));
```

**All Users**: Read-only
```sql
CREATE POLICY users_unit_kerja_read ON unit_kerja
  FOR SELECT
  USING (true);
```

---

## 4. QUERY EXAMPLES

### Get All Prodi with LAM

```sql
SELECT 
  uk.kode,
  uk.nama,
  l.kode as lam_kode,
  l.nama as lam_nama
FROM unit_kerja uk
JOIN lam l ON uk.lam_id = l.id
WHERE uk.jenis = 'prodi' AND uk.status = 'aktif'
ORDER BY uk.kode;
```

### Get Unit by LAM

```sql
SELECT uk.* 
FROM unit_kerja uk
WHERE uk.jenis = 'prodi' 
  AND uk.lam_id = (SELECT id FROM lam WHERE kode = 'LAMDIK');
```

---

## 5. TYPESCRIPT TYPES

```typescript
// types/unit-kerja.types.ts
export interface UnitKerja {
  id: string;
  kode: string;
  nama: string;
  jenis: 'prodi' | 'lab' | 'direktur' | 'wakil' | 'unit_lain';
  lam_id?: string;
  lam_kode?: string;
  lam_nama?: string;
  parent_id?: string;
  deskripsi?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface CreateUnitKerjaDto {
  kode: string;
  nama: string;
  jenis: 'prodi' | 'lab' | 'direktur' | 'wakil' | 'unit_lain';
  lam_id?: string;
  parent_id?: string;
  deskripsi?: string;
}

export interface UpdateUnitKerjaDto {
  nama?: string;
  jenis?: 'prodi' | 'lab' | 'direktur' | 'wakil' | 'unit_lain';
  lam_id?: string | null;
  status?: 'aktif' | 'nonaktif';
  deskripsi?: string;
}
```

---

## 6. VALIDATION RULES

### Client-Side (Zod)

```typescript
const createUnitKerjaSchema = z.object({
  kode: z.string()
    .min(2).max(50)
    .regex(/^[A-Z0-9-]+$/)
    .transform(val => val.toUpperCase()),
  nama: z.string().min(5).max(255),
  jenis: z.enum(['prodi', 'lab', 'direktur', 'wakil', 'unit_lain']),
  lam_id: z.string().uuid().optional(),
  deskripsi: z.string().optional(),
}).refine(
  (data) => data.jenis === 'prodi' ? !!data.lam_id : true,
  { message: 'LAM wajib untuk Prodi', path: ['lam_id'] }
).refine(
  (data) => data.jenis !== 'prodi' ? !data.lam_id : true,
  { message: 'LAM hanya untuk Prodi', path: ['lam_id'] }
);
```

---

## 7. ERROR CODES

| Error | HTTP | Message | Field |
|-------|------|---------|-------|
| Kode duplicate | 409 | "Kode unit 'X' sudah digunakan" | kode |
| LAM missing (prodi) | 400 | "LAM wajib untuk Program Studi" | lam_id |
| LAM for non-prodi | 400 | "LAM hanya untuk Program Studi" | lam_id |
| Invalid LAM | 400 | "LAM tidak ditemukan" | lam_id |

---

**Version**: 1.0
**Last Updated**: 2026-09-01
