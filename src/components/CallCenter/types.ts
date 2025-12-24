export interface TranscriptMessage {
    role: 'caller' | 'agent' | 'system';
    text: string;
    timestamp: string;
}

export interface CallLocation {
    city: string | null;
    state: string | null;
    country: string | null;
    region?: string | null;
    display: string;
    isApproximate?: boolean;
}

export interface BaseCall {
    callId: string;
    phone: string;
    phoneFormatted?: string;
    location?: CallLocation;
}

export interface LiveCall extends BaseCall {
    status: 'live';
    startTime: string;
    transcript: TranscriptMessage[];
    agentName?: string; // Added for Dashboard view
}

export interface QueueCall extends BaseCall {
    status: 'queue';
    queuePosition: number;
    queueStartTime: string;
}

export type Call = LiveCall | QueueCall;

export interface Trip {
    tripId: string;
    callId: string;
    tripType: string;
    passengerName: string;
    passengerPhone: string;
    pickup: string;
    dropoff: string;
    returnPickup?: string;
    returnDropoff?: string;
    scheduledDate: string;
    scheduledTime: string;
    returnTime?: string;
    createdAt: string;
    notes?: string;
    driver?: string | null;
    vehicle?: string | null;
}

export interface Driver {
    id: string;
    name: string;
}

export interface Vehicle {
    id: string;
    name: string;
}

export interface CallCenterStats {
    activeCalls: number;
    queueLength: number;
    avgWaitTime: string;
    tripsCreated: number;
    pendingAssignment: number;
    today: {
        accepted: number;
        rejected: number;
        missed: number;
        transferred: number;
        avgDuration: string;
        totalCalls: number;
        conversionRate: number;
        tripsCreated: number;
        tripsAssigned: number;
    };
}

export interface CallCenterData {
    liveCalls: LiveCall[];
    queueCalls: QueueCall[];
    createdTrips: Trip[];
    assignmentTrips: Trip[];
    stats: CallCenterStats;
}

export interface PastTranscript extends BaseCall {
    startTime: string;
    endTime: string;
    duration: string;
    outcome: 'accepted' | 'rejected' | 'missed' | 'transferred';
    transcript: TranscriptMessage[];
    location: CallLocation; // Required here as per mock data
    phoneFormatted: string; // Required here
}
