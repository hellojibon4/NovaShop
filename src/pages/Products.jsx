import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, Sparkles, X } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/Common/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(600);
  const [minRating, setMinRating] = useState(0);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home-living', name: 'Home & Living' },
    { id: 'sports', name: 'Sports' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const handleCategoryChange = (catId) => {
    const next = new URLSearchParams(searchParams);
    if (catId === 'all') {
      next.delete('category');
    } else {
      next.set('category', catId);
    }
    setSearchParams(next);
  };

  const handleClearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all') {
          const match = p.category.toLowerCase().replace(/\s+/g, '-').replace('&', '').includes(activeCategory);
          if (!match && p.category.toLowerCase() !== activeCategory) {
            return false;
          }
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q));
          if (!match) return false;
        }
        // Price filter
        if (p.price > priceRange) return false;
        // Rating filter
        if (p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discount - a.discount;
        return 0; // featured default
      });
  }, [activeCategory, searchQuery, priceRange, minRating, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> items
            {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#161926] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Category Pills + Search Filter Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/25'
                  : 'bg-white dark:bg-[#161926] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-semibold">
            <span>Search: &quot;{searchQuery}&quot;</span>
            <button onClick={handleClearSearch} className="hover:text-rose-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Secondary Filter Bar: Max Price & Rating */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/80 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-violet-600" />
          <span>Filters:</span>
        </div>

        {/* Max price slider */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">Max Price:</span>
          <input
            type="range"
            min="10"
            max="600"
            step="10"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-28 sm:w-36 accent-violet-600"
          />
          <span className="font-bold text-slate-800 dark:text-slate-200 w-12">
            ${priceRange}
          </span>
        </div>

        {/* Min rating */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Min Rating:</span>
          <div className="flex items-center gap-1">
            {[0, 4, 4.5, 4.8].map((rate) => (
              <button
                key={rate}
                onClick={() => setMinRating(rate)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                  minRating === rate
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {rate === 0 ? 'All' : `${rate}★+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-[#151828] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            No products match your criteria
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keyword, increasing max price, or selecting another category.
          </p>
          <button
            onClick={() => {
              setPriceRange(600);
              setMinRating(0);
              handleCategoryChange('all');
              handleClearSearch();
            }}
            className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
