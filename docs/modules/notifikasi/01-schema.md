# Schema Database - Modul Notifikasi

## 1. Tabel: notifikasi

```sql
CREATE TABLE notifikasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  category VARCHAR(50) CHECK (category IN ('rtl', 'sesi', 'temuan', 'system')),
  related_id UUID,
  related_type VARCHAR(50),
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifikasi_user ON notifikasi(user_id);
CREATE INDEX idx_notifikasi_is_read ON notifikasi(is_read);
CREATE INDEX idx_notifikasi_created ON notifikasi(created_at DESC);
```

---

## 2. Tabel: notifikasi_log (Email Send History)

```sql
CREATE TABLE notifikasi_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifikasi_log_user ON notifikasi_log(user_id);
CREATE INDEX idx_notifikasi_log_status ON notifikasi_log(status);
```

---

## 3. Function: Create Notification

```sql
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title VARCHAR,
  p_message TEXT,
  p_type VARCHAR,
  p_category VARCHAR DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_related_type VARCHAR DEFAULT NULL,
  p_link VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notif_id UUID;
BEGIN
  INSERT INTO notifikasi (
    user_id, title, message, type, category, 
    related_id, related_type, link
  )
  VALUES (
    p_user_id, p_title, p_message, p_type, p_category,
    p_related_id, p_related_type, p_link
  )
  RETURNING id INTO notif_id;

  RETURN notif_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. RLS Policies

```sql
ALTER TABLE notifikasi ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY user_notifikasi_own ON notifikasi FOR ALL
  USING (user_id = auth.uid());

-- Admin can see all notification logs
ALTER TABLE notifikasi_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_notifikasi_log ON notifikasi_log FOR SELECT
  USING (check_role('admin_gpm'));
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
