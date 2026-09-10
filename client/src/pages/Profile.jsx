import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, LocateFixed, MapPin, Pencil } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/Button.jsx';
import { BLOOD_GROUPS } from '../utils/constants.js';
import { getProfile, updateAvailability, updateProfile } from '../services/userService.js';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { geocodeLocation } from '../services/locationService.js';
import BloodlyMap from '../components/BloodlyMap.jsx';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingLocation, setEditingLocation] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({ city: '', state: '', area: '', pincode: '', latitude: '', longitude: '' });

  const beginLocationEdit = () => {
    setLocationForm({ city: profile?.city || '', state: profile?.state || '', area: profile?.area || '', pincode: profile?.pincode || '', latitude: profile?.latitude || '', longitude: profile?.longitude || '' });
    setEditingLocation(true);
  };

  const captureLocation = () => {
    setError('');
    setSuccess('');
    if (!navigator.geolocation) {
      setError('Location is not available in this browser. Enter your city and area manually, then save.');
      return;
    }

    setSuccess('Requesting your current location. Please allow location access in the browser prompt.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationForm((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude }));
        setSuccess('Current location captured. Click Save map location to use it for donor matching.');
      },
      (locationError) => {
        const message = locationError.code === 1
          ? 'Location permission was denied. Allow location access for this site, or enter your city and area manually.'
          : locationError.code === 2
            ? 'Your location could not be determined. Check device location services or enter your city and area manually.'
            : 'Location request timed out. Try again or enter your city and area manually.';
        setSuccess('');
        setError(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const saveLocation = async (event) => {
    event.preventDefault();
    setSavingLocation(true);
    setError('');
    try {
      let coordinates = { latitude: locationForm.latitude, longitude: locationForm.longitude };
      if (!coordinates.latitude || !coordinates.longitude) coordinates = await geocodeLocation(locationForm);
      if (!coordinates) throw new Error('We could not find that location. Check the city, area, and pincode.');
      const response = await updateProfile({ ...locationForm, ...coordinates });
      setProfile(response.data);
      setEditingLocation(false);
      setSuccess('Map location updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to update map location.');
    } finally {
      setSavingLocation(false);
    }
  };

  useEffect(() => {
    getProfile()
      .then((response) => setProfile(response.data))
      .catch((loadError) => setError(loadError.message || 'Unable to load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAvailability = async () => {
    setUpdatingAvailability(true);
    setError('');
    try {
      const response = await updateAvailability(!profile.isAvailable);
      setProfile((currentProfile) => ({ ...currentProfile, isAvailable: response.data.isAvailable }));
      setSuccess(`Availability updated to ${response.data.isAvailable ? 'available' : 'unavailable'}.`);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update availability.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  return (
    <div className="page-shell px-4 py-12 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}
          {loading && <div className="mb-8 h-20 animate-pulse rounded-2xl bg-slate-100" />}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center text-4xl">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-semibold">{profile?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-semibold">{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                    <p className="font-semibold">{profile?.role}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Blood Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blood Group</p>
                    <p className="text-2xl font-bold text-primary-600">{profile?.bloodGroup || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-semibold">{profile?.city || 'Location not provided'}, {profile?.state || ''}</p>
                  <button type="button" onClick={beginLocationEdit} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800"><Pencil className="h-3.5 w-3.5" /> Edit map location</button>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Donation</p>
                  <p className="font-semibold">
                    {profile?.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'No record'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {editingLocation && <form onSubmit={saveLocation} className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="eyebrow mb-2">Map location</p><h2 className="text-xl font-bold text-slate-900">Update your searchable location</h2><p className="mt-1 text-sm text-slate-500">Use your current area or enter details. Donor home addresses are never shown exactly.</p></div><MapPin className="h-5 w-5 text-primary-700" /></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label>City<input value={locationForm.city} onChange={(event) => setLocationForm({ ...locationForm, city: event.target.value })} required /></label><label>State<input value={locationForm.state} onChange={(event) => setLocationForm({ ...locationForm, state: event.target.value })} required /></label><label>Area<input value={locationForm.area} onChange={(event) => setLocationForm({ ...locationForm, area: event.target.value })} required /></label><label>Pincode<input value={locationForm.pincode} onChange={(event) => setLocationForm({ ...locationForm, pincode: event.target.value })} required /></label></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="outline" onClick={captureLocation}><LocateFixed className="mr-2 h-4 w-4" /> Use current location</Button><Button type="submit" disabled={savingLocation}>{savingLocation ? 'Saving...' : 'Save map location'}</Button><Button type="button" variant="ghost" onClick={() => setEditingLocation(false)}>Cancel</Button></div></form>}

          {profile?.latitude && profile?.longitude && <div className="mb-8"><div className="mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-700" /><h2 className="font-bold text-slate-900">Your map location</h2></div><BloodlyMap origin={{ latitude: profile.latitude, longitude: profile.longitude }} className="h-64" /></div>}

          {user?.role === 'DONOR' && (
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary-600" />
                Donor Status
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You can update your availability status to let recipients know when you're ready to donate.
              </p>
              <Button className="w-full" onClick={handleAvailability} disabled={updatingAvailability}>
                {updatingAvailability ? 'Updating...' : `Mark as ${profile?.isAvailable ? 'unavailable' : 'available'}`}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
