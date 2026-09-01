# API Endpoints - Modul Activity Log

## SERVICE CLASS

```typescript
class ActivityLogService extends BaseApiService {
  private static instance: ActivityLogService;

  private constructor() {
    super('activity_log');
  }

  static getInstance(): ActivityLogService {
    if (!this.instance) {
      this.instance = new ActivityLogService();
    }
    return this.instance;
  }

  async log(data: ActivityLogCreate): Promise<void> {
    const user = await this.supabase.auth.getUser();
    
    await this.supabase.from('activity_log').insert({
      user_id: user.data.user?.id,
      action: data.action,
      resource_type: data.resource_type,
      resource_id: data.resource_id,
      description: data.description,
      changes: data.changes,
      ip_address: data.ip_address,
      user_agent: data.user_agent
    });
  }

  async getAll(filters?: ActivityLogFilters): Promise<ApiResponse<ActivityLog[]>> {
    let query = this.supabase
      .from('activity_log')
      .select('*, user:user_id(email, name)')
      .order('created_at', { ascending: false });

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async getByResource(resourceType: string, resourceId: string): Promise<ApiResponse<ActivityLog[]>> {
    return await this.supabase
      .from('activity_log')
      .select('*, user:user_id(email, name)')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });
  }

  async getRecentActivity(limit: number = 20): Promise<ApiResponse<ActivityLog[]>> {
    return await this.getAll({ limit });
  }
}
```

---

## AUTO-LOG MIDDLEWARE

```typescript
// middleware/activity-logger.ts
export function createActivityLogger() {
  return {
    async logCreate(resourceType: string, resourceId: string, description: string) {
      await ActivityLogService.getInstance().log({
        action: 'CREATE',
        resource_type: resourceType,
        resource_id: resourceId,
        description
      });
    },

    async logUpdate(resourceType: string, resourceId: string, changes: any, description: string) {
      await ActivityLogService.getInstance().log({
        action: 'UPDATE',
        resource_type: resourceType,
        resource_id: resourceId,
        description,
        changes
      });
    },

    async logDelete(resourceType: string, resourceId: string, description: string) {
      await ActivityLogService.getInstance().log({
        action: 'DELETE',
        resource_type: resourceType,
        resource_id: resourceId,
        description
      });
    }
  };
}

// Usage in service
class TemuanService extends BaseApiService {
  private logger = createActivityLogger();

  async create(data: TemuanCreate): Promise<ApiResponse<Temuan>> {
    const response = await this.supabase.from('temuan').insert(data).select().single();
    
    if (response.data) {
      await this.logger.logCreate('temuan', response.data.id, `Created temuan ${response.data.nomor}`);
    }

    return response;
  }

  async updateStatusRtl(id: string, statusId: string): Promise<ApiResponse<Temuan>> {
    const before = await this.supabase.from('temuan').select('status_rtl_id').eq('id', id).single();
    
    const response = await this.supabase.from('temuan').update({ status_rtl_id: statusId }).eq('id', id).select().single();

    if (response.data) {
      await this.logger.logUpdate('temuan', id, {
        before: { status_rtl_id: before.data?.status_rtl_id },
        after: { status_rtl_id: statusId }
      }, 'Updated status RTL');
    }

    return response;
  }
}
```

---

## TYPES

```typescript
export interface ActivityLog {
  id: string;
  user_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT';
  resource_type?: string;
  resource_id?: string;
  description: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface ActivityLogCreate {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT';
  resource_type?: string;
  resource_id?: string;
  description: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
}

export interface ActivityLogFilters {
  user_id?: string;
  action?: string;
  resource_type?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}
```

---

## USAGE

```typescript
const logService = ActivityLogService.getInstance();

// Manual logging
await logService.log({
  action: 'APPROVE',
  resource_type: 'tindak_lanjut',
  resource_id: rtlId,
  description: 'Approved RTL for temuan #151'
});

// Get logs for specific resource
const logs = await logService.getByResource('temuan', temuanId);

// Get recent activity (dashboard)
const recentActivity = await logService.getRecentActivity(10);

// Get filtered logs
const userLogs = await logService.getAll({
  user_id: userId,
  action: 'UPDATE',
  date_from: '2025-01-01'
});
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
