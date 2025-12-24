/**
 * Transcript Service
 * Handles fetching and storing past transcripts
 */

import { getLocationFromPhone, formatPhoneNumber } from './areaCodeData';
import { PastTranscript } from '../types';

export function getMockPastTranscripts(): PastTranscript[] {
  const now = new Date();

  return [
    {
      callId: 'past-001',
      phone: '+1 (214) 555-0001',
      phoneFormatted: formatPhoneNumber('+1 (214) 555-0001'),
      location: getLocationFromPhone('+1 (214) 555-0001'),
      startTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 26 * 60 * 1000).toISOString(),
      duration: '03:45',
      outcome: 'accepted',
      transcript: [
        { role: 'caller', text: 'Hi, I need a ride to the airport.', timestamp: '10:04:12' },
        { role: 'agent', text: 'Sure, I can help. When do you need the pickup?', timestamp: '10:04:18' },
        { role: 'caller', text: 'Tomorrow at 5 AM.', timestamp: '10:04:25' },
        { role: 'agent', text: 'Perfect. What is your pickup address?', timestamp: '10:04:32' },
        { role: 'caller', text: '456 Oak Street, Dallas.', timestamp: '10:04:40' },
        { role: 'agent', text: 'Great, I have you booked for 5 AM tomorrow from 456 Oak Street to DFW Airport. Is that correct?', timestamp: '10:04:55' },
        { role: 'caller', text: 'Yes, that is perfect. Thank you!', timestamp: '10:05:02' },
        { role: 'agent', text: 'You are all set. You will receive a confirmation text shortly. Have a great trip!', timestamp: '10:05:10' },
      ],
    },
    {
      callId: 'past-002',
      phone: '+1 (713) 555-0002',
      phoneFormatted: formatPhoneNumber('+1 (713) 555-0002'),
      location: getLocationFromPhone('+1 (713) 555-0002'),
      startTime: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 55 * 60 * 1000).toISOString(),
      duration: '05:12',
      outcome: 'accepted',
      transcript: [
        { role: 'caller', text: 'Hello, I would like to schedule a medical appointment ride.', timestamp: '09:34:05' },
        { role: 'agent', text: 'Of course. Is this a round trip?', timestamp: '09:34:12' },
        { role: 'caller', text: 'Yes, I need to go to the clinic and back.', timestamp: '09:34:20' },
        { role: 'agent', text: 'What date and time works for you?', timestamp: '09:34:28' },
        { role: 'caller', text: 'Next Monday at 9 AM.', timestamp: '09:34:35' },
      ],
    },
    {
      callId: 'past-003',
      phone: '+1 (512) 555-0003',
      phoneFormatted: formatPhoneNumber('+1 (512) 555-0003'),
      location: getLocationFromPhone('+1 (512) 555-0003'),
      startTime: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 88 * 60 * 1000).toISOString(),
      duration: '02:34',
      outcome: 'rejected',
      transcript: [
        { role: 'caller', text: 'Hi, do you service the Austin area?', timestamp: '09:04:10' },
        { role: 'agent', text: 'We do have limited coverage in Austin. What is your specific location?', timestamp: '09:04:18' },
        { role: 'caller', text: 'I am out near Lake Travis.', timestamp: '09:04:25' },
        { role: 'agent', text: 'I apologize, but that area is outside our current service zone.', timestamp: '09:04:35' },
      ],
    },
    {
      callId: 'past-004',
      phone: '+1 (305) 555-0004',
      phoneFormatted: formatPhoneNumber('+1 (305) 555-0004'),
      location: getLocationFromPhone('+1 (305) 555-0004'),
      startTime: new Date(now.getTime() - 120 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 117 * 60 * 1000).toISOString(),
      duration: '03:15',
      outcome: 'transferred',
      transcript: [
        { role: 'caller', text: 'I have a complaint about my ride yesterday.', timestamp: '08:34:20' },
        { role: 'agent', text: 'I am sorry to hear that. Let me transfer you to our customer care team.', timestamp: '08:34:28' },
      ],
    },
    {
      callId: 'past-005',
      phone: '+1 (404) 555-0005',
      phoneFormatted: formatPhoneNumber('+1 (404) 555-0005'),
      location: getLocationFromPhone('+1 (404) 555-0005'),
      startTime: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 150 * 60 * 1000 + 45 * 1000).toISOString(),
      duration: '00:45',
      outcome: 'missed',
      transcript: [
        { role: 'system', text: 'Call was not answered. Caller disconnected after 45 seconds.', timestamp: '08:04:45' },
      ],
    },
    {
      callId: 'past-006',
      phone: '+1 (617) 555-0006',
      phoneFormatted: formatPhoneNumber('+1 (617) 555-0006'),
      location: getLocationFromPhone('+1 (617) 555-0006'),
      startTime: new Date(now.getTime() - 180 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() - 175 * 60 * 1000).toISOString(),
      duration: '04:55',
      outcome: 'accepted',
      transcript: [
        { role: 'caller', text: 'Good morning. I need to set up recurring rides for dialysis.', timestamp: '07:34:10' },
        { role: 'agent', text: 'Good morning! I can definitely help with that. How many times a week do you need rides?', timestamp: '07:34:18' },
        { role: 'caller', text: 'Three times a week - Monday, Wednesday, and Friday.', timestamp: '07:34:28' },
      ],
    },
  ];
}

export function createTranscriptStore() {
  let transcripts: PastTranscript[] = getMockPastTranscripts();
  type Listener = (transcripts: PastTranscript[]) => void;
  let listeners: Listener[] = [];

  const notifyListeners = () => {
    listeners.forEach(listener => listener(transcripts));
  };

  return {
    subscribe: (listener: Listener) => {
      listeners.push(listener);
      listener(transcripts);

      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },

    getTranscripts: () => transcripts,

    getTranscriptById: (callId: string) => {
      return transcripts.find(t => t.callId === callId);
    },

    addTranscript: (transcript: PastTranscript) => {
      transcripts = [transcript, ...transcripts];
      notifyListeners();
    },

    searchTranscripts: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return transcripts.filter(t =>
        t.phone.includes(query) ||
        t.location?.display?.toLowerCase().includes(lowerQuery) ||
        t.transcript.some(msg => msg.text.toLowerCase().includes(lowerQuery))
      );
    },

    filterByOutcome: (outcome: PastTranscript['outcome'] | null) => {
      if (!outcome) return transcripts;
      return transcripts.filter(t => t.outcome === outcome);
    },
  };
}

export const transcriptStore = createTranscriptStore();

export function formatCallTime(isoString: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatCallDate(isoString: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Outcome = 'accepted' | 'rejected' | 'missed' | 'transferred';

export function getOutcomeInfo(outcome: Outcome) {
  const outcomeMap: Record<Outcome, { label: string; color: string; bgColor: string }> = {
    accepted: { label: 'Accepted', color: 'text-green-500', bgColor: 'bg-green-100' },
    rejected: { label: 'Rejected', color: 'text-red-500', bgColor: 'bg-red-100' },
    missed: { label: 'Missed', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    transferred: { label: 'Transferred', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  };
  return outcomeMap[outcome] || { label: outcome, color: 'text-gray-500', bgColor: 'bg-gray-100' };
}

export default {
  getMockPastTranscripts,
  transcriptStore,
  formatCallTime,
  formatCallDate,
  getOutcomeInfo,
};
