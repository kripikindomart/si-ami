# API Endpoints - Modul Standar Mutu

## 1. SERVICE METHODS

### 1.1 Get All Standar

```typescript
const response = await standarMutuService.getAll();
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "kode": "Standar 1.1",
      "nama": "Visi, Misi, Tujuan",
      "scope": "global",
      "lam_id": null,
      "lam_kode": null,
      "nomor_urut": 1,
      "status": "aktif"
    },
    {
      "id": "uuid-2",
      "kode": "Lamdik 5",
      "nama": "Standar Isi Pembelajaran",
      "scope": "specific",
      "lam_id": "uuid-lam-1",
      "lam_kode": "LAMDIK",
      "nomor_urut": 5,
      "status": "aktif"
    }
  ]
}
```

---

### 1.2 Get Standar by Unit (Filtered)

```typescript
const response = await standarMutuService.getByUnit(unitId);
```

**Query Logic**:
```sql
WHERE scope='global' 
   OR (scope='specific' AND lam_id = unit.lam_id)
```

**Example**: Unit DPAI (LAM=LAMDIK)
- Result: Standar global + Standar LAMDIK

---

### 1.3 Create Standar Global

```typescript
const response = await standarMutuService.create({
  kode: "Standar 1.1",
  nama: "Visi, Misi, Tujuan",
  scope: "global",
  lam_id: null, // MUST be null
  nomor_urut: 1
});
```

**Error - LAM for Global**:
```json
{
  "success": false,
  "errors": {
    "lam_id": ["LAM harus null untuk scope global"]
  }
}
```

---

### 1.4 Create Standar Specific

```typescript
const response = await standarMutuService.create({
  kode: "Lamdik 5",
  nama: "Standar Isi Pembelajaran",
  scope: "specific",
  lam_id: "uuid-lam-lamdik", // MUST be filled
  nomor_urut: 5
});
```

**Error - LAM Missing**:
```json
{
  "success": false,
  "errors": {
    "lam_id": ["LAM wajib diisi untuk scope specific"]
  }
}
```

---

### 1.5 Update Standar

```typescript
const response = await standarMutuService.update(standarId, {
  nama: "Updated Name",
  scope: "global",
  lam_id: null // Adjusted if scope changed
});
```

**Scope Change Handling**:
- specific → global: lam_id auto null
- global → specific: lam_id wajib diisi

---

## 2. INTEGRATION - Save Multiple Standar

### Save Standar untuk Temuan

```typescript
// In TemuanService.create()
const temuanId = await createTemuan(data);

// Save multiple standar
const standarIds = data.standar_mutu_ids; // ["uuid-1", "uuid-2"]

await Promise.all(
  standarIds.map(standarId =>
    supabase.from('temuan_standar').insert({
      temuan_id: temuanId,
      standar_mutu_id: standarId
    })
  )
);
```

### Update Standar (Replace)

```typescript
// Delete old standar
await supabase.from('temuan_standar')
  .delete()
  .eq('temuan_id', temuanId);

// Insert new standar
await supabase.from('temuan_standar').insert(
  newStandarIds.map(id => ({
    temuan_id: temuanId,
    standar_mutu_id: id
  }))
);
```

---

## 3. QUERY EXAMPLES

### Get Standar for Unit DPAI

```sql
SELECT * FROM get_standar_by_unit(
  (SELECT id FROM unit_kerja WHERE kode='DPAI')
);
```

### Get Global Standar Only

```sql
SELECT * FROM standar_mutu
WHERE scope='global' AND status='aktif'
ORDER BY nomor_urut;
```

### Get Standar by LAM

```sql
SELECT * FROM standar_mutu
WHERE scope='specific' 
  AND lam_id = (SELECT id FROM lam WHERE kode='LAMDIK')
  AND status='aktif'
ORDER BY nomor_urut;
```

---

## 4. TYPESCRIPT TYPES

```typescript
export interface StandarMutu {
  id: string;
  kode: string;
  nama: string;
  scope: 'global' | 'specific';
  lam_id?: string;
  lam_kode?: string;
  lam_nama?: string;
  nomor_urut?: number;
  deskripsi?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface CreateStandarDto {
  kode: string;
  nama: string;
  scope: 'global' | 'specific';
  lam_id?: string;
  nomor_urut?: number;
  deskripsi?: string;
}
```

---

## 5. VALIDATION RULES

```typescript
const createStandarSchema = z.object({
  kode: z.string().min(1).max(50),
  nama: z.string().min(5),
  scope: z.enum(['global', 'specific']),
  lam_id: z.string().uuid().optional(),
  nomor_urut: z.number().int().optional(),
}).refine(
  (data) => data.scope === 'global' ? !data.lam_id : true,
  { message: 'LAM harus null untuk global', path: ['lam_id'] }
).refine(
  (data) => data.scope === 'specific' ? !!data.lam_id : true,
  { message: 'LAM wajib untuk specific', path: ['lam_id'] }
);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
