-- ============================================
-- SEED ADMIN USER untuk Testing
-- ============================================
-- Email: admin@uika.ac.id
-- Password: Admin123 (hashed dengan bcrypt salt 10)

INSERT INTO users (id, nama, email, password_hash, role_id, status, created_at, updated_at) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Admin GPM',
  'admin@uika.ac.id',
  '$2b$10$k7mQ1Pn9ntKXcqnWjKHqnu8OSye1y9bsx.Kc/7vQ181/md4eLD0Ei',
  '11111111-1111-1111-1111-111111111111',
  'aktif',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Password hash above is for: Admin123
-- Generate new hash via Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('Admin123', 10);
-- console.log(hash);
