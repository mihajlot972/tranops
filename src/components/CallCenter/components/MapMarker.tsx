/**
 * MapMarker - Custom marker for call locations
 */

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Phone, Clock, Car } from 'lucide-react';
import { LiveCall, QueueCall, Trip } from '@/components/CallCenter/types';

// Create custom icon based on call status
function createMarkerIcon(count: number, status: string) {
  const color = status === 'live' ? '#ef4444' : status === 'queue' ? '#f59e0b' : '#3b82f6';
  const size = Math.min(40 + count * 2, 60);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="${size}" height="${size * 1.25}">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M20 0C9 0 0 9 0 20c0 11 20 30 20 30s20-19 20-30C40 9 31 0 20 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="20" cy="18" r="12" fill="white"/>
      <text x="20" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="${color}">${count}</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [size, size * 1.25],
    iconAnchor: [size / 2, size * 1.25],
    popupAnchor: [0, -size],
  });
}

// Interfaces based on map data structure in useCallMapData
type MapLiveCall = LiveCall & { callType: 'live' };
type MapQueueCall = QueueCall & { callType: 'queue' };

interface LocationData {
  coordinates: { lat: number; lng: number };
  city: string;
  state: string;
  liveCount: number;
  queueCount: number;
  tripCount: number;
  calls: (MapLiveCall | MapQueueCall)[];
  trips: Trip[];
  status: 'live' | 'queue' | 'trip';
  locationKey: string;
  region?: string;
}

interface MapMarkerProps {
  location: LocationData;
  onCallClick: (call: LiveCall | QueueCall) => void;
  onTripClick: (trip: Trip, type: 'trip' | 'assignment') => void;
}

export default function MapMarker({ location, onCallClick, onTripClick }: MapMarkerProps) {
  const { coordinates, city, state, liveCount, queueCount, tripCount, calls, trips, status } = location;

  if (!coordinates) return null;

  const icon = createMarkerIcon(liveCount + queueCount, status);

  return (
    <Marker
      position={[coordinates.lat, coordinates.lng]}
      icon={icon}
    >
      <Popup className="custom-popup" minWidth={280} maxWidth={320}>
        <div className="p-2">
          {/* Header */}
          <div className="font-semibold text-gray-800 text-base mb-3">
            {city}, {state}
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-4">
            {liveCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-600 font-medium">{liveCount} live</span>
              </div>
            )}
            {queueCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 font-medium">{queueCount} queue</span>
              </div>
            )}
            {tripCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Car className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-blue-600 font-medium">{tripCount} trips</span>
              </div>
            )}
          </div>

          {/* Call List */}
          {calls.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase">Calls</div>
              {calls.slice(0, 3).map((call) => (
                <button
                  key={call.callId}
                  onClick={() => {
                    console.log('Call clicked:', call.callId);
                    onCallClick(call);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {call.phoneFormatted}
                      </span>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${call.callType === 'live'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                      }`}>
                      {call.callType === 'live' ? 'LIVE' : 'QUEUE'}
                    </span>
                  </div>
                </button>
              ))}
              {calls.length > 3 && (
                <div className="text-xs text-gray-400 text-center">
                  +{calls.length - 3} more calls
                </div>
              )}
            </div>
          )}

          {/* Trip List */}
          {trips && trips.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-xs font-medium text-gray-500 uppercase">Trips</div>
              {trips.slice(0, 2).map((trip) => (
                <button
                  key={trip.tripId}
                  onClick={() => {
                    console.log('Trip clicked:', trip.tripId);
                    onTripClick(trip, trip.driver === null ? 'assignment' : 'trip');
                  }}
                  className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {trip.passengerName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {trip.scheduledTime}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
