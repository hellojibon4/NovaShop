import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, cancelOrder } from '../services/orderService';

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getUserOrders(currentUser?.uid);
    if (res.success && res.orders) {
      setOrders(res.orders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(orderId, 'User requested cancellation');
      fetchOrders();
    }
  };

  const steps = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Orders & Shipments
            </h1>
            <p className="text-xs text-slate-400">
              Track active packages, view delivery receipts, and manage orders
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center bg-white dark:bg-[#151828] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No orders placed yet</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            When you place an order, you will be able to track live delivery status right here.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderTotal = Number(order.totalAmount || order.total || 0);
            const currentStep = order.status === 'Cancelled' ? 0 : (order.step || 2);

            return (
              <div
                key={order.id || order.orderId}
                className="bg-white dark:bg-[#151828] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-5"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      Order #{order.id || order.orderId}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Cancelled'
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                          : order.status === 'Delivered'
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-violet-600 bg-violet-50 dark:bg-violet-950/40'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                    <span>Placed on {order.date}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      ${orderTotal.toFixed(2)}
                    </span>
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(order.id || order.orderId)}
                        type="button"
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Stepper tracking visual */}
                {order.status !== 'Cancelled' ? (
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 relative">
                      {steps.map((s, idx) => {
                        const isDone = idx + 1 <= currentStep;
                        const isCurrent = idx + 1 === currentStep;
                        return (
                          <div key={s} className="text-center space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone
                                  ? 'bg-gradient-to-r from-violet-600 to-purple-600'
                                  : 'bg-slate-100 dark:bg-slate-800'
                              }`}
                            />
                            <span
                              className={`text-[11px] font-semibold block ${
                                isCurrent
                                  ? 'text-violet-600 dark:text-violet-400 font-bold'
                                  : isDone
                                  ? 'text-slate-700 dark:text-slate-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {s}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>This order was cancelled. {order.cancelReason || ''}</span>
                  </div>
                )}

                {/* Ordered Items Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-[#181C2C] border border-slate-200/60 dark:border-slate-800/80"
                    >
                      <img
                        src={item.image || item.img || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl bg-white shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-slate-400">
                          Qty: {item.quantity || item.qty || 1} • ${(Number(item.price) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
