import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Send,
  CheckCircle2,
  Heart
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="mt-16 bg-white dark:bg-[#161926] border-t border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Nova<span className="text-violet-600 dark:text-violet-400">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Shop smarter. Live better. Experience premium lifestyle, high fashion, beauty essentials, and tech marvels delivered to your door.
            </p>
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 pt-2">
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300 transition-colors">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#twitter" aria-label="X (Twitter)" className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300 transition-colors">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300 transition-colors">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/products" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Deals & Discounts
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/account-settings" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Shipping & Tracking
                </Link>
              </li>
              <li>
                <Link to="/account-settings" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Easy Returns (30 Days)
                </Link>
              </li>
              <li>
                <Link to="/coupons" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Coupons & Promos
                </Link>
              </li>
              <li>
                <Link to="/account-settings" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  FAQ & Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Thank you for subscribing! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 NovaShop Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for modern shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
