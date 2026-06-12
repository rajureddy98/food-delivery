import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { CartItem, MenuItem, Restaurant } from '../types';
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  fetchRestaurant,
  fetchMenuItem,
} from '../services/backend';

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
      const cart = await getCart(user.id);

      if (cart.restaurantId) {
        const restaurantData = await fetchRestaurant(cart.restaurantId);
        setRestaurant(restaurantData);
      } else {
        setRestaurant(null);
      }

      const enrichedItems = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const menuItem = await fetchMenuItem(item.menuItemId);
            return { ...item, menu_item: menuItem } as CartItem;
          } catch {
            return item as CartItem;
          }
        })
      );

      setCartItems(enrichedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItem: MenuItem, restaurantId: string) => {
    if (!user) throw new Error('Must be logged in to add to cart');

    try {
      await addCartItem(user.id, {
        menuItemId: menuItem.id,
        restaurantId,
        quantity: 1,
      });
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
      await updateCartItem(user!.id, cartItemId, { quantity });
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await deleteCartItem(user!.id, cartItemId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await Promise.all(cartItems.map((item) => deleteCartItem(user.id, item.id)));
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
