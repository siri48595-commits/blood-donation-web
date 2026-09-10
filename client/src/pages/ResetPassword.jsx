import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { resetPassword } from '../services/authService.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      setSuccess(true);
    } catch (resetError) {
      setError(resetError.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose a new password for your account.</p>
          </div>

          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {success ? (
            <div className="space-y-6">
              <SuccessMessage message="Password reset successfully." />
              <Button type="button" className="w-full" onClick={() => navigate('/login')}>Return to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter new password" className="w-full pl-10" />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full pl-10" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <LoadingSpinner /> : 'Reset Password'}
              </Button>
            </form>
          )}

          {!success && <div className="mt-6 text-center"><Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Return to Login</Link></div>}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;