INSERT INTO carts (id, user_id, restaurant_id)
VALUES
  ('b9a7a9f7-2c6d-4eae-93db-1a9d2f445c8b', '8d4c8a15-38a3-46f9-8b8f-1cc07c347e6a', '1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (id, cart_id, menu_item_id, quantity)
VALUES
  ('d40efcd9-8034-4424-94c4-2988d4a92e8e', 'b9a7a9f7-2c6d-4eae-93db-1a9d2f445c8b', 'c3962648-08d3-4c61-8a00-79c58db2bb1f', 2)
ON CONFLICT (id) DO NOTHING;
