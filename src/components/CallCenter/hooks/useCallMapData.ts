/**
 * useCallMapData Hook
 * Aggregates call center calls by geographic location for map display
 */

import { useMemo } from 'react';
import { useCallCenter } from './useCallCenter';
import { getLocationFromPhone } from '../services/areaCodeData';
import { CallLocation } from '../types';

interface Coordinates {
  lat: number;
  lng: number;
}

// Approximate coordinates for major cities
const CITY_COORDINATES: Record<string, Coordinates> = {
  // Delaware - New Castle County
  'Wilmington, DE': { lat: 39.7391, lng: -75.5398 },
  'Newark, DE': { lat: 39.6837, lng: -75.7497 },
  'New Castle, DE': { lat: 39.6620, lng: -75.5663 },
  'Bear, DE': { lat: 39.6290, lng: -75.6546 },
  'Middletown, DE': { lat: 39.4496, lng: -75.7163 },
  'Claymont, DE': { lat: 39.8004, lng: -75.4596 },
  'Pike Creek, DE': { lat: 39.7320, lng: -75.6999 },
  'Hockessin, DE': { lat: 39.7876, lng: -75.6966 },
  'Elsmere, DE': { lat: 39.7393, lng: -75.5980 },
  // Delaware - Kent County
  'Dover, DE': { lat: 39.1582, lng: -75.5244 },
  'Smyrna, DE': { lat: 39.2998, lng: -75.6046 },
  'Milford, DE': { lat: 38.9126, lng: -75.4277 },
  'Camden, DE': { lat: 39.1134, lng: -75.5419 },
  'Harrington, DE': { lat: 38.9237, lng: -75.5777 },
  'Clayton, DE': { lat: 39.2904, lng: -75.6341 },
  'Felton, DE': { lat: 39.0084, lng: -75.5780 },
  'Wyoming, DE': { lat: 39.1187, lng: -75.5588 },
  // Delaware - Sussex County
  'Georgetown, DE': { lat: 38.6901, lng: -75.3857 },
  'Lewes, DE': { lat: 38.7746, lng: -75.1394 },
  'Rehoboth Beach, DE': { lat: 38.7209, lng: -75.0760 },
  'Seaford, DE': { lat: 38.6412, lng: -75.6110 },
  'Milton, DE': { lat: 38.7776, lng: -75.3099 },
  'Bethany Beach, DE': { lat: 38.5393, lng: -75.0552 },
  'Dewey Beach, DE': { lat: 38.6893, lng: -75.0774 },
  'Millsboro, DE': { lat: 38.5918, lng: -75.2913 },
  'Laurel, DE': { lat: 38.5565, lng: -75.5713 },
  'Bridgeville, DE': { lat: 38.7426, lng: -75.6044 },
  // Texas (kept for reference)
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'Fort Worth, TX': { lat: 32.7555, lng: -97.3308 },
  'El Paso, TX': { lat: 31.7619, lng: -106.4850 },
  // Florida
  'Miami, FL': { lat: 25.7617, lng: -80.1918 },
  'Orlando, FL': { lat: 28.5383, lng: -81.3792 },
  'Tampa, FL': { lat: 27.9506, lng: -82.4572 },
  'Jacksonville, FL': { lat: 30.3322, lng: -81.6557 },
  // New York
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Buffalo, NY': { lat: 42.8864, lng: -78.8784 },
  // California
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
  'Sacramento, CA': { lat: 38.5816, lng: -121.4944 },
  // Other major cities
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Phoenix, AZ': { lat: 33.4484, lng: -112.0740 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
  'Denver, CO': { lat: 39.7392, lng: -104.9903 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589 },
  'Las Vegas, NV': { lat: 36.1699, lng: -115.1398 },
  'Atlanta, GA': { lat: 33.7490, lng: -84.3880 },
  'Detroit, MI': { lat: 42.3314, lng: -83.0458 },
};

// State center coordinates for fallback
const STATE_COORDINATES: Record<string, Coordinates> = {
  'DE': { lat: 39.15, lng: -75.42 },
  'TX': { lat: 31.0, lng: -100.0 },
  'FL': { lat: 27.5, lng: -81.5 },
  'NY': { lat: 42.5, lng: -75.5 },
  'CA': { lat: 36.5, lng: -119.5 },
  'IL': { lat: 40.0, lng: -89.0 },
  'GA': { lat: 32.5, lng: -83.5 },
  'AZ': { lat: 34.0, lng: -111.5 },
  'MA': { lat: 42.3, lng: -71.8 },
  'WA': { lat: 47.5, lng: -120.5 },
  'CO': { lat: 39.0, lng: -105.5 },
  'NV': { lat: 39.0, lng: -116.5 },
};

function getCoordinates(location: CallLocation | undefined): Coordinates | null {
  if (!location || !location.city || !location.state) {
    return null;
  }

  const cityKey = `${location.city}, ${location.state}`;

  if (CITY_COORDINATES[cityKey]) {
    return CITY_COORDINATES[cityKey];
  }

  if (STATE_COORDINATES[location.state]) {
    return STATE_COORDINATES[location.state];
  }

  return null;
}

export function useCallMapData() {
  const { liveCalls, queueCalls, createdTrips, assignmentTrips } = useCallCenter();

  const mapData = useMemo(() => {
    const locationMap = new Map<string, any>();

    // Process all calls (live and queue)
    const allCalls = [
      ...liveCalls.map(call => ({ ...call, callType: 'live' })),
      ...queueCalls.map(call => ({ ...call, callType: 'queue' })),
    ];

    // Process trips
    const allTrips = [
      ...createdTrips.map(trip => ({ ...trip, itemType: 'trip' })),
      ...assignmentTrips.map(trip => ({ ...trip, itemType: 'assignment' })),
    ];

    allCalls.forEach(call => {
      const location = call.location || getLocationFromPhone(call.phone);
      if (!location || !location.city || !location.state) return;

      const locationKey = `${location.city}, ${location.state}`;
      const coordinates = getCoordinates(location);

      if (!coordinates) return;

      if (!locationMap.has(locationKey)) {
        locationMap.set(locationKey, {
          locationKey,
          city: location.city,
          state: location.state,
          region: location.region,
          coordinates,
          calls: [],
          trips: [],
          liveCount: 0,
          queueCount: 0,
          tripCount: 0,
        });
      }

      const entry = locationMap.get(locationKey);
      entry.calls.push(call);

      if (call.callType === 'live') {
        entry.liveCount++;
      } else {
        entry.queueCount++;
      }
    });

    // Add trips to locations based on pickup address
    allTrips.forEach(trip => {
      // Try to extract state from pickup address
      const addressMatch = trip.pickup?.match(/,\s*([A-Z]{2})\s*$/);
      if (addressMatch) {
        const state = addressMatch[1];
        // Find matching location or create one
        for (const [_, entry] of locationMap.entries()) {
          if (entry.state === state) {
            entry.trips.push(trip);
            entry.tripCount++;
            break;
          }
        }
      }
    });

    // Convert to array
    const locations = Array.from(locationMap.values()).map(entry => {
      const sortedCalls = [...entry.calls].sort((a, b) => {
        const timeA = a.startTime || a.queueStartTime;
        const timeB = b.startTime || b.queueStartTime;
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      });

      const status = entry.liveCount > 0 ? 'live' : entry.queueCount > 0 ? 'queue' : 'trip';

      return {
        ...entry,
        calls: sortedCalls,
        totalCount: entry.liveCount + entry.queueCount,
        status,
        longestWaitingCall: sortedCalls[0],
      };
    });

    const states = [...new Set(locations.map(l => l.state))].sort();

    return {
      locations,
      states,
      totalLocations: locations.length,
    };
  }, [liveCalls, queueCalls, createdTrips, assignmentTrips]);

  return mapData;
}

export default useCallMapData;
