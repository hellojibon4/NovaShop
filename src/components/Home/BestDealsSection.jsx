import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { products } from '../../data/products';
import ProductCard from '../Common/ProductCard';

export default function BestDealsSection() {
  const dealProducts = products.filter((p) => p.bestDeal).slice(0, 4);

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Best Deals for You
            </h2>
            <p className="text-xs text-slate-400">Exclusive prices on top rated items</p>
          </div>
        </div>

        <Link
          to="/deals"
          className="text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
