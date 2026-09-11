import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function Collections() {
  const collections = [
    {
      id: 'summer-solstice',
      title: 'Summer Solstice 2026',
      subtitle: 'Sun-kissed tones, airy linen silhouettes, and coastal relaxation.',
      itemsCount: '18 Items',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-amber-500/80 to-rose-600/80'
    },
    {
      id: 'urban-minimalism',
      title: 'Urban Monochrome & Tech',
      subtitle: 'Clean lines, matte finishes, smart audio, and everyday EDC carry.',
      itemsCount: '14 Items',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-slate-900/80 to-violet-900/80'
    },
    {
      id: 'clean-beauty',
      title: 'Dewy Glow & Skin First',
      subtitle: 'Nourishing botanical serums, gentle acids, and glass skin secrets.',
      itemsCount: '12 Items',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-pink-500/80 to-purple-600/80'
    },
    {
      id: 'zen-sanctuary',
      title: 'Zen Living & Artisan Homeware',
      subtitle: 'Earth-tone ceramics, linen throws, and relaxing ultrasonic aromas.',
      itemsCount: '10 Items',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-emerald-600/80 to-teal-800/80'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Collections
            </h1>
            <p className="text-xs text-slate-400">
              Editorial moodboards and thematic style guides
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 min-h-[280px] flex flex-col justify-end p-6 sm:p-8"
          >
            <img
              src={col.image}
              alt={col.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${col.gradient} opacity-90`} />

            <div className="relative z-10 space-y-2 text-white">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                {col.itemsCount}
              </span>
              <h3 className="text-2xl font-black">{col.title}</h3>
              <p className="text-xs text-white/90 max-w-md">{col.subtitle}</p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md hover:bg-white/90 transition-all"
                >
                  <span>Shop This Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
