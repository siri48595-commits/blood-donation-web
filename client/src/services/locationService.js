const GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';

export const geocodeLocation = async ({ area, city, state, pincode }) => {
  const query = [area, city, state, pincode].filter(Boolean).join(', ');
  if (!query) return null;

  const response = await fetch(`${GEOCODING_URL}?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Location lookup failed');
  const results = await response.json();
  if (!results[0]) return null;

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
  };
};

export default { geocodeLocation };
