import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/Common/ProductCard';
import PromoCards from '../components/Home/PromoCards';

export default function Deals() {
  const dealProducts = products.filter((p) => p.discount > 0 || p.bestDeal);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
            <span>Exclusive Clearance & Flash Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Save Up to 50% Off Everything
          </h1>
          <p className="text-xs sm:text-sm text-purple-100">
            Limited quantity prices on trending sneakers, luxury beauty fragrances, smart tech, and seasonal fashion.
          </p>
        </div>
        <div className="text-center sm:text-right bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <span className="text-xs text-purple-200 block">Use Promo Code</span>
          <span className="text-2xl font-black tracking-widest text-amber-300">SAVE10</span>
          <span className="text-[10px] text-purple-200 block mt-0.5">For an extra 10% off at checkout</span>
        </div>
      </div>

      <PromoCards />

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              All Discounted Deals ({dealProducts.length} items)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {dealProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
