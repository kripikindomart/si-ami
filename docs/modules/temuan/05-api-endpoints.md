# API Endpoints - Modul Temuan

## SERVICE CLASS

```typescript
class TemuanService extends BaseApiService {
  private static instance: TemuanService;

  private constructor() {
    super('temuan');
  }

  static getInstance(): TemuanService {
    if (!this.instance) {
      this.instance = new TemuanService();
    }
    return this.instance;
  }

  async create(data: TemuanCreate, standarIds: string[], files?: File[]): Promise<ApiResponse<Temuan>> {
    if (!standarIds?.length) {
      return { error: { message: 'Standar wajib', errors: { standar_ids: ['Min 1 standar'] } } };
    }

    const temuanResponse = await this.supabase.from('temuan').insert(data).select().single();
    if (temuanResponse.error) return this.handleError(temuanResponse.error);

    const temuanId = temuanResponse.data.id;

    await this.supabase.from('temuan_standar').insert(
      standarIds.map(sid => ({ temuan_id: temuanId, standar_mutu_id: sid }))
    );

    if (files?.length) await this.uploadEvidence(temuanId, files);

    return temuanResponse;
  }

  async getById(id: string): Promise<ApiResponse<TemuanDetail>> {
    const response = await this.supabase.from('v_temuan_detail').select('*').eq('id', id).single();
    if (response.data) {
      const standar = await this.supabase.from('temuan_standar').select('*, standar_mutu:standar_mutu_id(*)').eq('temuan_id', id);
      const evidence = await this.supabase.from('temuan_evidence').select('*').eq('temuan_id', id).order('created_at', { ascending: false });
      response.data.standar = standar.data || [];
      response.data.evidence = evidence.data || [];
    }
    return response;
  }

  async uploadEvidence(temuanId: string, files: File[]): Promise<ApiResponse<TemuanEvidence[]>> {
    const uploaded: TemuanEvidence[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return { error: { message: 'File > 5MB', errors: { file: [`${file.name} terlalu besar`] } } };
      }
      const filePath = `${temuanId}/${Date.now()}-${file.name}`;
      const uploadRes = await this.supabase.storage.from('temuan-evidence').upload(filePath, file);
      if (uploadRes.error) return this.handleError(uploadRes.error);

      const { data: urlData } = this.supabase.storage.from('temuan-evidence').getPublicUrl(filePath);
      const dbRes = await this.supabase.from('temuan_evidence').insert({
        temuan_id: temuanId, file_name: file.name, file_path: urlData.publicUrl,
        file_size: file.size, file_type: file.type
      }).select().single();
      if (dbRes.data) uploaded.push(dbRes.data);
    }
    return { data: uploaded };
  }

  async updateStatusRtl(id: string, statusId: string): Promise<ApiResponse<Temuan>> {
    return await this.supabase.from('temuan').update({ status_rtl_id: statusId, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  }
}
```

## STANDAR FILTER

```typescript
async function getStandarByUnitForTemuan(unitId: string): Promise<StandarMutu[]> {
  const unit = await supabase.from('unit_kerja').select('*, lam:lam_id(*)').eq('id', unitId).single();
  if (!unit.data) return [];

  const isProdi = ['prodi_s2', 'prodi_s3'].includes(unit.data.jenis);
  let query = supabase.from('standar_mutu').select('*').eq('status', 'aktif');

  if (isProdi && unit.data.lam_id) {
    query = query.or(`scope.eq.global,and(scope.eq.specific,lam_id.eq.${unit.data.lam_id})`);
  } else {
    query = query.eq('scope', 'global');
  }

  const res = await query.order('kode');
  return res.data || [];
}
```

## TYPES

```typescript
export interface Temuan {
  id: string;
  nomor: string;
  sesi_audit_id: string;
  kategori_temuan_id: string;
  deskripsi: string;
  lokasi?: string;
  status_rtl_id: string;
  deadline_rtl: string;
  tanggal_temuan: string;
  created_at: string;
}

export interface TemuanCreate {
  sesi_audit_id: string;
  kategori_temuan_id: string;
  deskripsi: string;
  lokasi?: string;
  tanggal_temuan?: string;
}

export interface TemuanDetail extends Temuan {
  sesi_nomor: string;
  unit_kerja_nama: string;
  kategori_nama: string;
  kategori_warna: string;
  status_rtl_nama: string;
  status_rtl_warna: string;
  standar?: { id: string; standar_mutu: StandarMutu }[];
  evidence?: TemuanEvidence[];
}

export interface TemuanEvidence {
  id: string;
  temuan_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}
```

**Version**: 1.0
**Last Updated**: 2026-09-01
