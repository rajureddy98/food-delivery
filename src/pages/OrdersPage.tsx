import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { listOrders, fetchRestaurant } from '../services/backend';
import type { Order } from '../types';

interface OrdersPageProps {
  onBack: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
  preparing: { label: 'Preparing', icon: Package, color: 'text-orange-600 bg-orange-50' },
  out_for_delivery: { label: 'Out for Delivery', icon: Package, color: 'text-emerald-600 bg-emerald-50' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export function OrdersPage({ onBack }: OrdersPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurantNames, setRestaurantNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);

    try {
      const data = await listOrders(user!.id);
      setOrders(data);

      const restaurantIds = Array.from(
        new Set(data.map((order: any) => order.restaurantId))
      );

      const restaurantData = await Promise.all(
        restaurantIds.map(async (id) => {
          try {
            const restaurant = await fetchRestaurant(id);
            return { id, name: restaurant.name };
          } catch {
            return { id, name: 'Restaurant' };
          }
        })
      );

      setRestaurantNames(
        Object.fromEntries(
          restaurantData.map((restaurant) => [
            restaurant.id,
            restaurant.name,
          ])
        )
      );
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      setRestaurantNames({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-600 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="text-3xl font-bold">My Orders</h1>

          <p className="text-emerald-100 mt-2">
            Track and view your order history
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-48 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const config =
                statusConfig[order.status as keyof typeof statusConfig] ||
                statusConfig.pending;

              const StatusIcon = config.icon;

              return (
                <Card key={order.id}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {restaurantNames[order.restaurantId] ||
                            'Restaurant'}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.color}`}
                      >
                        <StatusIcon size={16} />
                        <span className="font-medium text-sm">
                          {config.label}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Delivery Address
                        </span>

                        <span className="font-medium text-gray-900 text-right max-w-xs">
                          {order.deliveryAddress}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone</span>

                        <span className="font-medium text-gray-900">
                          {order.phone}
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total Amount</span>

                        <span className="text-emerald-600">
                          ₹{(order.totalAmount ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package
              className="mx-auto text-gray-300 mb-4"
              size={64}
            />

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>

            <p className="text-gray-500">
              Start ordering to see your order history here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}