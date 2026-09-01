# Wireframe - Modul Unit Kerja

## Overview
Wireframe UI/UX untuk modul Unit Kerja dengan conditional LAM field based on jenis unit.

---

## 1. PAGE: List Unit Kerja

### Layout Desktop (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] SIM-AMI                                    [🔔] [👤 Admin GPM ▼]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Sidebar]    │                                                              │
│ Dashboard    │  ┌──────────────────────────────────────────────────────┐   │
│ Master Data  │  │ MASTER DATA UNIT KERJA          [+ Tambah Unit]     │   │
│  ├─ LAM      │  ├──────────────────────────────────────────────────────┤   │
│  ├─ Unit  ◄─────│ Filter & Search:                                    │   │
│  ├─ Periode  │  │ ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐    │   │
│  └─ Standar  │  │ │Jenis: ▼ │ │ LAM: ▼ │ │Status:▼│ │🔍 Search │    │   │
│              │  │ │Semua    │ │ Semua  │ │ Semua  │ └──────────┘    │   │
│              │  │ └─────────┘ └────────┘ └────────┘                  │   │
│              │  ├──────────────────────────────────────────────────────┤   │
│              │  │ ┌────────────────────────────────────────────────┐ │   │
│              │  │ │Kode │Nama Unit       │Jenis │LAM    │PIC│Aksi│ │   │
│              │  │ ├─────┼────────────────┼──────┼───────┼───┼────┤ │   │
│              │  │ │DPAI │Prodi Doktor PAI│Prodi │LAMDIK │ 2 │[⋮]│ │   │
│              │  │ ├─────┼────────────────┼──────┼───────┼───┼────┤ │   │
│              │  │ │MM   │Prodi Magister  │Prodi │LAMDIK-│ 1 │[⋮]│ │   │
│              │  │ │     │Manajemen       │      │TI     │   │    │ │   │
│              │  │ ├─────┼────────────────┼──────┼───────┼───┼────┤ │   │
│              │  │ │LAB  │Laboratorium SPs│Lab   │  -    │ 0 │[⋮]│ │   │
│              │  │ │-SPS │                │      │       │   │    │ │   │
│              │  │ └────────────────────────────────────────────────┘ │   │
│              │  │ Showing 3 of 10            [◄] [1] [2] [►]        │   │
│              │  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Action Menu (Dropdown):

```
┌────────────────────────┐
│ Edit                   │
│ Lihat PIC              │
│ ─────────────────      │
│ Nonaktifkan            │
└────────────────────────┘
```

---

## 2. DIALOG: Create Unit Kerja

### Modal Layout - Jenis Prodi (600x700)

```
┌──────────────────────────────────────────────────┐
│ Tambah Unit Kerja                       [✕]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Kode Unit *                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ DPAI                                       │ │
│  └────────────────────────────────────────────┘ │
│  Otomatis uppercase, contoh: DPAI, MM          │
│                                                  │
│  Nama Unit *                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ Program Studi Doktor Pendidikan Agama     │ │
│  │ Islam                                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Jenis Unit *                                    │
│  ┌────────────────────────────────────────────┐ │
│  │ Prodi                                   ▼ │ │
│  └────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐   │
│  │ ● Prodi (Program Studi)                  │   │
│  │ ○ Lab (Laboratorium)                     │   │
│  │ ○ Direktur                               │   │
│  │ ○ Wakil (Wakil Direktur)                 │   │
│  │ ○ Unit Lain                              │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM (Wajib untuk Prodi) *                  │ │
│  ├────────────────────────────────────────────┤ │
│  │ [LAMDIK ▼]                                 │ │
│  │   ○ LAMDIK - LAM Pendidikan Tinggi        │ │
│  │             Keagamaan Islam                │ │
│  │   ○ LAMDIKTI - LAM Pendidikan Tinggi      │ │
│  │   ○ LAMDIKES - LAM Pendidikan Tinggi      │ │
│  │                Kesehatan                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Parent Unit (Opsional)                          │
│  ┌────────────────────────────────────────────┐ │
│  │ - Tidak ada parent -                    ▼ │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Deskripsi                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ Program Studi S3 Pendidikan Agama Islam   │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

### Modal Layout - Jenis Lab (LAM Hidden)

```
┌──────────────────────────────────────────────────┐
│ Tambah Unit Kerja                       [✕]     │
├──────────────────────────────────────────────────┤
│  Kode Unit *                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ LAB-SPS                                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Nama Unit *                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ Laboratorium Sekolah Pascasarjana         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Jenis Unit *                                    │
│  ┌────────────────────────────────────────────┐ │
│  │ Lab                                     ▼ │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  (Field LAM tidak ditampilkan untuk non-prodi)   │
│                                                  │
│  Deskripsi                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ Laboratorium untuk mahasiswa SPs          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

### Component Code:

```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Tambah Unit Kerja</DialogTitle>
    </DialogHeader>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Unit *</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  placeholder="DPAI"
                  maxLength={50}
                />
              </FormControl>
              <FormDescription>
                Otomatis uppercase, contoh: DPAI, MM
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Unit *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Program Studi Doktor PAI" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="jenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Unit *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="prodi">Prodi (Program Studi)</SelectItem>
                  <SelectItem value="lab">Lab (Laboratorium)</SelectItem>
                  <SelectItem value="direktur">Direktur</SelectItem>
                  <SelectItem value="wakil">Wakil (Wakil Direktur)</SelectItem>
                  <SelectItem value="unit_lain">Unit Lain</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Conditional LAM field - hanya muncul jika jenis=prodi */}
        {selectedJenis === 'prodi' && (
          <FormField
            control={form.control}
            name="lam_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LAM (Wajib untuk Prodi) *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih LAM" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lamOptions.map((lam) => (
                      <SelectItem key={lam.id} value={lam.id}>
                        {lam.kode} - {lam.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Unit (Opsional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="- Tidak ada parent -" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">- Tidak ada parent -</SelectItem>
                  {parentOptions.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.kode} - {unit.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

### Validation Schema:

```typescript
const unitKerjaSchema = z.object({
  kode: z.string()
    .min(2, 'Kode minimal 2 karakter')
    .max(50, 'Kode maksimal 50 karakter')
    .regex(/^[A-Z0-9-]+$/, 'Kode hanya boleh huruf kapital, angka, dan dash')
    .transform(val => val.toUpperCase()),
  nama: z.string()
    .min(5, 'Nama minimal 5 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  jenis: z.enum(['prodi', 'lab', 'direktur', 'wakil', 'unit_lain']),
  lam_id: z.string().uuid().optional(),
  parent_id: z.string().uuid().optional(),
  deskripsi: z.string().optional(),
}).refine(
  (data) => {
    // Jika jenis=prodi, LAM wajib
    if (data.jenis === 'prodi') {
      return !!data.lam_id;
    }
    return true;
  },
  {
    message: 'LAM wajib dipilih untuk Program Studi',
    path: ['lam_id'],
  }
).refine(
  (data) => {
    // Jika jenis!=prodi, LAM harus null
    if (data.jenis !== 'prodi') {
      return !data.lam_id;
    }
    return true;
  },
  {
    message: 'LAM hanya untuk Program Studi',
    path: ['lam_id'],
  }
);
```

---

## 3. DIALOG: Edit Unit Kerja

```
┌──────────────────────────────────────────────────┐
│ Edit Unit Kerja: DPAI                   [✕]     │
├──────────────────────────────────────────────────┤
│  Kode Unit                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ DPAI                        [🔒 Locked]   │ │
│  └────────────────────────────────────────────┘ │
│  Tidak dapat diubah                              │
│                                                  │
│  Nama Unit *                                     │
│  ┌────────────────────────────────────────────┐ │
│  │ Program Studi Doktor Pendidikan Agama     │ │
│  │ Islam                                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Jenis Unit *                                    │
│  ┌────────────────────────────────────────────┐ │
│  │ Prodi                                   ▼ │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  LAM *                                           │
│  ┌────────────────────────────────────────────┐ │
│  │ LAMDIK                                  ▼ │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Status *                                        │
│  ┌────────────────────────────────────────────┐ │
│  │ Aktif                                   ▼ │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                      [Batal]  [Update]          │
└──────────────────────────────────────────────────┘
```

---

## 4. DIALOG: View PIC List

```
┌──────────────────────────────────────────────────┐
│ PIC Unit: DPAI                          [✕]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Daftar PIC untuk unit DPAI:                     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ 1. Budi Santoso                            │ │
│  │    Email: budi@uika.ac.id                  │ │
│  │    Unit lain: MM, MH                       │ │
│  ├────────────────────────────────────────────┤ │
│  │ 2. Siti Rahma                              │ │
│  │    Email: siti@uika.ac.id                  │ │
│  │    Unit lain: MPAI                         │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Total: 2 PIC                                    │
│                                                  │
│  Note: Untuk menambah/mengurangi PIC,            │
│  edit di halaman User Management.                │
│                                                  │
│                             [Tutup]              │
└──────────────────────────────────────────────────┘
```

---

## 5. DIALOG: Toggle Status Confirmation

```
┌──────────────────────────────────────────────┐
│ ⚠ Nonaktifkan Unit Kerja?          [✕]     │
├──────────────────────────────────────────────┤
│                                              │
│  Unit: DPAI                                  │
│  Nama: Program Studi Doktor PAI              │
│                                              │
│  Unit ini digunakan di:                      │
│  • 3 Sesi Audit (2024, 2025, 2026)          │
│  • 8 Temuan                                  │
│  • 5 Rekomendasi                             │
│  • 2 PIC User                                │
│                                              │
│  Unit yang dinonaktifkan:                    │
│  ✓ Tidak bisa dipilih untuk audit baru       │
│  ✓ Data audit lama tetap bisa diakses        │
│  ✓ PIC tetap bisa akses data unit            │
│                                              │
│  Yakin nonaktifkan unit ini?                 │
│                                              │
│           [Batal]  [Ya, Nonaktifkan]         │
└──────────────────────────────────────────────┘
```

---

## 6. RESPONSIVE DESIGN - Mobile

### List Mobile (375x667)

```
┌───────────────────────────────┐
│ [☰] SIM-AMI       [🔔] [👤]  │
├───────────────────────────────┤
│ Master Data Unit   [+ Tambah] │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ 🔍 Search units...        │ │
│ └───────────────────────────┘ │
│ ┌───────────┐ ┌────────────┐  │
│ │ Jenis: ▼  │ │ Status: ▼ │  │
│ └───────────┘ └────────────┘  │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ DPAI            [⋮]       │ │
│ │ Prodi Doktor PAI          │ │
│ │ LAM: LAMDIK • PIC: 2      │ │
│ │ ✓ Aktif                   │ │
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ LAB-SPS         [⋮]       │ │
│ │ Laboratorium SPs          │ │
│ │ Lab • PIC: 0              │ │
│ │ ✓ Aktif                   │ │
│ └───────────────────────────┘ │
│                               │
│         [◄] [1] [►]           │
└───────────────────────────────┘
```

---

## 7. LOADING & ERROR STATES

### Table Loading (Skeleton):
```
┌─────────────────────────────────────┐
│ ┌─────┐ ┌──────────┐ ┌───┐ ┌────┐ │
│ │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓│ │▓▓▓│ │ ▓▓ │ │
│ └─────┘ └──────────┘ └───┘ └────┘ │
│                                     │
│ ┌─────┐ ┌──────────┐ ┌───┐ ┌────┐ │
│ │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓│ │▓▓▓│ │ ▓▓ │ │
│ └─────┘ └──────────┘ └───┘ └────┘ │
└─────────────────────────────────────┘
```

### Form Error - Validation:
```
┌────────────────────────────────────┐
│  Kode Unit *                       │
│  ┌──────────────────────────────┐ │
│  │ dp                  ⚠       │ │ ← Border merah
│  └──────────────────────────────┘ │
│  🔴 Kode minimal 2 karakter        │
│                                    │
│  LAM *                             │
│  ┌──────────────────────────────┐ │
│  │ - Pilih LAM -       ⚠       │ │ ← Border merah
│  └──────────────────────────────┘ │
│  🔴 LAM wajib dipilih untuk Prodi  │
└────────────────────────────────────┘
```

---

## 8. SUCCESS FEEDBACK

### Toast Success:
```
┌───────────────────────────────────────┐
│ ✓ Unit Kerja DPAI berhasil ditambahkan│
│                              [Tutup]  │
└───────────────────────────────────────┘
```

---

## 9. ACCESSIBILITY

### Keyboard Navigation:
- Tab: Move through form fields
- Enter: Submit form / Open dropdown
- Esc: Close dialog
- Arrow keys: Navigate dropdown options

### Screen Reader:
```html
<label for="kode">Kode Unit <span aria-label="required">*</span></label>
<input 
  id="kode" 
  aria-required="true"
  aria-describedby="kode-help"
  aria-invalid={hasError}
/>
<span id="kode-help">Otomatis uppercase, contoh: DPAI</span>

<select aria-label="Pilih jenis unit">
  <option value="prodi">Prodi (Program Studi)</option>
  <option value="lab">Lab (Laboratorium)</option>
</select>
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
