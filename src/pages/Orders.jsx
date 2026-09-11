import React from 'react';
import { Package } from 'lucide-react';

export default function Orders() {
  const orders = [
    {
      id: 'NV-82914',
      date: 'May 10, 2026',
      total: 413.07,
      status: 'In Transit',
      statusColor: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
      items: [
        { name: 'Air Max 270 React', qty: 1, price: 129.99, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80' },
        { name: 'Chanel Chance Eau Tendre EDP', qty: 1, price: 135.00, img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&auto=format&fit=crop&q=80' },
        { name: 'Minimalist Shoulder Bag', qty: 1, price: 79.00, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=80' },
      ],
      step: 3
    },
    {
      id: 'NV-79402',
      date: 'April 22, 2026',
      total: 349.99,
      status: 'Delivered',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
      items: [
        { name: 'Sony WH-1000XM5 Wireless Headphones', qty: 1, price: 349.99, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80' },
      ],
      step: 4
    }
  ];

  const steps = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Orders & Shipments
            </h1>
            <p className="text-xs text-slate-400">
              Track active packages, view delivery receipts, and request returns
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-[#151828] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-5"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  Order #{order.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-4">
                <span>Placed on {order.date}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stepper tracking visual */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((s, idx) => {
                  const isDone = idx + 1 <= order.step;
                  const isCurrent = idx + 1 === order.step;
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
                            ? 'text-violet-600 dark:text-violet-400'
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

            {/* Ordered Items Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-[#181C2C] border border-slate-200/60 dark:border-slate-800/80"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl bg-white shrink-0"
                  />
                  <div className="min-w-0 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-slate-400">Qty: {item.qty} • ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
