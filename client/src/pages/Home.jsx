import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users, Shield, Search, MapPin, Activity, ChevronRight } from 'lucide-react';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full overflow-hidden bg-stone-50">
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#170f12] px-4 py-16 text-white sm:px-8 lg:px-12">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=2200&q=85"
          alt="Healthcare professional preparing a blood donation"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(23,15,18,0.98)_0%,rgba(23,15,18,0.82)_40%,rgba(23,15,18,0.3)_100%)]" />
        <div className="absolute right-[-8rem] top-[-8rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-700/25 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              A calmer way to find help
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
              Every drop can <span className="text-red-300">save a life.</span>
            </h1>
            <p className="mb-9 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
              Find blood donors faster, connect with your community, and make a difference when every second matters.
            </p>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/create-request"><Button size="lg" variant="secondary" className="flex items-center gap-2">Create a Blood Request <ArrowRight className="h-4 w-4" /></Button></Link>
                  <Link to="/dashboard"><Button size="lg" variant="lightOutline">Open Dashboard</Button></Link>
                </>
              ) : (
                <>
                  <Link to="/donor-search"><Button size="lg" variant="secondary" className="flex items-center gap-2">Find a Donor <ArrowRight className="h-4 w-4" /></Button></Link>
                  <Link to="/register"><Button size="lg" variant="lightOutline">Become a Donor</Button></Link>
                </>
              )}
            </div>
            <p className="mt-5 text-xs text-white/50">Bloodly helps coordinate discovery. Medical decisions remain with qualified professionals.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="hidden justify-end lg:flex"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="rounded-2xl bg-[#fffaf8] p-5 text-slate-900">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <p className="eyebrow">Right now</p>
                    <h2 className="mt-2 text-2xl font-bold">Need blood?</h2>
                  </div>
                  <div className="rounded-xl bg-primary-100 p-2.5 text-primary-700"><Activity className="h-5 w-5" /></div>
                </div>
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">O+</div>
                  <div className="flex-1"><p className="font-bold">Start with a blood group</p><p className="text-xs text-slate-500">Then narrow by area and availability</p></div>
                  <ChevronRight className="h-4 w-4 text-primary-600" />
                </div>
                <Link to={isAuthenticated ? '/create-request' : '/donor-search'} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800">
                  {isAuthenticated ? 'Create a blood request' : 'Open donor search'} <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-primary-600" /> Approximate locations protect donor privacy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="soft-grid px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Built for the moment it matters</p>
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">A little more clarity when everything feels urgent.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Heart className="w-8 h-8" />,
              title: 'AI-Powered Matching',
              description: 'Intelligent donor ranking based on compatibility and availability',
            },
            {
              icon: <Search className="w-8 h-8" />,
              title: 'Real-Time Donor Search',
              description: 'Find available donors by blood group and location instantly',
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Secure Authentication',
              description: 'JWT-based authentication with encrypted data storage',
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Easy Coordination',
              description: 'Streamlined communication between donors and recipients',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card text-left"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 px-4 py-20 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl"><p className="eyebrow mb-3 text-red-200">Your next step can be simple</p><h2 className="text-4xl font-bold sm:text-5xl">Show up for someone you may never meet.</h2></div>
          <Link to={isAuthenticated ? '/dashboard' : '/register'}><Button variant="secondary" size="lg" className="shrink-0">{isAuthenticated ? 'Open Dashboard' : 'Join Bloodly'} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
