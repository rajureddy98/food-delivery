import { useEffect, useState } from 'react';
import { Pizza, Coffee, Soup, Beef, IceCream, Salad } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const iconMap: Record<string, typeof Pizza> = {
  pizza: Pizza,
  coffee: Coffee,
  soup: Soup,
  beef: Beef,
  dessert: IceCream,
  salad: Salad,
};

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium transition-all ${
          selectedCategory === null
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Pizza;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon size={18} />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
