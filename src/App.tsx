import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { RestaurantPage } from './pages/RestaurantPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { CartSidebar } from './components/cart/CartSidebar';
import { CheckoutModal } from './components/checkout/CheckoutModal';

type Page = 'home' | 'restaurant' | 'profile' | 'orders';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSelectRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('restaurant');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedRestaurantId(null);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setCurrentPage('orders');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={() => setShowCart(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onOrdersClick={() => setCurrentPage('orders')}
          />

          {currentPage === 'home' && (
            <HomePage onSelectRestaurant={handleSelectRestaurant} />
          )}

          {currentPage === 'restaurant' && selectedRestaurantId && (
            <RestaurantPage
              restaurantId={selectedRestaurantId}
              onBack={handleBackToHome}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage onBack={handleBackToHome} />
          )}

          {currentPage === 'orders' && (
            <OrdersPage onBack={handleBackToHome} />
          )}

          <CartSidebar
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />

          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            onSuccess={handleOrderSuccess}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
