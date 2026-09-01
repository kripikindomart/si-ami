# API Endpoints - Modul Tindak Lanjut

## SERVICE CLASS

```typescript
class TindakLanjutService extends BaseApiService {
  private static instance: TindakLanjutService;

  private constructor() {
    super('tindak_lanjut');
  }

  static getInstance(): TindakLanjutService {
    if (!this.instance) {
      this.instance = new TindakLanjutService();
    }
    return this.instance;
  }

  async create(temuanId: string): Promise<ApiResponse<TindakLanjut>> {
    const statusDraft = await this.supabase.from('status_rtl').select('id').eq('kode', 'DRAFT').single();
    const data = { temuan_id: temuanId, status_rtl_id: statusDraft.data.id };
    return await this.supabase.from('tindak_lanjut').insert(data).select().single();
  }

  async update(id: string, data: Partial<TindakLanjutUpdate>): Promise<ApiResponse<TindakLanjut>> {
    return await this.supabase.from('tindak_lanjut').update(data).eq('id', id).select().single();
  }

  async submit(id: string): Promise<ApiResponse<TindakLanjut>> {
    const evidenceCount = await this.supabase.from('tindak_lanjut_evidence').select('id', { count: 'exact' }).eq('tindak_lanjut_id', id).eq('stage', 'submit');
    if (!evidenceCount.count || evidenceCount.count === 0) {
      return { error: { message: 'Evidence wajib', errors: { evidence: ['Min 1 evidence saat submit'] } } };
    }

    const statusSubmitted = await this.supabase.from('status_rtl').select('id').eq('kode', 'SUBMITTED').single();
    return await this.supabase.from('tindak_lanjut').update({
      status_rtl_id: statusSubmitted.data.id,
      tanggal_submit: new Date().toISOString()
    }).eq('id', id).select().single();
  }

  async approve(id: string): Promise<ApiResponse<TindakLanjut>> {
    const statusOnProgress = await this.supabase.from('status_rtl').select('id').eq('kode', 'ON_PROGRESS').single();
    return await this.supabase.from('tindak_lanjut').update({
      status_rtl_id: statusOnProgress.data.id,
      tanggal_approved: new Date().toISOString()
    }).eq('id', id).select().single();
  }

  async reject(id: string, catatan: string, backToStatus: 'DRAFT' | 'ON_PROGRESS'): Promise<ApiResponse<TindakLanjut>> {
    if (!catatan) {
      return { error: { message: 'Catatan wajib', errors: { catatan_reject: ['Catatan penolakan wajib diisi'] } } };
    }

    const status = await this.supabase.from('status_rtl').select('id').eq('kode', backToStatus).single();
    return await this.supabase.from('tindak_lanjut').update({
      status_rtl_id: status.data.id,
      catatan_reject: catatan
    }).eq('id', id).select().single();
  }

  async markCompleted(id: string): Promise<ApiResponse<TindakLanjut>> {
    const evidenceCount = await this.supabase.from('tindak_lanjut_evidence').select('id', { count: 'exact' }).eq('tindak_lanjut_id', id).eq('stage', 'complete');
    if (!evidenceCount.count || evidenceCount.count === 0) {
      return { error: { message: 'Evidence final wajib', errors: { evidence: ['Min 1 evidence final saat complete'] } } };
    }

    const statusCompleted = await this.supabase.from('status_rtl').select('id').eq('kode', 'COMPLETED').single();
    return await this.supabase.from('tindak_lanjut').update({
      status_rtl_id: statusCompleted.data.id,
      tanggal_completed: new Date().toISOString()
    }).eq('id', id).select().single();
  }

  async verify(id: string): Promise<ApiResponse<TindakLanjut>> {
    const statusVerified = await this.supabase.from('status_rtl').select('id').eq('kode', 'VERIFIED').single();
    return await this.supabase.from('tindak_lanjut').update({
      status_rtl_id: statusVerified.data.id,
      tanggal_verified: new Date().toISOString()
    }).eq('id', id).select().single();
  }

  async uploadEvidence(rtlId: string, files: File[], stage: 'submit' | 'complete'): Promise<ApiResponse<TindakLanjutEvidence[]>> {
    const uploaded: TindakLanjutEvidence[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return { error: { message: 'File > 5MB', errors: { file: [`${file.name} terlalu besar`] } } };
      }
      const filePath = `${rtlId}/${stage}/${Date.now()}-${file.name}`;
      const uploadRes = await this.supabase.storage.from('rtl-evidence').upload(filePath, file);
      if (uploadRes.error) return this.handleError(uploadRes.error);

      const { data: urlData } = this.supabase.storage.from('rtl-evidence').getPublicUrl(filePath);
      const dbRes = await this.supabase.from('tindak_lanjut_evidence').insert({
        tindak_lanjut_id: rtlId, file_name: file.name, file_path: urlData.publicUrl,
        file_size: file.size, file_type: file.type, stage
      }).select().single();
      if (dbRes.data) uploaded.push(dbRes.data);
    }
    return { data: uploaded };
  }

  async getByTemuan(temuanId: string): Promise<ApiResponse<TindakLanjutDetail>> {
    const response = await this.supabase.from('v_tindak_lanjut_detail').select('*').eq('temuan_id', temuanId).single();
    if (response.data) {
      const evidence = await this.supabase.from('tindak_lanjut_evidence').select('*').eq('tindak_lanjut_id', response.data.id).order('created_at', { ascending: false });
      response.data.evidence = evidence.data || [];
    }
    return response;
  }
}
```

---

## TYPES

```typescript
export interface TindakLanjut {
  id: string;
  temuan_id: string;
  status_rtl_id: string;
  deskripsi_rtl?: string;
  target_penyelesaian?: string;
  tanggal_submit?: string;
  tanggal_approved?: string;
  tanggal_completed?: string;
  tanggal_verified?: string;
  catatan_reject?: string;
  created_at: string;
}

export interface TindakLanjutUpdate {
  deskripsi_rtl: string;
  target_penyelesaian: string;
}

export interface TindakLanjutDetail extends TindakLanjut {
  temuan_nomor: string;
  temuan_deskripsi: string;
  temuan_deadline: string;
  sesi_nomor: string;
  unit_kerja_nama: string;
  kategori_temuan_nama: string;
  status_rtl_kode: string;
  status_rtl_nama: string;
  status_rtl_warna: string;
  jumlah_evidence: number;
  evidence?: TindakLanjutEvidence[];
}

export interface TindakLanjutEvidence {
  id: string;
  tindak_lanjut_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  stage: 'submit' | 'complete';
  created_at: string;
}
```

---

## USAGE

```typescript
const service = TindakLanjutService.getInstance();

// PIC Unit: Submit RTL
await service.update(rtlId, { deskripsi_rtl: '...', target_penyelesaian: '2025-04-05' });
await service.uploadEvidence(rtlId, files, 'submit');
await service.submit(rtlId);

// Admin GPM: Approve
await service.approve(rtlId);

// Admin GPM: Reject
await service.reject(rtlId, 'Deskripsi kurang detail', 'DRAFT');

// PIC Unit: Mark Completed
await service.uploadEvidence(rtlId, files, 'complete');
await service.markCompleted(rtlId);

// Admin GPM: Verify
await service.verify(rtlId);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
