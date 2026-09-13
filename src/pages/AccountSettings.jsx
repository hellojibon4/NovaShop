import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Settings,
  Moon,
  Sun,
  Check,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function AccountSettings() {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, updateUser, uploadAvatar, logout } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState({ type: '', text: '' });
  const [saveError, setSaveError] = useState('');

  // Initial state derived purely from currently logged-in user
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || currentUser.displayName || currentUser.userName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        country: currentUser.country || ''
      });
    }
  }, [currentUser]);

  // Calculate joined year dynamically from creation time or createdAt
  const getJoinedYear = () => {
    const rawDate = currentUser?.createdAt || currentUser?.creationTime;
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getFullYear())) {
        return parsed.getFullYear();
      }
    }
    return new Date().getFullYear();
  };

  const joinedYear = getJoinedYear();
  const userName = currentUser?.name || currentUser?.displayName || currentUser?.userName || profile.name || 'Shopper';
  const userAvatar =
    currentUser?.avatar ||
    currentUser?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7C3AED&color=fff`;

  // Profile Image Upload Handler (Storage path: profile-images/{uid}/profile.jpg)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setImageMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setImageMessage({ type: 'error', text: 'Image size should be less than 5MB.' });
      return;
    }

    setUploadingImage(true);
    setImageMessage({ type: '', text: '' });

    const res = await uploadAvatar(file);
    setUploadingImage(false);

    if (res.success) {
      setImageMessage({ type: 'success', text: 'Profile photo updated successfully!' });
      setTimeout(() => setImageMessage({ type: '', text: '' }), 3500);
    } else {
      setImageMessage({ type: 'error', text: res.error || 'Failed to upload photo. Please try again.' });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Profile Form Save Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');

    if (!currentUser) return;

    setSaving(true);
    const res = await updateUser({
      name: profile.name.trim(),
      displayName: profile.name.trim(),
      userName: profile.name.trim(),
      phone: profile.phone.trim(),
      country: profile.country.trim()
    });
    setSaving(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError(res.error || 'Failed to update profile.');
    }
  };

  // If user is not authenticated, show sign-in prompt
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white dark:bg-[#151828] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Please sign in to view and manage your profile details, shipping preferences, and security settings.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/25 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
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

      {/* Notifications */}
      {imageMessage.text && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs animate-in fade-in ${
            imageMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
          }`}
        >
          {imageMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{imageMessage.text}</span>
        </div>
      )}

      {saveError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dynamic Profile Header Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            {/* Profile Avatar with Camera Upload Badge */}
            <div className="relative group">
              <img
                src={userAvatar}
                alt={userName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-violet-500/20 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                title="Change Profile Photo"
                aria-label="Upload profile image"
              >
                {uploadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
            </div>

            {/* Dynamic Profile Header Info */}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {userName}
              </h3>
              <p className="text-xs text-slate-400">
                NovaShop Member • Joined {joinedYear}
              </p>
              <p className="text-[11px] text-violet-600 dark:text-violet-400 font-medium mt-0.5">
                Click the camera icon to upload custom photo
              </p>
            </div>
          </div>

          {/* Form Fields for User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={profile.email}
                title="Account email address cannot be modified directly"
                className="w-full p-2.5 bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. +880 1700 000000"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-300">
                Country / Region
              </label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="e.g. Bangladesh"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            App Appearance & Theme
          </h3>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-violet-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
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
              className="px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-violet-700 cursor-pointer"
            >
              Toggle Mode
            </button>
          </div>
        </div>

        {/* Account Security & Session */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151828] border border-slate-200/80 dark:border-slate-800/90 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Account Security & Session
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
            <div>
              <p className="font-bold text-xs text-rose-900 dark:text-rose-200">
                Log Out of Account
              </p>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400">
                Sign out of this session and clear active cart, wishlist, and local credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/login', { replace: true });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
