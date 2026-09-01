# API Endpoints - Modul Auditor

## SERVICE METHODS

### Get All Auditor
```typescript
const response = await auditorService.getAll();
```

### Get Active Auditor
```typescript
const response = await auditorService.getActive();
```

### Create Auditor
```typescript
const response = await auditorService.create({
  nip: "198001012020",
  nama: "Dr. Ahmad Zaki",
  email: "zaki@uika.ac.id",
  telepon: "08123456789",
  sertifikasi: "Auditor Internal",
  user_id: "uuid-optional"
});
```

### Get Workload
```typescript
const response = await auditorService.getWorkload(auditorId, periodeId);
// Returns: { total_sesi, sesi_ketua, sesi_anggota }
```

### Assign to Sesi
```typescript
// In SesiAuditService.create()
await supabase.from('sesi_auditor').insert([
  { sesi_audit_id, auditor_id: ketuaId, peran: 'ketua' },
  { sesi_audit_id, auditor_id: anggota1Id, peran: 'anggota' },
  { sesi_audit_id, auditor_id: anggota2Id, peran: 'anggota' }
]);
```

## TYPES

```typescript
export interface Auditor {
  id: string;
  nip: string;
  nama: string;
  email?: string;
  telepon?: string;
  sertifikasi?: string;
  user_id?: string;
  status: 'aktif' | 'nonaktif';
}
```

**Version**: 1.0
**Last Updated**: 2026-09-01
