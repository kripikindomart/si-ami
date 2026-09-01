# API Endpoints - Modul Nilai Positif

## SERVICE CLASS

```typescript
class NilaiPositifService extends BaseApiService {
  private static instance: NilaiPositifService;

  private constructor() {
    super('nilai_positif');
  }

  static getInstance(): NilaiPositifService {
    if (!this.instance) {
      this.instance = new NilaiPositifService();
    }
    return this.instance;
  }

  async create(data: NilaiPositifCreate, files?: File[]): Promise<ApiResponse<NilaiPositif>> {
    const response = await this.supabase.from('nilai_positif').insert(data).select().single();
    if (response.error) return this.handleError(response.error);

    if (files?.length) await this.uploadEvidence(response.data.id, files);

    return response;
  }

  async getBySesi(sesiId: string): Promise<ApiResponse<NilaiPositifDetail[]>> {
    return await this.supabase
      .from('v_nilai_positif_detail')
      .select('*')
      .eq('sesi_audit_id', sesiId)
      .order('tanggal', { ascending: false });
  }

  async getById(id: string): Promise<ApiResponse<NilaiPositifDetail>> {
    const response = await this.supabase.from('v_nilai_positif_detail').select('*').eq('id', id).single();
    if (response.data) {
      const evidence = await this.supabase
        .from('nilai_positif_evidence')
        .select('*')
        .eq('nilai_positif_id', id)
        .order('created_at', { ascending: false });
      response.data.evidence = evidence.data || [];
    }
    return response;
  }

  async uploadEvidence(nilaiPositifId: string, files: File[]): Promise<ApiResponse<NilaiPositifEvidence[]>> {
    const uploaded: NilaiPositifEvidence[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return { error: { message: 'File > 5MB', errors: { file: [`${file.name} terlalu besar`] } } };
      }
      const filePath = `${nilaiPositifId}/${Date.now()}-${file.name}`;
      const uploadRes = await this.supabase.storage.from('nilai-positif-evidence').upload(filePath, file);
      if (uploadRes.error) return this.handleError(uploadRes.error);

      const { data: urlData } = this.supabase.storage.from('nilai-positif-evidence').getPublicUrl(filePath);
      const dbRes = await this.supabase.from('nilai_positif_evidence').insert({
        nilai_positif_id: nilaiPositifId,
        file_name: file.name,
        file_path: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type
      }).select().single();
      if (dbRes.data) uploaded.push(dbRes.data);
    }
    return { data: uploaded };
  }

  async deleteEvidence(evidenceId: string): Promise<ApiResponse<void>> {
    const evidenceRes = await this.supabase.from('nilai_positif_evidence').select('file_path').eq('id', evidenceId).single();
    if (!evidenceRes.data) return { error: { message: 'Evidence tidak ditemukan', errors: {} } };

    const filePath = evidenceRes.data.file_path.split('/').slice(-2).join('/');
    await this.supabase.storage.from('nilai-positif-evidence').remove([filePath]);
    await this.supabase.from('nilai_positif_evidence').delete().eq('id', evidenceId);

    return { data: undefined };
  }
}
```

---

## TYPES

```typescript
export interface NilaiPositif {
  id: string;
  sesi_audit_id: string;
  deskripsi: string;
  tanggal: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NilaiPositifCreate {
  sesi_audit_id: string;
  deskripsi: string;
  tanggal?: string;
}

export interface NilaiPositifDetail extends NilaiPositif {
  sesi_nomor: string;
  sesi_tanggal: string;
  unit_kerja_nama: string;
  unit_kerja_kode: string;
  jumlah_evidence: number;
  evidence?: NilaiPositifEvidence[];
}

export interface NilaiPositifEvidence {
  id: string;
  nilai_positif_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}
```

---

## USAGE EXAMPLES

```typescript
const service = NilaiPositifService.getInstance();

// Create
const data: NilaiPositifCreate = {
  sesi_audit_id: 'uuid-sesi',
  deskripsi: 'Tim dosen sangat responsif...',
  tanggal: '2025-03-10'
};
const files = [file1, file2];
const response = await service.create(data, files);

// Get by sesi
const list = await service.getBySesi('uuid-sesi');
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
