# API Endpoints - Modul Konfigurasi

## SERVICE CLASS

```typescript
class KonfigurasiService extends BaseApiService {
  private static instance: KonfigurasiService;
  private cache: Map<string, any> = new Map();

  private constructor() {
    super('konfigurasi');
  }

  static getInstance(): KonfigurasiService {
    if (!this.instance) {
      this.instance = new KonfigurasiService();
    }
    return this.instance;
  }

  // Get all configs (cached)
  async getAll(): Promise<ApiResponse<Konfigurasi[]>> {
    if (this.cache.has('all')) {
      return { data: this.cache.get('all') };
    }

    const response = await this.supabase
      .from('konfigurasi')
      .select('*')
      .order('kategori, key');

    if (response.data) {
      this.cache.set('all', response.data);
    }

    return response;
  }

  // Get single config with type casting
  async get<T>(key: string): Promise<T | null> {
    const { data } = await this.supabase
      .from('konfigurasi')
      .select('*')
      .eq('key', key)
      .single();

    if (!data) return null;

    // Type casting
    switch (data.type) {
      case 'number':
        return Number(data.value) as T;
      case 'boolean':
        return (data.value === 'true') as T;
      case 'json':
        return JSON.parse(data.value) as T;
      default:
        return data.value as T;
    }
  }

  // Update config
  async update(key: string, value: any): Promise<ApiResponse<Konfigurasi>> {
    const stringValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : String(value);

    const response = await this.supabase
      .from('konfigurasi')
      .update({ 
        value: stringValue,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single();

    // Invalidate cache
    this.cache.clear();

    return response;
  }

  // Bulk update
  async updateMany(updates: Record<string, any>): Promise<ApiResponse<void>> {
    const promises = Object.entries(updates).map(([key, value]) => 
      this.update(key, value)
    );

    await Promise.all(promises);
    return { data: undefined };
  }
}
```

---

## USAGE EXAMPLES

### Get Config Value

```typescript
const konfigurasiService = KonfigurasiService.getInstance();

// Get as string
const appName = await konfigurasiService.get<string>('app_name');
// "SIM-AMI SPs UIKA"

// Get as number
const deadlineDays = await konfigurasiService.get<number>('rtl_deadline_days');
// 30

// Get as boolean
const notifEnabled = await konfigurasiService.get<boolean>('notif_enabled');
// true
```

---

### Update Config

```typescript
// Single update
await konfigurasiService.update('app_name', 'SIM-AMI New Name');

// Bulk update
await konfigurasiService.updateMany({
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_user: 'admin@uika.ac.id'
});
```

---

### React Hook

```typescript
// hooks/useConfig.ts
export function useConfig() {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadConfig = async () => {
      const service = KonfigurasiService.getInstance();
      const { data } = await service.getAll();
      
      const configMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      
      setConfig(configMap);
    };

    loadConfig();
  }, []);

  return config;
}

// Usage in component
function MyComponent() {
  const config = useConfig();
  
  return <h1>{config.app_name}</h1>;
}
```

---

### Auto Numbering Helper

```typescript
// utils/generateNumber.ts
export async function generateNumber(
  entity: 'sesi' | 'temuan' | 'rekomendasi',
  urut: number,
  tahun: number
): Promise<string> {
  const konfigurasiService = KonfigurasiService.getInstance();
  
  let formatKey = '';
  switch (entity) {
    case 'sesi':
      formatKey = 'nomor_format_sesi';
      break;
    case 'temuan':
      formatKey = 'nomor_format_temuan';
      break;
    case 'rekomendasi':
      formatKey = 'nomor_format_rekomendasi';
      break;
  }

  const format = await konfigurasiService.get<string>(formatKey);
  
  return format
    .replace('{tahun}', String(tahun))
    .replace(/{urut:(\d+)}/g, (_, digits) => 
      String(urut).padStart(Number(digits), '0')
    );
}

// Usage
const nomorSesi = await generateNumber('sesi', 1, 2025);
// "SA/2025/001"

const nomorTemuan = await generateNumber('temuan', 151, 2025);
// "151/PM.10/KPMA/2025"
```

---

## STORAGE SERVICE (Google Drive OAuth)

```typescript
class StorageService {
  private static instance: StorageService;
  private provider: 'supabase' | 'google_drive' = 'supabase';

  private constructor() {}

  static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  async init() {
    const konfigurasiService = KonfigurasiService.getInstance();
    this.provider = await konfigurasiService.get<'supabase' | 'google_drive'>('storage_provider') || 'supabase';
  }

  // Upload file
  async upload(file: File, path: string): Promise<{ url: string; path: string }> {
    await this.init();

    if (this.provider === 'google_drive') {
      return await this.uploadToGoogleDrive(file, path);
    } else {
      return await this.uploadToSupabase(file, path);
    }
  }

  // Upload to Supabase Storage
  private async uploadToSupabase(file: File, path: string) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.storage
      .from('evidence-files')
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('evidence-files')
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path
    };
  }

  // Upload to Google Drive
  private async uploadToGoogleDrive(file: File, path: string) {
    const konfigurasiService = KonfigurasiService.getInstance();
    
    const clientId = await konfigurasiService.get<string>('storage_gdrive_client_id');
    const clientSecret = await konfigurasiService.get<string>('storage_gdrive_client_secret');
    const refreshToken = await konfigurasiService.get<string>('storage_gdrive_refresh_token');
    const folderId = await konfigurasiService.get<string>('storage_gdrive_folder_id');

    // Get access token
    const accessToken = await this.getGoogleDriveAccessToken(clientId!, clientSecret!, refreshToken!);

    // Upload file
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify({
      name: file.name,
      parents: [folderId]
    })], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    const data = await response.json();

    // Make file public (optional)
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });

    return {
      url: `https://drive.google.com/file/d/${data.id}/view`,
      path: data.id
    };
  }

  // Get Google Drive access token from refresh token
  private async getGoogleDriveAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  // Delete file
  async delete(path: string): Promise<void> {
    await this.init();

    if (this.provider === 'google_drive') {
      await this.deleteFromGoogleDrive(path);
    } else {
      await this.deleteFromSupabase(path);
    }
  }

  private async deleteFromSupabase(path: string) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.storage.from('evidence-files').remove([path]);
  }

  private async deleteFromGoogleDrive(fileId: string) {
    const konfigurasiService = KonfigurasiService.getInstance();
    
    const clientId = await konfigurasiService.get<string>('storage_gdrive_client_id');
    const clientSecret = await konfigurasiService.get<string>('storage_gdrive_client_secret');
    const refreshToken = await konfigurasiService.get<string>('storage_gdrive_refresh_token');

    const accessToken = await this.getGoogleDriveAccessToken(clientId!, clientSecret!, refreshToken!);

    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
```

---

## GOOGLE DRIVE OAUTH SETUP

```typescript
// api/storage/google-drive/authorize/route.ts
export async function GET(request: Request) {
  const konfigurasiService = KonfigurasiService.getInstance();
  const clientId = await konfigurasiService.get<string>('storage_gdrive_client_id');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId!);
  authUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/storage/google-drive/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return Response.redirect(authUrl.toString());
}

// api/storage/google-drive/callback/route.ts
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const konfigurasiService = KonfigurasiService.getInstance();
  const clientId = await konfigurasiService.get<string>('storage_gdrive_client_id');
  const clientSecret = await konfigurasiService.get<string>('storage_gdrive_client_secret');

  // Exchange code for tokens
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code: code!,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/storage/google-drive/callback`,
      grant_type: 'authorization_code'
    })
  });

  const data = await response.json();

  // Save refresh token
  await konfigurasiService.update('storage_gdrive_refresh_token', data.refresh_token);

  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?gdrive=connected`);
}
```

---

## LOGO UPLOAD

```typescript
class LogoService {
  private static instance: LogoService;

  static getInstance(): LogoService {
    if (!this.instance) {
      this.instance = new LogoService();
    }
    return this.instance;
  }

  async uploadLogo(file: File): Promise<string> {
    const storageService = StorageService.getInstance();
    const path = `branding/logo-${Date.now()}.${file.name.split('.').pop()}`;
    
    const { url } = await storageService.upload(file, path);

    // Update config
    const konfigurasiService = KonfigurasiService.getInstance();
    await konfigurasiService.update('logo_url', url);

    return url;
  }

  async uploadFavicon(file: File): Promise<string> {
    const storageService = StorageService.getInstance();
    const path = `branding/favicon-${Date.now()}.${file.name.split('.').pop()}`;
    
    const { url } = await storageService.upload(file, path);

    // Update config
    const konfigurasiService = KonfigurasiService.getInstance();
    await konfigurasiService.update('favicon_url', url);

    return url;
  }
}
```

---

## USAGE

```typescript
// Upload logo
const logoService = LogoService.getInstance();
const logoUrl = await logoService.uploadLogo(logoFile);

// Upload evidence file
const storageService = StorageService.getInstance();
const { url, path } = await storageService.upload(evidenceFile, `temuan/${temuanId}/bukti-1.pdf`);

// Google Drive OAuth flow
// 1. Admin click "Connect Google Drive"
window.location.href = '/api/storage/google-drive/authorize';

// 2. User authorize in Google
// 3. Callback saves refresh token
// 4. Future uploads use Google Drive automatically
```

---

## TYPES

```typescript
export interface Konfigurasi {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  kategori: string;
  deskripsi: string;
  updated_by?: string;
  updated_at: string;
  created_at: string;
}

export interface KonfigurasiUpdate {
  key: string;
  value: any;
}
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
