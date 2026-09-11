import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Heart,
  Bell,
  ChevronDown,
  Menu,
  User,
  Package,
  Settings,
  LogOut,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { products } from '../../data/products';

export default function Header({ onOpenSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { wishlistCount } = useWishlist();
  const { totalItemsCount, toggleCart } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Filter preview items for live search
  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/95 dark:bg-[#121522]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-colors duration-200 flex items-center">
      <div className="flex items-center justify-between gap-4 lg:gap-6 w-full max-w-[1920px] mx-auto">
        {/* Left: Branding Logo (NovaShop E-MARKETPLACE) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onOpenSidebar}
            type="button"
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Main Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Nova<span className="text-violet-600 dark:text-violet-400">Shop</span>
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
                E-MARKETPLACE
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 sm:mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search for products, brands and more..."
              className="w-full pl-4 pr-11 py-2.5 bg-slate-100/80 dark:bg-[#1A1D2D] border border-slate-200/80 dark:border-slate-700/70 rounded-full text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors shadow-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Real-time search dropdown results */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1D2D] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 z-[110] overflow-hidden">
              <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Matching Products</span>
                <button
                  type="button"
                  onClick={() => setShowSearchResults(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="space-y-1">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {p.subcategory || p.category}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                        ${p.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2 text-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    View all results for &quot;{searchQuery}&quot; &rarr;
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No products found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Area: Wishlist | 🔔 | Alina Putri | 🛍 My Cart (4) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          {/* Quick Theme Switch */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-violet-600" />
            )}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Wishlist"
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold hidden md:inline">Wishlist</span>
          </Link>

          {/* Notification Center */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#121522]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1A1D2D] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-3 z-[110]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    Notifications
                  </h5>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300 rounded-md">
                    2 New
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Summer Sale is Live! ☀️
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Use code <strong className="text-violet-600 dark:text-violet-400">SAVE10</strong> for 10% off.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">10m ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Order #NV-82914 Shipped
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Your package is out for delivery with Express Tracking.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">2h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Section (Alina Putri) with High Z-Index Dropdown */}
          <div ref={profileRef} className="relative z-[90]">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              type="button"
              className="flex items-center gap-2 p-1 sm:px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Alina Putri"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/30"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline">
                Alina Putri
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
            </button>

            {/* Profile Dropdown: Must open cleanly ABOVE the cart section */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#151828] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-700/80 py-2 z-[110] transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">Alina Putri</p>
                  <p className="text-xs text-slate-400">alina.putri@novashop.com</p>
                </div>

                {/* Navigation Items with Lucide Icons */}
                <div className="py-1.5 space-y-0.5">
                  <Link
                    to="/account-settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    <User className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    <Package className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/account-settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>Account Settings</span>
                  </Link>
                </div>

                {/* Log Out Button */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 🛍 My Cart (4) Section */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1280) {
                // Desktop: smoothly highlight/pulse cart container
                const el = document.getElementById('cart-sidebar-container');
                if (el) {
                  el.classList.add('ring-2', 'ring-violet-500');
                  setTimeout(() => el.classList.remove('ring-2', 'ring-violet-500'), 1000);
                }
              } else {
                toggleCart();
              }
            }}
            type="button"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all cursor-pointer group shrink-0"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>My Cart ({totalItemsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
