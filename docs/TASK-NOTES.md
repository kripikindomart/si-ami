# TASK NOTES - Instruksi & Context

Catat semua instruksi baru yang belum dieksekusi untuk tracking konteks.

---

## [2026-09-01 15:45] Temuan/Rekomendasi: Multiple Standar Rujukan

**Dari**: User
**Konteks**: Melihat screenshot temuan DPAI dari laporan AMI 2025
**Instruksi**: 
Satu temuan/rekomendasi bisa punya **lebih dari satu standar rujukan**.

**Contoh Real dari DPAI**:
- Temuan #151: "Standar 5.1" + "Lamdik 39"
- Temuan #152: "Standar 1.4" + "Lamdik 1"
- Temuan #153: "Standar 1.4" + "Lamdik 2"
- Temuan #154: "Standar 7.4" + "Lamdik 45"

**Impact ke Database Schema**:
Perlu relasi **many-to-many**:
- Tabel `temuan_standar` (temuan_id, standar_mutu_id)
- Tabel `rekomendasi_standar` (rekomendasi_id, standar_mutu_id)
- Hapus field `standar_mutu_id` dari tabel `temuan` dan `rekomendasi`

**Status**: ✅ DONE - Schema sudah diupdate
**Relasi Issue**: Modul Temuan (B.2), Modul Rekomendasi (B.4)
**Priority**: Critical (blocking data structure)

**Implementasi**:
- ✅ Update tabel `temuan` (remove standar_mutu_id)
- ✅ Buat tabel `temuan_standar` (many-to-many)
- ✅ Update tabel `rekomendasi` (remove standar_mutu_id)
- ✅ Buat tabel `rekomendasi_standar` (many-to-many)
- Update views & queries untuk join multiple standar
- Update UI form input temuan (multi-select standar)

**Catatan**:
- Mayoritas temuan di AMI 2025 punya 2 standar (1 global + 1 specific LAM)
- Ada kemungkinan temuan cuma punya 1 standar atau bahkan lebih dari 2
- Di UI form input: gunakan multi-select dropdown atau checkboxes

---

## [2026-09-01 15:30] Standar Mutu: Global vs Specific per Prodi

**Dari**: User
**Konteks**: Sedang membahas modul Standar Mutu
**Instruksi**: 
Setiap program studi bisa punya standar mutu yang berbeda karena LAM (Lembaga Akreditasi Mandiri) berbeda, tapi ada juga standar yang scope global (berlaku untuk semua).

**Detail**:
- **Standar Global**: Berlaku untuk semua prodi/unit
  - Contoh: Standar 1.3, 1.4, 2.1, 5.1, 7.4
  - Harus bisa dipilih oleh semua unit saat input temuan
  
- **Standar Specific**: Berlaku hanya untuk prodi tertentu
  - Contoh dari laporan AMI 2025:
    - "Lamdik 1", "Lamdik 2", "Lamdik 10", "Lamdik 27", "Lamdik 39", "Lamdik 45", "Lamdik 46", "Lamdik 58"
    - Ini khusus untuk LAM PTKeIs (Lembaga Akreditasi Mandiri Perguruan Tinggi Keislaman)
  - LAM lain:
    - LAM Dikti (prodi umum)
    - LAM PTKes (prodi kesehatan)
    - dll

**Impact ke Database Schema**:
Tabel `standar_mutu` perlu tambahan field:
- `scope` (global / specific)
- `lam_type` (jika specific: lamdik / lamdikti / lamdikes / dll)
- Atau relasi many-to-many: `standar_unit` untuk mapping standar ke unit yang applicable

**Impact ke Modul Standar Mutu**:
- Filter standar saat input temuan: tampilkan standar global + standar specific unit tersebut
- CRUD standar dengan kategori scope
- Assign standar ke unit (jika pakai approach many-to-many)

**Status**: APPROVED - Ready to execute
**Relasi Issue**: 
- Modul LAM (baru - A.8)
- Modul Standar Mutu (A.4) - update
- Modul Unit Kerja (A.2) - update
**Priority**: High (blocking input temuan)

**Next Steps**:
1. ✅ Update database schema (tambah tabel `lam`, update `unit_kerja`, update `standar_mutu`)
2. ✅ Update MODULES-LIST.md (tambah modul LAM)
3. ✅ Buat folder & dokumentasi modul LAM
4. ✅ Update dokumentasi modul Unit Kerja (field lam_id)
5. ✅ Update dokumentasi modul Standar Mutu (scope & lam_id)
6. Update seed data (master LAM & assignment contoh)

**Decision - HYBRID APPROACH**:

1. **Buat Modul LAM baru**:
   - Tabel `lam` untuk master LAM (LAM Dikti, LAM PTKes, LAM PTKeIs, dll)
   - CRUD LAM oleh Admin GPM

2. **Update Unit Kerja**:
   - Tambah field `lam_id` di tabel `unit_kerja`
   - Admin GPM assign LAM ke setiap prodi saat setup
   - Contoh assignment:
     - DPAI → LAM PTKeIs (LAMDik)
     - MPAI → LAM PTKeIs (LAMDik)
     - MM → LAM Dikti
     - MTP → LAM Dikti
     - DESy, MESy → (tergantung LAM ekonomi syariah)
     - MKPI → (tergantung LAM komunikasi)

3. **Update Standar Mutu**:
   - Field `scope` (global/specific)
   - Field `lam_id` (null jika global, filled jika specific)
   - Standar global (Standar 1.3, 1.4, dll) → tampil untuk semua
   - Standar specific (Lamdik 1, Lamdik 2, dll) → hanya tampil untuk unit dengan LAM tersebut

4. **Auto-filter saat Input Temuan**:
   - Ambil unit yang diaudit → ambil `lam_id` unit tersebut
   - Filter standar: scope=global OR lam_id=unit.lam_id
   - Tampilkan dropdown standar yang sudah di-filter

5. **Optional: Many-to-many `standar_unit`**:
   - Untuk kasus khusus jika Admin GPM perlu manual override
   - Jarang dipakai, tapi available untuk fleksibilitas

**Catatan**: 
- Setiap prodi LAM-nya bisa berbeda (DPAI & MPAI sama-sama LAMDik, tapi MM pakai LAM Dikti)
- Assignment LAM ke unit WAJIB dilakukan Admin GPM saat setup
- Standar mutu yang "Standar X.X" (tanpa prefix LAM) adalah global
- Standar mutu yang "Lamdik XX" atau "LAM XXX XX" adalah specific per LAM

---

**Total Notes**: 1
**Last Updated**: 2026-09-01 15:30
