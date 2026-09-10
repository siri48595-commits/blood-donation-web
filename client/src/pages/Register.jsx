import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LocateFixed } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { authRegister } from '../services/authService.js';
import Button from '../components/Button.jsx';
import { ErrorMessage, SuccessMessage } from '../components/Alerts.jsx';
import { BLOOD_GROUPS, GENDERS } from '../utils/constants.js';
import { geocodeLocation } from '../services/locationService.js';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'RECIPIENT',
    bloodGroup: 'O+',
    dateOfBirth: '',
    gender: 'MALE',
    city: '',
    state: '',
    area: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });
  const [locationMessage, setLocationMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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
      let registrationData = formData;
      if (!formData.latitude || !formData.longitude) {
        const coordinates = await geocodeLocation(formData);
        if (coordinates) registrationData = { ...formData, ...coordinates };
      }
      const response = await authRegister(registrationData);
      if (response.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        login(response.token, response.user);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser. You can continue without it.');
      return;
    }
    setLocationMessage('Requesting your location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude }));
        setLocationMessage('Location captured. We use an approximate map point to protect your privacy.');
      },
      () => setLocationMessage('Location access was denied. Add your city, area and pincode manually instead.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Bloodly and make a difference
            </p>
          </div>

          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="DONOR">Donor</option>
                <option value="RECIPIENT">Recipient</option>
              </select>
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
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                {Object.entries(GENDERS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-sm font-bold text-slate-800">Map location</p><p className="text-xs text-slate-500">Capture your current area so donor matching and directions can work. Your exact home address is never displayed.</p></div><Button type="button" variant="outline" size="sm" onClick={captureLocation}><LocateFixed className="mr-2 h-4 w-4" /> Use current location</Button></div>
              {locationMessage && <p className="mt-3 text-xs font-semibold text-slate-500">{locationMessage}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
