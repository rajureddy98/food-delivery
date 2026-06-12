export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      restaurants: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          rating?: number;
          delivery_time: string;
          cuisines: string[];
          location: string;
          is_active?: boolean;
          min_order?: number;
          delivery_fee?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          rating?: number;
          delivery_time?: string;
          cuisines?: string[];
          location?: string;
          is_active?: boolean;
          min_order?: number;
          delivery_fee?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_vegetarian: boolean;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_vegetarian?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          is_vegetarian?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          default_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          default_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          default_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          restaurant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          restaurant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          menu_item_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          menu_item_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          menu_item_id?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          total_amount: number;
          delivery_fee: number;
          status: string;
          delivery_address: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          restaurant_id: string;
          total_amount: number;
          delivery_fee?: number;
          status?: string;
          delivery_address: string;
          phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          restaurant_id?: string;
          total_amount?: number;
          delivery_fee?: number;
          status?: string;
          delivery_address?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price: number;
          item_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity?: number;
          price: number;
          item_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          price?: number;
          item_name?: string;
          created_at?: string;
        };
      };
    };
  };
};
