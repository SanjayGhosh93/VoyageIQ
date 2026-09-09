import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { seaRoute } from 'searoute-ts';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  Anchor,
  ArrowDownUp,
  CalendarClock,
  ChevronDown,
  CircleDot,
  Compass,
  Filter,
  Globe2,
  Navigation,
  Route as RouteIcon,
  Search,
  Ship,
  Timer,
  X,
  Waves,
  Droplets,
  MapPin,
} from 'lucide-react';

/*
 * Route Radar — frontend/src/pages/RouteRadarPage.jsx
 * Routes: Eurostat SeaRoute / MARNET · Weather: Open-Meteo @ lat/lng
 * Distances displayed in kilometres (internal calc still NM)
 */

const NM_TO_KM = 1.852;

const PORTS = [
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 18.95, lng: 72.84, type: 'India West' },
  { id: 'mundra', name: 'Mundra', country: 'India', lat: 22.75, lng: 69.7, type: 'India West' },
  { id: 'kochi', name: 'Kochi', country: 'India', lat: 9.97, lng: 76.28, type: 'India South' },
  { id: 'chennai', name: 'Chennai', country: 'India', lat: 13.08, lng: 80.3, type: 'India East' },
  { id: 'colombo', name: 'Colombo', country: 'Sri Lanka', lat: 6.93, lng: 79.84, type: 'Indian Ocean' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.25, lng: 55.3, type: 'Gulf' },
  { id: 'jebel-ali', name: 'Jebel Ali', country: 'UAE', lat: 24.99, lng: 55.06, type: 'Gulf' },
  { id: 'salalah', name: 'Salalah', country: 'Oman', lat: 16.95, lng: 54.0, type: 'Arabian Sea' },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', lat: 21.49, lng: 39.19, type: 'Red Sea' },
  { id: 'suez', name: 'Suez', country: 'Egypt', lat: 29.97, lng: 32.55, type: 'Suez' },
  { id: 'port-said', name: 'Port Said', country: 'Egypt', lat: 31.27, lng: 32.3, type: 'Suez' },
  { id: 'piraeus', name: 'Piraeus', country: 'Greece', lat: 37.94, lng: 23.63, type: 'Mediterranean' },
  { id: 'algeciras', name: 'Algeciras', country: 'Spain', lat: 36.13, lng: -5.44, type: 'Gibraltar' },
  { id: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', lat: 51.95, lng: 4.1, type: 'Europe' },
  { id: 'hamburg', name: 'Hamburg', country: 'Germany', lat: 53.55, lng: 9.95, type: 'Europe' },
  { id: 'antwerp', name: 'Antwerp', country: 'Belgium', lat: 51.3, lng: 4.25, type: 'Europe' },
  { id: 'london', name: 'London Gateway', country: 'UK', lat: 51.5, lng: 0.5, type: 'Europe' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', lat: 6.45, lng: 3.4, type: 'West Africa' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', lat: -33.92, lng: 18.42, type: 'Cape Route' },
  { id: 'durban', name: 'Durban', country: 'South Africa', lat: -29.87, lng: 31.05, type: 'East Africa' },
  { id: 'mombasa', name: 'Mombasa', country: 'Kenya', lat: -4.05, lng: 39.67, type: 'East Africa' },
  { id: 'santos', name: 'Santos', country: 'Brazil', lat: -23.95, lng: -46.3, type: 'South America' },
  { id: 'panama', name: 'Panama', country: 'Panama', lat: 8.95, lng: -79.55, type: 'Panama' },
  { id: 'new-york', name: 'New York / Newark', country: 'USA', lat: 40.68, lng: -74.04, type: 'North America' },
  { id: 'houston', name: 'Houston', country: 'USA', lat: 29.73, lng: -95.0, type: 'Gulf USA' },
  { id: 'los-angeles', name: 'Los Angeles / Long Beach', country: 'USA', lat: 33.75, lng: -118.25, type: 'Pacific USA' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', lat: 49.3, lng: -123.1, type: 'Pacific Canada' },
  { id: 'valparaiso', name: 'Valparaiso', country: 'Chile', lat: -33.0, lng: -71.6, type: 'South America' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.29, lng: 103.85, type: 'Malacca' },
  { id: 'port-klang', name: 'Port Klang', country: 'Malaysia', lat: 3.0, lng: 101.39, type: 'Malacca' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', lat: -6.1, lng: 106.88, type: 'SE Asia' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', lat: 22.32, lng: 114.17, type: 'China' },
  { id: 'shanghai', name: 'Shanghai', country: 'China', lat: 31.23, lng: 121.47, type: 'China' },
  { id: 'ningbo', name: 'Ningbo', country: 'China', lat: 29.87, lng: 121.55, type: 'China' },
  { id: 'busan', name: 'Busan', country: 'South Korea', lat: 35.08, lng: 129.04, type: 'Korea' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.65, lng: 139.8, type: 'Japan' },
  { id: 'manila', name: 'Manila', country: 'Philippines', lat: 14.6, lng: 120.98, type: 'SE Asia' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.86, lng: 151.2, type: 'Australia' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', lat: -37.84, lng: 144.94, type: 'Australia' },
  { id: 'perth', name: 'Perth', country: 'Australia', lat: -32.05, lng: 115.75, type: 'Australia' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', lat: -36.85, lng: 174.76, type: 'New Zealand' },
];

const PORT_BY_ID = Object.fromEntries(PORTS.map((p) => [p.id, p]));

const NOAA_STATIONS = {
  'new-york': '8518750',
  houston: '8771450',
  'los-angeles': '9410660',
  vancouver: null,
};

const WEATHER_CACHE = new Map();
const MARINE_CACHE = new Map();
const WATER_CACHE = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function cacheFresh(entry) {
  return entry && Date.now() - entry.timestamp < CACHE_TTL;
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchShipWeather(lat, lng, signal) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = WEATHER_CACHE.get(key);
  if (cacheFresh(cached)) return cached.data;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,` +
    `wind_speed_10m,wind_direction_10m,surface_pressure,visibility` +
    `&wind_speed_unit=kn&timezone=UTC`;
  const data = await fetchJson(url, signal);
  WEATHER_CACHE.set(key, { timestamp: Date.now(), data });
  return data;
}

async function fetchMarineConditions(lat, lng, signal) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = MARINE_CACHE.get(key);
  if (cacheFresh(cached)) return cached.data;
  const url =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}` +
    `&current=wave_height,wave_direction,wave_period,sea_level_height_msl,` +
    `sea_surface_temperature,ocean_current_velocity,ocean_current_direction` +
    `&timezone=UTC`;
  const data = await fetchJson(url, signal);
  MARINE_CACHE.set(key, { timestamp: Date.now(), data });
  return data;
}

async function fetchNoaaWaterLevel(portId, signal) {
  const station = NOAA_STATIONS[portId];
  if (!station) return null;
  const cached = WATER_CACHE.get(station);
  if (cacheFresh(cached)) return cached.data;
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level` +
    `&application=voyageiq&format=json&datum=MSL&units=metric&time_zone=gmt` +
    `&interval=6&station=${station}&range=24`;
  const data = await fetchJson(url, signal);
  const latest = data?.data?.[data.data.length - 1];
  const result = latest ? { ...latest, station } : null;
  WATER_CACHE.set(station, { timestamp: Date.now(), data: result });
  return result;
}

function weatherLabel(code) {
  const map = {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
  };
  return map[code] || 'Marine weather';
}

function formatValue(value, digits = 1, suffix = '') {
  return Number.isFinite(Number(value)) ? `${Number(value).toFixed(digits)}${suffix}` : '--';
}

function directionLabel(deg) {
  if (!Number.isFinite(Number(deg))) return '--';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(Number(deg) / 45) % 8];
}

function formatPassages(passages) {
  if (!passages?.length) return 'Eurostat SeaRoute / MARNET network';
  const labels = {
    suez: 'Suez Canal', panama: 'Panama Canal', malacca: 'Strait of Malacca',
    hormuz: 'Strait of Hormuz', gibraltar: 'Gibraltar', babelmandeb: 'Bab el-Mandeb',
    babalmandab: 'Bab el-Mandeb', dover: 'Dover Strait', kiel: 'Kiel Canal',
    corinth: 'Corinth Canal', bering: 'Bering Strait', magellan: 'Strait of Magellan',
    cape: 'Cape of Good Hope',
  };
  return passages.map((p) => labels[String(p).toLowerCase()] || String(p)).join(' · ');
}

function formatDistance(nm) {
  if (!Number.isFinite(nm)) return '--';
  const km = nm * NM_TO_KM;
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km).toLocaleString()} km`;
}

function formatDuration(hours) {
  if (!Number.isFinite(hours)) return '--';
  const days = Math.floor(hours / 24);
  const remaining = Math.round(hours % 24);
  return `${days}d ${remaining}h`;
}

function formatClock(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const CORRIDORS = [
  { id: 'europe-suez', points: [[51.9, 3.3], [49.5, -1.5], [43.5, -7.5], [38.2, -8.8], [36.0, -6.0], [36.1, -5.45], [37.0, -2.0], [38.0, 4.0], [36.5, 12.0], [35.0, 18.0], [33.5, 25.0], [31.8, 30.5], [31.2, 32.3], [29.95, 32.55]] },
  { id: 'suez-red-sea', points: [[29.95, 32.55], [27.5, 34.0], [24.0, 36.0], [21.0, 37.8], [17.0, 39.0], [14.0, 41.0], [12.6, 43.2], [12.6, 45.0]] },
  { id: 'arabian-sea', points: [[12.6, 45.0], [13.5, 48.0], [14.5, 52.0], [16.0, 56.0], [16.5, 60.0], [16.0, 65.0], [17.0, 69.0], [18.0, 72.0], [12.0, 75.0], [7.0, 78.5], [6.9, 79.7]] },
  { id: 'hormuz', points: [[25.0, 55.5], [25.2, 57.0], [25.0, 59.0], [24.0, 61.0], [22.0, 63.0], [19.0, 65.0]] },
  { id: 'malacca', points: [[6.9, 79.7], [5.5, 84.0], [4.0, 89.0], [3.0, 94.0], [2.0, 98.0], [2.0, 101.0], [1.3, 103.8]] },
  { id: 'se-asia-china', points: [[1.3, 103.8], [5.0, 106.0], [9.0, 110.0], [13.0, 113.0], [17.0, 114.0], [20.0, 113.8], [22.3, 114.2], [25.0, 116.0], [28.0, 119.0], [31.2, 121.4]] },
  { id: 'east-asia', points: [[31.2, 121.4], [33.0, 125.0], [35.0, 129.0], [35.5, 134.0], [35.7, 139.7]] },
  { id: 'pacific-north', points: [[35.7, 139.7], [38.0, 150.0], [40.0, 160.0], [40.0, 170.0], [39.0, 179.0], [40.0, -170.0], [39.0, -160.0], [38.0, -150.0], [36.0, -140.0], [35.0, -130.0], [34.0, -122.0], [33.7, -118.3]] },
  { id: 'pacific-canada', points: [[49.2, -123.2], [48.0, -135.0], [45.0, -145.0], [43.0, -155.0], [42.0, -165.0], [41.0, -175.0], [40.0, 175.0], [39.0, 165.0], [37.0, 153.0], [35.7, 139.7]] },
  { id: 'panama-pacific', points: [[9.1, -79.4], [11.0, -82.0], [13.0, -88.0], [16.0, -96.0], [19.0, -104.0], [23.0, -112.0], [28.0, -117.0], [33.7, -118.3]] },
  { id: 'panama-atlantic', points: [[9.1, -79.4], [12.0, -77.0], [15.0, -75.0], [20.0, -73.0], [25.0, -75.0], [30.0, -72.0], [35.0, -68.0], [40.0, -65.0], [40.5, -60.0], [42.0, -50.0], [45.0, -40.0], [48.0, -30.0], [50.0, -20.0], [51.0, -10.0], [51.9, 0.0]] },
  { id: 'south-atlantic', points: [[-34.0, 18.0], [-35.0, 12.0], [-34.0, 5.0], [-32.0, -5.0], [-29.0, -15.0], [-25.0, -25.0], [-22.0, -35.0], [-24.0, -46.0]] },
  { id: 'west-africa-cape', points: [[6.0, 3.0], [2.0, 0.0], [-4.0, -2.0], [-10.0, -5.0], [-16.0, -2.0], [-23.0, 5.0], [-29.0, 12.0], [-34.0, 18.0]] },
  { id: 'east-africa', points: [[-34.0, 18.0], [-31.0, 25.0], [-29.8, 31.0], [-23.0, 36.0], [-15.0, 40.0], [-5.0, 40.0], [2.0, 45.0], [8.0, 50.0]] },
  { id: 'australia-asia', points: [[-32.0, 115.0], [-25.0, 112.0], [-18.0, 112.0], [-12.0, 115.0], [-7.0, 110.0], [-3.0, 105.0], [1.3, 103.8]] },
  { id: 'australia-east', points: [[-37.8, 145.0], [-36.0, 150.0], [-33.9, 151.2], [-31.0, 154.0], [-27.0, 158.0], [-22.0, 162.0], [-20.0, 170.0], [-25.0, 175.0], [-32.0, 178.0], [-36.8, 174.7]] },
];

const CHOKEPOINTS = [
  { id: 'suez-gate', name: 'Suez Canal', lat: 30.1, lng: 32.35, kind: 'CANAL' },
  { id: 'panama-gate', name: 'Panama Canal', lat: 9.1, lng: -79.55, kind: 'CANAL' },
  { id: 'malacca-gate', name: 'Strait of Malacca', lat: 2.2, lng: 101.2, kind: 'STRAIT' },
  { id: 'hormuz-gate', name: 'Strait of Hormuz', lat: 26.0, lng: 56.5, kind: 'STRAIT' },
  { id: 'gibraltar-gate', name: 'Gibraltar', lat: 36.1, lng: -5.5, kind: 'STRAIT' },
  { id: 'bab-gate', name: 'Bab el Mandeb', lat: 12.6, lng: 43.4, kind: 'STRAIT' },
  { id: 'cape-gate', name: 'Cape of Good Hope', lat: -34.0, lng: 18.0, kind: 'ROUTE' },
];

const VESSEL_TYPES = [
  { id: 'container', label: 'Container', color: '#22d3ee', speed: 18 },
  { id: 'tanker', label: 'Tanker', color: '#f59e0b', speed: 14 },
  { id: 'bulk', label: 'Bulk carrier', color: '#a78bfa', speed: 13 },
  { id: 'lng', label: 'LNG', color: '#34d399', speed: 16 },
];

const SHIP_PAIRS = [
  ['mumbai', 'rotterdam'], ['singapore', 'rotterdam'], ['shanghai', 'rotterdam'],
  ['tokyo', 'los-angeles'], ['los-angeles', 'shanghai'], ['new-york', 'panama'],
  ['panama', 'los-angeles'], ['mumbai', 'singapore'], ['dubai', 'singapore'],
  ['jebel-ali', 'rotterdam'], ['santos', 'rotterdam'], ['cape-town', 'rotterdam'],
  ['durban', 'singapore'], ['mombasa', 'mumbai'], ['perth', 'singapore'],
  ['sydney', 'singapore'], ['melbourne', 'singapore'], ['hong-kong', 'busan'],
  ['busan', 'tokyo'], ['chennai', 'singapore'], ['colombo', 'singapore'],
  ['hamburg', 'new-york'], ['antwerp', 'new-york'], ['london', 'new-york'],
  ['lagos', 'rotterdam'],
];

const WORLD_CENTER = [18, 20];

function haversineNm(a, b) {
  const R = 3440.065;
  const toRad = (v) => (v * Math.PI) / 180;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLat = lat2 - lat1;
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function normalizeLng(lng) {
  let x = lng;
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
}

function unwrapLng(lng, reference) {
  let x = lng;
  while (x - reference > 180) x -= 360;
  while (x - reference < -180) x += 360;
  return x;
}

function interpolate(a, b, t) {
  const lngB = unwrapLng(b[1], a[1]);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (lngB - a[1]) * t];
}

function routeDistance(path) {
  let total = 0;
  for (let i = 1; i < path.length; i += 1) total += haversineNm(path[i - 1], path[i]);
  return total;
}

function routeFeatureToPath(feature) {
  if (!feature?.geometry) return [];
  if (feature.geometry.type === 'LineString') {
    return feature.geometry.coordinates.map(([lng, lat]) => [lat, normalizeLng(lng)]);
  }
  if (feature.geometry.type === 'MultiLineString') {
    return feature.geometry.coordinates.flatMap((line) =>
      line.map(([lng, lat]) => [lat, normalizeLng(lng)]),
    );
  }
  return [];
}

function calculateMaritimeRoute(origin, destination) {
  if (!origin || !destination) return null;
  try {
    const feature = seaRoute([origin.lng, origin.lat], [destination.lng, destination.lat], {
      units: 'nauticalmiles',
      speedKnots: 16.2,
      returnPassages: true,
      antimeridian: 'unwrap',
      maxSnapDistanceKm: 150,
    });
    const path = routeFeatureToPath(feature);
    if (path.length < 2) return null;
    const length = Number(feature.properties?.length) || routeDistance(path);
    const hours = Number(feature.properties?.durationHours) || length / 16.2;
    return {
      path,
      distanceNm: length,
      hours,
      days: hours / 24,
      passages: feature.properties?.passages || [],
    };
  } catch (error) {
    console.warn('Eurostat SeaRoute failed:', origin.id, destination.id, error);
    return null;
  }
}

function createShipIcon(color, heading = 0) {
  return L.divIcon({
    className: 'vessel-marker-wrap',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `
      <div class="vessel-marker" style="--vessel-color:${color};transform:rotate(${heading}deg)">
        <svg viewBox="0 0 34 34" aria-hidden="true">
          <path d="M17 2 L29 27 L17 23 L5 27 Z" fill="${color}" fill-opacity=".95" stroke="#020617" stroke-width="2"/>
          <path d="M17 7 L17 24" stroke="#fff" stroke-width="1.5" stroke-opacity=".75"/>
        </svg>
      </div>
    `,
  });
}

const SHIP_ICON_CACHE = new Map();

function getShipIcon(color, heading) {
  const h = Math.round(Number(heading) / 5) * 5;
  const key = `${color}:${h}`;
  let icon = SHIP_ICON_CACHE.get(key);
  if (!icon) {
    icon = createShipIcon(color, h);
    SHIP_ICON_CACHE.set(key, icon);
  }
  return icon;
}

function interpolatePath(path, progress) {
  if (!path?.length) return null;
  if (path.length === 1) return { point: path[0], heading: 0 };
  const segmentLengths = [];
  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    const d = haversineNm(path[i - 1], path[i]);
    segmentLengths.push(d);
    total += d;
  }
  const target = Math.max(0, Math.min(1, progress)) * total;
  let accumulated = 0;
  for (let i = 1; i < path.length; i += 1) {
    const length = segmentLengths[i - 1];
    if (accumulated + length >= target) {
      const local = length ? (target - accumulated) / length : 0;
      const a = path[i - 1];
      const b = path[i];
      const point = interpolate(a, b, local);
      const lat1 = (a[0] * Math.PI) / 180;
      const lat2 = (b[0] * Math.PI) / 180;
      const dLng = ((unwrapLng(b[1], a[1]) - a[1]) * Math.PI) / 180;
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      const heading = (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
      return { point: [point[0], normalizeLng(point[1])], heading };
    }
    accumulated += length;
  }
  return { point: path[path.length - 1], heading: 0 };
}

function MapViewport({ route }) {
  const map = useMap();
  useEffect(() => {
    if (!route?.path?.length) {
      map.setView(WORLD_CENTER, 2);
      return;
    }
    map.fitBounds(L.latLngBounds(route.path), { padding: [30, 30], maxZoom: 5, animate: true });
  }, [map, route]);
  return null;
}

function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    let frame1 = 0;
    let frame2 = 0;
    let resizeObserver;
    let mutationObserver;
    const refreshMapSize = () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      frame1 = requestAnimationFrame(() => {
        map.invalidateSize({ animate: false, pan: false });
        frame2 = requestAnimationFrame(() => map.invalidateSize({ animate: false, pan: false }));
      });
    };
    refreshMapSize();
    window.addEventListener('resize', refreshMapSize);
    window.addEventListener('orientationchange', refreshMapSize);
    const container = map.getContainer();
    const parent = container.parentElement;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(refreshMapSize);
      resizeObserver.observe(container);
      if (parent) resizeObserver.observe(parent);
    }
    if (typeof MutationObserver !== 'undefined' && parent) {
      mutationObserver = new MutationObserver(refreshMapSize);
      mutationObserver.observe(parent, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    const timers = [0, 50, 100, 200, 350, 500, 800, 1200, 1800].map((d) => window.setTimeout(refreshMapSize, d));
    if (document.fonts?.ready) document.fonts.ready.then(refreshMapSize).catch(() => {});
    return () => {
      window.removeEventListener('resize', refreshMapSize);
      window.removeEventListener('orientationchange', refreshMapSize);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [map]);
  return null;
}

function MapClickDeselect({ selectedShipId, onClear }) {
  useMapEvents({
    click: () => {
      if (selectedShipId) onClear();
    },
  });
  return null;
}

function createSelectionRingIcon(heading) {
  return L.divIcon({
    className: 'selection-ring-wrap',
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    html: `
      <div class="selection-ring">
        <div class="selection-ring-circle"></div>
        <div class="selection-ring-heading" style="--heading-rotation:${heading}deg"></div>
      </div>
    `,
  });
}

function bearingBetween(a, b) {
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const dLng = ((unwrapLng(b[1], a[1]) - a[1]) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

function DirectionCompass({ heading }) {
  const hasShip = Number.isFinite(heading);
  const deg = hasShip ? heading : 0;
  return (
    <div className="direction-compass" title={hasShip ? `Heading ${Math.round(deg)}°` : 'North'}>
      <div className="direction-compass-ring">
        <span className="direction-n">N</span>
        <span className="direction-e">E</span>
        <span className="direction-s">S</span>
        <span className="direction-w">W</span>
        <div
          className={`direction-needle ${hasShip ? 'active' : ''}`}
          style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
        />
        <div className="direction-hub" />
      </div>
      <div className="direction-label">{hasShip ? `${Math.round(deg)}° ${directionLabel(deg)}` : 'N'}</div>
    </div>
  );
}

function RadarScope({ vessels, selectedShipId, onSelect }) {
  const selected = vessels.find((ship) => ship.id === selectedShipId);
  const contacts = vessels.slice(0, 10);
  return (
    <div className="radar-widget">
      <div className="radar-label">RADAR SCOPE {selected ? `· ${selected.id}` : ''}</div>
      <div className="radar-scope">
        <div className="radar-grid-circle circle-1" />
        <div className="radar-grid-circle circle-2" />
        <div className="radar-grid-circle circle-3" />
        <div className="radar-cross cross-x" />
        <div className="radar-cross cross-y" />
        <div className="radar-sweep" />
        {contacts.map((ship, index) => {
          let angle;
          let radius;
          if (selected) {
            if (ship.id === selected.id) {
              angle = selected.heading;
              radius = 0;
            } else {
              const distance = haversineNm(selected.point, ship.point);
              angle = bearingBetween(selected.point, ship.point);
              radius = Math.min(43, 8 + Math.sqrt(Math.max(distance, 1)) * 0.65);
            }
          } else {
            angle = (index * 47 + ship.progress * 80) % 360;
            radius = 20 + ((index * 17) % 42);
          }
          const x = 50 + Math.cos(((angle - 90) * Math.PI) / 180) * radius;
          const y = 50 + Math.sin(((angle - 90) * Math.PI) / 180) * radius;
          return (
            <button
              key={ship.id}
              type="button"
              aria-label={`Select ${ship.id}`}
              className={`radar-contact ${ship.id === selectedShipId ? 'selected' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, background: ship.color, '--contact-color': ship.color }}
              onClick={() => onSelect(ship.id)}
            />
          );
        })}
        <span className="radar-center" />
      </div>
    </div>
  );
}

export default function RouteRadarPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [originId, setOriginId] = useState('mumbai');
  const [destinationId, setDestinationId] = useState('panama');
  const [route, setRoute] = useState(null);
  const [routeError, setRouteError] = useState('');
  const [routeLoading, setRouteLoading] = useState(false);
  const [ships, setShips] = useState([]);
  const [paused, setPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedShipId, setSelectedShipId] = useState(null);
  const [weather, setWeather] = useState(null);
  const [marine, setMarine] = useState(null);
  const [portMarine, setPortMarine] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [environmentLoading, setEnvironmentLoading] = useState(false);
  const [environmentError, setEnvironmentError] = useState('');
  const [selectedPortId, setSelectedPortId] = useState('mumbai');

  const routeCache = useRef(new Map());
  const rafRef = useRef(null);
  const lastFrameRef = useRef(performance.now());
  const markerRefs = useRef(new Map());
  const markerRefCallbacks = useRef(new Map());
  const mapInstanceRef = useRef(null);

  const clearSelection = useCallback(() => {
    setSelectedShipId(null);
    setWeather(null);
    setMarine(null);
    setEnvironmentError('');
  }, []);

  const getMarkerRefCallback = useCallback((shipId) => {
    if (!markerRefCallbacks.current.has(shipId)) {
      markerRefCallbacks.current.set(shipId, (marker) => {
        if (marker) markerRefs.current.set(shipId, marker);
        else markerRefs.current.delete(shipId);
      });
    }
    return markerRefCallbacks.current.get(shipId);
  }, []);

  const getRoute = useCallback((fromId, toId) => {
    if (fromId === toId) return null;
    const key = `${fromId}:${toId}`;
    const reverseKey = `${toId}:${fromId}`;
    if (routeCache.current.has(key)) return routeCache.current.get(key);
    if (routeCache.current.has(reverseKey)) {
      const reversed = routeCache.current.get(reverseKey);
      const result = { ...reversed, path: [...reversed.path].reverse() };
      routeCache.current.set(key, result);
      return result;
    }
    const result = calculateMaritimeRoute(PORT_BY_ID[fromId], PORT_BY_ID[toId]);
    if (result) routeCache.current.set(key, result);
    return result;
  }, []);

  const calculateSelectedRoute = useCallback(() => {
    setRouteLoading(true);
    setRouteError('');
    window.setTimeout(() => {
      const result = getRoute(originId, destinationId);
      if (!result) {
        setRoute(null);
        setRouteError('No MARNET corridor found for this port pair. Try another major port.');
      } else {
        setRoute(result);
      }
      setRouteLoading(false);
    }, 30);
  }, [destinationId, getRoute, originId]);

  useEffect(() => {
    calculateSelectedRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const generated = [];
    SHIP_PAIRS.forEach(([fromId, toId], index) => {
      const result = getRoute(fromId, toId);
      if (!result?.path?.length) return;
      const vesselType = VESSEL_TYPES[index % VESSEL_TYPES.length];
      generated.push({
        id: `OCA-SIM-${String(index + 1).padStart(3, '0')}`,
        fromId,
        toId,
        type: vesselType.id,
        typeLabel: vesselType.label,
        color: vesselType.color,
        speed: vesselType.speed,
        path: result.path,
        passages: result.passages || [],
        progress: (index * 0.137) % 1,
        direction: 1,
      });
    });
    setShips(generated);
  }, [getRoute]);

  useEffect(() => {
    const tick = (now) => {
      const deltaSeconds = Math.min(0.5, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      if (!paused) {
        setShips((current) =>
          current.map((ship) => {
            const distanceNm = routeDistance(ship.path);
            const distanceMovedNm = (ship.speed * deltaSeconds) / 3600;
            const progressChange = distanceMovedNm / Math.max(distanceNm, 1);
            let progress = ship.progress + progressChange * ship.direction;
            let direction = ship.direction;
            if (progress >= 1) {
              progress = 1;
              direction = -1;
            }
            if (progress <= 0) {
              progress = 0;
              direction = 1;
            }
            return { ...ship, progress, direction };
          }),
        );
        setLastUpdate(new Date());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  const displayedShips = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ships.filter((ship) => {
      const matchesSearch =
        !q ||
        ship.id.toLowerCase().includes(q) ||
        PORT_BY_ID[ship.fromId]?.name.toLowerCase().includes(q) ||
        PORT_BY_ID[ship.toId]?.name.toLowerCase().includes(q);
      return matchesSearch && (selectedType === 'all' || ship.type === selectedType);
    });
  }, [search, selectedType, ships]);

  const livePositions = useMemo(
    () =>
      displayedShips
        .map((ship) => {
          const position = interpolatePath(ship.path, ship.progress);
          return position ? { ...ship, ...position } : null;
        })
        .filter(Boolean),
    [displayedShips],
  );

  const origin = PORT_BY_ID[originId];
  const destination = PORT_BY_ID[destinationId];
  const selectedShip = livePositions.find((s) => s.id === selectedShipId) || null;
  const selectedPort = PORT_BY_ID[selectedPortId];
  const selectedLatKey = selectedShip?.point?.[0]?.toFixed(2) ?? null;
  const selectedLngKey = selectedShip?.point?.[1]?.toFixed(2) ?? null;

  useEffect(() => {
    if (!selectedShipId) {
      mapInstanceRef.current?.closePopup();
      return undefined;
    }
    let cancelled = false;
    const open = () => {
      if (cancelled) return;
      const marker = markerRefs.current.get(selectedShipId);
      if (marker) {
        marker.openPopup();
        marker.bringToFront?.();
      }
    };
    const timers = [0, 50, 150, 300, 600].map((d) => window.setTimeout(open, d));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [selectedShipId]);

  useEffect(() => {
    if (!selectedShipId || selectedLatKey == null || selectedLngKey == null) {
      setWeather(null);
      setMarine(null);
      setEnvironmentError('');
      return undefined;
    }
    const lat = Number(selectedLatKey);
    const lng = Number(selectedLngKey);
    const controller = new AbortController();
    let active = true;
    setEnvironmentLoading(true);
    setEnvironmentError('');
    Promise.all([
      fetchShipWeather(lat, lng, controller.signal),
      fetchMarineConditions(lat, lng, controller.signal),
    ])
      .then(([w, m]) => {
        if (!active) return;
        setWeather(w);
        setMarine(m);
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && active) {
          setEnvironmentError('Environmental data could not be loaded right now.');
        }
      })
      .finally(() => {
        if (active) setEnvironmentLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedShipId, selectedLatKey, selectedLngKey]);

  useEffect(() => {
    if (!selectedPort) return undefined;
    const controller = new AbortController();
    fetchMarineConditions(selectedPort.lat, selectedPort.lng, controller.signal)
      .then(setPortMarine)
      .catch(() => {});
    fetchNoaaWaterLevel(selectedPort.id, controller.signal)
      .then(setWaterLevel)
      .catch(() => setWaterLevel(null));
    return () => controller.abort();
  }, [selectedPortId]);

  const swapPorts = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  return (
    <div className="route-radar-page">
      <style>{`
        /* Base Variables & Structural Layout */
        .route-radar-page {
          --bg: #020617;
          --line: rgba(148, 163, 184, .15);
          --text: #e5eef8;
          height: calc(100dvh - 94px);
          min-height: 0;
          width: 100%;
          margin-left: 0;
          overflow: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .cargo-layout { display: flex; height: 100%; min-height: 0; width: 100%; }

        /* Dark Mode Monitor (Default) */
        .cargo-monitor {
          width: 470px;
          min-width: 470px;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background: linear-gradient(180deg, #06101d 0%, #030a14 100%);
          border-right: 1px solid var(--line);
          scrollbar-width: thin;
          scrollbar-color: #1e3a52 transparent;
        }
        .cargo-monitor::-webkit-scrollbar { width: 7px; }
        .cargo-monitor::-webkit-scrollbar-thumb { background: #1e3a52; border-radius: 10px; }
        .monitor-inner { padding: 14px 14px 22px; }
        .monitor-header { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
        .eyebrow { font-size: 12px; letter-spacing: .2em; color: #5e7892; font-weight: 800; }
        .monitor-title { font-size: 29px; line-height: 1.05; font-weight: 900; letter-spacing: .04em; margin-top: 4px; }
        .monitor-subtitle { font-size: 12px; color: #7890a9; margin-top: 5px; letter-spacing: .09em; }
        .status-pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(34, 211, 238, .25); background: rgba(34, 211, 238, .08); color: #67e8f9; padding: 5px 8px; border-radius: 999px; font-size: 14px; font-weight: 900; letter-spacing: .08em; white-space: nowrap; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 10px #22d3ee; }
        .section { border: 1px solid var(--line); background: rgba(7, 17, 31, .82); border-radius: 10px; margin-top: 10px; padding: 10px; }
        .section-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .section-title { display: flex; align-items: center; gap: 6px; font-size: 17px; letter-spacing: .1em; color: #9fb2c5; font-weight: 900; text-transform: uppercase; }
        .section-count { font-size: 15px; color: #66829a; }
        .search-box { display: flex; align-items: center; gap: 8px; border: 1px solid rgba(148, 163, 184, .15); background: #030b15; border-radius: 8px; padding: 8px 9px; }
        .search-box svg { color: #4f718b; flex: none; }
        .search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: #dce8f4; font-size: 14px; }
        .search-box input::placeholder { color: #456078; }
        .filter-row { display: flex; gap: 5px; overflow-x: auto; margin-top: 8px; }
        .filter-row::-webkit-scrollbar { display: none; }
        .filter-btn { border: 1px solid rgba(148, 163, 184, .12); background: #071321; color: #718aa0; padding: 7px 9px; border-radius: 6px; font-size: 11px; white-space: nowrap; cursor: pointer; }
        .filter-btn.active { border-color: rgba(34, 211, 238, .35); background: rgba(34, 211, 238, .1); color: #67e8f9; }
        .route-grid { display: grid; grid-template-columns: 1fr 30px 1fr; align-items: end; gap: 7px; }
        .field-label { font-size: 13px; color: #59728a; text-transform: uppercase; letter-spacing: .11em; margin-bottom: 4px; font-weight: 800; }
        .select-wrap { position: relative; }
        .select-wrap select { width: 100%; appearance: none; border: 1px solid rgba(148, 163, 184, .14); background: #030b15; color: #dbeafe; border-radius: 7px; padding: 8px 25px 8px 8px; font-size: 14px; outline: none; }
        .select-wrap svg { position: absolute; right: 7px; bottom: 9px; color: #506a82; pointer-events: none; }
        .swap-btn { height: 30px; width: 30px; border-radius: 7px; border: 1px solid rgba(34, 211, 238, .2); background: #061525; color: #4dd7ec; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .route-button { width: 100%; margin-top: 8px; border: 1px solid rgba(34, 211, 238, .35); background: linear-gradient(90deg, rgba(8, 145, 178, .24), rgba(34, 211, 238, .08)); color: #a5f3fc; border-radius: 7px; padding: 10px; font-size: 13px; font-weight: 900; letter-spacing: .1em; cursor: pointer; }
        .route-button:disabled { opacity: .45; cursor: not-allowed; }
        .route-error { margin-top: 7px; padding: 7px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, .22); background: rgba(239, 68, 68, .07); color: #fca5a5; font-size: 12px; line-height: 1.4; }
        .route-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px; }
        .metric { background: #030b15; border: 1px solid rgba(148, 163, 184, .1); border-radius: 7px; padding: 7px; }
        .metric-value { font-size: 20px; font-weight: 900; color: #e7f5ff; }
        .metric-label { font-size: 12px; color: #526d85; text-transform: uppercase; letter-spacing: .08em; margin-top: 2px; }
        .route-caption { font-size: 14px; color: #688198; margin-top: 8px; line-height: 1.45; }
        .route-line { height: 1px; background: linear-gradient(90deg, #22d3ee, rgba(34, 211, 238, .05)); margin: 8px 0; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .stat-card { display: flex; gap: 8px; align-items: center; padding: 8px; border-radius: 7px; background: #030b15; border: 1px solid rgba(148, 163, 184, .09); }
        .stat-icon { width: 27px; height: 27px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(34, 211, 238, .08); color: #4dd7ec; }
        .stat-number { font-size: 20px; font-weight: 900; }
        .stat-label { font-size: 12px; color: #6c879e; text-transform: uppercase; letter-spacing: .06em; }
        .ship-list { display: flex; flex-direction: column; gap: 5px; }
        .ship-row { display: grid; grid-template-columns: 24px 1fr auto; gap: 7px; align-items: center; background: #030b15; border: 1px solid rgba(148, 163, 184, .08); padding: 6px; border-radius: 7px; cursor: pointer; }
        .ship-row.selected { border-color: rgba(34, 211, 238, .45); background: rgba(34, 211, 238, .08); }
        .ship-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
        .ship-name { font-size: 15px; font-weight: 900; color: #dce9f5; }
        .ship-route { font-size: 13px; color: #66839b; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ship-type { font-size: 11px; color: #7e96aa; text-align: right; }
        .monitor-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: #3f5b72; font-size: 10px; letter-spacing: .05em; }
        .pause-btn { border: 1px solid rgba(148, 163, 184, .12); background: #06101c; color: #71889d; border-radius: 6px; padding: 5px 7px; display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 8px; }
        .pause-btn.active { color: #fbbf24; border-color: rgba(245, 158, 11, .22); }
        .reference-note { font-size: 12px; color: #5f819a; margin-top: 7px; line-height: 1.35; }
        
        /* Map Viewport Base */
        .cargo-map-pane { position: relative; min-width: 0; flex: 1; height: 100%; overflow: hidden; background: #020617; }
        .cargo-map { height: 100%; width: 100%; background: #071321; }

        /* Tile Brightness & Filters */
        .cargo-map .leaflet-tile { filter: brightness(0.78) contrast(1.08) saturate(0.9) hue-rotate(6deg); }
        
        .route-radar-page.dark-mode .cargo-map .leaflet-tile,
        body.dark .cargo-map .leaflet-tile,
        [data-theme="dark"] .cargo-map .leaflet-tile {
          filter: brightness(0.52) contrast(1.18) saturate(0.82) hue-rotate(10deg);
        }

        /* Improved Light Mode Map Tile Rendering */
        .route-radar-page.light-mode .cargo-map-pane,
        body.light .cargo-map-pane,
        [data-theme="light"] .cargo-map-pane,
        .route-radar-page.light-mode .cargo-map,
        body.light .cargo-map,
        [data-theme="light"] .cargo-map {
          background: #e2e8f0 !important;
        }

        .route-radar-page.light-mode .cargo-map .leaflet-tile,
        body.light .cargo-map .leaflet-tile,
        [data-theme="light"] .cargo-map .leaflet-tile {
          filter: brightness(1.08) contrast(1.02) saturate(1.15) hue-rotate(0deg) !important;
        }

        /* ===== WHITE / LIGHT MODE - MONITOR & UI ===== */
        .route-radar-page.light-mode .cargo-monitor,
        body.light .cargo-monitor,
        [data-theme="light"] .cargo-monitor {
          background: #ffffff !important;
          border-right: 1px solid #e2e8f0 !important;
          color: #0f172a !important;
        }

        .route-radar-page.light-mode .section,
        body.light .section,
        [data-theme="light"] .section {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .route-radar-page.light-mode .eyebrow,
        body.light .eyebrow,
        [data-theme="light"] .eyebrow { color: #64748b !important; }

        .route-radar-page.light-mode .monitor-title,
        body.light .monitor-title,
        [data-theme="light"] .monitor-title { color: #0f172a !important; }

        .route-radar-page.light-mode .monitor-subtitle,
        body.light .monitor-subtitle,
        [data-theme="light"] .monitor-subtitle { color: #475569 !important; }

        .route-radar-page.light-mode .section-title,
        body.light .section-title,
        [data-theme="light"] .section-title { color: #1e293b !important; }

        .route-radar-page.light-mode .section-count,
        body.light .section-count,
        [data-theme="light"] .section-count { color: #64748b !important; }

        .route-radar-page.light-mode .search-box,
        body.light .search-box,
        [data-theme="light"] .search-box {
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
        }

        .route-radar-page.light-mode .search-box input,
        body.light .search-box input,
        [data-theme="light"] .search-box input { color: #0f172a !important; }

        .route-radar-page.light-mode .search-box input::placeholder,
        body.light .search-box input::placeholder,
        [data-theme="light"] .search-box input::placeholder { color: #94a3b8 !important; }

        .route-radar-page.light-mode .select-wrap select,
        body.light .select-wrap select,
        [data-theme="light"] .select-wrap select,
        .route-radar-page.light-mode .port-select,
        body.light .port-select,
        [data-theme="light"] .port-select {
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
        }

        .route-radar-page.light-mode .swap-btn,
        body.light .swap-btn,
        [data-theme="light"] .swap-btn {
          background: #f1f5f9 !important;
          border: 1px solid #cbd5e1 !important;
          color: #0284c7 !important;
        }

        .route-radar-page.light-mode .metric,
        body.light .metric,
        [data-theme="light"] .metric,
        .route-radar-page.light-mode .stat-card,
        body.light .stat-card,
        [data-theme="light"] .stat-card,
        .route-radar-page.light-mode .env-card,
        body.light .env-card,
        [data-theme="light"] .env-card {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
        }

        .route-radar-page.light-mode .metric-value,
        body.light .metric-value,
        [data-theme="light"] .metric-value,
        .route-radar-page.light-mode .stat-number,
        body.light .stat-number,
        [data-theme="light"] .stat-number,
        .route-radar-page.light-mode .env-value,
        body.light .env-value,
        [data-theme="light"] .env-value { color: #0f172a !important; }

        .route-radar-page.light-mode .metric-label,
        body.light .metric-label,
        [data-theme="light"] .metric-label,
        .route-radar-page.light-mode .stat-label,
        body.light .stat-label,
        [data-theme="light"] .stat-label,
        .route-radar-page.light-mode .env-label,
        body.light .env-label,
        [data-theme="light"] .env-label { color: #64748b !important; }

        .route-radar-page.light-mode .ship-row,
        body.light .ship-row,
        [data-theme="light"] .ship-row {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
        }

        .route-radar-page.light-mode .ship-row.selected,
        body.light .ship-row.selected,
        [data-theme="light"] .ship-row.selected {
          background: #e0f2fe !important;
          border-color: #38bdf8 !important;
        }

        .route-radar-page.light-mode .ship-name,
        body.light .ship-name,
        [data-theme="light"] .ship-name { color: #0f172a !important; }

        .route-radar-page.light-mode .ship-route,
        body.light .ship-route,
        [data-theme="light"] .ship-route { color: #64748b !important; }

        .route-radar-page.light-mode .route-button,
        body.light .route-button,
        [data-theme="light"] .route-button {
          background: linear-gradient(90deg, #0284c7, #38bdf8) !important;
          border: 1px solid #0284c7 !important;
          color: #ffffff !important;
        }

        .route-radar-page.light-mode .filter-btn,
        body.light .filter-btn,
        [data-theme="light"] .filter-btn {
          background: #f1f5f9 !important;
          border: 1px solid #cbd5e1 !important;
          color: #475569 !important;
        }

        .route-radar-page.light-mode .filter-btn.active,
        body.light .filter-btn.active,
        [data-theme="light"] .filter-btn.active {
          background: #e0f2fe !important;
          border-color: #38bdf8 !important;
          color: #0369a1 !important;
        }

        .route-radar-page.light-mode .status-pill,
        body.light .status-pill,
        [data-theme="light"] .status-pill {
          background: #e0f2fe !important;
          border: 1px solid #7dd3fc !important;
          color: #0369a1 !important;
        }

        .route-radar-page.light-mode .monitor-footer,
        body.light .monitor-footer,
        [data-theme="light"] .monitor-footer { color: #64748b !important; }

        .route-radar-page.light-mode .pause-btn,
        body.light .pause-btn,
        [data-theme="light"] .pause-btn {
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          color: #475569 !important;
        }

        .route-radar-page.light-mode .reference-note,
        body.light .reference-note,
        [data-theme="light"] .reference-note,
        .route-radar-page.light-mode .route-caption,
        body.light .route-caption,
        [data-theme="light"] .route-caption { color: #64748b !important; }

        /* Map Controls Floating Overlay in Light Mode */
        .route-radar-page.light-mode .map-title-card,
        body.light .map-title-card,
        [data-theme="light"] .map-title-card,
        .route-radar-page.light-mode .map-time-card,
        body.light .map-time-card,
        [data-theme="light"] .map-time-card,
        .route-radar-page.light-mode .map-legend,
        body.light .map-legend,
        [data-theme="light"] .map-legend {
          background: rgba(255, 255, 255, 0.88) !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .route-radar-page.light-mode .map-title-sub,
        body.light .map-title-sub,
        [data-theme="light"] .map-title-sub,
        .route-radar-page.light-mode .legend-row,
        body.light .legend-row,
        [data-theme="light"] .legend-row { color: #475569 !important; }

        .route-radar-page.light-mode .map-actions button,
        body.light .map-actions button,
        [data-theme="light"] .map-actions button {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid #cbd5e1 !important;
          color: #334155 !important;
        }

        /* Map controls & overlays */
        .cargo-map .leaflet-control-zoom a { background: #06111e !important; color: #9fb7ca !important; }
        .route-radar-page.light-mode .cargo-map .leaflet-control-zoom a,
        body.light .cargo-map .leaflet-control-zoom a,
        [data-theme="light"] .cargo-map .leaflet-control-zoom a { background: #ffffff !important; color: #1e293b !important; }

        .map-topbar { position: absolute; z-index: 900; left: 14px; right: 14px; top: 12px; display: flex; justify-content: space-between; pointer-events: none; }
        .map-title-card, .map-time-card { pointer-events: auto; background: rgba(2, 6, 23, .78); border: 1px solid rgba(148, 163, 184, .13); backdrop-filter: blur(8px); border-radius: 8px; padding: 7px 9px; }
        .map-title-card { display: flex; align-items: center; gap: 8px; }
        .map-title { font-size: 14px; font-weight: 900; letter-spacing: .12em; }
        .map-title-sub { font-size: 10px; color: #718ba1; margin-top: 2px; }
        .map-time-card { font-size: 9px; color: #7f98ae; display: flex; gap: 6px; align-items: center; }
        .map-actions { position: absolute; right: 14px; top: 78px; z-index: 1100; display: flex; flex-direction: column; gap: 5px; }
        .map-actions button { width: 30px; height: 30px; border: 1px solid rgba(148, 163, 184, .16); background: rgba(2, 6, 23, .82); color: #86a2b9; border-radius: 7px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .map-actions button:hover { color: #67e8f9; border-color: rgba(34, 211, 238, .3); }
        .direction-compass { position: absolute; right: 14px; top: 152px; z-index: 1100; display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none; }
        .direction-compass-ring { position: relative; width: 56px; height: 56px; border-radius: 50%; background: radial-gradient(circle, rgba(6, 17, 30, .92), rgba(2, 6, 23, .88)); border: 1px solid rgba(34, 211, 238, .35); box-shadow: 0 0 16px rgba(34, 211, 238, .12); }
        .direction-n, .direction-e, .direction-s, .direction-w { position: absolute; font-size: 9px; font-weight: 900; color: #5f788f; }
        .direction-n { top: 3px; left: 50%; transform: translateX(-50%); color: #67e8f9; }
        .direction-e { right: 5px; top: 50%; transform: translateY(-50%); }
        .direction-s { bottom: 3px; left: 50%; transform: translateX(-50%); }
        .direction-w { left: 5px; top: 50%; transform: translateY(-50%); }
        .direction-needle { position: absolute; left: 50%; top: 50%; width: 3px; height: 18px; background: linear-gradient(#94a3b8, transparent); transform-origin: bottom center; border-radius: 2px; }
        .direction-needle.active { background: linear-gradient(#facc15, transparent); box-shadow: 0 0 8px rgba(250, 204, 21, .45); }
        .direction-hub { position: absolute; left: 50%; top: 50%; width: 7px; height: 7px; border-radius: 50%; background: #a5f3fc; transform: translate(-50%, -50%); box-shadow: 0 0 8px #22d3ee; }
        .direction-label { font-size: 9px; font-weight: 900; letter-spacing: .1em; color: #7f98ae; background: rgba(2, 6, 23, .78); border: 1px solid rgba(148, 163, 184, .13); border-radius: 4px; padding: 2px 6px; }
        .map-legend { position: absolute; z-index: 900; right: 14px; bottom: 14px; background: rgba(2, 6, 23, .82); border: 1px solid rgba(148, 163, 184, .13); backdrop-filter: blur(8px); border-radius: 8px; padding: 8px 9px; min-width: 150px; }
        .legend-title { font-size: 8px; letter-spacing: .12em; color: #607990; font-weight: 900; margin-bottom: 6px; }
        .legend-row { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #829bb0; margin-top: 4px; }
        .legend-line { height: 2px; width: 18px; background: #22d3ee; border-radius: 2px; }
        .legend-dot { height: 7px; width: 7px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
        .legend-port { height: 7px; width: 7px; border-radius: 50%; background: #fff; border: 2px solid #22d3ee; box-sizing: border-box; }
        .radar-widget { position: absolute; z-index: 900; right: 18px; bottom: 18px; transform: translateY(-118px); display: flex; flex-direction: column; align-items: center; }
        .radar-label { font-size: 8px; color: #5f788f; letter-spacing: .14em; font-weight: 900; margin-bottom: 5px; }
        .radar-scope { position: relative; width: 170px; height: 170px; border-radius: 50%; overflow: hidden; background: radial-gradient(circle, #092333, #061725 52%, #020912); border: 1px solid rgba(34, 211, 238, .34); }
        .radar-grid-circle { position: absolute; inset: 0; margin: auto; border: 1px solid rgba(34, 211, 238, .12); border-radius: 50%; }
        .circle-1 { width: 70%; height: 70%; } .circle-2 { width: 42%; height: 42%; } .circle-3 { width: 18%; height: 18%; }
        .radar-cross { position: absolute; background: rgba(34, 211, 238, .1); } .cross-x { height: 1px; left: 0; right: 0; top: 50%; } .cross-y { width: 1px; top: 0; bottom: 0; left: 50%; }
        .radar-sweep { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 0deg, transparent 296deg, rgba(34, 211, 238, .48) 354deg, transparent 360deg); animation: radarSpin 3.2s linear infinite; }
        .radar-center { position: absolute; width: 5px; height: 5px; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 50%; background: #a5f3fc; box-shadow: 0 0 10px #22d3ee; }
        .radar-contact { position: absolute; width: 6px; height: 6px; padding: 0; border: 0; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 8px var(--contact-color); cursor: pointer; }
        .radar-contact.selected { width: 11px; height: 11px; border: 2px solid #facc15; box-shadow: 0 0 8px #facc15; }
        @keyframes radarSpin { to { transform: rotate(360deg); } }

        /* Popups & Markers */
        .vessel-detail-popup .leaflet-popup-content-wrapper { min-width: 300px; }
        .vessel-popup { min-width: 285px; }
        .vessel-popup-kicker { font-size: 8px; color: #facc15; letter-spacing: .13em; font-weight: 900; }
        .vessel-popup-title { font-size: 18px; font-weight: 900; margin-top: 3px; color: #e8f7ff; }
        .vessel-popup-route { font-size: 11px; color: #8199ad; margin-top: 5px; } .vessel-popup-route strong { color: #e8f7ff; }
        .vessel-popup-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 9px; }
        .vessel-popup-grid>div { background: #030b15; border: 1px solid rgba(148, 163, 184, .11); border-radius: 6px; padding: 7px; }
        .vessel-popup-grid b { display: block; font-size: 13px; color: #e8f7ff; } .vessel-popup-grid span { display: block; font-size: 7px; color: #5d788f; margin-top: 3px; }
        .vessel-popup-weather { margin-top: 7px; padding: 8px; border-radius: 6px; background: rgba(34, 211, 238, .07); border: 1px solid rgba(34, 211, 238, .14); color: #67e8f9; }
        .vessel-popup-weather b { display: block; font-size: 11px; color: #dffbff; } .vessel-popup-weather span { display: block; font-size: 9px; color: #7895a9; margin-top: 2px; }
        .vessel-popup-hint { font-size: 8px; color: #58748b; margin-top: 7px; line-height: 1.35; }
        .selection-ring-wrap { background: transparent !important; border: 0 !important; pointer-events: none !important; }
        .selection-ring { position: relative; width: 64px; height: 64px; }
        .selection-ring-circle { position: absolute; inset: 6px; border: 2px solid rgba(250, 204, 21, .55); border-radius: 50%; box-shadow: 0 0 14px rgba(250, 204, 21, .3); animation: selectionRingPulse 2.2s ease-in-out infinite; }
        .selection-ring-heading { position: absolute; left: 50%; top: 50%; width: 2px; height: 26px; background: linear-gradient(#facc15, transparent); transform-origin: bottom center; transform: translate(-50%, -100%) rotate(var(--heading-rotation)); }
        @keyframes selectionRingPulse { 50% { transform: scale(1.08); opacity: .7; } }
        .vessel-marker-wrap { background: transparent !important; border: 0 !important; }
        .vessel-marker { width: 34px; height: 34px; filter: drop-shadow(0 0 5px var(--vessel-color)); }
        .vessel-marker svg { width: 34px; height: 34px; display: block; }
        .popup-dark .leaflet-popup-content-wrapper, .popup-dark .leaflet-popup-tip { background: #06111e; color: #dce8f4; border: 1px solid rgba(148, 163, 184, .15); }
        .popup-dark .leaflet-popup-content { margin: 9px 10px; font-size: 10px; }
        .popup-title { font-weight: 900; font-size: 14px; } .popup-muted { color: #6d859a; font-size: 9px; margin-top: 3px; }
        .environment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .env-card { background: #030b15; border: 1px solid rgba(148, 163, 184, .1); border-radius: 7px; padding: 8px; }
        .env-value { font-size: 18px; font-weight: 900; color: #e6f7ff; }
        .env-label { font-size: 11px; color: #68839a; margin-top: 3px; text-transform: uppercase; }
        .env-source { font-size: 11px; color: #5c7890; margin-top: 8px; line-height: 1.4; }
        .port-select { width: 100%; border: 1px solid rgba(148, 163, 184, .14); background: #030b15; color: #dbeafe; border-radius: 7px; padding: 9px; font-size: 14px; outline: none; }
        .selected-route-note { color: #67e8f9; font-size: 12px; margin-top: 6px; }

        /* Responsive Rules */
        @media (max-width: 1150px) { .cargo-monitor { width: 390px; min-width: 390px; } .radar-widget { transform: translateY(-10px) scale(.82); transform-origin: bottom right; } }
        @media (max-width: 800px) { .route-radar-page { height: auto; min-height: calc(100dvh - 94px); overflow: auto; width: 100%; margin-left: 0; } .cargo-layout { display: block; } .cargo-monitor { width: 100%; min-width: 0; border-right: 0; border-bottom: 1px solid var(--line); } .cargo-map-pane { height: 65vh; min-height: 520px; } .radar-widget { transform: scale(.75); transform-origin: bottom right; } }
      `}</style>

      <div className="cargo-layout">
        <aside className="cargo-monitor">
          <div className="monitor-inner">
            <div className="monitor-header">
              <div>
                <div className="eyebrow">OCEANCHARTER AI</div>
                <div className="monitor-title">ROUTE RADAR</div>
                <div className="monitor-subtitle">GLOBAL MARITIME MONITOR</div>
                <div className="reference-note">ROUTES: EUROSTAT MARNET · WEATHER: OPEN-METEO · DISTANCE: KM</div>
              </div>
              <div className="status-pill"><span className="status-dot" /> SIM + LIVE WX</div>
            </div>

            <section className="section">
              <div className="section-head">
                <div className="section-title"><Search size={12} /> Vessel search</div>
                <div className="section-count">{displayedShips.length} tracked</div>
              </div>
              <div className="search-box">
                <Search size={13} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Vessel ID or port..." />
                {search && <X size={13} style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
              </div>
              <div className="filter-row">
                <button type="button" className={`filter-btn ${selectedType === 'all' ? 'active' : ''}`} onClick={() => setSelectedType('all')}>All</button>
                {VESSEL_TYPES.map((t) => (
                  <button key={t.id} type="button" className={`filter-btn ${selectedType === t.id ? 'active' : ''}`} onClick={() => setSelectedType(t.id)}>{t.label}</button>
                ))}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div className="section-title"><Navigation size={12} /> Sea route planner</div>
                <button type="button" className="swap-btn" onClick={swapPorts}><ArrowDownUp size={13} /></button>
              </div>
              <div className="route-grid">
                <div>
                  <div className="field-label">Origin</div>
                  <div className="select-wrap">
                    <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
                      {PORTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown size={13} />
                  </div>
                </div>
                <div />
                <div>
                  <div className="field-label">Destination</div>
                  <div className="select-wrap">
                    <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
                      {PORTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown size={13} />
                  </div>
                </div>
              </div>
              <button type="button" className="route-button" disabled={routeLoading || originId === destinationId} onClick={calculateSelectedRoute}>
                {routeLoading ? 'CALCULATING MARNET ROUTE...' : 'CALCULATE SEA ROUTE'}
              </button>
              {routeError && <div className="route-error">{routeError}</div>}
              {route && (
                <>
                  <div className="route-line" />
                  <div className="route-summary">
                    <div className="metric">
                      <div className="metric-value">{formatDistance(route.distanceNm)}</div>
                      <div className="metric-label">Distance</div>
                    </div>
                    <div className="metric">
                      <div className="metric-value">{formatDuration(route.hours)}</div>
                      <div className="metric-label">Transit</div>
                    </div>
                    <div className="metric">
                      <div className="metric-value">{route.path.length}</div>
                      <div className="metric-label">Waypoints</div>
                    </div>
                  </div>
                  <div className="route-caption">
                    {origin?.name} → {destination?.name}
                    <br />Via {formatPassages(route.passages)}
                    <br />Eurostat SeaRoute / MARNET · distances in kilometres
                  </div>
                </>
              )}
            </section>

            <section className="section">
              <div className="section-head">
                <div className="section-title"><Activity size={12} /> Radar statistics</div>
                <div className="section-count">{formatClock(lastUpdate)}</div>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-icon"><Ship size={14} /></div><div><div className="stat-number">{ships.length}</div><div className="stat-label">Sim vessels</div></div></div>
                <div className="stat-card"><div className="stat-icon"><Anchor size={14} /></div><div><div className="stat-number">{PORTS.length}</div><div className="stat-label">Ports</div></div></div>
                <div className="stat-card"><div className="stat-icon"><RouteIcon size={14} /></div><div><div className="stat-number">MARNET</div><div className="stat-label">Sea network</div></div></div>
                <div className="stat-card"><div className="stat-icon"><CircleDot size={14} /></div><div><div className="stat-number">{CHOKEPOINTS.length}</div><div className="stat-label">Chokepoints</div></div></div>
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div className="section-title"><Filter size={12} /> Tracked vessels</div>
                <div className="section-count">SIMULATED</div>
              </div>
              <div className="ship-list">
                {displayedShips.slice(0, 10).map((ship) => (
                  <div
                    key={ship.id}
                    className={`ship-row ${selectedShipId === ship.id ? 'selected' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedShipId(ship.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedShipId(ship.id); }}
                  >
                    <span className="ship-dot" style={{ color: ship.color, background: ship.color }} />
                    <div>
                      <div className="ship-name">{ship.id}</div>
                      <div className="ship-route">{PORT_BY_ID[ship.fromId].name} → {PORT_BY_ID[ship.toId].name}</div>
                    </div>
                    <div className="ship-type">{ship.typeLabel}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div className="section-title"><Anchor size={15} /> Port monitor</div>
                <div className="section-count">LIVE MARINE</div>
              </div>
              <select className="port-select" value={selectedPortId} onChange={(e) => setSelectedPortId(e.target.value)}>
                {PORTS.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.country}</option>)}
              </select>
              <div className="environment-grid" style={{ marginTop: 8 }}>
                <div className="env-card"><Waves size={14} /><div className="env-value">{formatValue(portMarine?.current?.sea_level_height_msl, 2, ' m')}</div><div className="env-label">Sea level</div></div>
                <div className="env-card"><Waves size={14} /><div className="env-value">{formatValue(portMarine?.current?.wave_height, 1, ' m')}</div><div className="env-label">Wave height</div></div>
                <div className="env-card"><Droplets size={14} /><div className="env-value">{formatValue(portMarine?.current?.sea_surface_temperature, 1, '°C')}</div><div className="env-label">Sea temp</div></div>
                <div className="env-card"><MapPin size={14} /><div className="env-value">{selectedPort.lat.toFixed(2)}°</div><div className="env-label">Latitude</div></div>
              </div>
              {waterLevel && (
                <div className="selected-route-note">
                  NOAA: {formatValue(waterLevel.v, 2, ' m')} · {waterLevel.t} UTC · {waterLevel.station}
                </div>
              )}
            </section>

            <section className="section">
              <div className="section-head"><div className="section-title"><Compass size={12} /> Data sources</div></div>
              <div className="route-caption">
                Routes: Eurostat MARNET. Weather: Open-Meteo. Distance shown in km (1 NM = 1.852 km). Click empty map to clear selection.
              </div>
            </section>

            <div className="monitor-footer">
              <span>WORLD MARITIME NETWORK</span>
              <button type="button" className={`pause-btn ${paused ? 'active' : ''}`} onClick={() => setPaused((v) => !v)}>
                <Timer size={11} /> {paused ? 'RESUME' : 'PAUSE'}
              </button>
            </div>
          </div>
        </aside>

        <main className="cargo-map-pane">
          <MapContainer
            className="cargo-map"
            style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
            center={WORLD_CENTER}
            zoom={2}
            minZoom={2}
            maxZoom={7}
            worldCopyJump
            zoomControl
            whenReady={(e) => {
              mapInstanceRef.current = e.target;
              [0, 250, 750].forEach((d) => window.setTimeout(() => e.target.invalidateSize({ animate: false }), d));
            }}
          >
            <MapAutoResize />
            <MapClickDeselect selectedShipId={selectedShipId} onClear={clearSelection} />
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <TileLayer attribution="OpenSeaMap" url="https://t1.openseamap.org/seamark/{z}/{x}/{y}.png" opacity={0.82} />
            <MapViewport route={route} />

            {route?.path?.length > 1 && (
              <>
                <Polyline positions={route.path} pathOptions={{ color: '#020617', weight: 7, opacity: 0.65 }} />
                <Polyline positions={route.path} pathOptions={{ color: '#22d3ee', weight: 3, opacity: 0.95, dashArray: '8 8' }} />
              </>
            )}

            {CORRIDORS.map((c) => (
              <Polyline key={c.id} positions={c.points} pathOptions={{ color: '#38bdf8', weight: 1.2, opacity: 0.16, dashArray: '4 7' }} />
            ))}

            {CHOKEPOINTS.map((p) => (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={4} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.9, weight: 1 }}>
                <Popup className="popup-dark"><div className="popup-title">{p.name}</div><div className="popup-muted">{p.kind}</div></Popup>
              </CircleMarker>
            ))}

            {PORTS.map((p) => (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={3} pathOptions={{ color: '#22d3ee', fillColor: '#e0f2fe', fillOpacity: 0.9, weight: 1 }}>
                <Popup className="popup-dark"><div className="popup-title">{p.name}</div><div className="popup-muted">{p.country}</div></Popup>
              </CircleMarker>
            ))}

            {selectedShip?.path?.length > 1 && (
              <>
                <Polyline positions={selectedShip.path} pathOptions={{ color: '#020617', weight: 8, opacity: 0.78 }} />
                <Polyline positions={selectedShip.path} pathOptions={{ color: '#facc15', weight: 3, opacity: 0.95, dashArray: '10 7' }} />
                <Marker position={selectedShip.point} icon={createSelectionRingIcon(selectedShip.heading)} interactive={false} zIndexOffset={-100} />
              </>
            )}

            {livePositions.map((ship) => (
              <Marker
                key={ship.id}
                ref={getMarkerRefCallback(ship.id)}
                position={ship.point}
                icon={getShipIcon(ship.color, ship.heading)}
                zIndexOffset={ship.id === selectedShipId ? 1000 : 0}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e.originalEvent);
                    setSelectedShipId(ship.id);
                    e.target.openPopup();
                  },
                }}
              >
                <Popup
                  className="popup-dark vessel-detail-popup"
                  closeButton
                  autoPan
                  autoClose
                  closeOnClick
                  eventHandlers={{
                    remove: () => setSelectedShipId((id) => (id === ship.id ? null : id)),
                  }}
                >
                  <div className="vessel-popup">
                    <div className="vessel-popup-kicker">MARNET · LIVE WEATHER</div>
                    <div className="vessel-popup-title">{ship.id}</div>
                    <div className="vessel-popup-route">
                      {PORT_BY_ID[ship.fromId].name} → <strong>{PORT_BY_ID[ship.toId].name}</strong>
                    </div>
                    <div className="vessel-popup-grid">
                      <div><b>{ship.point[0].toFixed(3)}°</b><span>LAT</span></div>
                      <div><b>{ship.point[1].toFixed(3)}°</b><span>LNG</span></div>
                      <div><b>{ship.speed} kn</b><span>SPEED</span></div>
                      <div><b>{Math.round(ship.heading)}°</b><span>HDG · {directionLabel(ship.heading)}</span></div>
                    </div>
                    {ship.id === selectedShipId && (
                      <div className="vessel-popup-weather">
                        <b>
                          {environmentLoading ? 'Loading…' : weather ? weatherLabel(weather.current?.weather_code) : environmentError || '—'}
                        </b>
                        <span>
                          {formatValue(weather?.current?.temperature_2m, 1, '°C')} · Wind{' '}
                          {formatValue(weather?.current?.wind_speed_10m, 1, ' kn')}
                        </span>
                        <span>
                          Waves {formatValue(marine?.current?.wave_height, 1, ' m')} · SST{' '}
                          {formatValue(marine?.current?.sea_surface_temperature, 1, '°C')}
                        </span>
                      </div>
                    )}
                    <div className="vessel-popup-hint">Click map or X to clear gold route</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-actions">
            <button type="button" title="World view" onClick={() => mapInstanceRef.current?.setView(WORLD_CENTER, 2)}>
              <Globe2 size={15} />
            </button>
            <button
              type="button"
              title="Fit route"
              onClick={() => {
                if (route?.path?.length) mapInstanceRef.current?.fitBounds(L.latLngBounds(route.path), { padding: [30, 30], maxZoom: 5 });
              }}
            >
              <RouteIcon size={15} />
            </button>
          </div>

          <DirectionCompass heading={selectedShip?.heading} />

          <div className="map-topbar">
            <div className="map-title-card">
              <Globe2 size={15} color="#22d3ee" />
              <div>
                <div className="map-title">WORLD SEA ROUTES</div>
                <div className="map-title-sub">MARNET · OPEN-METEO · KM</div>
              </div>
            </div>
            <div className="map-time-card"><CalendarClock size={12} /> {formatClock(lastUpdate)}</div>
          </div>

          <RadarScope vessels={livePositions} selectedShipId={selectedShipId} onSelect={setSelectedShipId} />

          <div className="map-legend">
            <div className="legend-title">MAP LEGEND</div>
            <div className="legend-row"><span className="legend-line" /> Selected route</div>
            <div className="legend-row"><span className="legend-line" style={{ opacity: 0.35 }} /> Corridor</div>
            <div className="legend-row"><span className="legend-dot" /> Chokepoint</div>
            <div className="legend-row"><span className="legend-port" /> Port</div>
          </div>
        </main>
      </div>
    </div>
  );
}