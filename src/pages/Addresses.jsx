import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, Trash2, Home, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserAddresses, saveUserAddresses } from '../services/addressService';

export default function Addresses() {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getUserAddresses(currentUser?.uid);
      setAddresses(res.addresses || []);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) return;
    const item = {
      id: 'addr-' + Date.now(),
      ...newAddr,
      name: newAddr.name || currentUser?.displayName || currentUser?.userName || 'Customer',
      phone: newAddr.phone || currentUser?.phone || '',
      isDefault: addresses.length === 0
    };
    const updated = [...addresses, item];
    setAddresses(updated);
    setShowForm(false);
    setNewAddr({ type: 'Home', name: '', phone: '', street: '', city: '', state: '', zip: '' });
    await saveUserAddresses(currentUser?.uid, updated);
  };

  const setDefault = async (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    await saveUserAddresses(currentUser?.uid, updated);
  };

  const deleteAddr = async (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    await saveUserAddresses(currentUser?.uid, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shipping Addresses
            </h1>
            <p className="text-xs text-slate-400">
              Manage your delivery locations and billing destinations
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAddress} className="p-6 rounded-3xl bg-white dark:bg-[#161926] border border-violet-200 dark:border-violet-900/50 shadow-md space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">New Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              placeholder="Recipient Full Name"
              value={newAddr.name}
              onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
              required
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newAddr.phone}
              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
              required
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={newAddr.street}
              onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
              required
              className="sm:col-span-2 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <input
              type="text"
              placeholder="City"
              value={newAddr.city}
              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
              required
              className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="State (e.g. CA)"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                required
                className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={newAddr.zip}
                onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                required
                className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3">Loading your addresses...</p>
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="max-w-md mx-auto py-16 text-center bg-white dark:bg-[#151828] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">No Addresses Saved Yet</h2>
          <p className="text-xs text-slate-400">Add your first shipping address for fast checkout.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => {
            const Icon = addr.type === 'Office' ? Briefcase : Home;
            return (
              <div
                key={addr.id}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  addr.isDefault
                    ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 ring-2 ring-violet-500/20 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-[#151828]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {addr.type}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Default Delivery
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{addr.name}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-slate-400 pt-1">{addr.phone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="font-bold text-violet-600 hover:underline"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">Primary Address</span>
                  )}
                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddr(addr.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
