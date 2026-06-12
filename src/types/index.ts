export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  delivery_time: string;
  cuisines: string[];
  location: string;
  is_active: boolean;
  min_order: number;
  delivery_fee: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  is_available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  menu_item_id: string;
  quantity: number;
  menu_item?: MenuItem;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  total_amount: number;
  delivery_fee: number;
  status: string;
  delivery_address: string;
  phone: string;
  created_at: string;
  restaurant?: Restaurant;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  default_address: string | null;
}
