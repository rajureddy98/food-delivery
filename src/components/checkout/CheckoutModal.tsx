import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { createOrder, createPaymentIntent } from '../../services/backend';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { user, profile } = useAuth();
  const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
  const [address, setAddress] = useState(profile?.default_address || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    setAddress(profile?.default_address || '');
    setPhone(profile?.phone || '');
  }, [profile]);

  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.delivery_fee || 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !restaurant) return;

    setLoading(true);
    setError('');
    setPaymentMessage('');

    try {
      const paymentIntent = await createPaymentIntent({
        userId: user.id,
        amount: total,
        metadata: {
          restaurantId: restaurant.id,
          userEmail: user.email,
        },
      });

      setPaymentMessage('Payment intent created successfully.');
      console.log('cartItems=', cartItems);
      const orderResponse = await createOrder({
        userId: user.id,
        restaurantId: restaurant.id,
        totalAmount: total,
        deliveryFee,
        deliveryAddress: address,
        phone,
        stripePaymentId: paymentIntent.paymentIntentId,
        items: cartItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.menu_item?.price || 0,
        itemName: item.menu_item?.name || '',
      })),
      });

      await clearCart();
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Checkout" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Input
          label="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          placeholder="Enter your delivery address"
          multiline
        />

        <Input
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="Enter your phone number"
        />

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
          <div className="space-y-4">
            <Input
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              placeholder="1234 5678 9012 3456"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                placeholder="MM/YY"
              />
              <Input
                label="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                placeholder="123"
              />
            </div>
          </div>
        </div>

        {paymentMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
            {paymentMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Place Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
