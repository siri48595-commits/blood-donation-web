import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ShieldCheck, Clock3, LocateFixed } from 'lucide-react';
import { BLOOD_GROUPS } from '../utils/constants.js';
import Button from '../components/Button.jsx';
import { EmptyState } from '../components/Alerts.jsx';
import { searchDonors } from '../services/donorService.js';
import { createDonationRequest, getMyBloodRequests } from '../services/requestService.js';
import BloodlyMap from '../components/BloodlyMap.jsx';
import { geocodeLocation } from '../services/locationService.js';

const DonorSkeleton = () => <div className="card animate-pulse space-y-5"><div className="flex justify-between"><div className="h-5 w-28 rounded bg-slate-200" /><div className="h-10 w-10 rounded-full bg-slate-200" /></div><div className="h-4 w-40 rounded bg-slate-200" /><div className="h-4 w-32 rounded bg-slate-200" /><div className="h-11 rounded-xl bg-slate-200" /></div>;

const DonorSearch = () => {
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [activeRequest, setActiveRequest] = useState(null);
  const [contactingDonor, setContactingDonor] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [searchError, setSearchError] = useState('');
  const loadedRequestRef = useRef(false);

  useEffect(() => {
    if (loadedRequestRef.current) return;
    loadedRequestRef.current = true;
    getMyBloodRequests(1, 10)
      .then((response) => setActiveRequest((response.data || []).find((request) => !['FULFILLED', 'CANCELLED'].includes(request.status))))
      .catch(() => setActiveRequest(null));
  }, []);
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', available: 'true', page: 1, limit: 10 });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearchError('');
    try {
      let searchLocation = location;
      if (!searchLocation && filters.city) searchLocation = await geocodeLocation({ city: filters.city });
      if (searchLocation) setLocation(searchLocation);
      const searchFilters = searchLocation
        ? { ...filters, latitude: searchLocation.latitude, longitude: searchLocation.longitude, radius: 50 }
        : filters;
      const response = await searchDonors(searchFilters);
      setDonors(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Unable to search donors right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser. Search by city or area instead.');
      return;
    }
    setLocationMessage('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationMessage('Location enabled. Search results can now be filtered by distance.');
      },
      () => setLocationMessage('Location access was denied. Search by city or area instead.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const requestContact = async (donor) => {
    if (!activeRequest) return;
    setContactingDonor(donor._id);
    setContactMessage('');
    try {
      await createDonationRequest({ donorId: donor._id, bloodRequestId: activeRequest._id, message: `Please review my ${activeRequest.bloodGroup} blood request.` });
      setContactMessage('Contact request sent. The donor can now review the request and route.');
    } catch (error) {
      setContactMessage(error.message || 'Unable to send the contact request.');
    } finally {
      setContactingDonor('');
    }
  };

  return (
    <div className="page-shell px-4 py-12 sm:px-8"><div className="mx-auto max-w-7xl"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-3">Donor discovery</p><h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Find help, closer to home.</h1><p className="mt-3 max-w-xl text-slate-500">Search by blood group and area. Donor locations are intentionally approximate to protect privacy.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Privacy-first results</div></div>
      <div className="card mb-10 border-slate-200/80 p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-primary-50 p-2 text-primary-700"><SlidersHorizontal className="h-5 w-5" /></div><div><h2 className="font-bold text-slate-900">Search filters</h2><p className="text-sm text-slate-500">Start broad, then narrow your search.</p></div></div><div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4"><label>Blood group<select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}><option value="">All Blood Groups</option>{BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}</select></label><label>Area or city<input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} /></label><label>Availability<select name="available" value={filters.available} onChange={handleFilterChange}><option value="">All Donors</option><option value="true">Available Only</option></select></label><Button onClick={handleSearch} className="w-full self-end"><Search className="mr-2 h-4 w-4" /> Search donors</Button></div><div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary-600" /> Exact addresses are never shown.</span><button type="button" onClick={captureLocation} className="inline-flex items-center gap-2 font-bold text-primary-700 hover:text-primary-800"><LocateFixed className="h-3.5 w-3.5" /> Use my location</button></div>{locationMessage && <p className="mt-3 text-xs font-semibold text-slate-500">{locationMessage}</p>}<p className="mt-3 text-xs text-slate-500">Available only shows donors who have marked themselves available in their profile.</p></div>
      {searchError && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{searchError}</div>}
      {(location || selectedDonor || donors.some((donor) => donor.latitude && donor.longitude)) && <div className="card mb-10 p-3 sm:p-4"><div className="mb-4 px-2"><p className="eyebrow mb-2">Live map</p><h2 className="text-2xl font-bold text-slate-900">Donors and directions</h2><p className="mt-1 text-sm text-slate-500">Select a marker or donor card to preview a driving route from your location. Donor points are approximate.</p></div>{selectedDonor && (!selectedDonor.latitude || !selectedDonor.longitude) ? <div className="rounded-xl bg-amber-50 p-5 text-sm text-amber-800"><p className="font-bold">Map location is not available for this donor yet.</p><p className="mt-1">The donor can add a location from their profile. You can still create a blood request using the donor&apos;s listed city and area.</p></div> : <BloodlyMap origin={location} destination={selectedDonor ? { latitude: selectedDonor.latitude, longitude: selectedDonor.longitude } : null} donors={donors} onSelectDonor={setSelectedDonor} className="h-[420px]" />}</div>}
      {contactMessage && <p className="mb-6 rounded-xl bg-primary-50 p-4 text-sm font-semibold text-primary-800">{contactMessage}</p>}
      {loading ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"><DonorSkeleton /><DonorSkeleton /><DonorSkeleton /></div> : donors.length === 0 ? <EmptyState icon={Search} title="No donors found nearby" description="Try increasing your search radius or selecting another location." action={<Button onClick={handleSearch}>Try different filters</Button>} /> : <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{donors.map((donor, i) => <motion.div key={donor._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card group relative overflow-hidden"><div className="mb-7 flex items-start justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Blood donor</p><h3 className="text-lg font-bold text-slate-900">Verified donor</h3></div><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">{donor.bloodGroup}</span></div><div className="space-y-3"><p className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-primary-600" /> {donor.city}, {donor.state}</p><p className="flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4 text-slate-400" /> Last active recently</p></div><p className="my-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className={donor.isAvailable ? 'font-bold text-emerald-700' : 'font-bold text-orange-600'}>{donor.isAvailable ? 'Available now' : 'Currently unavailable'}</span></p><button type="button" onClick={() => setSelectedDonor(donor)} className="mb-2 inline-flex w-full items-center justify-center rounded-xl border-2 border-primary-700 bg-transparent px-4 py-3 text-sm font-bold text-primary-800 transition hover:bg-primary-50">View route</button>{activeRequest ? <button type="button" onClick={() => requestContact(donor)} disabled={contactingDonor === donor._id} className="inline-flex w-full items-center justify-center rounded-xl bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60">{contactingDonor === donor._id ? 'Sending...' : 'Request contact'}</button> : <Link to="/create-request" className="inline-flex w-full items-center justify-center rounded-xl bg-primary-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-800">Create a blood request</Link>}</motion.div>)}</div>}
    </motion.div></div></div>
  );
};

export default DonorSearch;