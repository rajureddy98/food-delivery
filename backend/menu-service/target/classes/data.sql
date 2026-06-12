INSERT INTO categories (id, name, icon) VALUES
  ('a01d7e9f-2b1f-4c7d-8e63-36f4c047db67', 'Pizza', '🍕'),
  ('d6e2f7a1-2d5c-4a8b-bf06-e9bb6f936a0d', 'Burgers', '🍔'),
  ('f134c9bf-3b5d-4ec0-94b1-58b7d079f9fa', 'Desserts', '🍰')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, image_url, is_vegetarian, is_available)
VALUES
  ('c3962648-08d3-4c61-8a00-79c58db2bb1f', '1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9', 'a01d7e9f-2b1f-4c7d-8e63-36f4c047db67', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil.', 14.99, 'https://example.com/images/margherita.jpg', true, true),
  ('544c8b01-5cd7-4b82-9a9c-5cd5b2da7d12', '1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9', 'd6e2f7a1-2d5c-4a8b-bf06-e9bb6f936a0d', 'Beef Burger', 'Juicy beef burger with lettuce, tomato, and cheese.', 12.50, 'https://example.com/images/beef-burger.jpg', false, true),
  ('1137d5fd-9cde-4f41-9894-4014c6d47f9f', '1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9', 'f134c9bf-3b5d-4ec0-94b1-58b7d079f9fa', 'Chocolate Cake', 'Rich chocolate cake slice with whipped cream.', 6.50, 'https://example.com/images/chocolate-cake.jpg', true, true)
ON CONFLICT (id) DO NOTHING;
