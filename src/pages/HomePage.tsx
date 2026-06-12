import { useEffect, useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryFilter } from '../components/restaurant/CategoryFilter';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { listRestaurants, listMenuItems } from '../services/backend';
import type { Restaurant } from '../types';

interface HomePageProps {
  onSelectRestaurant: (restaurantId: string) => void;
}

export function HomePage({ onSelectRestaurant }: HomePageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, selectedCategory]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await listRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = async () => {
    let filtered = [...restaurants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisines
          .split(',')
          .some(cuisine =>
            cuisine.trim().toLowerCase().includes(query)
          ) ||
          restaurant.location.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      try {
        const menuItems = await listMenuItems(undefined, selectedCategory);
        const restaurantIds = new Set(menuItems.map((item) => item.restaurant_id));
        filtered = filtered.filter((restaurant) =>
          restaurantIds.has(restaurant.id)
        );
      } catch (error) {
        console.error('Error filtering by category:', error);
      }
    }

    setFilteredRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order food from your favorite restaurants
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 mb-8">
            Fast delivery to your doorstep
          </p>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? 'Restaurants' : 'All Restaurants'}{' '}
            <span className="text-gray-500 text-lg">
              ({filteredRestaurants.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => onSelectRestaurant(restaurant.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No restaurants found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
