# API Endpoints - Modul Kategori & Status

## SERVICE METHODS

### Kategori Temuan

```typescript
// Get all kategori
const response = await kategoriTemuanService.getAll();

// Get active only
const response = await kategoriTemuanService.getActive();

// Response
{
  "data": [
    { "id": "uuid", "kode": "MAJOR", "nama": "Major", "warna": "red" },
    { "id": "uuid", "kode": "MINOR", "nama": "Minor", "warna": "yellow" },
    { "id": "uuid", "kode": "OFI", "nama": "OFI", "warna": "blue" }
  ]
}
```

---

### Status RTL

```typescript
// Get all status
const response = await statusRtlService.getAll();

// Get active only (ordered by urutan)
const response = await statusRtlService.getActive();

// Response
{
  "data": [
    { "kode": "DRAFT", "nama": "Draft", "warna": "gray", "urutan": 1 },
    { "kode": "SUBMITTED", "nama": "Submitted", "warna": "blue", "urutan": 2 },
    { "kode": "ON_PROGRESS", "nama": "On Progress", "warna": "orange", "urutan": 3 },
    { "kode": "COMPLETED", "nama": "Completed", "warna": "green", "urutan": 4 },
    { "kode": "VERIFIED", "nama": "Verified", "warna": "purple", "urutan": 5 }
  ]
}
```

---

## USAGE IN COMPONENTS

### Badge Component

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant={kategori.warna}>
  {kategori.nama}
</Badge>

// Renders: <span class="badge badge-red">Major</span>
```

---

## TYPES

```typescript
export interface KategoriTemuan {
  id: string;
  kode: string;
  nama: string;
  warna: string;
  urutan: number;
  status: 'aktif' | 'nonaktif';
}

export interface StatusRtl {
  id: string;
  kode: string;
  nama: string;
  warna: string;
  urutan: number;
  status: 'aktif' | 'nonaktif';
}
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
