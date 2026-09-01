# API Endpoints - Modul Notifikasi

## SERVICE CLASS

```typescript
class NotificationService extends BaseApiService {
  private static instance: NotificationService;

  private constructor() {
    super('notifikasi');
  }

  static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = new NotificationService();
    }
    return this.instance;
  }

  async create(userId: string, data: NotificationCreate): Promise<ApiResponse<Notification>> {
    const response = await this.supabase.from('notifikasi').insert({ user_id: userId, ...data }).select().single();
    
    // Send email if enabled
    if (data.send_email) {
      await EmailService.getInstance().sendNotification(userId, data);
    }

    return response;
  }

  async getByUser(userId: string, limit: number = 20): Promise<ApiResponse<Notification[]>> {
    return await this.supabase
      .from('notifikasi')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await this.supabase
      .from('notifikasi')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_read', false);
    return count || 0;
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return await this.supabase
      .from('notifikasi')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  }

  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    await this.supabase
      .from('notifikasi')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);
    return { data: undefined };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    await this.supabase.from('notifikasi').delete().eq('id', id);
    return { data: undefined };
  }

  // Realtime subscription
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return this.supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifikasi',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        callback(payload.new as Notification);
      })
      .subscribe();
  }
}
```

---

## EMAIL SERVICE

```typescript
class EmailService {
  private static instance: EmailService;

  private constructor() {}

  static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService();
    }
    return this.instance;
  }

  async sendNotification(userId: string, notifData: NotificationCreate): Promise<void> {
    const user = await supabase.from('users').select('email, name').eq('id', userId).single();
    if (!user.data?.email) return;

    const template = this.getTemplate(notifData.category || 'system');
    const subject = notifData.title;
    const body = this.renderTemplate(template, { ...notifData, user_name: user.data.name });

    await this.send(user.data.email, subject, body);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const config = await KonfigurasiService.getInstance();
    const smtpHost = await config.get<string>('smtp_host');
    const smtpPort = await config.get<number>('smtp_port');
    const smtpUser = await config.get<string>('smtp_user');
    const smtpPass = await config.get<string>('smtp_pass');

    // Use nodemailer or similar
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: { user: smtpUser, pass: smtpPass }
    });

    try {
      await transporter.sendMail({ from: smtpUser, to, subject, html: body });
      await supabase.from('notifikasi_log').insert({
        email: to, subject, body, status: 'sent', sent_at: new Date().toISOString()
      });
    } catch (error) {
      await supabase.from('notifikasi_log').insert({
        email: to, subject, body, status: 'failed', error_message: error.message
      });
    }
  }

  private getTemplate(category: string): string {
    const templates = {
      rtl: `
        <h3>Tindak Lanjut Update</h3>
        <p>{{message}}</p>
        <p><strong>Temuan:</strong> {{related_id}}</p>
        <p><a href="{{link}}">Lihat Detail</a></p>
      `,
      sesi: `
        <h3>Sesi Audit Update</h3>
        <p>{{message}}</p>
        <p><a href="{{link}}">Lihat Detail</a></p>
      `
    };
    return templates[category] || '<p>{{message}}</p>';
  }

  private renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }
}
```

---

## HELPER FUNCTIONS

```typescript
// Create notification helper
async function notifyUsers(userIds: string[], data: NotificationCreate): Promise<void> {
  const notifService = NotificationService.getInstance();
  
  for (const userId of userIds) {
    await notifService.create(userId, data);
  }
}

// Notify on RTL submit
async function notifyRTLSubmitted(temuanId: string, rtlId: string): Promise<void> {
  const admins = await supabase.from('users').select('id').eq('role', 'admin_gpm');
  const adminIds = admins.data?.map(a => a.id) || [];

  await notifyUsers(adminIds, {
    title: 'RTL Submitted untuk Review',
    message: `RTL untuk temuan ${temuanId} telah disubmit oleh PIC Unit`,
    type: 'info',
    category: 'rtl',
    related_id: rtlId,
    related_type: 'tindak_lanjut',
    link: `/temuan/${temuanId}`,
    send_email: true
  });
}
```

---

## TYPES

```typescript
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: 'rtl' | 'sesi' | 'temuan' | 'system';
  related_id?: string;
  related_type?: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: 'rtl' | 'sesi' | 'temuan' | 'system';
  related_id?: string;
  related_type?: string;
  link?: string;
  send_email?: boolean;
}
```

---

## USAGE

```typescript
const notifService = NotificationService.getInstance();

// Create notification
await notifService.create(userId, {
  title: 'RTL Submitted',
  message: 'PIC Unit telah submit RTL',
  type: 'info',
  category: 'rtl',
  link: '/temuan/151',
  send_email: true
});

// Subscribe to real-time notifications
notifService.subscribeToNotifications(userId, (notif) => {
  console.log('New notification:', notif);
  showToast(notif.title);
  updateBadgeCount();
});

// Mark as read
await notifService.markAsRead(notifId);

// Get unread count
const unreadCount = await notifService.getUnreadCount(userId);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
