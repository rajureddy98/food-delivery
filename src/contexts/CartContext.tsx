import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { CartItem, MenuItem, Restaurant } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  restaurant: Restaurant | null;
  loading: boolean;
  addToCart: (menuItem: MenuItem, restaurantId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setRestaurant(null);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: cart } = await supabase
        .from('carts')
        .select('*, cart_items(*, menu_items(*))')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cart) {
        setCartItems(cart.cart_items || []);

        if (cart.restaurant_id) {
          const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', cart.restaurant_id)
            .single();
          setRestaurant(restaurantData);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItem: MenuItem, restaurantId: string) => {
    if (!user) throw new Error('Must be logged in to add to cart');

    try {
      let { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cart && cart.restaurant_id && cart.restaurant_id !== restaurantId) {
        throw new Error('Cannot add items from different restaurants');
      }

      if (!cart) {
        const { data: newCart, error } = await supabase
          .from('carts')
          .insert({ user_id: user.id, restaurant_id: restaurantId })
          .select()
          .single();

        if (error) throw error;
        cart = newCart;
      } else if (!cart.restaurant_id) {
        await supabase
          .from('carts')
          .update({ restaurant_id: restaurantId })
          .eq('id', cart.id);
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('menu_item_id', menuItem.id)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            menu_item_id: menuItem.id,
            quantity: 1,
          });
      }

      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cart) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);

        await supabase
          .from('carts')
          .update({ restaurant_id: null })
          .eq('id', cart.id);
      }

      setCartItems([]);
      setRestaurant(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.menu_item?.price || 0) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    restaurant,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
