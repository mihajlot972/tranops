/**
 * CallCenter Context
 * Provides global state and actions for the CallCenter component
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Call, Trip } from '../types';

interface CallCenterContextType {
  selectedCall: Call | null;
  selectedTrip: Trip | null;
  modalType: 'call' | 'queue' | 'trip' | 'assignment' | 'history' | null;
  historyOpen: boolean;
  openCallModal: (call: Call) => void;
  openTripModal: (trip: Trip, type?: 'trip' | 'assignment') => void;
  closeModal: () => void;
  openHistory: () => void;
  closeHistory: () => void;
  openAndScrollToCall: (callId: string, section: string) => void;
}

const CallCenterContext = createContext<CallCenterContextType | null>(null);

export function CallCenterProvider({ children }: { children: ReactNode }) {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalType, setModalType] = useState<'call' | 'queue' | 'trip' | 'assignment' | 'history' | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const openCallModal = useCallback((call: Call) => {
    console.log('openCallModal', call);
    setSelectedCall(call);
    setModalType(call.status === 'live' ? 'call' : 'queue');
  }, []);

  const openTripModal = useCallback((trip: Trip, type: 'trip' | 'assignment' = 'trip') => {
    console.log('openTripModal', trip, type);
    setSelectedTrip(trip);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    console.log('closeModal');
    setSelectedCall(null);
    setSelectedTrip(null);
    setModalType(null);
  }, []);

  const openHistory = useCallback(() => {
    console.log('openHistory');
    setHistoryOpen(true);
  }, []);

  const closeHistory = useCallback(() => {
    setHistoryOpen(false);
  }, []);

  // Used by map markers to open modal and scroll
  const openAndScrollToCall = useCallback((callId: string, section: string) => {
    // This will be handled by the parent component
    console.log('Open and scroll to call:', callId, section);
  }, []);

  const value: CallCenterContextType = {
    selectedCall,
    selectedTrip,
    modalType,
    historyOpen,
    openCallModal,
    openTripModal,
    closeModal,
    openHistory,
    closeHistory,
    openAndScrollToCall,
  };

  return (
    <CallCenterContext.Provider value={value}>
      {children}
    </CallCenterContext.Provider>
  );
}

export function useCallCenterContext() {
  const context = useContext(CallCenterContext);
  if (!context) {
    throw new Error('useCallCenterContext must be used within a CallCenterProvider');
  }
  return context;
}

export default CallCenterContext;
