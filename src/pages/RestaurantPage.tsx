import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { AuthModal } from '../components/auth/AuthModal';
import type { Restaurant, MenuItem, Category } from '../types';
import { fetchRestaurant, listMenuItems, listCategories } from '../services/backend';

interface RestaurantPageProps {
  restaurantId: string;
  onBack: () => void;
}

export function RestaurantPage({ restaurantId, onBack }: RestaurantPageProps) {
  const { user } = useAuth();
  const { addToCart, restaurant: cartRestaurant } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  useEffect(() => {
    loadMenuItems();
  }, [restaurantId, selectedCategory]);

  const loadRestaurantData = async () => {
    setLoading(true);

    try {
      const [restaurantData, categoryData] = await Promise.all([
        fetchRestaurant(restaurantId),
        listCategories(),
      ]);

      setRestaurant(restaurantData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      const items = await listMenuItems(
        restaurantId,
        selectedCategory ?? undefined
      );

      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      setMenuItems([]);
    }
  };

  const handleAddToCart = async (item: MenuItem) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (cartRestaurant && cartRestaurant.id !== restaurantId) {
      if (
        !confirm(
          'Your cart contains items from another restaurant. Clear cart and add this item?'
        )
      ) {
        return;
      }
    }

    try {
      await addToCart(item, restaurantId);
    } catch (error) {
      console.error(error);
      alert('Failed to add item to cart');
    }
  };

  const groupedItems = categories.reduce((acc, category) => {
    const items = menuItems.filter(
      (item) => item.categoryId === category.id
    );

    if (items.length > 0) {
      acc[category.name] = items;
    }

    return acc;
  }, {} as Record<string, MenuItem[]>);

  // TEMP DEBUG
  console.log('Restaurant:', restaurant);
  console.log('Menu Items:', menuItems);
  console.log('Categories:', categories);
  console.log('Grouped Items:', groupedItems);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Restaurant not found
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="relative h-64 overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            onClick={onBack}
            className="absolute top-4 left-4 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm -mt-16 relative z-10 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>

            <p className="text-gray-600 mb-4">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Star
                  className="text-yellow-500 fill-yellow-500"
                  size={18}
                />
                <span className="font-medium">
                  {restaurant.rating}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={18} />
                <span>{restaurant.deliveryTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span>{restaurant.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="text-blue-600" size={20} />

              <span className="text-sm text-blue-900">
                Minimum order: ₹{restaurant.minOrder}
                {' • '}
                Delivery fee: ₹{restaurant.deliveryFee}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All Items
              </button>

              {categories.map((category) => {
                const count = menuItems.filter(
                  (item) => item.categoryId === category.id
                ).length;

                if (count === 0) return null;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pb-8">
            {Object.entries(groupedItems).map(
              ([categoryName, items]) => (
                <div
                  key={categoryName}
                  className="mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {categoryName}
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={() =>
                          handleAddToCart(item)
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            )}

            {menuItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500">
                  No items available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}