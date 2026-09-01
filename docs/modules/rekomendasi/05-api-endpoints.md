# API Endpoints - Modul Rekomendasi

## SERVICE CLASS

```typescript
class RekomendasiService extends BaseApiService {
  private static instance: RekomendasiService;

  private constructor() {
    super('rekomendasi');
  }

  static getInstance(): RekomendasiService {
    if (!this.instance) {
      this.instance = new RekomendasiService();
    }
    return this.instance;
  }

  async create(data: RekomendasiCreate, standarIds: string[], files?: File[]): Promise<ApiResponse<Rekomendasi>> {
    if (!standarIds?.length) {
      return { error: { message: 'Standar wajib', errors: { standar_ids: ['Min 1 standar'] } } };
    }

    const response = await this.supabase.from('rekomendasi').insert(data).select().single();
    if (response.error) return this.handleError(response.error);

    const rekomendasiId = response.data.id;

    await this.supabase.from('rekomendasi_standar').insert(
      standarIds.map(sid => ({ rekomendasi_id: rekomendasiId, standar_mutu_id: sid }))
    );

    if (files?.length) await this.uploadEvidence(rekomendasiId, files);

    return response;
  }

  async getByTemuan(temuanId: string): Promise<ApiResponse<RekomendasiDetail[]>> {
    return await this.supabase
      .from('v_rekomendasi_detail')
      .select('*')
      .eq('temuan_id', temuanId)
      .order('tanggal', { ascending: false });
  }

  async getById(id: string): Promise<ApiResponse<RekomendasiDetail>> {
    const response = await this.supabase.from('v_rekomendasi_detail').select('*').eq('id', id).single();
    if (response.data) {
      const standar = await this.supabase.from('rekomendasi_standar').select('*, standar_mutu:standar_mutu_id(*)').eq('rekomendasi_id', id);
      const evidence = await this.supabase.from('rekomendasi_evidence').select('*').eq('rekomendasi_id', id).order('created_at', { ascending: false });
      response.data.standar = standar.data || [];
      response.data.evidence = evidence.data || [];
    }
    return response;
  }

  async uploadEvidence(rekomendasiId: string, files: File[]): Promise<ApiResponse<RekomendasiEvidence[]>> {
    const uploaded: RekomendasiEvidence[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return { error: { message: 'File > 5MB', errors: { file: [`${file.name} terlalu besar`] } } };
      }
      const filePath = `${rekomendasiId}/${Date.now()}-${file.name}`;
      const uploadRes = await this.supabase.storage.from('rekomendasi-evidence').upload(filePath, file);
      if (uploadRes.error) return this.handleError(uploadRes.error);

      const { data: urlData } = this.supabase.storage.from('rekomendasi-evidence').getPublicUrl(filePath);
      const dbRes = await this.supabase.from('rekomendasi_evidence').insert({
        rekomendasi_id: rekomendasiId, file_name: file.name, file_path: urlData.publicUrl,
        file_size: file.size, file_type: file.type
      }).select().single();
      if (dbRes.data) uploaded.push(dbRes.data);
    }
    return { data: uploaded };
  }
}
```

---

## TYPES

```typescript
export interface Rekomendasi {
  id: string;
  nomor: string;
  temuan_id: string;
  deskripsi: string;
  tanggal: string;
  created_at: string;
}

export interface RekomendasiCreate {
  temuan_id: string;
  deskripsi: string;
  tanggal?: string;
}

export interface RekomendasiDetail extends Rekomendasi {
  temuan_nomor: string;
  temuan_deskripsi: string;
  sesi_nomor: string;
  unit_kerja_nama: string;
  standar_nama: string;
  jumlah_evidence: number;
  standar?: { id: string; standar_mutu: StandarMutu }[];
  evidence?: RekomendasiEvidence[];
}

export interface RekomendasiEvidence {
  id: string;
  rekomendasi_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}
```

---

## USAGE

```typescript
const service = RekomendasiService.getInstance();

const data: RekomendasiCreate = {
  temuan_id: 'uuid-temuan',
  deskripsi: 'Perbarui dokumen kurikulum...',
  tanggal: '2025-03-10'
};
const standarIds = ['uuid-standar-5-1', 'uuid-lamdik-39'];
const files = [file1];

const response = await service.create(data, standarIds, files);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
