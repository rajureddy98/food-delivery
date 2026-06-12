INSERT INTO users (id, email, password, full_name, phone)
VALUES
  ('8d4c8a15-38a3-46f9-8b8f-1cc07c347e6a', 'admin@fooddelivery.com', '$2a$10$K0Z1gUeMz7Qb4pJtZSjAyuokGcnf8Qk8Z5YeMlNR3QbPGqdbQjY2i', 'Admin User', '+15551234567')
ON CONFLICT (id) DO NOTHING;
