INSERT INTO orders (id, user_id, restaurant_id, total_amount, delivery_fee, status, delivery_address, phone, stripe_payment_id)
VALUES
  ('e7fa54d3-aa87-4e0d-b83b-4cb1f2f76d3f', '8d4c8a15-38a3-46f9-8b8f-1cc07c347e6a', '1e0e1b7d-8f2f-4d8f-9e9f-f9078d4cb7d9', 31.48, 3.99, 'PLACED', '123 Neon St, New York, NY', '+15551234567', 'pi_1Kxyzabcdefghijkl')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, item_name)
VALUES
  ('f7f3ea29-8d5a-4a3b-9a3a-8c72c2e2f34d', 'e7fa54d3-aa87-4e0d-b83b-4cb1f2f76d3f', 'c3962648-08d3-4c61-8a00-79c58db2bb1f', 1, 14.99, 'Margherita Pizza'),
  ('0f9a2d1f-469e-4fcb-a019-1b8f9d4b0c3a', 'e7fa54d3-aa87-4e0d-b83b-4cb1f2f76d3f', '1137d5fd-9cde-4f41-9894-4014c6d47f9f', 1, 6.50, 'Chocolate Cake')
ON CONFLICT (id) DO NOTHING;
