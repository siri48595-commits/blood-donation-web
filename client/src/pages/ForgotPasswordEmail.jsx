import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { requestPasswordReset } from '../services/authService.js';

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || 'Unable to request a password reset.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Using Email</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your registered email to receive a reset link.</p>
          </div>
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {message ? <SuccessMessage message={message} /> : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium mb-2">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="w-full pl-10" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? <LoadingSpinner /> : 'Send Verification Code'}</Button>
            </form>
          )}
          <div className="mt-6 text-center space-y-2">
            <Link to="/forgot-password" className="block text-primary-600 hover:text-primary-700 font-medium">Choose another method</Link>
            <Link to="/login" className="block text-primary-600 hover:text-primary-700 font-medium">Return to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordEmail;
