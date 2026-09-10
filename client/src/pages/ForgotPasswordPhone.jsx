import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { requestPhonePasswordReset, resetPasswordWithOtp } from '../services/authService.js';

const ForgotPasswordPhone = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError('');
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await requestPhonePasswordReset(phone.trim());
      if (response.success) setStep('otp');
    } catch (requestError) {
      setError(requestError.message || 'Unable to request a password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setError('');
    if (!otp || !password || !confirmPassword) {
      setError('OTP and both password fields are required.');
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
      await resetPasswordWithOtp(phone.trim(), otp.trim(), password, confirmPassword);
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
            <h1 className="text-3xl font-bold mb-2">Reset Using WhatsApp</h1>
            <p className="text-gray-600 dark:text-gray-400">Receive a one-time code on your registered phone.</p>
          </div>
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {success ? (
            <div className="space-y-6">
              <SuccessMessage message="Password reset successfully." />
              <Button type="button" className="w-full" onClick={() => navigate('/login')}>Return to Login</Button>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label htmlFor="reset-phone" className="block text-sm font-medium mb-2">Registered Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="reset-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Enter your phone number" className="w-full pl-10" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? <LoadingSpinner /> : <><MessageCircle className="mr-2 h-4 w-4" /> Send WhatsApp Code</>}</Button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label htmlFor="reset-otp" className="block text-sm font-medium mb-2">WhatsApp OTP</label>
                <input id="reset-otp" type="text" inputMode="numeric" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter 6-digit code" className="w-full" />
                <p className="mt-1 text-sm text-gray-500">The code expires in 10 minutes.</p>
              </div>
              <div>
                <label htmlFor="otp-new-password" className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="otp-new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter new password" className="w-full pl-10" />
                </div>
              </div>
              <div>
                <label htmlFor="otp-confirm-password" className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input id="otp-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" className="w-full pl-10" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? <LoadingSpinner /> : 'Reset Password'}</Button>
            </form>
          )}
          {!success && <div className="mt-6 text-center space-y-2"><Link to="/forgot-password" className="block text-primary-600 hover:text-primary-700 font-medium">Choose another method</Link><Link to="/login" className="block text-primary-600 hover:text-primary-700 font-medium">Return to Login</Link></div>}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPhone;
