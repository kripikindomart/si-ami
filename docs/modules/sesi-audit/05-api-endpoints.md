# API Endpoints - Modul Sesi Audit

## SERVICE CLASS

```typescript
class SesiAuditService extends BaseApiService {
  private static instance: SesiAuditService;

  private constructor() {
    super('sesi_audit');
  }

  static getInstance(): SesiAuditService {
    if (!this.instance) {
      this.instance = new SesiAuditService();
    }
    return this.instance;
  }

  // Create sesi with auditors
  async create(data: SesiAuditCreate, auditors: AuditorAssignment[]): Promise<ApiResponse<SesiAudit>> {
    try {
      // Validate periode aktif
      const periodeAktif = await this.supabase
        .from('periode_audit')
        .select('id')
        .eq('status', 'aktif')
        .single();

      if (!periodeAktif.data) {
        return {
          error: { message: 'Tidak ada periode aktif', errors: { _general: ['Tidak ada periode aktif'] } }
        };
      }

      data.periode_audit_id = periodeAktif.data.id;

      // Validate duplicate active sesi for unit
      const existingSesi = await this.supabase
        .from('sesi_audit')
        .select('id')
        .eq('unit_kerja_id', data.unit_kerja_id)
        .in('status', ['SCHEDULED', 'IN_PROGRESS'])
        .single();

      if (existingSesi.data) {
        return {
          error: { 
            message: 'Unit sudah memiliki sesi aktif',
            errors: { unit_kerja_id: ['Unit sudah memiliki sesi aktif atau terjadwal'] }
          }
        };
      }

      // Validate ketua exists
      const hasKetua = auditors.some(a => a.peran === 'ketua');
      if (!hasKetua) {
        return {
          error: { 
            message: 'Ketua auditor wajib',
            errors: { auditors: ['Minimal 1 ketua auditor wajib ada'] }
          }
        };
      }

      // Insert sesi
      const sesiResponse = await this.supabase
        .from('sesi_audit')
        .insert(data)
        .select()
        .single();

      if (sesiResponse.error) {
        return this.handleError(sesiResponse.error);
      }

      // Insert auditors
      const sesiId = sesiResponse.data.id;
      const auditorInserts = auditors.map(a => ({
        sesi_audit_id: sesiId,
        auditor_id: a.auditor_id,
        peran: a.peran
      }));

      await this.supabase
        .from('sesi_auditor')
        .insert(auditorInserts);

      return sesiResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get by ID with details
  async getById(id: string): Promise<ApiResponse<SesiAuditDetail>> {
    const response = await this.supabase
      .from('v_sesi_audit_detail')
      .select('*')
      .eq('id', id)
      .single();

    if (response.data) {
      // Get auditors
      const auditorsResponse = await this.supabase
        .from('sesi_auditor')
        .select('*, auditor:auditor_id(*)')
        .eq('sesi_audit_id', id);

      response.data.auditors = auditorsResponse.data || [];
    }

    return response;
  }

  // Get all with filters
  async getAll(filters?: SesiAuditFilters): Promise<ApiResponse<SesiAuditDetail[]>> {
    let query = this.supabase
      .from('v_sesi_audit_detail')
      .select('*')
      .order('tanggal_mulai', { ascending: false });

    if (filters?.periode_id) {
      query = query.eq('periode_audit_id', filters.periode_id);
    }

    if (filters?.unit_id) {
      query = query.eq('unit_kerja_id', filters.unit_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`nomor.ilike.%${filters.search}%,unit_kerja_nama.ilike.%${filters.search}%`);
    }

    return await query;
  }

  // Get my sesi (for auditor role)
  async getMySesi(userId: string): Promise<ApiResponse<SesiAuditDetail[]>> {
    // Get auditor_id from user_id
    const auditorResponse = await this.supabase
      .from('auditor')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!auditorResponse.data) {
      return { data: [] };
    }

    // Get sesi where auditor assigned
    const sesiIdsResponse = await this.supabase
      .from('sesi_auditor')
      .select('sesi_audit_id')
      .eq('auditor_id', auditorResponse.data.id);

    const sesiIds = sesiIdsResponse.data?.map(s => s.sesi_audit_id) || [];

    if (sesiIds.length === 0) {
      return { data: [] };
    }

    const response = await this.supabase
      .from('v_sesi_audit_detail')
      .select('*')
      .in('id', sesiIds)
      .order('tanggal_mulai', { ascending: false });

    return response;
  }

  // Get by unit (for PIC role)
  async getByUnit(unitId: string): Promise<ApiResponse<SesiAuditDetail[]>> {
    const response = await this.supabase
      .from('v_sesi_audit_detail')
      .select('*')
      .eq('unit_kerja_id', unitId)
      .order('tanggal_mulai', { ascending: false });

    return response;
  }

  // Update status
  async updateStatus(id: string, status: SesiStatus): Promise<ApiResponse<SesiAudit>> {
    // Validate cannot update COMPLETED
    const current = await this.supabase
      .from('sesi_audit')
      .select('status')
      .eq('id', id)
      .single();

    if (current.data?.status === 'COMPLETED') {
      return {
        error: {
          message: 'Sesi completed tidak dapat diubah',
          errors: { status: ['Sesi completed tidak dapat diubah'] }
        }
      };
    }

    const response = await this.supabase
      .from('sesi_audit')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return response;
  }

  // Update auditors
  async updateAuditors(sesiId: string, auditors: AuditorAssignment[]): Promise<ApiResponse<void>> {
    try {
      // Validate ketua exists
      const hasKetua = auditors.some(a => a.peran === 'ketua');
      if (!hasKetua) {
        return {
          error: {
            message: 'Ketua auditor wajib',
            errors: { auditors: ['Minimal 1 ketua auditor wajib ada'] }
          }
        };
      }

      // Delete old
      await this.supabase
        .from('sesi_auditor')
        .delete()
        .eq('sesi_audit_id', sesiId);

      // Insert new
      const auditorInserts = auditors.map(a => ({
        sesi_audit_id: sesiId,
        auditor_id: a.auditor_id,
        peran: a.peran
      }));

      await this.supabase
        .from('sesi_auditor')
        .insert(auditorInserts);

      return { data: undefined };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
```

---

## TYPES

```typescript
export interface SesiAudit {
  id: string;
  nomor: string;
  periode_audit_id: string;
  unit_kerja_id: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  status: SesiStatus;
  keterangan?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type SesiStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface SesiAuditCreate {
  unit_kerja_id: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  keterangan?: string;
  periode_audit_id?: string; // auto-filled
}

export interface AuditorAssignment {
  auditor_id: string;
  peran: 'ketua' | 'anggota';
}

export interface SesiAuditDetail extends SesiAudit {
  periode_nama: string;
  periode_tahun: number;
  unit_kerja_nama: string;
  unit_kerja_kode: string;
  ketua_auditor: string;
  anggota_auditor: string;
  jumlah_temuan: number;
  jumlah_nilai_positif: number;
  auditors?: SesiAuditorDetail[];
}

export interface SesiAuditorDetail {
  id: string;
  peran: 'ketua' | 'anggota';
  auditor: {
    id: string;
    nip: string;
    nama: string;
  };
}

export interface SesiAuditFilters {
  periode_id?: string;
  unit_id?: string;
  status?: SesiStatus;
  search?: string;
}
```

---

## USAGE EXAMPLES

### Create Sesi

```typescript
const sesiService = SesiAuditService.getInstance();

const sesiData: SesiAuditCreate = {
  unit_kerja_id: 'uuid-dpai',
  tanggal_mulai: '2025-03-10',
  tanggal_selesai: '2025-03-15',
  keterangan: 'Audit rutin semester genap'
};

const auditors: AuditorAssignment[] = [
  { auditor_id: 'uuid-ali', peran: 'ketua' },
  { auditor_id: 'uuid-budi', peran: 'anggota' },
  { auditor_id: 'uuid-cici', peran: 'anggota' }
];

const response = await sesiService.create(sesiData, auditors);
```

---

### Get My Sesi (Auditor)

```typescript
const userId = auth.uid();
const response = await sesiService.getMySesi(userId);

// Group by status
const upcoming = response.data.filter(s => s.status === 'SCHEDULED');
const inProgress = response.data.filter(s => s.status === 'IN_PROGRESS');
const completed = response.data.filter(s => s.status === 'COMPLETED');
```

---

### Update Status

```typescript
await sesiService.updateStatus('uuid-sesi', 'IN_PROGRESS');
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
