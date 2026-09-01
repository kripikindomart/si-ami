# API Endpoints - Modul Dashboard

## SERVICE CLASS

```typescript
class DashboardService extends BaseApiService {
  private static instance: DashboardService;

  private constructor() {
    super('');
  }

  static getInstance(): DashboardService {
    if (!this.instance) {
      this.instance = new DashboardService();
    }
    return this.instance;
  }

  async getAdminStats(periodeId?: string): Promise<ApiResponse<AdminDashboardStats>> {
    const response = await this.supabase.from('v_dashboard_admin').select('*').single();
    
    if (periodeId) {
      const { data } = await this.supabase.rpc('get_dashboard_stats', { periode_id: periodeId });
      return { data: { ...response.data, ...data } };
    }

    return response;
  }

  async getAuditorStats(userId: string): Promise<ApiResponse<AuditorDashboardStats>> {
    const auditor = await this.supabase.from('auditor').select('id').eq('user_id', userId).single();
    if (!auditor.data) return { data: null };

    const sesiCount = await this.supabase.from('sesi_auditor').select('*', { count: 'exact' }).eq('auditor_id', auditor.data.id);
    
    const temuanCount = await this.supabase
      .from('temuan')
      .select('id', { count: 'exact' })
      .in('sesi_audit_id', 
        this.supabase.from('sesi_auditor').select('sesi_audit_id').eq('auditor_id', auditor.data.id)
      );

    const nilaiPositifCount = await this.supabase
      .from('nilai_positif')
      .select('id', { count: 'exact' })
      .in('sesi_audit_id',
        this.supabase.from('sesi_auditor').select('sesi_audit_id').eq('auditor_id', auditor.data.id)
      );

    return {
      data: {
        total_sesi: sesiCount.count || 0,
        total_temuan: temuanCount.count || 0,
        total_nilai_positif: nilaiPositifCount.count || 0
      }
    };
  }

  async getPICStats(unitId: string): Promise<ApiResponse<PICDashboardStats>> {
    const response = await this.supabase.from('v_temuan_by_unit').select('*').eq('unit_kerja_id', unitId).single();
    
    const nextAudit = await this.supabase
      .from('sesi_audit')
      .select('nomor, tanggal_mulai, tanggal_selesai')
      .eq('unit_kerja_id', unitId)
      .in('status', ['SCHEDULED', 'IN_PROGRESS'])
      .order('tanggal_mulai', { ascending: true })
      .limit(1)
      .single();

    return {
      data: {
        ...response.data,
        next_audit: nextAudit.data
      }
    };
  }

  async getTemuanByUnit(periodeId?: string): Promise<ApiResponse<TemuanByUnit[]>> {
    let query = this.supabase.from('v_temuan_by_unit').select('*');
    
    if (periodeId) {
      const sesiIds = await this.supabase
        .from('sesi_audit')
        .select('id')
        .eq('periode_audit_id', periodeId);
      
      query = query.in('unit_kerja_id',
        this.supabase.from('sesi_audit').select('unit_kerja_id').in('id', sesiIds.data?.map(s => s.id) || [])
      );
    }

    return await query.order('total_temuan', { ascending: false });
  }

  async getUpcomingSesi(userId?: string, limit: number = 5): Promise<ApiResponse<SesiAudit[]>> {
    let query = this.supabase
      .from('sesi_audit')
      .select('*, unit_kerja:unit_kerja_id(*)')
      .eq('status', 'SCHEDULED')
      .order('tanggal_mulai', { ascending: true })
      .limit(limit);

    if (userId) {
      const auditor = await this.supabase.from('auditor').select('id').eq('user_id', userId).single();
      if (auditor.data) {
        query = query.in('id',
          this.supabase.from('sesi_auditor').select('sesi_audit_id').eq('auditor_id', auditor.data.id)
        );
      }
    }

    return await query;
  }

  async getAlerts(): Promise<ApiResponse<DashboardAlerts>> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdue = await this.supabase
      .from('v_temuan_detail')
      .select('*')
      .lt('deadline_rtl', now.toISOString())
      .neq('status_rtl_kode', 'VERIFIED');

    const deadlineSoon = await this.supabase
      .from('v_temuan_detail')
      .select('*')
      .gte('deadline_rtl', now.toISOString())
      .lte('deadline_rtl', sevenDaysFromNow.toISOString())
      .neq('status_rtl_kode', 'VERIFIED');

    const pendingReview = await this.supabase
      .from('v_tindak_lanjut_detail')
      .select('*')
      .eq('status_rtl_kode', 'SUBMITTED');

    return {
      data: {
        overdue: overdue.data || [],
        deadline_soon: deadlineSoon.data || [],
        pending_review: pendingReview.data || []
      }
    };
  }
}
```

---

## TYPES

```typescript
export interface AdminDashboardStats {
  sesi_scheduled: number;
  sesi_in_progress: number;
  sesi_completed: number;
  total_temuan: number;
  temuan_major: number;
  temuan_minor: number;
  temuan_ofi: number;
  rtl_pending_review: number;
  rtl_on_progress: number;
  rtl_need_verification: number;
  rtl_verified: number;
  rtl_overdue: number;
  completion_rate?: number;
}

export interface AuditorDashboardStats {
  total_sesi: number;
  total_temuan: number;
  total_nilai_positif: number;
}

export interface PICDashboardStats {
  total_temuan: number;
  temuan_major: number;
  temuan_minor: number;
  temuan_ofi: number;
  rtl_verified: number;
  rtl_overdue: number;
  next_audit?: {
    nomor: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
  };
}

export interface TemuanByUnit {
  unit_kerja_id: string;
  unit_kerja_nama: string;
  unit_kerja_kode: string;
  total_temuan: number;
  temuan_major: number;
  temuan_minor: number;
  temuan_ofi: number;
  rtl_verified: number;
  rtl_overdue: number;
}

export interface DashboardAlerts {
  overdue: TemuanDetail[];
  deadline_soon: TemuanDetail[];
  pending_review: TindakLanjutDetail[];
}
```

---

## USAGE

```typescript
const dashboardService = DashboardService.getInstance();

// Admin Dashboard
const adminStats = await dashboardService.getAdminStats();
const temuanByUnit = await dashboardService.getTemuanByUnit();
const alerts = await dashboardService.getAlerts();

// Auditor Dashboard
const auditorStats = await dashboardService.getAuditorStats(userId);
const upcomingSesi = await dashboardService.getUpcomingSesi(userId);

// PIC Dashboard
const picStats = await dashboardService.getPICStats(unitId);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
