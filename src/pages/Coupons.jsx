import React, { useState } from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import { couponsData } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Coupons() {
  const { applyCoupon, appliedCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Promos & Coupons
            </h1>
            <p className="text-xs text-slate-400">
              Apply coupon vouchers with 1-click for instant discount savings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {couponsData.map((c) => {
          const isApplied = appliedCoupon?.code === c.code;
          return (
            <div
              key={c.code}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isApplied
                  ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/40 ring-2 ring-violet-500/20 shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#151828] shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600 bg-violet-100 dark:bg-violet-900/60 px-2.5 py-0.5 rounded-full">
                    {c.type === 'percentage' ? `${c.discount}% Discount` : `$${c.discount} Discount`}
                  </span>
                  {isApplied && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Active in Cart
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {c.code}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {c.desc}
                </p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                type="button"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  copiedCode === c.code || isApplied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20'
                }`}
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied & Applied!</span>
                  </>
                ) : isApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Order</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy & Apply Code</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
