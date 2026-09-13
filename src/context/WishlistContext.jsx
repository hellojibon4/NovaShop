import React, { createContext, useContext, useState, useEffect } from 'react';
import { products } from '../data/products';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('novashop_wishlist');
      if (saved !== null) return JSON.parse(saved);
      const hasVisited = localStorage.getItem('novashop_visited');
      if (hasVisited) return [];
      return [
        products.find(p => p.id === 'apple-watch-series-9') || products[1],
        products.find(p => p.id === 'sony-wh-1000xm5') || products[3]
      ].filter(Boolean);
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Listen for global logout event to purge wishlist immediately
  useEffect(() => {
    const handleLogout = () => {
      setWishlist([]);
      try {
        localStorage.removeItem('novashop_wishlist');
      } catch {
        // ignore
      }
    };

    window.addEventListener('novashop:logout', handleLogout);
    return () => window.removeEventListener('novashop:logout', handleLogout);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('novashop_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`Added "${product.name}" to wishlist ❤️`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem('novashop_wishlist');
    } catch {
      // ignore
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        toastMessage
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
