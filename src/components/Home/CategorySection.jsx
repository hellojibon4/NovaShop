import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shirt,
  Sparkles,
  Laptop,
  Home,
  Activity,
  MoreHorizontal
} from 'lucide-react';

const categories = [
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    bgLight: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-300',
    ringColor: 'group-hover:ring-pink-400'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: Sparkles,
    bgLight: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300',
    ringColor: 'group-hover:ring-purple-400'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    bgLight: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
    ringColor: 'group-hover:ring-blue-400'
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    icon: Home,
    bgLight: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    ringColor: 'group-hover:ring-amber-400'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Activity,
    bgLight: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    ringColor: 'group-hover:ring-emerald-400'
  },
  {
    id: 'accessories',
    name: 'More',
    icon: MoreHorizontal,
    bgLight: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300',
    ringColor: 'group-hover:ring-violet-400'
  }
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="my-8">
      <div className="flex items-center justify-between gap-3 overflow-x-auto py-2 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              type="button"
              className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 min-w-[76px] sm:min-w-[90px] transition-all"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${cat.bgLight} group-hover:scale-110 group-hover:shadow-md ring-2 ring-transparent ${cat.ringColor}`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-center">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
