import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RatingStars from '../components/Common/RatingStars';
import ProductCard from '../components/Common/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.id === id) || products[0];
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(product.id);

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to results</span>
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-[#151828] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800/90 shadow-sm">
        {/* Left: Big Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100/80 dark:bg-[#1A1D2D] border border-slate-200/80 dark:border-slate-700/80">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 rounded-full shadow-md">
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-3 py-1 rounded-full">
                {product.brand || 'NovaShop Exclusive'}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                type="button"
                className={`p-2.5 rounded-full border transition-all ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/50 dark:border-rose-900'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} reviews={product.reviews} size={16} />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-slate-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Color Variant
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                        selectedColor === c
                          ? 'ring-2 ring-violet-600 ring-offset-2 dark:ring-offset-slate-900 scale-110 shadow-sm'
                          : 'border border-slate-200 dark:border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      {selectedColor === c && (
                        <Check
                          className="w-3.5 h-3.5"
                          style={{
                            color: c === '#FFFFFF' ? '#000000' : '#FFFFFF',
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/60 px-2 py-1.5 shrink-0 justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                type="button"
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-violet-500/25'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200/60 dark:border-slate-800/80">
              <Truck className="w-4 h-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Free Shipping</p>
              <p className="text-[10px] text-slate-400">Orders over $50</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200/60 dark:border-slate-800/80">
              <RotateCcw className="w-4 h-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">30-Day Returns</p>
              <p className="text-[10px] text-slate-400">Hassle-free guarantee</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200/60 dark:border-slate-800/80">
              <ShieldCheck className="w-4 h-4 mx-auto text-violet-600 dark:text-violet-400 mb-1" />
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Authentic</p>
              <p className="text-[10px] text-slate-400">100% Genuine product</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Related in {product.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
