# Schema Database - Modul Activity Log

## 1. Tabel: activity_log

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT'
  resource_type VARCHAR(50), -- 'temuan', 'sesi_audit', 'tindak_lanjut', etc
  resource_id UUID,
  description TEXT,
  changes JSONB, -- { "before": {...}, "after": {...} }
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_resource ON activity_log(resource_type, resource_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
```

---

## 2. Function: Log Activity

```sql
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID,
  p_description TEXT,
  p_changes JSONB DEFAULT NULL,
  p_ip_address VARCHAR DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO activity_log (
    user_id, action, resource_type, resource_id,
    description, changes, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_description, p_changes, p_ip_address, p_user_agent
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Trigger Examples (Auto-logging)

```sql
-- Example: Auto-log RTL status changes
CREATE OR REPLACE FUNCTION trigger_log_rtl_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status_rtl_id IS DISTINCT FROM NEW.status_rtl_id THEN
    PERFORM log_activity(
      NEW.updated_by,
      'UPDATE',
      'tindak_lanjut',
      NEW.id,
      'Status RTL changed',
      jsonb_build_object(
        'before', jsonb_build_object('status_rtl_id', OLD.status_rtl_id),
        'after', jsonb_build_object('status_rtl_id', NEW.status_rtl_id)
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_rtl_status
  AFTER UPDATE OF status_rtl_id ON tindak_lanjut
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_rtl_status_change();
```

---

## 4. RLS Policies

```sql
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Admin: Full access
CREATE POLICY admin_activity_log_full ON activity_log FOR SELECT
  USING (check_role('admin_gpm'));

-- Users: Own logs only
CREATE POLICY user_activity_log_own ON activity_log FOR SELECT
  USING (user_id = auth.uid());
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
