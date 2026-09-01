# API Endpoints - Modul Laporan

## SERVICE CLASS

```typescript
class LaporanService extends BaseApiService {
  private static instance: LaporanService;

  private constructor() {
    super('');
  }

  static getInstance(): LaporanService {
    if (!this.instance) {
      this.instance = new LaporanService();
    }
    return this.instance;
  }

  async generateSesiAudit(sesiId: string, format: 'pdf' | 'excel'): Promise<Blob> {
    const data = await this.supabase.from('v_laporan_sesi_audit').select('*').eq('sesi_id', sesiId).single();
    
    const temuan = await this.supabase.from('v_laporan_temuan_detail').select('*').eq('sesi_nomor', data.data.sesi_nomor);
    
    const nilaiPositif = await this.supabase.from('nilai_positif').select('*').eq('sesi_audit_id', sesiId);

    const reportData = { ...data.data, temuan: temuan.data, nilai_positif: nilaiPositif.data };

    if (format === 'pdf') {
      return await PDFService.getInstance().generateSesiAudit(reportData);
    } else {
      return await ExcelService.getInstance().generateSesiAudit(reportData);
    }
  }

  async generateTemuanByUnit(periodeId: string, unitId?: string, format: 'pdf' | 'excel' = 'excel'): Promise<Blob> {
    let query = this.supabase
      .from('v_laporan_temuan_detail')
      .select('*')
      .eq('periode_id', periodeId);

    if (unitId) {
      query = query.eq('unit_kerja_id', unitId);
    }

    const { data } = await query.order('unit_kode, temuan_nomor');

    if (format === 'pdf') {
      return await PDFService.getInstance().generateTemuanByUnit(data);
    } else {
      return await ExcelService.getInstance().generateTemuanByUnit(data);
    }
  }

  async generateKomprehensif(periodeId: string): Promise<Blob> {
    const statistik = await this.supabase.rpc('get_statistik_periode', { periode_id: periodeId });
    
    const temuanByUnit = await this.supabase.from('v_temuan_by_unit').select('*');
    
    const sesiList = await this.supabase.from('v_laporan_sesi_audit').select('*').eq('periode_id', periodeId);

    const reportData = {
      statistik: statistik.data,
      temuan_by_unit: temuanByUnit.data,
      sesi_list: sesiList.data
    };

    return await PDFService.getInstance().generateKomprehensif(reportData);
  }

  async generateRTLProgress(periodeId: string, format: 'pdf' | 'excel' = 'excel'): Promise<Blob> {
    const rtlData = await this.supabase
      .from('v_tindak_lanjut_detail')
      .select('*')
      .in('sesi_audit_id', 
        this.supabase.from('sesi_audit').select('id').eq('periode_audit_id', periodeId)
      )
      .order('unit_kerja_nama, temuan_nomor');

    if (format === 'pdf') {
      return await PDFService.getInstance().generateRTLProgress(rtlData.data);
    } else {
      return await ExcelService.getInstance().generateRTLProgress(rtlData.data);
    }
  }
}
```

---

## PDF SERVICE

```typescript
class PDFService {
  private static instance: PDFService;

  static getInstance(): PDFService {
    if (!this.instance) {
      this.instance = new PDFService();
    }
    return this.instance;
  }

  async generateSesiAudit(data: any): Promise<Blob> {
    const html = this.renderSesiAuditTemplate(data);
    
    // Using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    await browser.close();

    return new Blob([pdf], { type: 'application/pdf' });
  }

  private renderSesiAuditTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>LAPORAN HASIL AUDIT MUTU INTERNAL</h1>
        <h2>Sekolah Pascasarjana UIKA</h2>
        
        <table>
          <tr><th>Nomor Sesi</th><td>${data.sesi_nomor}</td></tr>
          <tr><th>Periode</th><td>${data.periode_nama}</td></tr>
          <tr><th>Unit Kerja</th><td>${data.unit_nama}</td></tr>
          <tr><th>Tanggal</th><td>${data.tanggal_mulai} - ${data.tanggal_selesai}</td></tr>
        </table>

        <h3>Ringkasan</h3>
        <p>Total Temuan: ${data.jumlah_temuan}</p>
        <ul>
          <li>MAJOR: ${data.temuan_major}</li>
          <li>MINOR: ${data.temuan_minor}</li>
          <li>OFI: ${data.temuan_ofi}</li>
        </ul>

        <h3>Daftar Temuan</h3>
        ${data.temuan.map((t, i) => `
          <h4>${i + 1}. Temuan ${t.temuan_nomor}</h4>
          <p><strong>Kategori:</strong> ${t.kategori_nama}</p>
          <p><strong>Deskripsi:</strong> ${t.deskripsi}</p>
          <p><strong>Status RTL:</strong> ${t.status_rtl_nama}</p>
        `).join('')}
      </body>
      </html>
    `;
  }
}
```

---

## EXCEL SERVICE

```typescript
class ExcelService {
  private static instance: ExcelService;

  static getInstance(): ExcelService {
    if (!this.instance) {
      this.instance = new ExcelService();
    }
    return this.instance;
  }

  async generateTemuanByUnit(data: any[]): Promise<Blob> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Temuan');

    worksheet.columns = [
      { header: 'Unit', key: 'unit_nama', width: 20 },
      { header: 'Nomor Temuan', key: 'temuan_nomor', width: 20 },
      { header: 'Kategori', key: 'kategori_nama', width: 15 },
      { header: 'Deskripsi', key: 'deskripsi', width: 50 },
      { header: 'Standar', key: 'standar_nama', width: 30 },
      { header: 'Status RTL', key: 'status_rtl_nama', width: 15 }
    ];

    worksheet.addRows(data);

    // Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
```

---

## USAGE

```typescript
const laporanService = LaporanService.getInstance();

// Generate PDF Sesi Audit
const pdfBlob = await laporanService.generateSesiAudit('uuid-sesi', 'pdf');
const url = URL.createObjectURL(pdfBlob);
window.open(url); // or trigger download

// Generate Excel Temuan
const excelBlob = await laporanService.generateTemuanByUnit('uuid-periode', undefined, 'excel');
const link = document.createElement('a');
link.href = URL.createObjectURL(excelBlob);
link.download = 'laporan-temuan.xlsx';
link.click();
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
