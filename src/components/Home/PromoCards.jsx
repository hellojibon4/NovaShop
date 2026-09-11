import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Truck, Sparkles } from 'lucide-react';

export default function PromoCards() {
  // Live countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 45, seconds: 18 }; // Reset cycle
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n) => String(n).padStart(2, '0');

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Flash Sale */}
        <Link
          to="/deals"
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-rose-50 to-pink-100/70 dark:from-rose-950/30 dark:to-pink-900/20 border border-rose-100/80 dark:border-rose-900/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-rose-500 stroke-rose-500 animate-pulse" />
              <span>Flash Sale</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              Limited time deals
            </h3>
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Up to 50% OFF
            </p>

            {/* Countdown Badge */}
            <div className="pt-2 flex items-center gap-1 font-mono text-xs font-bold text-white">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 shadow-xs">
                {formatDigits(timeLeft.hours)}
              </span>
              <span className="text-rose-600 dark:text-rose-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-600 shadow-xs">
                {formatDigits(timeLeft.minutes)}
              </span>
              <span className="text-rose-600 dark:text-rose-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-600 shadow-xs">
                {formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>

          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80"
              alt="Flash Sale Bag"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Card 2: Free Shipping */}
        <Link
          to="/products"
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-blue-100/70 dark:from-indigo-950/30 dark:to-blue-900/20 border border-indigo-100/80 dark:border-indigo-900/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide">
              <Truck className="w-3.5 h-3.5" />
              <span>Fast Delivery</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              Free Shipping
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              On orders over $50
            </p>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>Shop now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80"
              alt="Free Shipping Package"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Card 3: New Arrivals */}
        <Link
          to="/new-arrivals"
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-yellow-100/70 dark:from-amber-950/30 dark:to-yellow-900/20 border border-amber-100/80 dark:border-amber-900/40 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
        >
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Dropped</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              New Arrivals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check out the latest trends
            </p>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
              <span>Shop now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&auto=format&fit=crop&q=80"
              alt="New Arrivals Eyewear"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
