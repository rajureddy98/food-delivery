/*
  # Food Delivery Application Schema

  ## Overview
  Complete database schema for a Zomato-like food delivery application with proper security and relationships.

  ## New Tables
  
  ### 1. categories
    - `id` (uuid, primary key) - Unique category identifier
    - `name` (text) - Category name (e.g., "Pizza", "Burgers")
    - `icon` (text) - Icon identifier for UI
    - `created_at` (timestamptz) - Record creation timestamp

  ### 2. restaurants
    - `id` (uuid, primary key) - Unique restaurant identifier
    - `name` (text) - Restaurant name
    - `description` (text) - Restaurant description
    - `image_url` (text) - Restaurant cover image
    - `rating` (numeric) - Average rating (0-5)
    - `delivery_time` (text) - Estimated delivery time
    - `cuisines` (text array) - List of cuisines offered
    - `location` (text) - Restaurant location/area
    - `is_active` (boolean) - Whether restaurant is accepting orders
    - `min_order` (numeric) - Minimum order amount
    - `delivery_fee` (numeric) - Delivery fee
    - `created_at` (timestamptz) - Record creation timestamp

  ### 3. menu_items
    - `id` (uuid, primary key) - Unique menu item identifier
    - `restaurant_id` (uuid, foreign key) - Reference to restaurant
    - `category_id` (uuid, foreign key) - Reference to category
    - `name` (text) - Item name
    - `description` (text) - Item description
    - `price` (numeric) - Item price
    - `image_url` (text) - Item image
    - `is_vegetarian` (boolean) - Vegetarian flag
    - `is_available` (boolean) - Availability status
    - `created_at` (timestamptz) - Record creation timestamp

  ### 4. carts
    - `id` (uuid, primary key) - Unique cart identifier
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `restaurant_id` (uuid, foreign key) - Reference to restaurant (cart tied to one restaurant)
    - `created_at` (timestamptz) - Cart creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 5. cart_items
    - `id` (uuid, primary key) - Unique cart item identifier
    - `cart_id` (uuid, foreign key) - Reference to cart
    - `menu_item_id` (uuid, foreign key) - Reference to menu item
    - `quantity` (integer) - Item quantity
    - `created_at` (timestamptz) - Record creation timestamp

  ### 6. orders
    - `id` (uuid, primary key) - Unique order identifier
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `restaurant_id` (uuid, foreign key) - Reference to restaurant
    - `total_amount` (numeric) - Total order amount
    - `delivery_fee` (numeric) - Delivery fee for this order
    - `status` (text) - Order status (pending, confirmed, preparing, out_for_delivery, delivered, cancelled)
    - `delivery_address` (text) - Delivery address
    - `phone` (text) - Contact phone number
    - `created_at` (timestamptz) - Order placement timestamp
    - `updated_at` (timestamptz) - Last status update timestamp

  ### 7. order_items
    - `id` (uuid, primary key) - Unique order item identifier
    - `order_id` (uuid, foreign key) - Reference to order
    - `menu_item_id` (uuid, foreign key) - Reference to menu item
    - `quantity` (integer) - Item quantity
    - `price` (numeric) - Price at time of order
    - `item_name` (text) - Item name snapshot
    - `created_at` (timestamptz) - Record creation timestamp

  ### 8. profiles
    - `id` (uuid, primary key, foreign key to auth.users) - User identifier
    - `full_name` (text) - User's full name
    - `phone` (text) - Phone number
    - `default_address` (text) - Default delivery address
    - `created_at` (timestamptz) - Profile creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Categories and restaurants are publicly readable
  - Menu items are publicly readable
  - Carts and cart items are user-specific
  - Orders and order items are user-specific
  - Profiles are user-specific

  ### Policies
  - Public read access for categories, restaurants, and menu items
  - Authenticated users can manage their own carts, orders, and profiles
  - Users can only view and modify their own data
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  rating numeric(2,1) DEFAULT 4.0,
  delivery_time text NOT NULL,
  cuisines text[] NOT NULL,
  location text NOT NULL,
  is_active boolean DEFAULT true,
  min_order numeric(10,2) DEFAULT 0,
  delivery_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  is_vegetarian boolean DEFAULT false,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  default_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(cart_id, menu_item_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  delivery_address text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL,
  item_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read)
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for restaurants (public read)
CREATE POLICY "Restaurants are publicly readable"
  ON restaurants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for menu_items (public read)
CREATE POLICY "Menu items are publicly readable"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for carts
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON carts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON carts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for cart_items
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);