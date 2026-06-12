import { useState } from 'react';
import { ShoppingCart, User, LogOut, UtensilsCrossed, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../ui/Button';

interface HeaderProps {
  onCartClick: () => void;
  onProfileClick: () => void;
  onOrdersClick: () => void;
}

export function Header({ onCartClick, onProfileClick, onOrdersClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { getItemCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const itemCount = getItemCount();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="text-emerald-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">FoodExpress</h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={onCartClick}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart size={24} className="text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={24} className="text-gray-700" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <button
                        onClick={() => {
                          onProfileClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <User size={18} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onOrdersClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Package size={18} />
                        My Orders
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
