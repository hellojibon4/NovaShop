import React, { createContext, useContext, useState, useEffect } from 'react';
import { products, couponsData } from '../data/products';

const CartContext = createContext();

const initialCartItems = [
  {
    product: products.find(p => p.id === 'air-max-270-react') || products[0],
    quantity: 1,
    selectedColor: '#EF4444'
  },
  {
    product: products.find(p => p.id === 'chanel-chance-eau-tendre') || products[2],
    quantity: 1,
    selectedColor: '#F472B6'
  },
  {
    product: products.find(p => p.id === 'minimalist-shoulder-bag') || products[5],
    quantity: 1,
    selectedColor: '#475569'
  },
  {
    product: products.find(p => p.id === 'gentle-monster-sunglasses') || products[8],
    quantity: 1,
    selectedColor: '#18181B'
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('novashop_cart');
      if (saved !== null) return JSON.parse(saved);
      // If user has visited or session cleared, start empty
      const hasVisited = localStorage.getItem('novashop_visited');
      if (hasVisited) return [];
      localStorage.setItem('novashop_visited', 'true');
      return initialCartItems;
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('novashop_coupon');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Listen for global logout event to purge cart immediately
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setAppliedCoupon(null);
      try {
        localStorage.removeItem('novashop_cart');
        localStorage.removeItem('novashop_coupon');
      } catch {
        // ignore
      }
    };

    window.addEventListener('novashop:logout', handleLogout);
    return () => window.removeEventListener('novashop:logout', handleLogout);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('novashop_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('novashop_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('novashop_coupon');
      }
    } catch {
      // ignore
    }
  }, [appliedCoupon]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    setCartItems(prev => {
      const color = selectedColor || (product.colors && product.colors[0]) || null;
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedColor === color);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color }];
      }
    });
    showToast(`Added "${product.name}" to cart ✨`);
  };

  const removeFromCart = (productId, selectedColor = null) => {
    setCartItems(prev => prev.filter(item => {
      if (selectedColor) {
        return !(item.product.id === productId && item.selectedColor === selectedColor);
      }
      return item.product.id !== productId;
    }));
  };

  const updateQuantity = (productId, delta, selectedColor = null) => {
    setCartItems(prev => {
      return prev.map(item => {
        const matches = item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor);
        if (!matches) return item;
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('novashop_cart');
      localStorage.removeItem('novashop_coupon');
    } catch {
      // ignore
    }
  };

  const applyCoupon = (codeStr) => {
    const cleanCode = codeStr.trim().toUpperCase();
    const found = couponsData.find(c => c.code === cleanCode);
    if (found) {
      setAppliedCoupon(found);
      showToast(`Coupon "${found.code}" applied! 🎉`);
      return { success: true, message: `Coupon applied: ${found.desc}` };
    } else {
      return { success: false, message: 'Invalid coupon code. Try SAVE10 or NOVA20' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discount = Math.min(subtotal, appliedCoupon.discount);
    }
  }

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.00;
  const total = Math.max(0, subtotal - discount + (subtotal > 0 ? shipping : 0));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        total,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
