import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ClipboardList, HeartPulse, Users } from 'lucide-react';
import { getAdminDashboard } from '../services/adminService.js';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then((response) => setDashboard(response.data))
      .catch((loadError) => setError(loadError.message || 'Unable to load admin data.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = dashboard ? [
    { title: 'Active users', value: dashboard.users.totalUsers, icon: Users },
    { title: 'Available donors', value: dashboard.users.availableDonors, icon: HeartPulse },
    { title: 'Blood requests', value: dashboard.requests.totalRequests, icon: ClipboardList },
    { title: 'Urgent requests', value: dashboard.requests.urgentRequests, icon: Activity },
  ] : [];

  return (
    <div className="page-shell px-4 py-12 sm:px-8"><div className="mx-auto max-w-7xl"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <p className="eyebrow mb-3">Operations overview</p><h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Admin dashboard.</h1><p className="mb-10 mt-3 text-slate-500">Live platform data from your Bloodly database.</p>
      {error && <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="card h-36 animate-pulse bg-slate-100" />)}</div> : <>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ title, value, icon: Icon }, index) => <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="card"><div className="mb-7 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700"><Icon className="h-5 w-5" /></div><p className="text-sm font-semibold text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></motion.div>)}</div>
        <div className="grid gap-6 lg:grid-cols-2"><div className="card"><div className="mb-6 flex items-center justify-between"><div><p className="eyebrow mb-2">Requests</p><h2 className="text-2xl font-bold">Request status</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Live</span></div><div className="space-y-4"><div className="flex items-center justify-between"><span className="text-slate-500">Pending</span><strong>{dashboard.requests.pendingRequests}</strong></div><div className="flex items-center justify-between"><span className="text-slate-500">Fulfilled</span><strong>{dashboard.requests.fulfilledRequests}</strong></div><div className="flex items-center justify-between"><span className="text-slate-500">Donation requests</span><strong>{dashboard.donations.totalDonationRequests}</strong></div></div></div><div className="card"><div className="mb-6"><p className="eyebrow mb-2">Donor network</p><h2 className="text-2xl font-bold">Blood group distribution</h2></div>{dashboard.donations && dashboard.users && dashboard.users.totalDonors > 0 ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{dashboard.bloodGroupStats.map((group) => <div key={group._id} className="rounded-xl border border-slate-200 p-4"><p className="text-lg font-bold text-primary-700">{group._id}</p><p className="mt-1 text-sm text-slate-500">{group.count} donor{group.count === 1 ? '' : 's'}</p></div>)}</div> : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No donor records yet. This section will populate as people register.</p>}</div></div>
      </>}
    </motion.div></div></div>
  );
};

export default AdminDashboard;