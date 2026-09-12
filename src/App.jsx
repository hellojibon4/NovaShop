import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import AppLayout from './components/Layout/AppLayout';
import AuthModal from './components/Auth/AuthModal';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import Brands from './pages/Brands';
import Collections from './pages/Collections';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Coupons from './pages/Coupons';
import Addresses from './pages/Addresses';
import AccountSettings from './pages/AccountSettings';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <AuthModal />
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="new-arrivals" element={<NewArrivals />} />
                  <Route path="best-sellers" element={<BestSellers />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="collections" element={<Collections />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="coupons" element={<Coupons />} />
                  <Route path="addresses" element={<Addresses />} />
                  <Route path="account-settings" element={<AccountSettings />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="register" element={<Signup />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
