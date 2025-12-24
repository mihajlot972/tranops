/**
 * useCallCenter Hook
 * Main state management for the Call Center component
 */

import { useState, useEffect, useCallback } from 'react';
import {
  callCenterStore,
  calculateDuration,
  endCall as endCallService,
  transferCall as transferCallService,
  answerCall as answerCallService,
  flagCall as flagCallService,
  assignTrip as assignTripService,
} from '../services/callCenterService';
import { transcriptStore } from '../services/transcriptService';
import { LiveCall, QueueCall, Trip, CallCenterStats, PastTranscript } from '../types';

/**
 * Main hook for Call Center state
 */
export function useCallCenter() {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);
  const [queueCalls, setQueueCalls] = useState<QueueCall[]>([]);
  const [createdTrips, setCreatedTrips] = useState<Trip[]>([]);
  const [assignmentTrips, setAssignmentTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<CallCenterStats | null>({
    activeCalls: 0,
    queueLength: 0,
    tripsCreated: 0,
    pendingAssignment: 0,
    avgWaitTime: '0:00',
    today: {
      accepted: 0,
      rejected: 0,
      missed: 0,
      transferred: 0,
      avgDuration: '0:00',
      totalCalls: 0,
      conversionRate: 0,
      tripsCreated: 0,
      tripsAssigned: 0,
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = callCenterStore.subscribe((data) => {
      if (data) {
        setLiveCalls(data.liveCalls || []);
        setQueueCalls(data.queueCalls || []);
        setCreatedTrips(data.createdTrips || []);
        setAssignmentTrips(data.assignmentTrips || []);
        setStats(data.stats || null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const endCall = useCallback(async (callId: string) => {
    try {
      await endCallService(callId);
      setLiveCalls(prev => prev.filter(call => call.callId !== callId));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const transferCall = useCallback(async (callId: string, destination: string) => {
    try {
      await transferCallService(callId, destination);
      setLiveCalls(prev => prev.filter(call => call.callId !== callId));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const answerCall = useCallback(async (callId: string) => {
    try {
      await answerCallService(callId);
      const answeredCall = queueCalls.find(call => call.callId === callId);
      if (answeredCall) {
        setQueueCalls(prev => prev.filter(call => call.callId !== callId));
        // Note: In a real app, the live call would come from the store update,
        // but here we optimistcally update
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [queueCalls]);

  const flagCall = useCallback(async (callId: string, reason: string) => {
    try {
      await flagCallService(callId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const assignTrip = useCallback(async (tripId: string, driverId: string, vehicleId: string) => {
    try {
      await assignTripService(tripId, driverId, vehicleId);
      setAssignmentTrips(prev => prev.filter(trip => trip.tripId !== tripId));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  return {
    liveCalls,
    queueCalls,
    createdTrips,
    assignmentTrips,
    stats,
    loading,
    error,
    actions: {
      endCall,
      transferCall,
      answerCall,
      flagCall,
      assignTrip,
    },
  };
}

/**
 * Hook for past transcripts
 */
export function usePastTranscripts() {
  const [transcripts, setTranscripts] = useState<PastTranscript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<PastTranscript | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [outcomeFilter, setOutcomeFilter] = useState<PastTranscript['outcome'] | null>(null);

  useEffect(() => {
    const unsubscribe = transcriptStore.subscribe((data) => {
      setTranscripts(data);
    });

    return unsubscribe;
  }, []);

  const filteredTranscripts = useCallback(() => {
    let result = transcripts;

    if (searchQuery) {
      result = transcriptStore.searchTranscripts(searchQuery);
    }

    if (outcomeFilter) {
      result = result.filter(t => t.outcome === outcomeFilter);
    }

    return result;
  }, [transcripts, searchQuery, outcomeFilter]);

  const selectTranscript = useCallback((callId: string) => {
    const transcript = transcriptStore.getTranscriptById(callId);
    setSelectedTranscript(transcript || null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTranscript(null);
  }, []);

  return {
    transcripts: filteredTranscripts(),
    selectedTranscript,
    searchQuery,
    outcomeFilter,
    setSearchQuery,
    setOutcomeFilter,
    selectTranscript,
    clearSelection,
  };
}

/**
 * Hook for call duration timer
 */
export function useCallDuration(startTime: string) {
  const [duration, setDuration] = useState<string>(() => calculateDuration(startTime));

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setDuration(calculateDuration(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return duration;
}

/**
 * Hook for queue wait time
 */
export function useQueueWaitTime(queueStartTime: string) {
  const [waitTime, setWaitTime] = useState<string>(() => calculateDuration(queueStartTime));

  useEffect(() => {
    if (!queueStartTime) return;

    const interval = setInterval(() => {
      setWaitTime(calculateDuration(queueStartTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [queueStartTime]);

  return waitTime;
}

export default useCallCenter;
