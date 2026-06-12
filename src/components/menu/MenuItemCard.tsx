import { Plus, Leaf } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          {item.is_vegetarian && (
            <Leaf className="text-green-600 flex-shrink-0" size={18} />
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
          <Button
            size="sm"
            onClick={onAddToCart}
            disabled={!item.is_available}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>
        {!item.is_available && (
          <p className="text-red-500 text-sm mt-2">Currently unavailable</p>
        )}
      </div>
      <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    </Card>
  );
}
