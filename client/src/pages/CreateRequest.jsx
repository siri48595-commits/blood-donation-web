import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, HeartPulse, ArrowLeft, LocateFixed } from 'lucide-react';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../utils/constants.js';
import Button from '../components/Button.jsx';
import { InfoMessage } from '../components/Alerts.jsx';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { createBloodRequest } from '../services/requestService.js';
import BloodlyMap from '../components/BloodlyMap.jsx';
import { geocodeLocation } from '../services/locationService.js';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 2,
    hospitalName: '',
    hospitalLocation: '',
    city: '',
    state: '',
    pincode: '',
    urgency: 'NORMAL',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [locationMessage, setLocationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      let requestData = { ...formData, unitsRequired: Number(formData.unitsRequired) };
      if (!requestData.latitude || !requestData.longitude) {
        const coordinates = await geocodeLocation({ area: requestData.hospitalLocation, city: requestData.city, state: requestData.state, pincode: requestData.pincode });
        if (coordinates) requestData = { ...requestData, ...coordinates };
      }
      await createBloodRequest(requestData);
      setSuccess('Blood request created successfully. Matching donors will be notified.');
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (requestError) {
      setError(requestError.message || 'Unable to create the request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser. Enter the hospital city and area manually.');
      return;
    }
    setLocationMessage('Requesting hospital location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude }));
        setLocationMessage('Location captured for the request map.');
      },
      () => setLocationMessage('Location access was denied. The request can still be submitted with city and area details.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <div className="page-shell px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-9 flex items-start gap-4"><div className="hidden rounded-2xl bg-primary-100 p-3 text-primary-700 sm:block"><HeartPulse className="h-6 w-6" /></div><div><p className="eyebrow mb-3">Emergency coordination</p><h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Create a blood request.</h1><p className="mt-3 max-w-xl text-slate-500">
            Submit an urgent blood donation request
          </p></div></div>

          <InfoMessage
            message="For critical situations, contact your nearest blood bank or hospital directly in addition to using this platform."
            onClose={() => {}}
          />
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

          <div className="card mt-8 p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-2 border-b border-slate-100 pb-5"><p className="text-sm font-bold text-slate-900">Request details</p><p className="mt-1 text-sm text-slate-500">Share only what is needed to help coordinate care.</p></div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label>Patient or requester name
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>Blood group
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                </label>
                <label>Units required
                <input
                  type="number"
                  name="unitsRequired"
                  placeholder="Units Required"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                />
                </label>
                <label>Urgency
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  required
                >
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                </label>
                <label>Hospital or blood bank
                <input
                  type="text"
                  name="hospitalName"
                  placeholder="Hospital Name"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>Hospital area
                <input
                  type="text"
                  name="hospitalLocation"
                  placeholder="Hospital Location"
                  value={formData.hospitalLocation}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>City
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>State
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                </label>
                <label>Pincode
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
                </label>
              </div>

              <label>Additional information
              <textarea
                name="description"
                placeholder="Add context for donors or coordinators"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full"
              /></label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-sm font-bold text-slate-800">Request map location</p><p className="text-xs text-slate-500">Use the hospital location to help donors see a route. Donor home locations remain private.</p></div><Button type="button" variant="outline" size="sm" onClick={captureLocation}><LocateFixed className="mr-2 h-4 w-4" /> Use current location</Button></div>{locationMessage && <p className="mt-3 text-xs font-semibold text-slate-500">{locationMessage}</p>}{formData.latitude && formData.longitude && <div className="mt-4 h-56"><BloodlyMap destination={{ latitude: formData.latitude, longitude: formData.longitude }} className="h-full" /></div>}</div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Submitting...' : 'Create Request'}
                </Button>
                <Button variant="outline" className="flex-1" type="button" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRequest;
