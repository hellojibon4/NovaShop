import React, { useState } from 'react';
import { Settings, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AccountSettings() {
  const { isDark, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alina Putri',
    email: 'alina.putri@novashop.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    orderAlerts: true,
    promoEmails: true,
    twoFactor: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Account Settings
            </h1>
            <p className="text-xs text-slate-400">
              Manage your personal info, notification preferences, and security
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              alt="Alina Putri"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-violet-500/20"
            />
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Alina Putri</h3>
              <p className="text-xs text-slate-400">NovaShop VIP Member • Joined 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Country / Region</label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">App Appearance & Theme</h3>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {isDark ? 'Dark Theme Active' : 'Light Theme Active'}
                </p>
                <p className="text-[11px] text-slate-400">Adjust the color scheme of the interface</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-violet-700"
            >
              Toggle Mode
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
