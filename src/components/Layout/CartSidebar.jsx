import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Minus,
  Plus,
  Trash2,
  Lock,
  ArrowRight,
  Heart,
  Tag,
  Check,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { products } from '../../data/products';

export default function CartSidebar() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    shipping,
    total,
    totalItemsCount,
    isCartOpen,
    closeCart
  } = useCart();

  const { isInWishlist, toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  // Mini recommendations: Ray-Ban Wayfarer and Nike Air Force 1
  const miniRecommendations = [
    products.find((p) => p.id === 'ray-ban-wayfarer') || products[9],
    products.find((p) => p.id === 'nike-air-force-1') || products[10],
  ].filter(Boolean);

  // Recently viewed: Watch, Purple hoodie, Green bag, Perfume
  const recentlyViewed = [
    products.find((p) => p.id === 'apple-watch-series-9') || products[1],
    products.find((p) => p.id === 'lavender-crop-hoodie') || products[11],
    products.find((p) => p.id === 'emerald-green-bag') || products[12],
    products.find((p) => p.id === 'chanel-chance-eau-tendre') || products[2],
  ].filter(Boolean);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 xl:hidden transition-opacity"
        />
      )}

      {/* Cart Container */}
      <aside
        id="cart-sidebar-container"
        className={`fixed top-[72px] right-0 bottom-0 z-30 w-88 bg-white dark:bg-[#121522] border-l border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out xl:translate-x-0 ${
          isCartOpen ? 'translate-x-0 shadow-2xl z-50 top-0 xl:top-[72px]' : 'translate-x-full xl:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Cart Header (Section 11) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>My Cart</span>
                  <span className="text-violet-600 dark:text-violet-400 font-black">({totalItemsCount})</span>
                </h3>
                <p className="text-[10px] text-slate-400">Order bag preview</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={closeCart}
              type="button"
              className="xl:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-500 flex items-center justify-center mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Your cart is empty
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explore our catalog to add items.
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="mt-3 inline-block px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-violet-700 transition-colors"
              >
                Shop Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => {
                const isLiked = isInWishlist(item.product.id);
                return (
                  <div
                    key={`${item.product.id}-${item.selectedColor || idx}`}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#181C2C] border border-slate-100 dark:border-slate-800/80 group relative transition-colors"
                  >
                    <Link
                      to={`/products/${item.product.id}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-13 h-13 object-cover rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/products/${item.product.id}`}
                          onClick={closeCart}
                          className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 line-clamp-1 truncate"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleWishlist(item.product)}
                            type="button"
                            className={`p-0.5 transition-colors ${
                              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                            }`}
                            title={isLiked ? 'In Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                            type="button"
                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 truncate">
                        {item.product.subcategory || item.product.category}
                      </p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-[#121522]">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1, item.selectedColor)}
                            type="button"
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-l-md transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1, item.selectedColor)}
                            type="button"
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-r-md transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Coupon Section (Section 12) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1.5">
              Promo Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      {appliedCoupon.code} Applied
                    </p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400">
                      {appliedCoupon.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  type="button"
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. SAVE10)"
                    className="w-full pl-7 pr-2 py-1.5 bg-slate-100/80 dark:bg-[#1A1D2D] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[10px] text-rose-500 mt-1 font-medium">{couponError}</p>
            )}
          </div>

          {/* Cart Summary (Section 13) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Shipping</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {shipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total</span>
              <span className="text-base text-violet-600 dark:text-violet-400">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button (Section 14) */}
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            type="button"
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition-all duration-200 group/checkout cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Checkout ({totalItemsCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/checkout:translate-x-1 transition-transform" />
          </button>

          {/* Payment Methods (Section 15) */}
          <div className="pt-1 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="text-[9px] font-bold tracking-widest uppercase">VISA</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">•</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">MC</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">•</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">PAYPAL</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">•</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">PAY</span>
          </div>

          {/* You Might Also Like Section (Section 16) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
              You might also like
            </h5>
            <div className="space-y-1.5">
              {miniRecommendations.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/80 dark:bg-[#181C2C] border border-slate-100 dark:border-slate-800/60"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/products/${product.id}`}
                        onClick={closeCart}
                        className="text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:text-violet-600 block truncate"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    type="button"
                    title="Add to cart"
                    className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 hover:bg-violet-600 hover:text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed (Section 17) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
              Recently Viewed
            </h5>
            <div className="grid grid-cols-4 gap-1.5">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  onClick={closeCart}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:ring-2 hover:ring-violet-500 transition-all"
                  title={item.name}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
