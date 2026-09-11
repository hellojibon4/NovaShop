import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import Toast from '../Common/Toast';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#0B0D14] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Toast Notifications */}
      <Toast />

      {/* Full-Width Fixed Top Navbar (z-50) */}
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Left Sidebar (Fixed below navbar on desktop / Drawer on mobile) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace (Offset for Top Navbar, Left Sidebar on lg+, Right Cart on xl+) */}
      <div className="pt-[72px] lg:pl-64 xl:pr-88 flex-1 flex flex-col min-h-screen transition-all duration-300">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Right Cart Sidebar (Desktop Fixed below navbar on xl / Mobile Drawer on <xl) */}
      <CartSidebar />
    </div>
  );
}
