import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cartItems, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    fullName: 'Alina Putri',
    email: 'alina.putri@novashop.com',
    address: '42 Orchid Boulevard, Suite 300',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '08/28',
    cvv: '921'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newOrderNum = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderNum);
    setOrderPlaced(true);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#EC4899', '#3B82F6', '#10B981']
      });
    } catch {
      // ignore
    }

    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white dark:bg-[#161926] rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-xl space-y-5">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Thank you, {formData.fullName}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your order <strong className="text-slate-800 dark:text-slate-200">#{orderNumber}</strong> has been received and is being prepared with priority care.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Shipping Address:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.address}, {formData.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Confirmation Sent To:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Delivery:</span>
            <span className="font-semibold text-emerald-600">2-3 Business Days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to="/orders"
            className="flex-1 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-all text-center"
          >
            Track Order Status
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-white dark:bg-[#161926] rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-Bit Encrypted & Verified Transaction
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Shipping Address */}
          <div className="bg-white dark:bg-[#151828] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-600" />
              <span>1. Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white dark:bg-[#151828] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-violet-600" />
              <span>2. Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card', name: 'Credit Card', sub: 'Visa, MC, Amex' },
                { id: 'paypal', name: 'PayPal', sub: 'Fast & Secure' },
                { id: 'cod', name: 'Cash on Delivery', sub: 'Pay upon receipt' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    paymentMethod === m.id
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">{m.name}</p>
                  <p className="text-[10px] text-slate-400">{m.sub}</p>
                </button>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">Expiration</label>
                  <input
                    type="text"
                    name="expDate"
                    value={formData.expDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300">CVC / CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Confirmation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#151828] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Mini Items list */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-base text-violet-600 dark:text-violet-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Place Order (${total.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
