import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shipping,
    total,
    totalItemsCount
  } = useCart();

  const [couponInput, setCouponInput] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center bg-white dark:bg-[#161926] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your shopping cart is empty</h2>
        <p className="text-xs text-slate-400">Discover premium fashion, beauty & lifestyle items to fill your bag.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Shopping Cart ({totalItemsCount} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-50 shrink-0"
                />
                <div>
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-violet-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-slate-400">{item.product.subcategory || item.product.category}</p>
                  <p className="text-sm font-extrabold text-violet-600 mt-1">${item.product.price.toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1, item.selectedColor)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-xl"
                  >
                    <Minus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1, item.selectedColor)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-xl"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>

                <span className="font-bold text-sm text-slate-900 dark:text-white w-20 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Order Summary</h3>

            {/* Promo Code Form */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{appliedCoupon.code} applied</span>
                <button onClick={removeCoupon} className="text-rose-500 font-semibold hover:underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (SAVE10)"
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase"
                />
                <button type="submit" className="px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shipping === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-violet-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
