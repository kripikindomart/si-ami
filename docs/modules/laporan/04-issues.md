# GitHub Issues - Modul Laporan

## ISSUE #1: Database Views & Functions

**Title**: Create Views untuk Laporan Data

**Labels**: `database`, `view`, `medium-priority`

**Acceptance Criteria**:
- [ ] View v_laporan_sesi_audit
- [ ] View v_laporan_temuan_detail
- [ ] Function get_statistik_periode()

**Estimate**: 3 jam

---

## ISSUE #2: Laporan Service

**Title**: LaporanService dengan Generate Methods

**Labels**: `api`, `service`, `high-priority`

**Acceptance Criteria**:
- [ ] LaporanService.generateSesiAudit(sesiId, format)
- [ ] LaporanService.generateTemuanByUnit(periodeId, unitId?, format)
- [ ] LaporanService.generateRTLProgress(periodeId, format)
- [ ] LaporanService.generateKomprehensif(periodeId, format)
- [ ] LaporanService.generateStatistik(periodeId, format)

**Estimate**: 6 jam

---

## ISSUE #3: PDF Generator

**Title**: PDF Service dengan Template Support

**Labels**: `backend`, `pdf`, `high-priority`

**Acceptance Criteria**:
- [ ] PDFService using puppeteer/pdfmake
- [ ] Template: Laporan Sesi Audit
- [ ] Template: Laporan Komprehensif
- [ ] Include header/footer dengan logo
- [ ] Page numbering
- [ ] Support charts (export as image from frontend)

**Estimate**: 8 jam

---

## ISSUE #4: Excel Generator

**Title**: Excel Service dengan Export Methods

**Labels**: `backend`, `excel`, `medium-priority`

**Acceptance Criteria**:
- [ ] ExcelService using exceljs
- [ ] Export: Temuan list with styling
- [ ] Export: RTL progress with conditional formatting
- [ ] Export: Statistik with multiple sheets
- [ ] Auto-width columns

**Estimate**: 6 jam

---

## ISSUE #5: Laporan UI Page

**Title**: Laporan List dan Generate Form

**Labels**: `frontend`, `ui`, `high-priority`

**Acceptance Criteria**:
- [ ] Laporan list page dengan jenis laporan
- [ ] Generate form modal dengan parameter
- [ ] Format selection (PDF/Excel)
- [ ] Loading state during generation
- [ ] Download generated file
- [ ] Riwayat laporan (optional)

**Estimate**: 6 jam

---

## ISSUE #6: Background Job for Large Reports

**Title**: Queue System untuk Generate Laporan Besar

**Labels**: `backend`, `queue`, `low-priority`

**Acceptance Criteria**:
- [ ] Queue large report generation
- [ ] Email notification when ready
- [ ] Store generated file in storage
- [ ] Cleanup old files (7 days)

**Estimate**: 5 jam

---

## ISSUE #7: Documentation

**Title**: Laporan API Documentation

**Labels**: `documentation`, `low-priority`

**Estimate**: 1 jam

---

**Total Estimate**: 35 jam

**Version**: 1.0
**Last Updated**: 2026-09-01
