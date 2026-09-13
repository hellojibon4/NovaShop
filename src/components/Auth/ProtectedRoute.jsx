import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        <p className="text-xs text-slate-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page and preserve destination location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
