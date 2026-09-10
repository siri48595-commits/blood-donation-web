import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';

const RoleRoute = ({ children, roles = [], accessDeniedMessage = 'Your account is not authorized to access this page.' }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const normalizedRole = typeof user?.role === 'string' ? user.role.toUpperCase() : null;

  if (!normalizedRole) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="card w-full max-w-lg text-center">
          <p className="eyebrow mb-3">Account setup needed</p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">Your account role is not configured.</h1>
          <p className="mb-7 text-slate-500">Please contact support to finish setting up access for this account.</p>
          <Link to="/dashboard" className="inline-flex rounded-xl bg-primary-700 px-5 py-3 font-bold text-white hover:bg-primary-800">Return to dashboard</Link>
        </div>
      </div>
    );
  }

  if (!roles.map((role) => role.toUpperCase()).includes(normalizedRole)) {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="card w-full max-w-lg text-center">
          <p className="eyebrow mb-3">Access restricted</p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900">You do not have permission to access this route.</h1>
          <p className="mb-7 text-slate-500">{accessDeniedMessage}</p>
          <Link to="/dashboard" className="inline-flex rounded-xl bg-primary-700 px-5 py-3 font-bold text-white hover:bg-primary-800">Return to dashboard</Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
