import React from 'react';
import { ShieldCheck, RotateCcw, Headphones, Star } from 'lucide-react';

export default function TrustFeatures() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: '100% secure payment',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-100 dark:bg-violet-900/30'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '30-day return policy',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      subtitle: 'Dedicated support',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      icon: Star,
      title: 'Trusted by Thousands',
      subtitle: '4.8 average rating',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    }
  ];

  return (
    <section className="my-10">
      <div className="rounded-2xl sm:rounded-3xl bg-violet-50/70 dark:bg-violet-950/20 border border-violet-100/80 dark:border-violet-900/30 p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className={`w-11 h-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
