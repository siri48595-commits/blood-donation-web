import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { authLogout } from '../services/authService.js';
import { ThemeContext } from '../context/ThemeContext.jsx';

const navLink = 'text-sm font-semibold text-slate-500 transition hover:text-primary-700';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authLogout();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-[2000] border-b border-slate-200/70 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><img src="/assets/bloodly-icon.jpeg" alt="Bloodly" className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-primary-700/20" /><span className="font-bold tracking-tight text-slate-900">bloodly<span className="text-primary-700">.</span></span></Link>
          <div className="hidden items-center gap-7 md:flex"><Link to="/" className={navLink}>Home</Link>{isAuthenticated ? <><Link to="/dashboard" className={navLink}>Dashboard</Link><Link to="/create-request" className={navLink}>Emergency</Link></> : <><Link to="/donor-search" className={navLink}>Find a donor</Link><Link to="/create-request" className={navLink}>Emergency</Link></>}</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} aria-label="Toggle color theme" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700">{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            {isAuthenticated ? <div className="hidden items-center gap-3 md:flex"><Link to="/profile" aria-label="Notifications" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700"><Bell className="h-4 w-4" /></Link><Link to="/profile" className="text-sm font-semibold text-slate-700 hover:text-primary-700">{user?.name}</Link><button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-800"><LogOut className="h-4 w-4" /> Logout</button></div> : <div className="hidden items-center gap-3 md:flex"><Link to="/login" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-primary-700">Login</Link><Link to="/register" className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-700/15 hover:bg-primary-800">Become a donor</Link></div>}
            <button onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden">{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        {isOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-slate-100 pb-4 pt-3 md:hidden"><Link to="/" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Home</Link>{isAuthenticated ? <><Link to="/dashboard" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Dashboard</Link><Link to="/create-request" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Emergency request</Link><Link to="/profile" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Profile</Link><button onClick={() => { handleLogout(); closeMenu(); }} className="w-full rounded-lg px-2 py-2.5 text-left text-sm font-bold text-primary-700 hover:bg-primary-50">Logout</button></> : <><Link to="/donor-search" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Find a donor</Link><Link to="/create-request" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Emergency request</Link><Link to="/login" className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600 hover:bg-primary-50" onClick={closeMenu}>Login</Link><Link to="/register" className="block rounded-lg px-2 py-2.5 text-sm font-bold text-primary-700 hover:bg-primary-50" onClick={closeMenu}>Become a donor</Link></>}</motion.div>}
      </div>
    </nav>
  );
};

export default Navbar;