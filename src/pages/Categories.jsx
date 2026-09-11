import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Laptop, Home, Activity, Glasses, ArrowRight } from 'lucide-react';
import { products } from '../data/products';

export default function Categories() {
  const categoryCards = [
    {
      id: 'fashion',
      name: 'Fashion & Apparel',
      desc: 'Contemporary clothing, sneakers, jackets, and timeless silhouettes.',
      icon: Shirt,
      color: 'from-pink-500/20 to-purple-500/20',
      iconColor: 'text-pink-600',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Fashion').length
    },
    {
      id: 'beauty',
      name: 'Beauty & Skincare',
      desc: 'Radiant skincare serums, viral makeup, and signature fragrances.',
      icon: Sparkles,
      color: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-600',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Beauty').length
    },
    {
      id: 'electronics',
      name: 'Electronics & Audio',
      desc: 'State-of-the-art headphones, smartwatches, tablets, and keyboards.',
      icon: Laptop,
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Electronics').length
    },
    {
      id: 'home-living',
      name: 'Home & Living',
      desc: 'Artisanal ceramics, aromatherapy diffusers, and linen blankets.',
      icon: Home,
      color: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-600',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Home & Living').length
    },
    {
      id: 'sports',
      name: 'Sports & Activewear',
      desc: 'Performance leggings, pro yoga mats, and insulated hydration gear.',
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Sports').length
    },
    {
      id: 'accessories',
      name: 'Bags & Accessories',
      desc: 'Statement eyewear, leather cardholders, and fine jewelry chains.',
      icon: Glasses,
      color: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-600',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80',
      count: products.filter(p => p.category === 'Accessories').length
    }
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore our handpicked curation spanning daily lifestyle, luxury fashion, and tech
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center shadow-md">
                  <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                </div>
                <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                  {cat.count} Products
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
