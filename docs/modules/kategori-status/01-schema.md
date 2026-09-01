# Schema Database - Modul Kategori & Status

## 1. Tabel: kategori_temuan

```sql
CREATE TABLE kategori_temuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  warna VARCHAR(20),
  urutan INTEGER,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO kategori_temuan (kode, nama, warna, urutan) VALUES
  ('MAJOR', 'Major', 'red', 1),
  ('MINOR', 'Minor', 'yellow', 2),
  ('OFI', 'Opportunity for Improvement', 'blue', 3);
```

---

## 2. Tabel: status_rtl

```sql
CREATE TABLE status_rtl (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  warna VARCHAR(20),
  urutan INTEGER,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO status_rtl (kode, nama, warna, urutan) VALUES
  ('DRAFT', 'Draft', 'gray', 1),
  ('SUBMITTED', 'Submitted', 'blue', 2),
  ('ON_PROGRESS', 'On Progress', 'orange', 3),
  ('COMPLETED', 'Completed', 'green', 4),
  ('VERIFIED', 'Verified', 'purple', 5);
```

---

## 3. RLS Policies

```sql
ALTER TABLE kategori_temuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_rtl ENABLE ROW LEVEL SECURITY;

-- Admin: Full access
CREATE POLICY admin_kategori_full ON kategori_temuan FOR ALL
  USING (check_role('admin_gpm'));

CREATE POLICY admin_status_full ON status_rtl FOR ALL
  USING (check_role('admin_gpm'));

-- Others: Read only
CREATE POLICY users_kategori_read ON kategori_temuan FOR SELECT USING (true);
CREATE POLICY users_status_read ON status_rtl FOR SELECT USING (true);
```

---

**Version**: 1.0
**Last Updated**: 2026-09-01
