import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ThumbsUp } from 'lucide-react';
import { products } from '../../data/products';
import ProductCard from '../Common/ProductCard';

export default function RecommendedSection() {
  const recommendedProducts = [
    products.find((p) => p.id === 'oversized-cotton-shirt') || products[4],
    products.find((p) => p.id === 'minimalist-shoulder-bag') || products[5],
    products.find((p) => p.id === 'the-ordinary-niacinamide') || products[6],
    products.find((p) => p.id === 'fossil-gen-6-smartwatch') || products[7],
  ].filter(Boolean);

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recommended for You
            </h2>
            <p className="text-xs text-slate-400">Hand-picked picks tailored to your style</p>
          </div>
        </div>

        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} variant="recommended" />
        ))}
      </div>
    </section>
  );
}
