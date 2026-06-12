import { Star, Clock, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  const cuisines = Array.isArray(restaurant.cuisines)
    ? restaurant.cuisines
    : restaurant.cuisines.split(',').map((c) => c.trim());

  return (
    <Card hoverable onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />

        {!restaurant.active && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-900">
              Currently Closed
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {restaurant.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Star
              className="text-yellow-500 fill-yellow-500"
              size={16}
            />
            <span className="font-medium">{restaurant.rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MapPin size={16} />
          <span>{restaurant.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Min Order: ₹{restaurant.minOrder}</span>
          <span>Delivery: ₹{restaurant.deliveryFee}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {cuisines.slice(0, 3).map((cuisine, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
            >
              {cuisine}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}