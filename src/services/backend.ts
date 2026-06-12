import type { Category, MenuItem, Restaurant, Profile, Order } from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api';

export interface AuthResponse {
  userId: string;
  status: string;
  message: string;
}

export interface CartResponse {
  cartId: string;
  userId: string;
  restaurantId: string;
  items: CartItemResponse[];
}

export interface CartItemResponse {
  id: string;
  cartId: string;
  menuItemId: string;
  quantity: number;
}

export interface CartAddRequest {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface PaymentIntentRequest {
  userId: string;
  amount: number;
  metadata: Record<string, string>;
}

export function login(email: string, password: string) {
  return apiPost<AuthResponse>('/auth/login', { email, password });
}

export function register(email: string, password: string, fullName: string) {
  return apiPost<AuthResponse>('/auth/register', { email, password, fullName });
}

export function fetchProfile(userId: string) {
  return apiGet<Profile>(`/auth/profile/${userId}`);
}

export function updateProfile(userId: string, updates: Partial<Profile>) {
  return apiPut<Profile>(`/auth/profile/${userId}`, updates);
}

export function listRestaurants() {
  return apiGet<Restaurant[]>('/restaurants');
}

export function fetchRestaurant(restaurantId: string) {
  return apiGet<Restaurant>(`/restaurants/${restaurantId}`);
}

export function listMenuItems(restaurantId?: string, categoryId?: string) {
  const query = new URLSearchParams();
  if (restaurantId) query.append('restaurantId', restaurantId);
  if (categoryId) query.append('categoryId', categoryId);
  return apiGet<MenuItem[]>(`/menu?${query.toString()}`);
}

export function fetchMenuItem(id: string) {
  return apiGet<MenuItem>(`/menu/${id}`);
}

export function listCategories() {
  return apiGet<Category[]>('/restaurants/categories');
}

export function getCart(userId: string) {
  return apiGet<CartResponse>(`/cart/${userId}`);
}

export function addCartItem(userId: string, request: CartAddRequest) {
  return apiPost<CartResponse>(`/cart/${userId}/items`, request);
}

export function updateCartItem(userId: string, itemId: string, request: UpdateCartItemRequest) {
  return apiPut<CartResponse>(`/cart/${userId}/items/${itemId}`, request);
}

export function deleteCartItem(userId: string, itemId: string) {
  return apiDelete<CartResponse>(`/cart/${userId}/items/${itemId}`);
}

export function createOrder(request: {
  userId: string;
  restaurantId: string;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  phone: string;
  stripePaymentId?: string;
  items: { menuItemId: string; quantity: number; price: number; itemName: string }[];
}) {
  return apiPost<{ orderId: string; status: string }>(`/orders`, request);
}

export function listOrders(userId: string) {
  return apiGet<Order[]>(`/orders/user/${userId}`);
}

export function createPaymentIntent(request: PaymentIntentRequest) {
  return apiPost<{ paymentIntentId: string; clientSecret: string }>('/payments/intent', request);
}
