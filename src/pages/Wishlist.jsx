import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/Common/RatingStars';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-slate-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#161926] rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Save items you love by tapping the heart icon on any product card.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-all"
          >
            <span>Discover Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#151828] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/90 shadow-sm flex flex-col justify-between group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100/80 dark:bg-[#1A1D2D] mb-3">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  type="button"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-xs transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {product.subcategory || product.category}
                  </span>
                  <RatingStars rating={product.rating} reviews={product.reviews} />
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 line-clamp-1 block"
                >
                  {product.name}
                </Link>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  type="button"
                  className="w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
