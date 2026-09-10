import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';

// Lazy load pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ForgotPasswordEmail = lazy(() => import('./pages/ForgotPasswordEmail.jsx'));
const ForgotPasswordPhone = lazy(() => import('./pages/ForgotPasswordPhone.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const DonorSearch = lazy(() => import('./pages/DonorSearch.jsx'));
const CreateRequest = lazy(() => import('./pages/CreateRequest.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<LoadingSuspense />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/forgot-password/email" element={<ForgotPasswordEmail />} />
                  <Route path="/forgot-password/phone" element={<ForgotPasswordPhone />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/donor-search"
                    element={
                      <ProtectedRoute>
                        <DonorSearch />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-request"
                    element={
                      <RoleRoute roles={['DONOR', 'RECIPIENT']} accessDeniedMessage="Only donor and recipient accounts can create blood requests.">
                        <CreateRequest />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <RoleRoute roles={['ADMIN']}>
                        <AdminDashboard />
                      </RoleRoute>
                    }
                  />
                  
                  {/* 404 */}
                  <Route path="/not-found" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

const LoadingSuspense = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner text="Loading..." />
  </div>
);

export default App;
