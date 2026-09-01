# Wireframe - Modul User Management

## Overview
Wireframe UI/UX untuk authentication, user management, role & permission, dan profile management.

---

## 1. PAGE: Login (/login)

### Layout Desktop (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                             │
│                                                                             │
│         ┌───────────────────────────────────────────┐                      │
│         │                                           │                      │
│         │  ┌─────────────────────────────────────┐ │                      │
│         │  │ LOGO  SIM-AMI                       │ │                      │
│         │  │ Sistem Informasi Manajemen AMI     │ │                      │
│         │  └─────────────────────────────────────┘ │                      │
│         │                                           │                      │
│         │  Login ke Akun Anda                       │                      │
│         │                                           │                      │
│         │  Email                                    │                      │
│         │  ┌─────────────────────────────────────┐ │                      │
│         │  │ user@example.com                    │ │                      │
│         │  └─────────────────────────────────────┘ │                      │
│         │                                           │                      │
│         │  Password                                 │                      │
│         │  ┌─────────────────────────────────────┐ │                      │
│         │  │ ••••••••••••                   [👁] │ │                      │
│         │  └─────────────────────────────────────┘ │                      │
│         │                                           │                      │
│         │             [Lupa Password?]              │                      │
│         │                                           │                      │
│         │  ┌─────────────────────────────────────┐ │                      │
│         │  │           LOGIN                     │ │                      │
│         │  └─────────────────────────────────────┘ │                      │
│         │                                           │                      │
│         └───────────────────────────────────────────┘                      │
│                                                                             │
│                                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Code:

```typescript
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  <Card className="w-full max-w-md">
    <CardHeader className="text-center">
      <div className="mb-4">
        <div className="text-4xl font-bold text-primary">SIM-AMI</div>
        <div className="text-sm text-muted-foreground">
          Sistem Informasi Manajemen AMI
        </div>
      </div>
      <CardTitle>Login ke Akun Anda</CardTitle>
    </CardHeader>
    
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="user@example.com"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'LOGIN'
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  </Card>
</div>
```

### Validation Schema:

```typescript
const loginSchema = z.object({
  email: z.string()
    .email("Email tidak valid"),
  password: z.string()
    .min(6, "Password minimal 6 karakter"),
});
```

---

## 2. PAGE: List Users (/dashboard/users)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] SIM-AMI                                    [🔔] [👤 Admin GPM ▼]        │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Sidebar]    │                                                              │
│ Dashboard    │  ┌──────────────────────────────────────────────────────┐   │
│ Users     ◄─────│ MANAJEMEN USER                    [+ Tambah User]   │   │
│ Master Data  │  ├──────────────────────────────────────────────────────┤   │
│ Transaksional│  │ Filter & Search:                                    │   │
│ Laporan      │  │ ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌────┐  │   │
│              │  │ │ Role:  ▼ │ │ Status:▼ │ │ 🔍 Search.. │ │Cari│  │   │
│              │  │ │ Semua    │ │ Semua    │ └─────────────┘ └────┘  │   │
│              │  │ └──────────┘ └──────────┘                          │   │
│              │  ├──────────────────────────────────────────────────────┤   │
│              │  │ ┌────────────────────────────────────────────────┐ │   │
│              │  │ │Nama       │Email        │Role    │Status│Aksi │ │   │
│              │  │ ├───────────┼─────────────┼────────┼──────┼─────┤ │   │
│              │  │ │Ahmad Zaki │zaki@uika..  │Admin   │Aktif │ [⋮]│ │   │
│              │  │ │           │             │GPM     │      │     │ │   │
│              │  │ ├───────────┼─────────────┼────────┼──────┼─────┤ │   │
│              │  │ │Siti Aminah│siti@uika..  │Auditor │Aktif │ [⋮]│ │   │
│              │  │ ├───────────┼─────────────┼────────┼──────┼─────┤ │   │
│              │  │ │Budi       │budi@uika..  │PIC Unit│Aktif │ [⋮]│ │   │
│              │  │ │Santoso    │             │(DPAI,  │      │     │ │   │
│              │  │ │           │             │MM)     │      │     │ │   │
│              │  │ ├───────────┼─────────────┼────────┼──────┼─────┤ │   │
│              │  │ │Dr. Hadi   │hadi@uika..  │Pimpinan│Aktif │ [⋮]│ │   │
│              │  │ └────────────────────────────────────────────────┘ │   │
│              │  │ Showing 4 of 12            [◄] [1] [2] [►]        │   │
│              │  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Action Menu (Dropdown):

```
┌────────────────────────┐
│ Edit                   │
│ Kelola Unit (jika PIC) │
│ Reset Password         │
│ ─────────────────      │
│ Nonaktifkan            │
└────────────────────────┘
```

---

## 3. DIALOG: Create User

### Modal Layout (600x650)

```
┌──────────────────────────────────────────────────┐
│ Tambah User Baru                        [✕]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Nama Lengkap *                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Ahmad Zaki                                 │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Email *                                         │
│  ┌────────────────────────────────────────────┐ │
│  │ zaki@uika.ac.id                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Password *                                      │
│  ┌────────────────────────────────────────────┐ │
│  │ ••••••••••••                          [👁]│ │
│  └────────────────────────────────────────────┘ │
│  Min 6 karakter                                  │
│                                                  │
│  Role *                                          │
│  ┌────────────────────────────────────────────┐ │
│  │ Admin GPM                              ▼  │ │
│  └────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐   │
│  │ ○ Admin GPM                              │   │
│  │ ○ Auditor                                │   │
│  │ ● PIC Unit                               │   │
│  │ ○ Pimpinan                               │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Unit Kerja (untuk PIC Unit) *              │ │
│  ├────────────────────────────────────────────┤ │
│  │ ☑ DPAI - Doktor Pendidikan Agama Islam    │ │
│  │ ☐ MPAI - Magister Pendidikan Agama Islam  │ │
│  │ ☑ MM - Magister Manajemen                 │ │
│  │ ☐ MH - Magister Hukum                     │ │
│  │ ☐ LAB-SPS - Laboratorium SPS              │ │
│  └────────────────────────────────────────────┘ │
│  Min 1 unit untuk PIC Unit                       │
│                                                  │
│                      [Batal]  [Simpan]          │
└──────────────────────────────────────────────────┘
```

### Component Code:

```typescript
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Tambah User Baru</DialogTitle>
    </DialogHeader>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap *</FormLabel>
              <FormControl>
                <Input placeholder="Ahmad Zaki" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="zaki@uika.ac.id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Min 6 karakter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedRole === 'pic_unit' && (
          <FormField
            control={form.control}
            name="unit_kerja_ids"
            render={() => (
              <FormItem>
                <FormLabel>Unit Kerja (untuk PIC Unit) *</FormLabel>
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {units.map((unit) => (
                    <FormField
                      key={unit.id}
                      control={form.control}
                      name="unit_kerja_ids"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 py-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(unit.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), unit.id]
                                  : field.value?.filter((id) => id !== unit.id);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="font-medium">{unit.kode}</div>
                            <div className="text-sm text-muted-foreground">
                              {unit.nama}
                            </div>
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormDescription>Min 1 unit untuk PIC Unit</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

### Validation Schema:

```typescript
const userSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role_id: z.string().min(1, "Role wajib dipilih"),
  unit_kerja_ids: z.array(z.string()).optional(),
}).refine(
  (data) => {
    const role = roles.find((r) => r.id === data.role_id);
    if (role?.nama === 'pic_unit') {
      return data.unit_kerja_ids && data.unit_kerja_ids.length > 0;
    }
    return true;
  },
  {
    message: "PIC Unit wajib memilih minimal 1 unit kerja",
    path: ["unit_kerja_ids"],
  }
);
```

---

## 4. PAGE: Permission Matrix (/dashboard/permissions)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] SIM-AMI                                    [🔔] [👤 Admin GPM ▼]        │
├─────────────────────────────────────────────────────────────────────────────┤
│              │                                                              │
│ [Sidebar]    │  ┌──────────────────────────────────────────────────────┐   │
│ Dashboard    │  │ PERMISSION MATRIX                                    │   │
│ Users        │  ├──────────────────────────────────────────────────────┤   │
│ Permissions◄────│ Pilih Role:                                          │   │
│ Master Data  │  │ ┌─────────────────────────────────────────────────┐ │   │
│ Transaksional│  │ │ Admin GPM                                    ▼ │ │   │
│              │  │ └─────────────────────────────────────────────────┘ │   │
│              │  ├──────────────────────────────────────────────────────┤   │
│              │  │ ┌────────────────────────────────────────────────┐ │   │
│              │  │ │ Modul         │Create│Read│Update│Delete│Edit│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Users         │  ✓   │ ✓  │  ✓   │  ✓   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Roles &       │  ✓   │ ✓  │  ✓   │  ✓   │[✎]│ │   │
│              │  │ │ Permissions   │      │    │      │      │    │ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ LAM           │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Unit Kerja    │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Periode Audit │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Standar Mutu  │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Sesi Audit    │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Temuan        │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Rekomendasi   │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ ├───────────────┼──────┼────┼──────┼──────┼────┤ │   │
│              │  │ │ Tindak Lanjut │  ✓   │ ✓  │  ✓   │  -   │[✎]│ │   │
│              │  │ └────────────────────────────────────────────────┘ │   │
│              │  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. PAGE: User Profile (/dashboard/profile)

### Layout Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [☰] SIM-AMI                                    [🔔] [👤 Admin GPM ▼]        │
├─────────────────────────────────────────────────────────────────────────────┤
│              │                                                              │
│ [Sidebar]    │  ┌──────────────────────────────────────────────────────┐   │
│ Dashboard    │  │ PROFIL SAYA                                          │   │
│ Profile   ◄─────├──────────────────────────────────────────────────────┤   │
│ Master Data  │  │                                                      │   │
│              │  │  ┌────────────┐                                      │   │
│              │  │  │   [👤]     │                                      │   │
│              │  │  │  Avatar    │                                      │   │
│              │  │  └────────────┘                                      │   │
│              │  │                                                      │   │
│              │  │  Nama Lengkap                                        │   │
│              │  │  ┌─────────────────────────────────────────────┐    │   │
│              │  │  │ Ahmad Zaki                                  │    │   │
│              │  │  └─────────────────────────────────────────────┘    │   │
│              │  │                                                      │   │
│              │  │  Email                                               │   │
│              │  │  ┌─────────────────────────────────────────────┐    │   │
│              │  │  │ zaki@uika.ac.id             [🔒 Locked]    │    │   │
│              │  │  └─────────────────────────────────────────────┘    │   │
│              │  │  Tidak dapat diubah                                  │   │
│              │  │                                                      │   │
│              │  │  Role                                                │   │
│              │  │  ┌─────────────────────────────────────────────┐    │   │
│              │  │  │ Admin GPM                   [🔒 Locked]    │    │   │
│              │  │  └─────────────────────────────────────────────┘    │   │
│              │  │  Tidak dapat diubah                                  │   │
│              │  │                                                      │   │
│              │  │  Status                                              │   │
│              │  │  ┌─────────────────────────────────────────────┐    │   │
│              │  │  │ ✓ Aktif                                     │    │   │
│              │  │  └─────────────────────────────────────────────┘    │   │
│              │  │                                                      │   │
│              │  │  [Edit Profil]  [Ubah Password]                     │   │
│              │  │                                                      │   │
│              │  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. RESPONSIVE DESIGN - Mobile

### Login Mobile (375x667)

```
┌───────────────────────────────┐
│                               │
│    ┌──────────────────────┐   │
│    │  LOGO  SIM-AMI       │   │
│    └──────────────────────┘   │
│                               │
│  Login ke Akun Anda           │
│                               │
│  Email                        │
│  ┌─────────────────────────┐  │
│  │ user@example.com        │  │
│  └─────────────────────────┘  │
│                               │
│  Password                     │
│  ┌─────────────────────────┐  │
│  │ ••••••••••••       [👁]│  │
│  └─────────────────────────┘  │
│                               │
│        [Lupa Password?]       │
│                               │
│  ┌─────────────────────────┐  │
│  │       LOGIN            │  │
│  └─────────────────────────┘  │
│                               │
└───────────────────────────────┘
```

### User List Mobile

```
┌───────────────────────────────┐
│ [☰] SIM-AMI       [🔔] [👤]  │
├───────────────────────────────┤
│ Manajemen User  [+ Tambah]    │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ 🔍 Search users...        │ │
│ └───────────────────────────┘ │
│ ┌───────────┐ ┌────────────┐  │
│ │ Role: ▼   │ │ Status: ▼ │  │
│ └───────────┘ └────────────┘  │
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ Ahmad Zaki       [⋮]      │ │
│ │ zaki@uika.ac.id           │ │
│ │ Admin GPM • Aktif         │ │
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ Siti Aminah      [⋮]      │ │
│ │ siti@uika.ac.id           │ │
│ │ Auditor • Aktif           │ │
│ └───────────────────────────┘ │
│                               │
│         [◄] [1] [►]           │
└───────────────────────────────┘
```

---

## 7. INTERACTION STATES

### Button States:
```
Primary Button (Login/Simpan):
├─ Default: bg-primary text-white
├─ Hover: bg-primary/90
├─ Loading: bg-primary/90 + spinner + disabled
└─ Disabled: bg-primary/50 cursor-not-allowed
```

### Form States:
```
Input Field:
├─ Default: border border-input
├─ Focus: ring-2 ring-ring
├─ Error: border-destructive + error message below
├─ Success: border-green-500 (after successful validation)
└─ Disabled: bg-muted cursor-not-allowed
```

### Table Row States:
```
├─ Default: bg-background
├─ Hover: bg-muted/50
└─ Selected: bg-muted (if applicable)
```

---

## 8. LOADING STATES

### Table Loading (Skeleton):
```
┌─────────────────────────────────┐
│ ┌─────┐ ┌──────────┐ ┌───┐     │
│ │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓│ │▓▓▓│ [⋮]│
│ └─────┘ └──────────┘ └───┘     │
│                                 │
│ ┌─────┐ ┌──────────┐ ┌───┐     │
│ │ ▓▓▓ │ │ ▓▓▓▓▓▓▓▓│ │▓▓▓│ [⋮]│
│ └─────┘ └──────────┘ └───┘     │
└─────────────────────────────────┘
```

### Form Submitting:
```
Button text changes:
"Simpan" → [🔄 Menyimpan...]

All inputs disabled during submit
```

---

## 9. ERROR STATES

### Login Error:
```
┌─────────────────────────────────┐
│ Email                           │
│ ┌───────────────────────────┐   │
│ │ user@example.com          │   │
│ └───────────────────────────┘   │
│                                 │
│ Password                        │
│ ┌───────────────────────────┐   │
│ │ ••••••••                  │   │ ← Border merah
│ └───────────────────────────┘   │
│ 🔴 Email atau password salah    │
└─────────────────────────────────┘
```

### Toast Error:
```
┌───────────────────────────────────────┐
│ ✕ Gagal menyimpan user                │
│ Email sudah digunakan oleh user lain. │
│                              [Tutup]  │
└───────────────────────────────────────┘
```

---

## 10. SUCCESS FEEDBACK

### Toast Success:
```
┌───────────────────────────────────────┐
│ ✓ User berhasil ditambahkan           │
│                              [Tutup]  │
└───────────────────────────────────────┘

Position: top-right
Duration: 3 seconds
```

---

## 11. ACCESSIBILITY

### Keyboard Navigation:
- Tab: Move through inputs
- Enter: Submit form
- Esc: Close dialog
- Arrow keys: Navigate dropdowns

### Screen Reader Labels:
```html
<label for="email" className="sr-only">Email Address</label>
<input 
  id="email" 
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Email tidak valid
</span>
```

### Focus Management:
- Visible focus ring on all interactive elements
- Trap focus inside modals
- Return focus to trigger element on modal close

---

**Version**: 1.0
**Last Updated**: 2026-09-01
