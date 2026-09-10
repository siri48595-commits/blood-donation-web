import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose how you want to reset your password.</p>
          </div>

          <div className="space-y-4">
            <Link to="/forgot-password/email" className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-primary-500 hover:bg-primary-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <Mail className="h-5 w-5 text-primary-600" />
              <span className="font-semibold">Reset using Email</span>
            </Link>
            <Link to="/forgot-password/phone" className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-primary-500 hover:bg-primary-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <MessageCircle className="h-5 w-5 text-primary-600" />
              <span className="font-semibold">Reset using Phone Number / WhatsApp</span>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Return to Login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;