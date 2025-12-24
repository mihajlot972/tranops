/**
 * CallCenter - Map-centric call center dashboard
 * All interactions through modals overlaid on a Leaflet map
 */

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CallCenterProvider, useCallCenterContext } from './context/CallCenterContext';
import { useCallCenter } from './hooks/useCallCenter';
import { useCallMapData } from './hooks/useCallMapData';
import TopBar from './components/TopBar';
import { ViewMode } from './components/Sidebar';
import ViewModeSelector from './components/ViewModeSelector';
import DashboardPanel from './components/DashboardPanel';
import LiveActivityModal from './components/LiveActivityModal';
import AssignmentsActivityModal from './components/AssignmentsActivityModal';
// import Sidebar from './components/Sidebar'; // Removed by request
import CallDetailModal from './components/CallDetailModal';
import QueueModal from './components/QueueModal';
import TripModal from './components/TripModal';
import AssignmentModal from './components/AssignmentModal';
import HistoryDrawer from './components/HistoryDrawer';
import MapMarker from './components/MapMarker';
import RegionFilter from './components/RegionFilter';
import { LiveCall, QueueCall, Trip } from './types';
import { DELAWARE_REGIONS, DE_BOUNDS, DE_CENTER, DE_MAX_BOUNDS } from './constants/delawareRegions';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapControllerProps {
  regionFilter: string | null;
}

function MapController({ regionFilter }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    // No bounds restriction - free movement across the map
    // Data is filtered to Delaware only

    if (regionFilter && DELAWARE_REGIONS[regionFilter as keyof typeof DELAWARE_REGIONS]) {
      const region = DELAWARE_REGIONS[regionFilter as keyof typeof DELAWARE_REGIONS];
      map.flyToBounds(region.bounds, {
        duration: 1,
        padding: [20, 20]
      });
    } else {
      // Show full Delaware state on initial load or reset
      map.flyToBounds(DE_BOUNDS, {
        padding: [30, 30],
        duration: 1
      });
    }
  }, [map, regionFilter]);

  return null;
}

interface CallCenterProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

function CallCenterContent({ onLogout, isAuthenticated }: CallCenterProps) {
  const { stats, actions, liveCalls, queueCalls, assignmentTrips } = useCallCenter();
  const { locations, states } = useCallMapData();
  const {
    selectedCall,
    selectedTrip,
    modalType,
    historyOpen,
    openCallModal,
    openTripModal,
    closeModal,
    openHistory,
    closeHistory,
  } = useCallCenterContext();

  console.log('CallCenterContent Render:', { modalType, historyOpen, selectedCall, selectedTrip });

  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calls');
  const [dashboardOpen, setDashboardOpen] = useState(false); // Calls dashboard
  const [assignmentsDashboardOpen, setAssignmentsDashboardOpen] = useState(false); // Assignments dashboard
  const [panelOpen, setPanelOpen] = useState(true); // Right side panel state

  // Filter locations based on viewMode and regionFilter (Delaware only)
  const filteredLocations = useMemo(() => {
    return locations.filter((loc: any) => {
      // 1. Only show Delaware locations
      if (loc.state !== 'DE') return false;

      // 2. Filter by region if selected
      if (regionFilter && loc.region !== regionFilter) return false;

      // 2. Filter by View Mode
      if (viewMode === 'calls') {
        // Show only locations with active calls/queue
        return loc.liveCount > 0 || loc.queueCount > 0;
      } else if (viewMode === 'assignments') {
        // Show only locations with unassigned trips
        // (Assuming tripCount reflects relevant trips, or better: filter trips inside location)
        return loc.trips.some((t: Trip) => !t.driver);
      } else if (viewMode === 'dispatch') {
        // WIP - show everything or specific dispatch logic
        return true;
      }
      return false;
    }).map((loc: any) => {
      // 3. Clean up inner data based on mode (visual clarity)
      if (viewMode === 'calls') {
        return { ...loc, trips: [] }; // Hide trips from popup in calls mode
      } else if (viewMode === 'assignments') {
        // Hide calls, show only unassigned trips
        return {
          ...loc,
          calls: [],
          trips: loc.trips.filter((t: Trip) => !t.driver)
        };
      }
      return loc;
    });
  }, [locations, regionFilter, viewMode]);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation - Removed by Request */}
      {/* <Sidebar activeMode={viewMode} onModeChange={setViewMode} /> */}

      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Bar */}
        {isAuthenticated && stats && (
          <div className="relative z-[1001]">
            <TopBar stats={stats} onHistoryClick={openHistory} onLogout={onLogout} />
          </div>
        )}

        <div className="flex-1 flex relative overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative z-0">
            <MapContainer
              center={DE_CENTER}
              zoom={9}
              className="h-full w-full outline-none"
              zoomControl={false}
              scrollWheelZoom={true}
              minZoom={3}
              maxZoom={18}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapController regionFilter={regionFilter} />

              {/* Markers */}
              {isAuthenticated && filteredLocations.map((location: any) => (
                <MapMarker
                  key={location.locationKey}
                  location={location}
                  onCallClick={(call) => openCallModal(call as any)}
                  onTripClick={(trip, type) => openTripModal(trip as unknown as Trip, type)}
                />
              ))}
            </MapContainer>

            {/* Bottom Left Controls */}
            {isAuthenticated && (
              <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-3">
                <ViewModeSelector
                  activeMode={viewMode}
                  onModeChange={setViewMode}
                  onOpenDashboard={() => setDashboardOpen(true)}
                  onOpenAssignmentsDashboard={() => setAssignmentsDashboardOpen(true)}
                  panelOpen={panelOpen}
                  onTogglePanel={() => setPanelOpen(true)}
                />
                <RegionFilter
                  value={regionFilter}
                  onChange={setRegionFilter}
                />
              </div>
            )}
          </div>

          {/* Right Side Dashboard Panel */}
          {isAuthenticated && panelOpen && (
            <DashboardPanel
              viewMode={viewMode}
              liveCalls={liveCalls}
              queueCalls={queueCalls}
              assignmentTrips={assignmentTrips}
              onCallClick={(call) => openCallModal(call as any)}
              onTripClick={(trip) => openTripModal(trip, 'assignment')}
              onClose={() => setPanelOpen(false)}
            />
          )}
        </div>
      </div>

      {isAuthenticated && (
        <LiveActivityModal
          isOpen={dashboardOpen}
          onClose={() => setDashboardOpen(false)}
          liveCalls={liveCalls}
          queueCalls={queueCalls}
        />
      )}

      {isAuthenticated && (
        <AssignmentsActivityModal
          isOpen={assignmentsDashboardOpen}
          onClose={() => setAssignmentsDashboardOpen(false)}
          assignmentTrips={assignmentTrips}
          onAssignClick={(trip) => openTripModal(trip, 'assignment')}
        />
      )}

      {/* Modals - only visible when authenticated */}
      {isAuthenticated && modalType === 'call' && selectedCall && (
        <CallDetailModal
          call={selectedCall as LiveCall}
          onClose={() => closeModal()}
          onEndCall={actions.endCall}
          onTransfer={actions.transferCall}
          onFlag={actions.flagCall}
        />
      )}

      {isAuthenticated && modalType === 'queue' && selectedCall && (
        <QueueModal
          call={selectedCall as QueueCall}
          onClose={() => closeModal()}
          onAnswer={actions.answerCall}
        />
      )}

      {isAuthenticated && modalType === 'trip' && selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={() => closeModal()}
        />
      )}

      {isAuthenticated && modalType === 'assignment' && selectedTrip && (
        <AssignmentModal
          trip={selectedTrip}
          onClose={() => closeModal()}
          onAssign={actions.assignTrip}
        />
      )}

      {/* History Drawer - only visible when authenticated */}
      {isAuthenticated && <HistoryDrawer open={historyOpen} onClose={closeHistory} />}
    </div>
  );
}

export default function CallCenter({ onLogout, isAuthenticated }: CallCenterProps) {
  return (
    <CallCenterProvider>
      <CallCenterContent onLogout={onLogout} isAuthenticated={isAuthenticated} />
    </CallCenterProvider>
  );
}
