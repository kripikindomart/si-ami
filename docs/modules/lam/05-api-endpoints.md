# API Endpoints - Modul LAM

## Overview
Dokumentasi lengkap API endpoints untuk modul LAM (Lembaga Akreditasi Mandiri) dengan standardisasi singleton pattern + error JSON per field.

---

## Base URL

```
Local: http://localhost:3000
Environment Variable: process.env.NEXT_PUBLIC_APP_URL
```

**Note**: Menggunakan Supabase client singleton pattern. Semua service methods dipanggil dari client-side.

---

## 1. LAM SERVICE METHODS

### 1.1 Get All LAM

**Service Method**:
```typescript
import { lamService } from '@/lib/api/lam.service';

const response = await lamService.getAll();
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-lam-1",
      "kode": "LAMDIK",
      "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
      "deskripsi": "Untuk prodi keislaman",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z",
      "updated_at": "2026-09-01T10:00:00Z"
    },
    {
      "id": "uuid-lam-2",
      "kode": "LAMDIKTI",
      "nama": "LAM Pendidikan Tinggi",
      "deskripsi": "Untuk prodi umum",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z",
      "updated_at": "2026-09-01T10:00:00Z"
    },
    {
      "id": "uuid-lam-3",
      "kode": "LAMDIKES",
      "nama": "LAM Pendidikan Tinggi Kesehatan",
      "deskripsi": "Untuk prodi kesehatan",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z",
      "updated_at": "2026-09-01T10:00:00Z"
    },
    {
      "id": "uuid-lam-4",
      "kode": "GLOBAL",
      "nama": "Standar Global",
      "deskripsi": "Standar berlaku untuk semua prodi",
      "status": "aktif",
      "created_at": "2026-09-01T10:00:00Z",
      "updated_at": "2026-09-01T10:00:00Z"
    }
  ],
  "message": "Data berhasil diambil"
}
```

---

### 1.2 Get Active LAM (untuk Dropdown)

**Service Method**:
```typescript
const response = await lamService.getActive();
```

**Query Behavior**:
- Filter: `status = 'aktif'`
- Exclude: `kode != 'GLOBAL'` (GLOBAL tidak untuk assignment prodi)
- Order: `kode ASC`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-lam-1",
      "kode": "LAMDIK",
      "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
      "status": "aktif"
    },
    {
      "id": "uuid-lam-3",
      "kode": "LAMDIKES",
      "nama": "LAM Pendidikan Tinggi Kesehatan",
      "status": "aktif"
    },
    {
      "id": "uuid-lam-2",
      "kode": "LAMDIKTI",
      "nama": "LAM Pendidikan Tinggi",
      "status": "aktif"
    }
  ],
  "message": "Data LAM aktif berhasil diambil"
}
```

**Use Case**:
- Dropdown di form Unit Kerja (untuk pilih LAM prodi)
- Dropdown di form Standar Mutu (untuk scope=specific, include GLOBAL)

---

### 1.3 Get LAM by ID

**Service Method**:
```typescript
const response = await lamService.getById(lamId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-lam-1",
    "kode": "LAMDIK",
    "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
    "deskripsi": "Untuk prodi keislaman",
    "status": "aktif",
    "created_at": "2026-09-01T10:00:00Z",
    "updated_at": "2026-09-01T10:00:00Z"
  },
  "message": "Data berhasil diambil"
}
```

**Error Response - Not Found** (404):
```json
{
  "success": false,
  "data": null,
  "message": "LAM tidak ditemukan",
  "errors": {
    "id": ["LAM dengan ID tersebut tidak ditemukan"]
  }
}
```

---

### 1.4 Create LAM

**Service Method**:
```typescript
const response = await lamService.create({
  kode: string,   // Will be auto-uppercased
  nama: string,
  deskripsi?: string,
});
```

**Request Body**:
```json
{
  "kode": "lamdik",
  "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
  "deskripsi": "Untuk prodi keislaman"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-lam-new",
    "kode": "LAMDIK",
    "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
    "deskripsi": "Untuk prodi keislaman",
    "status": "aktif",
    "created_at": "2026-09-01T15:00:00Z",
    "updated_at": "2026-09-01T15:00:00Z"
  },
  "message": "LAM berhasil ditambahkan"
}
```

**Note**: Kode otomatis di-uppercase (client-side transform + database constraint).

**Error Response - Validation** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "kode": ["Kode minimal 2 karakter", "Kode hanya boleh huruf kapital tanpa spasi"],
    "nama": ["Nama minimal 5 karakter"]
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
    "kode": ["Kode LAM 'LAMDIK' sudah digunakan"]
  }
}
```

---

### 1.5 Update LAM

**Service Method**:
```typescript
const response = await lamService.update(lamId, {
  nama: string,
  deskripsi?: string,
});
```

**Request Body**:
```json
{
  "nama": "LAM Pendidikan Tinggi Keagamaan Islam Updated",
  "deskripsi": "Deskripsi baru"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-lam-1",
    "kode": "LAMDIK",
    "nama": "LAM Pendidikan Tinggi Keagamaan Islam Updated",
    "deskripsi": "Deskripsi baru",
    "status": "aktif",
    "updated_at": "2026-09-01T16:00:00Z"
  },
  "message": "LAM berhasil diupdate"
}
```

**Note**: Kode TIDAK BISA diubah (immutable). Hanya nama dan deskripsi yang bisa diupdate.

**Error Response - Validation** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama minimal 5 karakter"]
  }
}
```

---

### 1.6 Toggle Status LAM

**Service Method**:
```typescript
const response = await lamService.toggleStatus(lamId);
```

**Behavior**:
- Jika status='aktif' → ubah ke 'nonaktif'
- Jika status='nonaktif' → ubah ke 'aktif'

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-lam-1",
    "kode": "LAMDIK",
    "nama": "LAM Pendidikan Tinggi Keagamaan Islam",
    "status": "nonaktif",
    "updated_at": "2026-09-01T17:00:00Z"
  },
  "message": "LAM LAMDIK berhasil dinonaktifkan"
}
```

**Business Logic**:
- LAM nonaktif tidak bisa dipilih untuk prodi/standar BARU
- Prodi/standar yang sudah assigned tetap punya referensi (tidak berubah)
- Tidak ada hard delete (hanya toggle status)

---

### 1.7 Get LAM Usage

**Service Method**:
```typescript
const response = await lamService.getUsage(lamId);
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "lam_id": "uuid-lam-1",
    "lam_kode": "LAMDIK",
    "lam_nama": "LAM Pendidikan Tinggi Keagamaan Islam",
    "usage": {
      "prodi_count": 2,
      "prodi_list": ["DPAI", "MPAI"],
      "standar_count": 12,
      "standar_list": [
        "Lamdik 1", "Lamdik 2", "Lamdik 3", 
        "Lamdik 4", "Lamdik 5", "Lamdik 6",
        "Lamdik 7", "Lamdik 8", "Lamdik 9",
        "Lamdik 10", "Lamdik 11", "Lamdik 12"
      ]
    }
  },
  "message": "Data usage LAM berhasil diambil"
}
```

**Query**:
```sql
-- Count prodi
SELECT COUNT(*) FROM unit_kerja WHERE lam_id = 'uuid-lam-1' AND jenis = 'prodi';

-- Count standar
SELECT COUNT(*) FROM standar_mutu WHERE lam_id = 'uuid-lam-1';
```

**Use Case**:
- Tampilkan info usage saat toggle status LAM
- Warning dialog sebelum nonaktifkan LAM yang dipakai banyak

---

## 2. INTEGRATION ENDPOINTS

### 2.1 Get LAM for Unit Kerja Dropdown

**Context**: Di form Unit Kerja (create/edit prodi)

**Service Method**:
```typescript
// Same as getActive(), but exclude GLOBAL
const response = await lamService.getActive();
```

**Usage in Component**:
```typescript
// components/unit-kerja/unit-form.tsx
const { data: lamOptions } = await lamService.getActive();

// Show dropdown jika jenis='prodi'
{unitJenis === 'prodi' && (
  <FormField name="lam_id">
    <Select>
      {lamOptions.map(lam => (
        <SelectItem value={lam.id}>{lam.nama}</SelectItem>
      ))}
    </Select>
  </FormField>
)}
```

---

### 2.2 Get LAM for Standar Mutu Dropdown

**Context**: Di form Standar Mutu (create/edit dengan scope=specific)

**Service Method**:
```typescript
// Get all active (include GLOBAL untuk standar)
const { data } = await supabase
  .from('lam')
  .select('*')
  .eq('status', 'aktif')
  .order('kode', { ascending: true });
```

**Usage in Component**:
```typescript
// components/standar-mutu/standar-form.tsx
const { data: lamOptions } = await supabase.from('lam').select('*').eq('status', 'aktif');

// Show dropdown jika scope='specific'
{scope === 'specific' && (
  <FormField name="lam_id">
    <Select>
      {lamOptions.map(lam => (
        <SelectItem value={lam.id}>
          {lam.kode} - {lam.nama}
        </SelectItem>
      ))}
    </Select>
  </FormField>
)}
```

---

### 2.3 Filter Standar by Unit LAM

**Context**: Di form Temuan (pilih standar rujukan based on unit yang diaudit)

**Service Method**:
```typescript
// Get unit's LAM
const { data: unit } = await supabase
  .from('unit_kerja')
  .select('lam_id')
  .eq('id', unitId)
  .single();

// Get standar for this unit (global + specific LAM)
const { data: standarOptions } = await supabase
  .from('standar_mutu')
  .select('*')
  .or(`scope.eq.global,and(scope.eq.specific,lam_id.eq.${unit.lam_id})`)
  .order('kode', { ascending: true });
```

**Example Result**:
Unit DPAI (LAM=LAMDIK) akan dapat standar:
- Semua standar scope=global
- Semua standar scope=specific dengan lam_id=LAMDIK

---

## 3. PERMISSION & AUTHORIZATION

### 3.1 RLS Policies

**Admin GPM**: Full access (CREATE, READ, UPDATE, toggle status)
```sql
CREATE POLICY admin_lam_full ON lam
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.nama = 'admin_gpm'
    )
  );
```

**Others**: Read-only
```sql
CREATE POLICY users_lam_read ON lam
  FOR SELECT
  USING (true); -- All authenticated users can read
```

### 3.2 Permission Check in Frontend

```typescript
import { usePermission } from '@/hooks/use-permission';

function LamListPage() {
  const { canCreate, canUpdate } = usePermission('lam');
  
  return (
    <>
      {canCreate && <Button onClick={handleCreate}>Tambah LAM</Button>}
      {canUpdate && <Button onClick={handleEdit}>Edit</Button>}
    </>
  );
}
```

---

## 4. ERROR HANDLING

### 4.1 PostgreSQL Error Codes

| Code | Error | Field | Message |
|------|-------|-------|---------|
| 23505 | Unique violation | kode | "Kode LAM 'LAMDIK' sudah digunakan" |
| 23502 | Not null violation | kode/nama | "Kode wajib diisi" / "Nama wajib diisi" |
| 23514 | Check constraint | status | "Status harus 'aktif' atau 'nonaktif'" |

### 4.2 Custom Validations

**Kode Format**:
```json
{
  "errors": {
    "kode": ["Kode hanya boleh huruf kapital tanpa spasi"]
  }
}
```

**Kode Length**:
```json
{
  "errors": {
    "kode": ["Kode minimal 2 karakter", "Kode maksimal 20 karakter"]
  }
}
```

---

## 5. QUERY EXAMPLES

### 5.1 Get LAM with Usage Count

```sql
SELECT 
  l.*,
  COUNT(DISTINCT uk.id) as prodi_count,
  COUNT(DISTINCT sm.id) as standar_count
FROM lam l
LEFT JOIN unit_kerja uk ON uk.lam_id = l.id AND uk.jenis = 'prodi'
LEFT JOIN standar_mutu sm ON sm.lam_id = l.id
GROUP BY l.id
ORDER BY l.kode;
```

### 5.2 Get Prodi by LAM

```sql
SELECT 
  uk.id,
  uk.kode,
  uk.nama,
  uk.lam_id,
  l.kode as lam_kode,
  l.nama as lam_nama
FROM unit_kerja uk
JOIN lam l ON uk.lam_id = l.id
WHERE uk.jenis = 'prodi' AND l.kode = 'LAMDIK'
ORDER BY uk.kode;
```

### 5.3 Get Standar by LAM

```sql
SELECT 
  sm.id,
  sm.kode,
  sm.nama,
  sm.scope,
  sm.lam_id,
  l.kode as lam_kode
FROM standar_mutu sm
LEFT JOIN lam l ON sm.lam_id = l.id
WHERE sm.scope = 'global' 
   OR (sm.scope = 'specific' AND l.kode = 'LAMDIK')
ORDER BY sm.kode;
```

---

## 6. TYPESCRIPT TYPES

```typescript
// types/lam.types.ts
export interface Lam {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface CreateLamDto {
  kode: string;
  nama: string;
  deskripsi?: string;
}

export interface UpdateLamDto {
  nama: string;
  deskripsi?: string;
}

export interface LamUsage {
  lam_id: string;
  lam_kode: string;
  lam_nama: string;
  usage: {
    prodi_count: number;
    prodi_list: string[];
    standar_count: number;
    standar_list: string[];
  };
}
```

---

## 7. TESTING

### 7.1 Unit Test Example

```typescript
// __tests__/lam.service.test.ts
describe('LamService', () => {
  it('should auto-uppercase kode on create', async () => {
    const response = await lamService.create({
      kode: 'lamdik',
      nama: 'Test LAM',
    });
    
    expect(response.success).toBe(true);
    expect(response.data?.kode).toBe('LAMDIK');
  });
  
  it('should return error for duplicate kode', async () => {
    await lamService.create({ kode: 'TEST', nama: 'Test' });
    const response = await lamService.create({ kode: 'TEST', nama: 'Test 2' });
    
    expect(response.success).toBe(false);
    expect(response.errors?.kode).toContain('Kode LAM \'TEST\' sudah digunakan');
  });
  
  it('should exclude GLOBAL from getActive', async () => {
    const response = await lamService.getActive();
    
    expect(response.success).toBe(true);
    expect(response.data?.find(l => l.kode === 'GLOBAL')).toBeUndefined();
  });
});
```

---

## 8. MIGRATION NOTES

### Seed Data

```sql
-- Default LAM (sudah include di migration)
INSERT INTO lam (kode, nama, deskripsi) VALUES
  ('LAMDIK', 'LAM Pendidikan Tinggi Keagamaan Islam', 'Untuk prodi keislaman'),
  ('LAMDIKTI', 'LAM Pendidikan Tinggi', 'Untuk prodi umum'),
  ('LAMDIKES', 'LAM Pendidikan Tinggi Kesehatan', 'Untuk prodi kesehatan'),
  ('GLOBAL', 'Standar Global', 'Standar berlaku untuk semua prodi');
```

### Update Existing Data (jika ada)

```sql
-- Assign LAM ke prodi existing (manual, berdasarkan analisis per prodi)
UPDATE unit_kerja SET lam_id = (SELECT id FROM lam WHERE kode='LAMDIK')
WHERE kode IN ('DPAI', 'MPAI', 'MTP');

UPDATE unit_kerja SET lam_id = (SELECT id FROM lam WHERE kode='LAMDIKTI')
WHERE kode IN ('MM', 'MS');

UPDATE unit_kerja SET lam_id = (SELECT id FROM lam WHERE kode='LAMDIKES')
WHERE kode IN ('MK', 'MKG');
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
**Maintained by**: Tim Development SIM-AMI
