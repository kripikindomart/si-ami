# GitHub Issues - Modul Import AAR

## ISSUE #1: Database Schema Extension

**Title**: Add is_imported Columns dan import_log Table

**Labels**: `database`, `schema`, `high-priority`

**Acceptance Criteria**:
- [ ] ALTER temuan table (is_imported, original_document_path, import_source, imported_by, imported_at)
- [ ] CREATE import_log table
- [ ] CREATE function create_imported_temuan()
- [ ] RLS policies

**Estimate**: 3 jam

---

## ISSUE #2: PDF Parsing Backend API

**Title**: Backend API untuk Parse PDF menggunakan Tesseract OCR + GPT-4

**Labels**: `backend`, `ai`, `ocr`, `api`, `high-priority`

**Acceptance Criteria**:
- [ ] Endpoint POST /api/import-aar/parse
- [ ] Method 1: pdf-parse for text-based PDFs
- [ ] Method 2: Tesseract OCR for scanned PDFs (pdf2pic + tesseract.js)
- [ ] GPT-4 API for structure extraction (optional: regex fallback)
- [ ] Parse structured JSON (units, temuan, nilai_positif)
- [ ] Auto-detect if PDF is text or scanned image
- [ ] Error handling & validation

**Estimate**: 10 jam

**Dependencies**: 
- Tesseract installed (tesseract.js npm package)
- OpenAI API key (optional if using regex parser)

---

## ISSUE #3: Import AAR Service

**Title**: ImportAARService untuk Upload, Parse, dan Import

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] ImportAARService.uploadAndParse()
- [ ] ImportAARService.importData()
- [ ] ImportAARService.getImportHistory()
- [ ] Create sesi_audit for each unit
- [ ] Create temuan with is_imported=true
- [ ] Create tindak_lanjut auto-verified
- [ ] Create nilai_positif
- [ ] Update import_log with results

**Estimate**: 10 jam

---

## ISSUE #4: Upload & Parse UI

**Title**: Import AAR Page - Upload dan Parse PDF

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] File upload (drag & drop)
- [ ] Import source input
- [ ] Parse progress indicator
- [ ] Display parsed data preview
- [ ] Edit preview before import
- [ ] Error messages

**Estimate**: 6 jam

---

## ISSUE #5: Import Process UI

**Title**: Import Progress dan Result Display

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Import progress bar
- [ ] Real-time status per unit
- [ ] Import result summary
- [ ] Error details display
- [ ] Link to view imported data

**Estimate**: 4 jam

---

## ISSUE #6: Import History Page

**Title**: Import History List dan Detail

**Labels**: `frontend`, `ui`, `low-priority`

**Acceptance Criteria**:
- [ ] Import log table
- [ ] Filter by status, source
- [ ] View import details modal
- [ ] Download original PDF
- [ ] Retry failed imports

**Estimate**: 3 jam

---

## ISSUE #7: Imported Data Display

**Title**: Badge dan Read-only untuk Imported Temuan

**Labels**: `frontend`, `ui`, `medium-priority`

**Acceptance Criteria**:
- [ ] Badge "IMPORTED" on temuan list
- [ ] Filter: show imported only
- [ ] Read-only detail page for imported temuan
- [ ] Link to original PDF
- [ ] Display import metadata

**Estimate**: 3 jam

---

## ISSUE #8: Storage Setup

**Title**: Supabase Storage Bucket untuk AAR Documents

**Labels**: `infrastructure`, `storage`, `high-priority`

**Acceptance Criteria**:
- [ ] Create bucket "aar-documents"
- [ ] Set public access for read
- [ ] RLS policies (only admin can upload)

**Estimate**: 1 jam

---

## ISSUE #9: Unit Matching Logic

**Title**: Smart Unit Matching untuk Import

**Labels**: `backend`, `logic`, `medium-priority`

**Acceptance Criteria**:
- [ ] Match by kode (exact)
- [ ] Match by nama (fuzzy search)
- [ ] Handle unit not found errors
- [ ] Admin can manually map units

**Estimate**: 4 jam

---

## ISSUE #10: Documentation

**Title**: Import AAR User Guide

**Labels**: `documentation`, `low-priority`

**Estimate**: 2 jam

---

**Total Estimate**: 44 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
