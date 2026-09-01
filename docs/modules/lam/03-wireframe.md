# Wireframe - Modul LAM

## Overview
Wireframe UI/UX untuk modul LAM dengan detail layout, component, dan interaction.

---

## 1. PAGE: List LAM (/dashboard/master/lam)

### Layout Desktop (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] SIM-AMI                                    [🔔] [👤 Admin GPM ▼]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────┐                                                            │
│ │ Dashboard   │                                                            │
│ │ Master Data ▼───┐                                                        │
│ │  ├─ LAM        │← Active                                                │
│ │  ├─ Unit Kerja │                                                         │
│ │  ├─ Periode    │                                                         │
│ │  └─ Standar    │                                                         │
│ │ Transaksional │                                                          │
│ │ Laporan       │                                                          │
│ └─────────────────┘                                                        │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ Master Data LAM                                [+ Tambah LAM]      │   │
│   ├───────────────────────────────────────────────────────────────────┤   │
│   │                                                                   │   │
│   │ Filter & Search:                                                  │   │
│   │ ┌─────────────────┐  ┌───────────────────────┐  ┌───────┐       │   │
│   │ │ Status: Semua ▼ │  │ 🔍 Search LAM...     │  │ Cari  │       │   │
│   │ └─────────────────┘  └───────────────────────┘  └───────┘       │   │
│   │                                                                   │   │
│   ├───────────────────────────────────────────────────────────────────┤   │
│   │                                                                   │   │
│   │ ┌─────────────────────────────────────────────────────────────┐ │   │
│   │ │ Kode    │ Nama LAM                       │ Status  │ Aksi   │ │   │
│   │ ├─────────┼────────────────────────────────┼─────────┼────────┤ │   │
│   │ │ LAMDIK  │ LAM Pendidikan Tinggi          │ ✓ Aktif │ [Edit] │ │   │
│   │ │         │ Keagamaan Islam                │         │[Toggle]│ │   │
│   │ ├─────────┼────────────────────────────────┼─────────┼────────┤ │   │
│   │ │ LAMDIKTI│ LAM Pendidikan Tinggi         │ ✓ Aktif │ [Edit] │ │   │
│   │ │         │                                │         │[Toggle]│ │   │
│   │ ├─────────┼────────────────────────────────┼─────────┼────────┤ │   │
│   │ │ LAMDIKES│ LAM Pendidikan Tinggi          │ ✓ Aktif │ [Edit] │ │   │
│   │ │         │ Kesehatan                      │         │[Toggle]│ │   │
│   │ ├─────────┼────────────────────────────────┼─────────┼────────┤ │   │
│   │ │ GLOBAL  │ Standar Global                 │ ✓ Aktif │ [Edit] │ │   │
│   │ │         │                                │         │[Toggle]│ │   │
│   │ └─────────────────────────────────────────────────────────────┘ │   │
│   │                                                                   │   │
│   │ Showing 4 of 4 entries            [◄ Prev] [1] [Next ►]         │   │
│   │                                                                   │   │
│   └───────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Components:
1. **Header**: App name + notifications + user menu
2. **Sidebar**: Navigation menu (collapsible)
3. **Main Content**:
   - Page title + action button (Tambah LAM)
   - Filter section (Status dropdown, Search input, Button)
   - Data table (sortable columns)
   - Pagination

### Component Details:

#### Table Component (shadcn/ui Table)
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortable>Kode</TableHead>
      <TableHead sortable>Nama LAM</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Aksi</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((lam) => (
      <TableRow key={lam.id}>
        <TableCell className="font-mono">{lam.kode}</TableCell>
        <TableCell>
          <div className="font-medium">{lam.nama}</div>
          <div className="text-sm text-muted-foreground">{lam.deskripsi}</div>
        </TableCell>
        <TableCell>
          <Badge variant={lam.status === 'aktif' ? 'success' : 'secondary'}>
            {lam.status === 'aktif' ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleEdit(lam.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggle(lam.id)}>
                {lam.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 2. DIALOG: Create LAM

### Modal Layout (500x400)

```
┌──────────────────────────────────────────────────┐
│ Tambah LAM Baru                         [✕]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Kode LAM *                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ LAMDIK                                     │ │
│  └────────────────────────────────────────────┘ │
│  Otomatis uppercase, contoh: LAMDIK, LAMDIKTI  │
│                                                  │
│  Nama LAM *                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM Pendidikan Tinggi Keagamaan Islam     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Deskripsi                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM untuk perguruan tinggi keislaman      │ │
│  │                                            │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│  Opsional                                        │
│                                                  │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

### Component Code:
```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Tambah LAM Baru</DialogTitle>
    </DialogHeader>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode LAM *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="LAMDIK"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  maxLength={20}
                />
              </FormControl>
              <FormDescription>
                Otomatis uppercase, contoh: LAMDIK, LAMDIKTI
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
              <FormLabel>Nama LAM *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="LAM Pendidikan Tinggi Keagamaan Islam"
                />
              </FormControl>
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
                <Textarea 
                  {...field} 
                  placeholder="LAM untuk perguruan tinggi keislaman"
                  rows={3}
                />
              </FormControl>
              <FormDescription>Opsional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

### Validation Rules:
```typescript
const formSchema = z.object({
  kode: z.string()
    .min(2, "Kode minimal 2 karakter")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Z]+$/, "Kode hanya boleh huruf kapital tanpa spasi"),
  nama: z.string()
    .min(5, "Nama minimal 5 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  deskripsi: z.string().optional(),
});
```

---

## 3. DIALOG: Edit LAM

### Modal Layout (500x400)

```
┌──────────────────────────────────────────────────┐
│ Edit LAM: LAMDIK                        [✕]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Kode LAM                                        │
│  ┌────────────────────────────────────────────┐ │
│  │ LAMDIK                          [locked]   │ │
│  └────────────────────────────────────────────┘ │
│  Tidak dapat diubah                              │
│                                                  │
│  Nama LAM *                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM Pendidikan Tinggi Keagamaan Islam     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Deskripsi                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ LAM untuk perguruan tinggi keislaman      │ │
│  │                                            │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│                      [Batal]  [Update]          │
└──────────────────────────────────────────────────┘
```

**Differences from Create**:
- Kode field is **disabled/readonly**
- Pre-filled with existing data
- Button label: "Update" instead of "Simpan"

---

## 4. DIALOG: Toggle Status Confirmation

### Modal Layout - Nonaktifkan (400x300)

```
┌──────────────────────────────────────────────┐
│ ⚠ Nonaktifkan LAM?                  [✕]     │
├──────────────────────────────────────────────┤
│                                              │
│  Anda akan menonaktifkan LAM:                │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ LAMDIK                                 │ │
│  │ LAM Pendidikan Tinggi Keagamaan Islam │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  LAM ini saat ini digunakan oleh:            │
│  • 2 Program Studi (DPAI, MPAI)              │
│  • 12 Standar Mutu (Lamdik 1-12)             │
│                                              │
│  LAM akan dinonaktifkan, namun prodi         │
│  dan standar yang sudah ada tetap            │
│  memiliki referensi LAM ini.                 │
│                                              │
│  LAM nonaktif tidak bisa dipilih untuk       │
│  prodi atau standar baru.                    │
│                                              │
│                                              │
│               [Batal]  [Ya, Nonaktifkan]     │
└──────────────────────────────────────────────┘
```

### Component Code:
```typescript
<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        ⚠ Nonaktifkan LAM?
      </AlertDialogTitle>
      <AlertDialogDescription>
        <div className="space-y-3">
          <p>Anda akan menonaktifkan LAM:</p>
          
          <div className="bg-muted p-3 rounded">
            <div className="font-semibold">{lam.kode}</div>
            <div className="text-sm">{lam.nama}</div>
          </div>
          
          {usage && (
            <div>
              <p className="font-medium">LAM ini saat ini digunakan oleh:</p>
              <ul className="list-disc list-inside text-sm">
                {usage.prodiCount > 0 && (
                  <li>{usage.prodiCount} Program Studi ({usage.prodiList})</li>
                )}
                {usage.standarCount > 0 && (
                  <li>{usage.standarCount} Standar Mutu</li>
                )}
              </ul>
            </div>
          )}
          
          <p className="text-sm">
            LAM akan dinonaktifkan, namun prodi dan standar yang sudah ada 
            tetap memiliki referensi LAM ini.
          </p>
          
          <p className="text-sm text-muted-foreground">
            LAM nonaktif tidak bisa dipilih untuk prodi atau standar baru.
          </p>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirmToggle}>
        Ya, Nonaktifkan
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 5. RESPONSIVE DESIGN

### Mobile View (375x667)

```
┌───────────────────────────────┐
│ [☰] SIM-AMI       [🔔] [👤]  │
├───────────────────────────────┤
│ Master Data LAM               │
│                 [+ Tambah]    │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ 🔍 Search LAM...          │ │
│ └───────────────────────────┘ │
│ ┌───────────────┐             │
│ │ Status: Semua▼│             │
│ └───────────────┘             │
├───────────────────────────────┤
│                               │
│ ┌───────────────────────────┐ │
│ │ LAMDIK           [⋮]      │ │
│ │ LAM Pendidikan Tinggi     │ │
│ │ Keagamaan Islam           │ │
│ │ ✓ Aktif                   │ │
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ LAMDIKTI         [⋮]      │ │
│ │ LAM Pendidikan Tinggi    │ │
│ │ ✓ Aktif                   │ │
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ LAMDIKES         [⋮]      │ │
│ │ LAM Pendidikan Tinggi     │ │
│ │ Kesehatan                 │ │
│ │ ✓ Aktif                   │ │
│ └───────────────────────────┘ │
│                               │
│         [◄] [1] [►]           │
│                               │
└───────────────────────────────┘
```

**Mobile Adaptations**:
- Table → Card list
- Sidebar → Hamburger menu
- Filters stacked vertically
- Touch-friendly buttons (min 44px)

---

## 6. INTERACTION STATES

### Button States:
```
Primary Button (Simpan/Update):
├─ Default: bg-primary text-white
├─ Hover: bg-primary/90
├─ Active: bg-primary/80
├─ Disabled: bg-primary/50 cursor-not-allowed
└─ Loading: bg-primary/90 + spinner

Secondary Button (Batal):
├─ Default: border border-input bg-background
├─ Hover: bg-accent text-accent-foreground
└─ Active: bg-accent/80
```

### Table Row States:
```
├─ Default: bg-background
├─ Hover: bg-muted/50 cursor-pointer
└─ Selected: bg-muted
```

### Form Input States:
```
├─ Default: border border-input
├─ Focus: ring-2 ring-ring ring-offset-2
├─ Error: border-destructive ring-destructive
├─ Disabled: bg-muted cursor-not-allowed
└─ Readonly: bg-muted/30 cursor-default
```

---

## 7. LOADING STATES

### Table Loading:
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────┐ ┌────────────────┐        │
│  │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓▓▓    │ [⋮]   │
│  └─────┘ └────────────────┘        │
│                                     │
│  ┌─────┐ ┌────────────────┐        │
│  │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓▓▓    │ [⋮]   │
│  └─────┘ └────────────────┘        │
│                                     │
└─────────────────────────────────────┘

(Skeleton loader - shimmer animation)
```

### Form Submitting:
```
Button berubah:
"Simpan" → [🔄 Menyimpan...]

Input fields disabled
```

---

## 8. ERROR STATES

### Form Validation Error:
```
┌────────────────────────────────────┐
│  Kode LAM *                        │
│  ┌──────────────────────────────┐ │
│  │ lamdik              ⚠       │ │ ← Border merah
│  └──────────────────────────────┘ │
│  🔴 Kode hanya boleh huruf kapital │
└────────────────────────────────────┘
```

### Network Error Toast:
```
┌───────────────────────────────────────┐
│ ✕ Gagal menyimpan LAM                 │
│ Terjadi kesalahan. Silakan coba lagi. │
│                              [Tutup]  │
└───────────────────────────────────────┘
```

---

## 9. SUCCESS FEEDBACK

### Toast Notification:
```
┌───────────────────────────────────────┐
│ ✓ LAM LAMDIK berhasil ditambahkan     │
│                              [Tutup]  │
└───────────────────────────────────────┘

Position: top-right
Duration: 3 seconds (auto-dismiss)
```

---

## 10. ACCESSIBILITY

### Keyboard Navigation:
- Tab: Move focus through form fields
- Enter: Submit form / Activate button
- Esc: Close dialog
- Arrow keys: Navigate table rows

### Screen Reader:
```html
<label for="kode-lam">Kode LAM <span aria-label="required">*</span></label>
<input id="kode-lam" aria-required="true" aria-describedby="kode-help" />
<span id="kode-help">Otomatis uppercase, contoh: LAMDIK</span>

<button aria-label="Edit LAM LAMDIK">Edit</button>
<button aria-label="Nonaktifkan LAM LAMDIK">Toggle</button>
```

### Color Contrast:
- Text: WCAG AA minimum (4.5:1)
- Buttons: WCAG AAA (7:1)
- Error text: Red with sufficient contrast

---

**Version**: 1.0
**Last Updated**: 2026-09-01
