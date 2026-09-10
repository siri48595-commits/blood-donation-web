import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ClipboardList, HeartPulse, User, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getMyBloodRequests, getDonorRequests, getRecipientRequests } from '../services/requestService.js';
import { getDonorStats } from '../services/donorService.js';
import { getProfile } from '../services/userService.js';
import BloodlyMap from '../components/BloodlyMap.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [stats, setStats] = useState({ requests: [], donorStats: null, connections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const loadDashboard = async () => {
      try {
        const [requestsResponse, donorStatsResponse, profileResponse, connectionsResponse] = await Promise.all([
          getMyBloodRequests(),
          getDonorStats(),
          getProfile(),
          user?.role === 'DONOR' ? getDonorRequests(user.id) : getRecipientRequests(user.id),
        ]);
        setStats({
          requests: requestsResponse.data || [],
          donorStats: donorStatsResponse.data,
          connections: connectionsResponse.data || [],
        });
        setProfile(profileResponse.data);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const requestCount = stats.requests.length;
  const pendingCount = stats.requests.filter((request) => ['PENDING', 'MATCHED'].includes(request.status)).length;
  const firstConnection = stats.connections[0];
  const routeOrigin = profile?.latitude && profile?.longitude ? { latitude: profile.latitude, longitude: profile.longitude } : null;
  const routeDestination = user?.role === 'DONOR'
    ? firstConnection?.bloodRequestId
    : firstConnection?.donorId;

  return (
    <div className="page-shell px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="eyebrow mb-3">Your Bloodly space</p><h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Welcome, {user?.name}.</h1>
          <p className="mb-10 mt-3 max-w-xl text-slate-500">
            {user?.role === 'DONOR'
              ? 'Manage your donor profile and view incoming requests'
              : 'Search for donors and create blood requests'}
          </p>

          {error && <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          {loading ? <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="card h-36 animate-pulse bg-slate-100" />)}</div> : <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Your requests', value: requestCount, icon: ClipboardList },
              { title: 'Active requests', value: pendingCount, icon: HeartPulse },
              { title: 'Available donors', value: stats.donorStats?.availableDonors ?? 0, icon: User },
              { title: 'Last donation', value: profile?.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'No record', icon: HeartPulse },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700"><stat.icon className="h-5 w-5" /></div>
                <h3 className="mb-2 text-sm font-semibold text-slate-500">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>}

          {firstConnection && routeOrigin && routeDestination?.latitude && routeDestination?.longitude && <div className="card mb-6 p-3 sm:p-4"><div className="mb-4 px-2"><p className="eyebrow mb-2">Active route</p><h2 className="text-2xl font-bold">{user?.role === 'DONOR' ? 'Request location' : 'Donor location'}</h2><p className="mt-1 text-sm text-slate-500">Approximate directions are shown for coordination. Exact residential addresses are never displayed.</p></div><BloodlyMap origin={routeOrigin} destination={routeDestination} className="h-[380px]" /></div>}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <div className="mb-6 flex items-center justify-between"><div><p className="eyebrow mb-2">Quick actions</p><h2 className="text-2xl font-bold">What do you need today?</h2></div><HeartPulse className="h-6 w-6 text-primary-600" /></div>
            <div className="grid gap-3 sm:grid-cols-3"><Link to="/donor-search" className="rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50"><Search className="mb-5 h-5 w-5 text-primary-700" /><span className="text-sm font-bold">Find a donor</span><ArrowUpRight className="mt-3 h-4 w-4 text-slate-400" /></Link><Link to="/create-request" className="rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50"><ClipboardList className="mb-5 h-5 w-5 text-primary-700" /><span className="text-sm font-bold">Request blood</span><ArrowUpRight className="mt-3 h-4 w-4 text-slate-400" /></Link><Link to="/profile" className="rounded-xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50"><User className="mb-5 h-5 w-5 text-primary-700" /><span className="text-sm font-bold">Complete profile</span><ArrowUpRight className="mt-3 h-4 w-4 text-slate-400" /></Link></div>
          </div>
          <div className="card bg-primary-800 text-white"><p className="eyebrow mb-3 text-red-200">A small reminder</p><h2 className="text-2xl font-bold">Good information makes urgent moments easier.</h2><p className="mt-4 text-sm leading-6 text-white/70">Keep your area and availability up to date so the right requests can find you.</p><Link to="/profile" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-red-200">Review your profile <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
          <div className="sr-only">
            <h2>Dashboard Features</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary-600">✓</span>
                <span>View your profile and blood group information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600">✓</span>
                <span>Search for available donors by location</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600">✓</span>
                <span>Create and manage blood requests</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600">✓</span>
                <span>Chat with AI assistant for donor matching help</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary-600">✓</span>
                <span>Receive and respond to donation requests</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
