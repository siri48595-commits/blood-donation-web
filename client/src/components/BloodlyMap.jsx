import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [20.5937, 78.9629];

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => window.clearTimeout(timer);
  }, [map]);
  return null;
};

const RouteLine = ({ origin, destination, onRoute }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const loadRoute = async () => {
      if (!origin || !destination) {
        setRoute([]);
        onRoute?.(null);
        return;
      }
      try {
        const coordinates = `${origin[1]},${origin[0]};${destination[1]},${destination[0]}`;
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`);
        if (!response.ok) throw new Error('Route unavailable');
        const data = await response.json();
        if (cancelled) return;
        const points = data.routes?.[0]?.geometry?.coordinates?.map(([longitude, latitude]) => [latitude, longitude]) || [];
        setRoute(points);
        onRoute?.(data.routes?.[0] || null);
      } catch {
        if (!cancelled) {
          setRoute([]);
          onRoute?.(null);
        }
      }
    };
    loadRoute();
    return () => { cancelled = true; };
  }, [destination, onRoute, origin]);

  return route.length > 0 ? <Polyline positions={route} pathOptions={{ color: '#c1121f', weight: 5, opacity: 0.85 }} /> : null;
};

const pointFrom = (latitude, longitude) => {
  const lat = Number(latitude);
  const lon = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
};

const BloodlyMap = ({ origin, donors = [], destination, className = '', onSelectDonor }) => {
  const originPoint = origin ? pointFrom(origin.latitude, origin.longitude) : null;
  const destinationPoint = destination ? pointFrom(destination.latitude, destination.longitude) : null;
  const donorPoints = donors.map((donor) => ({ donor, point: pointFrom(donor.latitude, donor.longitude) })).filter(({ point }) => point);
  const center = destinationPoint || originPoint || donorPoints[0]?.point || DEFAULT_CENTER;
  const [routeInfo, setRouteInfo] = useState(null);

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${className}`}>
      <MapContainer center={center} zoom={originPoint || destinationPoint || donorPoints.length ? 12 : 5} scrollWheelZoom className="h-full min-h-[360px] w-full">
        <ResizeMap />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {originPoint && <CircleMarker center={originPoint} radius={9} pathOptions={{ color: '#0f172a', fillColor: '#0f172a', fillOpacity: 1 }}><></></CircleMarker>}
        {destinationPoint && <CircleMarker center={destinationPoint} radius={9} pathOptions={{ color: '#c1121f', fillColor: '#c1121f', fillOpacity: 1 }}><></></CircleMarker>}
        {donorPoints.map(({ donor, point }) => <CircleMarker key={donor._id} center={point} radius={8} pathOptions={{ color: '#c1121f', fillColor: donor.isAvailable ? '#e63946' : '#94a3b8', fillOpacity: 0.9 }} eventHandlers={{ click: () => onSelectDonor?.(donor) }} />)}
        {(originPoint && destinationPoint) && <RouteLine origin={originPoint} destination={destinationPoint} onRoute={setRouteInfo} />}
      </MapContainer>
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-wrap gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-600 shadow-lg backdrop-blur"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />Your location</span>{destinationPoint && <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-primary-700" />Request location</span>}{donorPoints.length > 0 && <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />Donors</span>}</div>
      {routeInfo && <div className="absolute right-3 top-3 z-[1000] rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg">{(routeInfo.distance / 1000).toFixed(1)} km · {Math.round(routeInfo.duration / 60)} min drive</div>}
    </div>
  );
};

export default BloodlyMap;
