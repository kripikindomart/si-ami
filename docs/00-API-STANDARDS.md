# Standar API - SIM-AMI

## Overview
Standar API untuk konsistensi response format, error handling, dan singleton pattern untuk API client.

---

## 1. SINGLETON PATTERN - API CLIENT

### 1.1 Supabase Client (Singleton)

```typescript
// lib/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getClient(): SupabaseClient<Database> {
    return this.client;
  }
}

export const supabase = SupabaseService.getInstance().getClient();
```

### 1.2 API Service Base (Singleton per Resource)

```typescript
// lib/api/base.service.ts
import { supabase } from '@/lib/supabase/client';
import { ApiResponse, ApiError } from '@/types/api.types';

export abstract class BaseApiService<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records
   */
  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as T[],
        message: 'Data berhasil diambil',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return {
          success: false,
          data: null,
          message: 'Data tidak ditemukan',
          errors: { id: ['Data dengan ID tersebut tidak ditemukan'] },
        };
      }

      return {
        success: true,
        data: data as T,
        message: 'Data berhasil diambil',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create record
   */
  async create(payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as T,
        message: 'Data berhasil ditambahkan',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update record
   */
  async update(id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as T,
        message: 'Data berhasil diupdate',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete record (soft delete via status)
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ status: 'nonaktif' })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        data: null,
        message: 'Data berhasil dihapus',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle error dengan format konsisten
   */
  protected handleError(error: any): ApiResponse<any> {
    console.error(`[${this.tableName}] Error:`, error);

    // Supabase PostgreSQL error
    if (error.code) {
      return this.parsePostgresError(error);
    }

    // Generic error
    return {
      success: false,
      data: null,
      message: error.message || 'Terjadi kesalahan',
      errors: { _general: [error.message || 'Terjadi kesalahan'] },
    };
  }

  /**
   * Parse PostgreSQL error ke format JSON per field
   */
  private parsePostgresError(error: any): ApiResponse<any> {
    const errors: Record<string, string[]> = {};

    switch (error.code) {
      // Unique constraint violation
      case '23505':
        const field = this.extractFieldFromError(error.message);
        errors[field] = [`${field} sudah digunakan`];
        return {
          success: false,
          data: null,
          message: 'Data duplikat',
          errors,
        };

      // Foreign key violation
      case '23503':
        const fkField = this.extractFieldFromError(error.message);
        errors[fkField] = [`${fkField} tidak valid atau tidak ditemukan`];
        return {
          success: false,
          data: null,
          message: 'Referensi data tidak valid',
          errors,
        };

      // Not null violation
      case '23502':
        const nullField = this.extractFieldFromError(error.message);
        errors[nullField] = [`${nullField} wajib diisi`];
        return {
          success: false,
          data: null,
          message: 'Data tidak lengkap',
          errors,
        };

      // Check constraint violation
      case '23514':
        errors._general = ['Data tidak sesuai dengan aturan validasi'];
        return {
          success: false,
          data: null,
          message: 'Validasi gagal',
          errors,
        };

      default:
        errors._general = [error.message];
        return {
          success: false,
          data: null,
          message: 'Terjadi kesalahan database',
          errors,
        };
    }
  }

  /**
   * Extract field name from error message
   */
  private extractFieldFromError(message: string): string {
    const match = message.match(/Key \(([^)]+)\)/);
    return match ? match[1] : '_general';
  }
}
```

---

## 2. RESPONSE FORMAT STANDARD

### 2.1 Success Response

```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Record<string, string[]>; // Per-field errors
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
```

**Example Success:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nama": "Ahmad Zaki",
    "email": "zaki@uika.ac.id",
    "role": "admin_gpm",
    "status": "aktif"
  },
  "message": "User berhasil ditambahkan"
}
```

**Example Success with Pagination:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "nama": "User 1" },
    { "id": "uuid-2", "nama": "User 2" }
  ],
  "message": "Data berhasil diambil",
  "meta": {
    "total": 50,
    "page": 1,
    "perPage": 10,
    "totalPages": 5
  }
}
```

### 2.2 Error Response - Per Field

```typescript
export interface ApiError {
  success: false;
  data: null;
  message: string;
  errors: Record<string, string[]>; // PENTING: Per-field errors
}
```

**Example Error - Validation:**
```json
{
  "success": false,
  "data": null,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama wajib diisi", "Nama minimal 3 karakter"],
    "email": ["Email tidak valid"],
    "password": ["Password minimal 6 karakter"],
    "role_id": ["Role wajib dipilih"]
  }
}
```

**Example Error - Duplicate:**
```json
{
  "success": false,
  "data": null,
  "message": "Data duplikat",
  "errors": {
    "email": ["Email sudah digunakan"]
  }
}
```

**Example Error - Foreign Key:**
```json
{
  "success": false,
  "data": null,
  "message": "Referensi data tidak valid",
  "errors": {
    "role_id": ["Role tidak ditemukan atau tidak valid"]
  }
}
```

**Example Error - General:**
```json
{
  "success": false,
  "data": null,
  "message": "Terjadi kesalahan",
  "errors": {
    "_general": ["Network error: Unable to connect"]
  }
}
```

---

## 3. VALIDATION ERROR HANDLING

### 3.1 Client-Side Validation (Zod)

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  nama: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  email: z.string()
    .email('Email tidak valid'),
  password: z.string()
    .min(6, 'Password minimal 6 karakter'),
  role_id: z.string()
    .uuid('Role tidak valid'),
});

// Convert Zod error to API error format
export function zodErrorToApiError(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const field = err.path.join('.');
    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(err.message);
  });
  
  return errors;
}
```

**Usage in Component:**
```typescript
const handleSubmit = async (values: any) => {
  try {
    // Validate
    const validated = userSchema.parse(values);
    
    // Call API
    const response = await UserService.getInstance().create(validated);
    
    if (!response.success) {
      // Show errors per field
      Object.entries(response.errors || {}).forEach(([field, messages]) => {
        form.setError(field as any, {
          type: 'manual',
          message: messages.join(', '),
        });
      });
      toast.error(response.message);
      return;
    }
    
    toast.success(response.message);
    router.push('/users');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = zodErrorToApiError(error);
      Object.entries(errors).forEach(([field, messages]) => {
        form.setError(field as any, {
          type: 'manual',
          message: messages.join(', '),
        });
      });
    }
  }
};
```

---

## 4. EXAMPLE: USER SERVICE (SINGLETON)

```typescript
// lib/api/user.service.ts
import { BaseApiService } from './base.service';
import { supabase } from '@/lib/supabase/client';
import { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import { ApiResponse } from '@/types/api.types';

class UserService extends BaseApiService<User> {
  private static instance: UserService;

  private constructor() {
    super('users');
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Create user with auth
   */
  async createWithAuth(payload: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
      });

      if (authError) throw authError;

      // Step 2: Create user record
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          nama: payload.nama,
          email: payload.email,
          role_id: payload.role_id,
          status: 'aktif',
        })
        .select()
        .single();

      if (error) {
        // Rollback: delete auth user if DB insert fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw error;
      }

      // Step 3: If PIC Unit, assign units
      if (payload.unit_kerja_ids && payload.unit_kerja_ids.length > 0) {
        const unitAssignments = payload.unit_kerja_ids.map((unitId) => ({
          user_id: data.id,
          unit_kerja_id: unitId,
        }));

        const { error: unitError } = await supabase
          .from('user_unit')
          .insert(unitAssignments);

        if (unitError) {
          // Rollback
          await supabase.auth.admin.deleteUser(authData.user.id);
          await supabase.from('users').delete().eq('id', data.id);
          throw unitError;
        }
      }

      return {
        success: true,
        data: data as User,
        message: 'User berhasil ditambahkan',
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Get users with role info
   */
  async getAllWithRole(): Promise<ApiResponse<User[]>> {
    try {
      const { data, error } = await supabase
        .from('v_users_with_role')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data as User[],
        message: 'Data berhasil diambil',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Toggle user status
   */
  async toggleStatus(id: string): Promise<ApiResponse<User>> {
    try {
      // Get current status
      const { data: currentUser } = await supabase
        .from('users')
        .select('status')
        .eq('id', id)
        .single();

      if (!currentUser) {
        return {
          success: false,
          data: null,
          message: 'User tidak ditemukan',
          errors: { id: ['User tidak ditemukan'] },
        };
      }

      const newStatus = currentUser.status === 'aktif' ? 'nonaktif' : 'aktif';

      const { data, error } = await supabase
        .from('users')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as User,
        message: `User berhasil ${newStatus === 'aktif' ? 'diaktifkan' : 'dinonaktifkan'}`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default UserService;

// Export singleton instance
export const userService = UserService.getInstance();
```

---

## 5. USAGE IN COMPONENTS

### 5.1 React Hook untuk API Call

```typescript
// hooks/use-api.ts
import { useState } from 'react';
import { ApiResponse } from '@/types/api.types';

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string[]> | null>(null);

  const execute = async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (!response.success) {
        setError(response.errors || null);
      }
      
      return response;
    } catch (err: any) {
      const errorResponse: ApiResponse<T> = {
        success: false,
        data: null,
        message: 'Terjadi kesalahan',
        errors: { _general: [err.message] },
      };
      setError(errorResponse.errors || null);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}
```

### 5.2 Usage in Component

```typescript
// components/users/create-user-dialog.tsx
'use client';

import { useApi } from '@/hooks/use-api';
import { userService } from '@/lib/api/user.service';
import { useToast } from '@/hooks/use-toast';

export function CreateUserDialog() {
  const { loading, execute } = useApi();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (values: any) => {
    const response = await execute(() => userService.createWithAuth(values));

    if (!response.success) {
      // Set errors per field
      if (response.errors) {
        Object.entries(response.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            type: 'manual',
            message: messages.join(', '),
          });
        });
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.message,
      });
      return;
    }

    toast({
      title: 'Sukses',
      description: response.message,
    });
    
    form.reset();
    onClose();
  };

  return (
    <Dialog>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* More fields... */}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 6. ERROR DISPLAY COMPONENT

```typescript
// components/ui/field-error.tsx
interface FieldErrorProps {
  errors: Record<string, string[]> | null;
  field: string;
}

export function FieldError({ errors, field }: FieldErrorProps) {
  if (!errors || !errors[field]) return null;

  return (
    <div className="text-sm text-destructive mt-1">
      {errors[field].map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  );
}

// Usage:
<Input {...field} />
<FieldError errors={apiError} field="nama" />
```

---

## 7. TYPESCRIPT TYPES

```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  errors: Record<string, string[]>;
}
```

---

## 8. TESTING

```typescript
// __tests__/user.service.test.ts
import { userService } from '@/lib/api/user.service';

describe('UserService', () => {
  it('should return error per field for invalid data', async () => {
    const response = await userService.createWithAuth({
      nama: 'AB', // Too short
      email: 'invalid-email',
      password: '123', // Too short
      role_id: 'invalid-uuid',
    });

    expect(response.success).toBe(false);
    expect(response.errors).toHaveProperty('nama');
    expect(response.errors).toHaveProperty('email');
    expect(response.errors).toHaveProperty('password');
    expect(response.errors?.nama).toContain('Nama minimal 3 karakter');
  });

  it('should return duplicate error for existing email', async () => {
    const response = await userService.createWithAuth({
      nama: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
      role_id: 'valid-uuid',
    });

    expect(response.success).toBe(false);
    expect(response.errors).toHaveProperty('email');
    expect(response.errors?.email).toContain('Email sudah digunakan');
  });
});
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01

**Key Points**:
1. Singleton pattern untuk semua service
2. Error format JSON per field: `{ field: ["error1", "error2"] }`
3. Consistent response structure
4. Type-safe dengan TypeScript
5. Rollback transaction on error
6. Reusable hooks dan components
