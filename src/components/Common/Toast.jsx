import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage: cartToast } = useCart();
  const { toastMessage: wishlistToast } = useWishlist();

  const activeMessage = cartToast || wishlistToast;

  if (!activeMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 animate-bounce transition-all">
      <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
        <CheckCircle className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium pr-2">{activeMessage}</p>
    </div>
  );
}
