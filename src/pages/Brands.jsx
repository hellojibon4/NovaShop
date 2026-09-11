import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/Common/ProductCard';

export default function Brands() {
  const brands = [
    { name: 'Nike', category: 'Athletic Footwear & Apparel', count: 3, logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
    { name: 'Apple', category: 'Smart Tech & Wearables', count: 2, logo: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&auto=format&fit=crop&q=80' },
    { name: 'Chanel', category: 'Haute Parfumerie & Beauty', count: 1, logo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&auto=format&fit=crop&q=80' },
    { name: 'Sony', category: 'Audiophile Sound', count: 1, logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80' },
    { name: 'NovaStudio', category: 'Contemporary Lifestyle', count: 6, logo: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80' },
    { name: 'LuxeCove', category: 'Fine Vegan Leathercraft', count: 3, logo: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80' },
    { name: 'Ray-Ban', category: 'Heritage Eyewear', count: 1, logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80' },
    { name: 'Dyson', category: 'Innovative Haircare & Tech', count: 1, logo: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&auto=format&fit=crop&q=80' },
  ];

  const [selectedBrand, setSelectedBrand] = useState('All');

  const filteredProducts = selectedBrand === 'All'
    ? products
    : products.filter(p => p.brand === selectedBrand);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Brands
            </h1>
            <p className="text-xs text-slate-400">
              Curated official labels and artisan studios worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Brand Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedBrand('All')}
          className={`p-4 rounded-2xl border text-center transition-all ${
            selectedBrand === 'All'
              ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
              : 'border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#151828] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <span className="font-bold text-sm block">All Brands</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">{products.length} Products</span>
        </button>

        {brands.map((b) => (
          <button
            key={b.name}
            onClick={() => setSelectedBrand(b.name)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              selectedBrand === b.name
                ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20'
                : 'border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#151828] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="font-bold text-sm block">{b.name}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">{b.category}</span>
          </button>
        ))}
      </div>

      {/* Products under selected brand */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
          {selectedBrand === 'All' ? 'Products from All Brands' : `Products by ${selectedBrand}`} ({filteredProducts.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
