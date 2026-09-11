import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Home,
  LayoutGrid,
  Tag,
  Sparkles,
  TrendingUp,
  Award,
  Compass,
  Package,
  Heart,
  Ticket,
  MapPin,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  X,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Sidebar({ isOpen, onClose }) {
  const { isDark, toggleTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const mainNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
    { name: 'Deals', path: '/deals', icon: Tag, badge: 'Hot' },
    { name: 'New Arrivals', path: '/new-arrivals', icon: Sparkles },
    { name: 'Best Sellers', path: '/best-sellers', icon: TrendingUp },
    { name: 'Brands', path: '/brands', icon: Award },
    { name: 'Collections', path: '/collections', icon: Compass },
  ];

  const secondaryNavItems = [
    { name: 'My Orders', path: '/orders', icon: Package },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, count: wishlistCount },
    { name: 'Coupons', path: '/coupons', icon: Ticket, badge: 'SAVE10' },
    { name: 'Addresses', path: '/addresses', icon: MapPin },
    { name: 'Account Settings', path: '/account-settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 lg:top-[72px] left-0 bottom-0 z-40 w-64 bg-white dark:bg-[#121522] border-r border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo (Visible in mobile drawer; desktop navbar has main logo) */}
          <div className="flex items-center justify-between lg:hidden">
            <Link
              to="/"
              onClick={() => onClose && onClose()}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Nova<span className="text-violet-600 dark:text-violet-400">Shop</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block -mt-1">
                  E-Marketplace
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
              Menu
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                          isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
              Personal
            </p>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="text-[11px] px-2 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Sidebar Promo Card (Section 4) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-4 text-white shadow-lg shadow-violet-500/20">
            {/* Decorative background glow circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-sm pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-pink-400/20 rounded-full blur-md pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md">
                Special Offer
              </span>
              <div>
                <h4 className="text-base font-bold leading-tight">Summer Sale</h4>
                <p className="text-xs text-violet-100 font-medium mt-0.5">Up to 50% Off</p>
              </div>
              <button
                onClick={() => {
                  navigate('/deals');
                  if (onClose) onClose();
                }}
                className="w-full mt-2 py-2 px-3 bg-white text-violet-700 hover:bg-violet-50 font-bold text-xs rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Support & Theme Switch */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <Link
            to="/account-settings"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Need Help?</p>
              <p className="text-[11px] text-slate-400">24/7 Support Center</p>
            </div>
          </Link>

          {/* Theme Switch Control */}
          <button
            onClick={toggleTheme}
            type="button"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-violet-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">Switch &gt;</span>
          </button>
        </div>
      </aside>
    </>
  );
}
