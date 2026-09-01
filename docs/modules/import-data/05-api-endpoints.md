# API Endpoints - Modul Import AAR

## SERVICE CLASS

```typescript
class ImportAARService extends BaseApiService {
  private static instance: ImportAARService;

  private constructor() {
    super('import_log');
  }

  static getInstance(): ImportAARService {
    if (!this.instance) {
      this.instance = new ImportAARService();
    }
    return this.instance;
  }

  async uploadAndParse(file: File, importSource: string): Promise<ApiResponse<ParsedAARData>> {
    // Upload PDF to storage
    const filePath = `aar-imports/${Date.now()}-${file.name}`;
    const uploadRes = await this.supabase.storage.from('aar-documents').upload(filePath, file);
    if (uploadRes.error) return this.handleError(uploadRes.error);

    const { data: urlData } = this.supabase.storage.from('aar-documents').getPublicUrl(filePath);

    // Parse using AI/OCR (call external API or use puppeteer + GPT)
    const parsedData = await this.parseAARDocument(file, importSource);

    return { data: { ...parsedData, file_path: urlData.publicUrl, file_name: file.name } };
  }

  async parseAARDocument(file: File, importSource: string): Promise<ParsedAARData> {
    // Option 1: Using OpenAI GPT-4 Vision (for PDF as image)
    // Option 2: Using pdf-parse + GPT-4 (extract text first)
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', importSource);

    // Call backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/import-aar/parse`, {
      method: 'POST',
      body: formData
    });

    const parsed = await response.json();
    return parsed.data;
  }

  async importData(
    periodeId: string,
    parsedData: ParsedAARData,
    originalFilePath: string,
    importSource: string
  ): Promise<ApiResponse<ImportResult>> {
    try {
      // Create import log
      const logResponse = await this.supabase.from('import_log').insert({
        file_name: parsedData.file_name,
        file_path: originalFilePath,
        file_size: parsedData.file_size,
        import_source: importSource,
        status: 'processing',
        total_records: parsedData.units.length
      }).select().single();

      const logId = logResponse.data.id;

      let successCount = 0;
      let errorCount = 0;
      const errors: any[] = [];

      // Import each unit's data
      for (const unit of parsedData.units) {
        try {
          // Get or create unit
          const unitRes = await this.supabase
            .from('unit_kerja')
            .select('id')
            .eq('kode', unit.kode)
            .single();

          if (!unitRes.data) {
            errors.push({ unit: unit.nama, error: 'Unit not found' });
            errorCount++;
            continue;
          }

          // Create sesi for this unit
          const sesiRes = await this.supabase.from('sesi_audit').insert({
            nomor: `IMPORT-${importSource}-${unit.kode}`,
            periode_audit_id: periodeId,
            unit_kerja_id: unitRes.data.id,
            tanggal_mulai: unit.tanggal_audit,
            tanggal_selesai: unit.tanggal_audit,
            status: 'COMPLETED',
            keterangan: `Imported from ${importSource}`
          }).select().single();

          if (sesiRes.error) {
            errors.push({ unit: unit.nama, error: sesiRes.error.message });
            errorCount++;
            continue;
          }

          // Import temuan
          for (const temuan of unit.temuan) {
            await this.supabase.rpc('create_imported_temuan', {
              p_sesi_id: sesiRes.data.id,
              p_temuan_data: temuan,
              p_original_pdf_path: originalFilePath,
              p_import_source: importSource,
              p_imported_by: (await this.supabase.auth.getUser()).data.user?.id
            });
          }

          // Import nilai positif
          for (const np of unit.nilai_positif) {
            await this.supabase.from('nilai_positif').insert({
              sesi_audit_id: sesiRes.data.id,
              deskripsi: np.deskripsi,
              tanggal: unit.tanggal_audit
            });
          }

          successCount++;
        } catch (error) {
          errors.push({ unit: unit.nama, error: error.message });
          errorCount++;
        }
      }

      // Update import log
      await this.supabase.from('import_log').update({
        status: errorCount > 0 ? 'completed' : 'completed',
        success_count: successCount,
        error_count: errorCount,
        error_details: errors,
        completed_at: new Date().toISOString()
      }).eq('id', logId);

      return {
        data: {
          total: parsedData.units.length,
          success: successCount,
          error: errorCount,
          errors
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getImportHistory(limit: number = 10): Promise<ApiResponse<ImportLog[]>> {
    return await this.supabase
      .from('import_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
  }
}
```

---

## BACKEND PARSE API (Node.js with Tesseract OCR)

```typescript
// api/import-aar/parse/route.ts
import { createWorker } from 'tesseract.js';
import { OpenAI } from 'openai';
import pdfParse from 'pdf-parse';
import { pdf2pic } from 'pdf2pic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const source = formData.get('source') as string;
  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText = '';

  // METHOD 1: pdf-parse (for text-based PDFs)
  try {
    const pdfData = await pdfParse(buffer);
    extractedText = pdfData.text;
    
    // If text is too short, PDF might be scanned image
    if (extractedText.trim().length < 100) {
      throw new Error('PDF contains images, use OCR');
    }
  } catch (error) {
    // METHOD 2: Tesseract OCR (for scanned PDFs/images)
    console.log('Using Tesseract OCR for scanned PDF');
    extractedText = await extractWithOCR(buffer);
  }

  // Parse using GPT-4 (structure the extracted text)
  const parsed = await parseWithGPT4(extractedText);

  return Response.json({ data: parsed });
}

// Tesseract OCR for scanned PDFs
async function extractWithOCR(pdfBuffer: Buffer): Promise<string> {
  // Convert PDF pages to images
  const options = {
    density: 300,
    saveFilename: 'page',
    savePath: './tmp',
    format: 'png',
    width: 2480,
    height: 3508
  };

  const convert = pdf2pic(options);
  const pages = await convert.bulk(pdfBuffer, { responseType: 'buffer' });

  // OCR each page
  const worker = await createWorker('ind'); // Indonesian language
  let fullText = '';

  for (const page of pages) {
    const { data: { text } } = await worker.recognize(page.buffer);
    fullText += text + '\n\n';
  }

  await worker.terminate();
  return fullText;
}

// GPT-4 to structure the text
async function parseWithGPT4(text: string): Promise<ParsedAARData> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `
Parse the following AMI (Audit Mutu Internal) report and extract:
1. List of units/prodi audited
2. For each unit:
   - Unit code and name
   - Audit date
   - Temuan (findings): nomor, kategori (MAJOR/MINOR/OFI), deskripsi, standar rujukan
   - Nilai positif (positive values): list of descriptions
   - Rekomendasi: list of recommendations

Return as JSON with structure:
{
  "units": [
    {
      "kode": "DPAI",
      "nama": "Doktor Pendidikan Agama Islam",
      "tanggal_audit": "2025-10-27",
      "temuan": [
        {
          "nomor": "151/PM.10/KPMA/2025",
          "kategori": "MINOR",
          "deskripsi": "...",
          "standar": "Standar 5.1, Lamdik 39"
        }
      ],
      "nilai_positif": [
        { "deskripsi": "..." }
      ]
    }
  ]
}

Document text:
${text}
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

---

## ALTERNATIVE: Pure Tesseract (No GPT-4)

```typescript
// Pure OCR + Regex parsing (free, no API cost)
import { createWorker } from 'tesseract.js';
import { pdf2pic } from 'pdf2pic';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Extract text with Tesseract
  const text = await extractWithOCR(buffer);

  // Parse with regex patterns
  const parsed = parseWithRegex(text);

  return Response.json({ data: parsed });
}

function parseWithRegex(text: string): ParsedAARData {
  const units: ParsedUnit[] = [];
  
  // Pattern for unit headers
  const unitRegex = /Unit\s*:\s*(\w+)\s*[-–]\s*(.+)/gi;
  // Pattern for temuan
  const temuanRegex = /(\d+\/PM\.10\/KPMA\/\d{4}).*?Kategori\s*:\s*(MAJOR|MINOR|OFI).*?Deskripsi\s*:\s*(.+?)(?=\d+\/PM\.10|Nilai Positif|$)/gis;
  // Pattern for tanggal
  const tanggalRegex = /Tanggal\s*Audit\s*:\s*(\d{4}-\d{2}-\d{2})/i;

  let match;
  let currentUnit: ParsedUnit | null = null;

  // Extract units
  while ((match = unitRegex.exec(text)) !== null) {
    if (currentUnit) {
      units.push(currentUnit);
    }
    
    currentUnit = {
      kode: match[1].toUpperCase(),
      nama: match[2].trim(),
      tanggal_audit: '',
      temuan: [],
      nilai_positif: []
    };

    // Extract date for this unit
    const dateMatch = tanggalRegex.exec(text.substring(match.index));
    if (dateMatch) {
      currentUnit.tanggal_audit = dateMatch[1];
    }
  }

  // Extract temuan
  while ((match = temuanRegex.exec(text)) !== null) {
    if (currentUnit) {
      currentUnit.temuan.push({
        nomor: match[1],
        kategori: match[2] as 'MAJOR' | 'MINOR' | 'OFI',
        deskripsi: match[3].trim(),
        standar: extractStandar(match[3])
      });
    }
  }

  if (currentUnit) {
    units.push(currentUnit);
  }

  return { units, file_name: '', file_size: 0 };
}

function extractStandar(text: string): string {
  const standarRegex = /Standar\s+[\d.]+|Lamdik\s+\d+/gi;
  const matches = text.match(standarRegex);
  return matches ? matches.join(', ') : '';
}
```

---

## INSTALLATION

```bash
# Install dependencies
npm install tesseract.js pdf-parse pdf2pic openai

# Optional: Install Tesseract binary (for better performance)
# Windows: choco install tesseract
# Mac: brew install tesseract
# Ubuntu: apt-get install tesseract-ocr tesseract-ocr-ind

# For Indonesian language support
npm install tesseract-lang-ind
```

---

## TYPES

```typescript
export interface ParsedAARData {
  file_name: string;
  file_path?: string;
  file_size?: number;
  units: ParsedUnit[];
}

export interface ParsedUnit {
  kode: string;
  nama: string;
  tanggal_audit: string;
  temuan: ParsedTemuan[];
  nilai_positif: ParsedNilaiPositif[];
}

export interface ParsedTemuan {
  nomor: string;
  kategori: 'MAJOR' | 'MINOR' | 'OFI';
  deskripsi: string;
  standar?: string;
  lokasi?: string;
}

export interface ParsedNilaiPositif {
  deskripsi: string;
}

export interface ImportResult {
  total: number;
  success: number;
  error: number;
  errors: any[];
}

export interface ImportLog {
  id: string;
  file_name: string;
  file_path: string;
  import_source: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number;
  success_count: number;
  error_count: number;
  created_at: string;
}
```

---

## USAGE

```typescript
const importService = ImportAARService.getInstance();

// Step 1: Upload & Parse
const file = new File([...], 'AMI-2024.pdf');
const parsed = await importService.uploadAndParse(file, 'AAR_2024');

// Step 2: Preview parsed data
console.log(parsed.data);

// Step 3: Import to database
const result = await importService.importData(
  periodeId2024,
  parsed.data,
  parsed.data.file_path,
  'AAR_2024'
);

console.log(`Imported: ${result.data.success}/${result.data.total}`);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
