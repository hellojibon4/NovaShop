import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product, _variant = 'standard' }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white dark:bg-[#151828] rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.12)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Image Section */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100/80 dark:bg-[#1A1D2D] mb-3">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white bg-gradient-to-r from-violet-600 to-pink-500 rounded-full shadow-sm">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          type="button"
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            isLiked
              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/80 shadow-sm'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-300'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover (desktop) */}
        <button
          onClick={handleAddToCart}
          type="button"
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] py-2 bg-slate-900/90 dark:bg-violet-600/90 hover:bg-violet-600 dark:hover:bg-violet-500 text-white rounded-xl text-xs font-semibold backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 translate-y-2 group-hover:translate-y-0"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </>
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1">
        {/* Category / Subcategory & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 truncate">
            {product.subcategory || product.category}
          </span>
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.id}`}
          className="font-semibold text-sm text-slate-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1 mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Optional Colors row */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.slice(0, 4).map((c) => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(c);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === c
                    ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-slate-900 scale-110'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Bottom Price & Add to Cart button */}
        <div className="mt-auto pt-1.5 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            type="button"
            aria-label="Add to cart"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              isAdded
                ? 'bg-emerald-500 text-white scale-105'
                : 'bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white dark:bg-violet-900/40 dark:text-violet-300 dark:hover:bg-violet-600 dark:hover:text-white'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
