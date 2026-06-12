INSERT INTO categories (id, name, icon) VALUES
  ('a01d7e9f-2b1f-4c7d-8e63-36f4c047db67', 'Pizza', '🍕'),
  ('d6e2f7a1-2d5c-4a8b-bf06-e9bb6f936a0d', 'Burgers', '🍔'),
  ('f134c9bf-3b5d-4ec0-94b1-58b7d079f9fa', 'Desserts', '🍰')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurants (id, name, description, image_url, rating, delivery_time, cuisines, location, is_active, min_order, delivery_fee)
VALUES
  ('1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9', 'Neon Eats', 'Fast and fresh meals delivered hot.', 'https://example.com/images/neon-eats.jpg', 4.6, '25-35 mins', 'Italian, Burgers, Desserts', 'New York, NY', true, 10.00, 3.99)
ON CONFLICT (id) DO NOTHING;
