import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0, reviews, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center text-amber-400">
        <Star className="fill-amber-400 stroke-amber-400" style={{ width: size, height: size }} />
      </div>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{Number(rating).toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-slate-400 dark:text-slate-500">({reviews})</span>
      )}
    </div>
  );
}
