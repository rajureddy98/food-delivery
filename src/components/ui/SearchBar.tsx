import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ onSearch, className = '', ...props }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        placeholder="Search for restaurants or cuisines..."
        {...props}
      />
    </div>
  );
}
