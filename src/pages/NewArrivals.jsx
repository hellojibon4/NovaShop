import React from 'react';
import { Sparkles } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/Common/ProductCard';

export default function NewArrivals() {
  const newItems = products.slice(0, 16);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h1>
            <p className="text-xs text-slate-400">
              Fresh silhouettes and innovative essentials added this week
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {newItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
