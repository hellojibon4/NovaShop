import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Code-splitting via React.lazy for optimized initial page loads
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const Deals = lazy(() => import('./pages/Deals'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const BestSellers = lazy(() => import('./pages/BestSellers'));
const Brands = lazy(() => import('./pages/Brands'));
const Collections = lazy(() => import('./pages/Collections'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Coupons = lazy(() => import('./pages/Coupons'));
const Addresses = lazy(() => import('./pages/Addresses'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

function PageLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold text-slate-400">Loading view...</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <Suspense fallback={<PageLoadingFallback />}>
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
                      <Route
                        path="orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="coupons" element={<Coupons />} />
                      <Route
                        path="addresses"
                        element={
                          <ProtectedRoute>
                            <Addresses />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="account-settings"
                        element={
                          <ProtectedRoute>
                            <AccountSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="cart" element={<Cart />} />
                      <Route
                        path="checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="contact" element={<Contact />} />
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="register" element={<Signup />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
