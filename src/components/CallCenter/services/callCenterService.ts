/**
 * Call Center Service
 * Handles data fetching and state management for the Call Center
 */

import { getLocationFromPhone, formatPhoneNumber, getDelawareRegion } from './areaCodeData';
import {
  LiveCall,
  QueueCall,
  Trip,
  CallCenterData,
  CallCenterStats,
  Driver,
  Vehicle
} from '../types';

/**
 * Generate mock calls data
 */
export function getMockCalls(): { liveCalls: LiveCall[]; queueCalls: QueueCall[] } {
  const now = new Date();

  // Delaware-only calls with city/region info
  const delawareCities = [
    { city: 'Wilmington', region: 'new-castle' },
    { city: 'Newark', region: 'new-castle' },
    { city: 'Dover', region: 'kent' },
    { city: 'Smyrna', region: 'kent' },
    { city: 'Middletown', region: 'new-castle' },
    { city: 'Bear', region: 'new-castle' },
    { city: 'Georgetown', region: 'sussex' },
    { city: 'Lewes', region: 'sussex' },
    { city: 'Rehoboth Beach', region: 'sussex' },
    { city: 'Milford', region: 'kent' },
    { city: 'Seaford', region: 'sussex' },
    { city: 'Camden', region: 'kent' },
  ];

  const liveCallsRaw = [
    {
      callId: 'call-001',
      phone: '+1 (302) 555-1234',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 3 * 60 * 1000).toISOString(),
      agentName: 'Sarah Jenkins',
      cityInfo: delawareCities[0], // Wilmington
      transcript: [
        { role: 'caller' as const, text: 'Hi, I need to schedule a ride for tomorrow morning.', timestamp: '10:31:12' },
        { role: 'agent' as const, text: 'Of course! I can help you with that. What time would you like to be picked up?', timestamp: '10:31:18' },
        { role: 'caller' as const, text: 'Around 6 AM. I have a flight at Philadelphia Airport.', timestamp: '10:31:25' },
        { role: 'agent' as const, text: 'Perfect. And what is your pickup address in Wilmington?', timestamp: '10:31:32' },
        { role: 'caller' as const, text: '123 Market Street, Wilmington.', timestamp: '10:31:40' },
      ]
    },
    {
      callId: 'call-002',
      phone: '+1 (302) 555-9876',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      agentName: 'Mike Ross',
      cityInfo: delawareCities[2], // Dover
      transcript: [
        { role: 'caller' as const, text: 'Hello, I need a wheelchair accessible vehicle in Dover.', timestamp: '10:29:05' },
        { role: 'agent' as const, text: 'Absolutely, we have wheelchair accessible vehicles available. When do you need the ride?', timestamp: '10:29:12' },
        { role: 'caller' as const, text: 'This afternoon, around 2 PM.', timestamp: '10:29:20' },
        { role: 'agent' as const, text: 'Let me check availability for you...', timestamp: '10:29:28' },
      ]
    },
    {
      callId: 'call-003',
      phone: '+1 (302) 555-4567',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
      agentName: 'Jessica Pearson',
      cityInfo: delawareCities[1], // Newark
      transcript: [
        { role: 'caller' as const, text: 'Hi there, I want to book a round trip to Christiana Hospital.', timestamp: '10:33:45' },
        { role: 'agent' as const, text: 'I can help with that. What date are you looking at?', timestamp: '10:33:52' },
      ]
    },
    {
      callId: 'call-004',
      phone: '+1 (302) 555-7890',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 4 * 60 * 1000).toISOString(),
      agentName: 'Harvey Specter',
      cityInfo: delawareCities[7], // Lewes
      transcript: [
        { role: 'caller' as const, text: 'I need a ride from Lewes to the Cape May ferry.', timestamp: '10:30:15' },
        { role: 'agent' as const, text: 'Sure, what time do you need to catch the ferry?', timestamp: '10:30:22' },
      ]
    },
    {
      callId: 'call-005',
      phone: '+1 (302) 555-3456',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      agentName: 'Donna Paulsen',
      cityInfo: delawareCities[6], // Georgetown
      transcript: [
        { role: 'caller' as const, text: 'Looking for medical transport in Sussex County.', timestamp: '10:32:30' },
        { role: 'agent' as const, text: 'We can help with that. What type of medical transport do you need?', timestamp: '10:32:38' },
      ]
    },
    {
      callId: 'call-006',
      phone: '+1 (302) 555-1212',
      status: 'live' as const,
      startTime: new Date(now.getTime() - 1.5 * 60 * 1000).toISOString(),
      agentName: 'Louis Litt',
      cityInfo: delawareCities[3], // Smyrna
      transcript: [
        { role: 'caller' as const, text: 'I need a ride from Smyrna to Dover.', timestamp: '10:33:00' },
        { role: 'agent' as const, text: 'Okay, what time do you need to leave?', timestamp: '10:33:05' },
      ]
    },
  ];

  const queueCallsRaw = [
    { callId: 'queue-001', phone: '+1 (302) 555-2222', status: 'queue' as const, queuePosition: 1, queueStartTime: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), cityInfo: delawareCities[0] },
    { callId: 'queue-002', phone: '+1 (302) 555-3333', status: 'queue' as const, queuePosition: 2, queueStartTime: new Date(now.getTime() - 1.5 * 60 * 1000).toISOString(), cityInfo: delawareCities[4] },
    { callId: 'queue-003', phone: '+1 (302) 555-4444', status: 'queue' as const, queuePosition: 3, queueStartTime: new Date(now.getTime() - 1 * 60 * 1000).toISOString(), cityInfo: delawareCities[2] },
    { callId: 'queue-004', phone: '+1 (302) 555-5555', status: 'queue' as const, queuePosition: 4, queueStartTime: new Date(now.getTime() - 0.5 * 60 * 1000).toISOString(), cityInfo: delawareCities[8] },
    { callId: 'queue-005', phone: '+1 (302) 555-6666', status: 'queue' as const, queuePosition: 5, queueStartTime: new Date(now.getTime() - 0.25 * 60 * 1000).toISOString(), cityInfo: delawareCities[1] },
    { callId: 'queue-006', phone: '+1 (302) 555-7777', status: 'queue' as const, queuePosition: 6, queueStartTime: new Date(now.getTime() - 3 * 60 * 1000).toISOString(), cityInfo: delawareCities[9] },
    { callId: 'queue-007', phone: '+1 (302) 555-8888', status: 'queue' as const, queuePosition: 7, queueStartTime: new Date(now.getTime() - 2.5 * 60 * 1000).toISOString(), cityInfo: delawareCities[5] },
    { callId: 'queue-008', phone: '+1 (302) 555-9999', status: 'queue' as const, queuePosition: 8, queueStartTime: new Date(now.getTime() - 4 * 60 * 1000).toISOString(), cityInfo: delawareCities[10] },
    { callId: 'queue-009', phone: '+1 (302) 555-1111', status: 'queue' as const, queuePosition: 9, queueStartTime: new Date(now.getTime() - 3.5 * 60 * 1000).toISOString(), cityInfo: delawareCities[11] },
    { callId: 'queue-010', phone: '+1 (302) 555-0001', status: 'queue' as const, queuePosition: 10, queueStartTime: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), cityInfo: delawareCities[7] },
  ];

  type AnyCall = (typeof liveCallsRaw[0] | typeof queueCallsRaw[0]) & { phoneFormatted?: string; location?: any };

  const enrichCall = <T extends AnyCall>(call: T): T => {
    const cityInfo = (call as any).cityInfo;
    return {
      ...call,
      phoneFormatted: formatPhoneNumber(call.phone),
      location: {
        city: cityInfo?.city || 'Wilmington',
        state: 'DE',
        region: cityInfo?.region || 'new-castle',
        country: 'USA',
        display: `${cityInfo?.city || 'Wilmington'}, DE`,
        isApproximate: false,
      },
    };
  };

  return {
    liveCalls: liveCallsRaw.map(enrichCall),
    queueCalls: queueCallsRaw.map(enrichCall),
  };
}

export const TRIP_TYPES = {
  ROUND_TRIP: 'round-trip',
  ONE_WAY: 'one-way',
  SAME_DAY: 'same-day',
  WHEELCHAIR: 'wheelchair',
};

export const TRIP_TYPE_LABELS = {
  [TRIP_TYPES.ROUND_TRIP]: 'Round Trip',
  [TRIP_TYPES.ONE_WAY]: 'One Way',
  [TRIP_TYPES.SAME_DAY]: 'Same Day',
  [TRIP_TYPES.WHEELCHAIR]: 'Wheelchair',
};

export function getMockCreatedTrips(): Trip[] {
  const now = new Date();

  return [
    {
      tripId: 'trip-001',
      callId: 'call-prev-001',
      tripType: TRIP_TYPES.ROUND_TRIP,
      passengerName: 'John Smith',
      passengerPhone: '+1 (302) 555-8888',
      pickup: '123 Market St, Wilmington, DE',
      dropoff: 'Philadelphia International Airport',
      scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '06:00 AM',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      notes: 'Early morning flight, needs to arrive by 7:30 AM',
    },
    {
      tripId: 'trip-002',
      callId: 'call-prev-002',
      tripType: TRIP_TYPES.WHEELCHAIR,
      passengerName: 'Mary Johnson',
      passengerPhone: '+1 (302) 555-7777',
      pickup: '456 State St, Dover, DE',
      dropoff: 'Bayhealth Hospital, Dover, DE',
      scheduledDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '02:00 PM',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      notes: 'Wheelchair accessible vehicle required',
    },
    {
      tripId: 'trip-003',
      callId: 'call-prev-003',
      tripType: TRIP_TYPES.ONE_WAY,
      passengerName: 'Robert Davis',
      passengerPhone: '+1 (302) 555-6666',
      pickup: '789 Main St, Newark, DE',
      dropoff: 'Christiana Hospital, Newark, DE',
      scheduledDate: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '10:00 AM',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      notes: '',
    },
    {
      tripId: 'trip-004',
      callId: 'call-prev-004',
      tripType: TRIP_TYPES.SAME_DAY,
      passengerName: 'Susan Wilson',
      passengerPhone: '+1 (302) 555-5555',
      pickup: '321 Rehoboth Ave, Rehoboth Beach, DE',
      dropoff: 'Beebe Healthcare, Lewes, DE',
      scheduledDate: now.toISOString(),
      scheduledTime: '04:30 PM',
      createdAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
      notes: 'Same day appointment',
    },
    {
      tripId: 'trip-005',
      callId: 'call-prev-005',
      tripType: TRIP_TYPES.ONE_WAY,
      passengerName: 'James Carter',
      passengerPhone: '+1 (302) 555-4444',
      pickup: '123 Delaware Ave, Wilmington, DE',
      dropoff: 'Dover Downs, Dover, DE',
      scheduledDate: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '01:00 PM',
      createdAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      notes: 'VIP Transport',
    },
  ];
}

export function getMockAssignmentTrips(): Trip[] {
  const now = new Date();

  return [
    {
      tripId: 'assign-001',
      callId: 'call-old-001',
      tripType: TRIP_TYPES.ROUND_TRIP,
      passengerName: 'Alice Brown',
      passengerPhone: '+1 (302) 555-4444',
      pickup: '100 King St, Wilmington, DE',
      dropoff: 'Christiana Hospital, Newark, DE',
      returnPickup: 'Christiana Hospital, Newark, DE',
      returnDropoff: '100 King St, Wilmington, DE',
      scheduledDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '01:00 PM',
      returnTime: '04:00 PM',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      driver: null,
      vehicle: null,
      notes: 'Doctor appointment, expects 2-hour wait',
    },
    {
      tripId: 'assign-002',
      callId: 'call-old-002',
      tripType: TRIP_TYPES.WHEELCHAIR,
      passengerName: 'George Miller',
      passengerPhone: '+1 (302) 555-3333',
      pickup: '200 S State St, Dover, DE',
      dropoff: 'Bayhealth Hospital, Dover, DE',
      scheduledDate: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '02:30 PM',
      createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      driver: null,
      vehicle: null,
      notes: 'Requires wheelchair lift vehicle',
    },
    {
      tripId: 'assign-003',
      callId: 'call-old-003',
      tripType: TRIP_TYPES.ONE_WAY,
      passengerName: 'Patricia Lee',
      passengerPhone: '+1 (302) 555-2222',
      pickup: '500 Savannah Rd, Lewes, DE',
      dropoff: 'Cape May-Lewes Ferry Terminal',
      scheduledDate: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '05:00 PM',
      createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      driver: null,
      vehicle: null,
      notes: 'Catching ferry to Cape May, NJ',
    },
    {
      tripId: 'assign-004',
      callId: 'call-old-004',
      tripType: TRIP_TYPES.SAME_DAY,
      passengerName: 'Thomas Wright',
      passengerPhone: '+1 (302) 555-1234',
      pickup: '75 Main St, Georgetown, DE',
      dropoff: 'Nanticoke Memorial Hospital, Seaford, DE',
      scheduledDate: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '12:30 PM',
      createdAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      driver: null,
      vehicle: null,
      notes: 'Urgent medical appointment',
    },
    {
      tripId: 'assign-005',
      callId: 'call-old-005',
      tripType: TRIP_TYPES.ONE_WAY,
      passengerName: 'Linda Martinez',
      passengerPhone: '+1 (302) 555-9876',
      pickup: '123 N DuPont Hwy, Smyrna, DE',
      dropoff: 'Dover Mall, Dover, DE',
      scheduledDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      scheduledTime: '03:00 PM',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      driver: null,
      vehicle: null,
      notes: '',
    },
  ];
}

export function getMockStats(): CallCenterStats {
  return {
    activeCalls: 5,
    queueLength: 14,
    avgWaitTime: '01:42',
    tripsCreated: 4,
    pendingAssignment: 3,
    today: {
      accepted: 47,
      rejected: 12,
      missed: 8,
      transferred: 5,
      avgDuration: '04:23',
      totalCalls: 72,
      conversionRate: 65,
      tripsCreated: 38,
      tripsAssigned: 35,
    }
  };
}

export function calculateDuration(startTime: string): string {
  if (!startTime) return '00:00';

  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  const diff = Math.floor((now - start) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function createCallCenterStore() {
  let data: CallCenterData | null = null;
  type Listener = (data: CallCenterData | null) => void;
  let listeners: Listener[] = [];
  let updateInterval: NodeJS.Timeout | null = null;

  const notifyListeners = (newData: CallCenterData) => {
    data = newData;
    listeners.forEach(listener => listener(newData));
  };

  const fetchData = () => {
    const { liveCalls, queueCalls } = getMockCalls();
    const mockData: CallCenterData = {
      liveCalls,
      queueCalls,
      createdTrips: getMockCreatedTrips(),
      assignmentTrips: getMockAssignmentTrips(),
      stats: getMockStats(),
    };
    notifyListeners(mockData);
  };

  return {
    subscribe: (listener: Listener) => {
      listeners.push(listener);

      if (listeners.length === 1) {
        fetchData();
        updateInterval = setInterval(fetchData, 5000);
      } else if (data) {
        listener(data);
      }

      return () => {
        listeners = listeners.filter(l => l !== listener);
        if (listeners.length === 0 && updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }
      };
    },
    getData: () => data,
  };
}

export const callCenterStore = createCallCenterStore();

export async function endCall(callId: string) {
  console.log('Ending call:', callId);
  return { success: true, callId };
}

export async function transferCall(callId: string, destination: string) {
  console.log('Transferring call:', callId, 'to', destination);
  return { success: true, callId, destination };
}

export async function answerCall(callId: string) {
  console.log('Answering call:', callId);
  return { success: true, callId };
}

export async function flagCall(callId: string, reason: string) {
  console.log('Flagging call:', callId, 'reason:', reason);
  return { success: true, callId, reason };
}

export async function assignTrip(tripId: string, driverId: string, vehicleId: string) {
  console.log('Assigning trip:', tripId, 'driver:', driverId, 'vehicle:', vehicleId);
  return { success: true, tripId, driverId, vehicleId };
}

// Mock drivers and vehicles
export const MOCK_DRIVERS: Driver[] = [
  { id: 'driver-001', name: 'Mike Thompson' },
  { id: 'driver-002', name: 'Sarah Johnson' },
  { id: 'driver-003', name: 'David Williams' },
  { id: 'driver-004', name: 'Jennifer Brown' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'vehicle-001', name: 'Toyota Camry - ABC123' },
  { id: 'vehicle-002', name: 'Honda Accord - XYZ789' },
  { id: 'vehicle-003', name: 'Wheelchair Van - WHL456' },
  { id: 'vehicle-004', name: 'Ford Transit - TRN321' },
];

export default {
  getMockCalls,
  getMockStats,
  getMockCreatedTrips,
  getMockAssignmentTrips,
  calculateDuration,
  callCenterStore,
  endCall,
  transferCall,
  answerCall,
  flagCall,
  assignTrip,
  TRIP_TYPES,
  TRIP_TYPE_LABELS,
  MOCK_DRIVERS,
  MOCK_VEHICLES,
};
