import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 inline-flex items-center justify-center disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary:
      'bg-primary-700 text-white shadow-lg shadow-primary-700/15 hover:bg-primary-800 focus:ring-primary-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none',
    secondary:
      'bg-white text-primary-800 shadow-lg shadow-black/10 hover:bg-primary-50 focus:ring-primary-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none',
    outline:
      'border-2 border-primary-700 bg-transparent text-primary-800 hover:bg-primary-50 focus:ring-primary-200 disabled:border-slate-300 disabled:text-slate-400',
    lightOutline:
      'border-2 border-white/50 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white focus:ring-white/50 disabled:border-white/30 disabled:text-white/50',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:text-gray-400',
    danger:
      'bg-red-700 text-white shadow-lg shadow-red-700/15 hover:bg-red-800 focus:ring-red-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
