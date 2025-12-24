/**
 * ControlOps Service
 * Handles API calls to the ControlOps backend for workspace/workflow management
 */

export interface ControlOpsTrip {
  tripId: string;
  riderName: string;
  driverName: string;
  pickup: string;
  dropoff: string;
  event: string;
  timestamp: string;
  status: string;
}

// Mock trips data
export const MOCK_TRIPS: ControlOpsTrip[] = [
  {
    tripId: "TRP-001",
    riderName: "John Smith",
    driverName: "Mike Johnson",
    pickup: "123 Main St, Downtown",
    dropoff: "456 Oak Ave, Airport",
    event: "Booked",
    timestamp: "2024-01-15 09:30:00",
    status: "Pending Approval"
  },
  {
    tripId: "TRP-002",
    riderName: "Sarah Wilson",
    driverName: "Tom Davis",
    pickup: "789 Pine Rd, Mall",
    dropoff: "321 Elm St, Hospital",
    event: "Completed",
    timestamp: "2024-01-15 08:15:00",
    status: "Finished"
  },
  {
    tripId: "TRP-003",
    riderName: "Emily Brown",
    driverName: "Chris Lee",
    pickup: "555 Cedar Ln, Office Park",
    dropoff: "777 Maple Dr, Residence",
    event: "Cancelled",
    timestamp: "2024-01-15 10:45:00",
    status: "Rider Cancelled"
  },
  {
    tripId: "TRP-004",
    riderName: "Michael Chen",
    driverName: "Jessica White",
    pickup: "999 Broadway, Hotel",
    dropoff: "111 First Ave, Convention Center",
    event: "Booked",
    timestamp: "2024-01-15 11:00:00",
    status: "Driver Assigned"
  },
  {
    tripId: "TRP-005",
    riderName: "Lisa Anderson",
    driverName: "Robert Martinez",
    pickup: "222 Second St, Train Station",
    dropoff: "333 Third Blvd, University",
    event: "Completed",
    timestamp: "2024-01-15 07:30:00",
    status: "Finished"
  }
];

export interface SopColumn {
  key: string;
  label: string;
  visible: boolean;
  width: number;
}

export interface SopLayout {
  style: string;
  pageSize: number;
  showPagination: boolean;
}

export interface SopConfig {
  columns: SopColumn[];
  layout: SopLayout;
  modalTitle?: string;
  filterEvents?: string[] | null;
  description?: string;
}

// SOP UI Configuration
export const getSopConfig = (sopId: string): SopConfig => {
  const baseConfig: SopConfig = {
    columns: [
      { key: "tripId", label: "Trip ID", visible: true, width: 100 },
      { key: "riderName", label: "Rider", visible: true, width: 150 },
      { key: "driverName", label: "Driver", visible: true, width: 150 },
      { key: "pickup", label: "Pickup", visible: true, width: 200 },
      { key: "dropoff", label: "Dropoff", visible: true, width: 200 },
      { key: "event", label: "Event", visible: true, width: 100 },
      { key: "timestamp", label: "Time", visible: true, width: 150 },
      { key: "status", label: "Status", visible: true, width: 130 }
    ],
    layout: {
      style: "table",
      pageSize: 10,
      showPagination: true
    }
  };

  const sopConfigs: Record<string, SopConfig> = {
    'sop-trip-assignment': {
      ...baseConfig,
      modalTitle: "Trip Assignment Results",
      filterEvents: ["Booked"],
      description: "Trips pending assignment"
    },
    'sop-driver-notification': {
      ...baseConfig,
      modalTitle: "Driver Notification Results",
      filterEvents: ["Booked"],
      description: "Drivers notified for new trips"
    },
    'sop-route-optimization': {
      ...baseConfig,
      modalTitle: "Route Optimization Results",
      filterEvents: ["Booked", "Completed"],
      description: "Optimized routes"
    },
    'sop-passenger-alerts': {
      ...baseConfig,
      modalTitle: "Passenger Alert Results",
      filterEvents: ["Booked", "Completed", "Cancelled"],
      description: "Passenger notifications sent"
    },
    'sop-dispatch-escalation': {
      ...baseConfig,
      modalTitle: "Dispatch Escalation Results",
      filterEvents: ["Booked", "Cancelled"],
      description: "Escalated to dispatch"
    }
  };

  return sopConfigs[sopId] || { ...baseConfig, modalTitle: "SOP Results", filterEvents: null, description: "" };
};

// Simulate SOP execution
export const simulateSopExecution = (sopId: string): Promise<{ success: boolean; config: SopConfig; trips: ControlOpsTrip[]; executedAt: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const config = getSopConfig(sopId);
      let trips = [...MOCK_TRIPS];

      if (config.filterEvents && config.filterEvents.length > 0) {
        trips = trips.filter(trip => config.filterEvents!.includes(trip.event));
      }

      resolve({
        success: true,
        config,
        trips,
        executedAt: new Date().toISOString()
      });
    }, 1500);
  });
};

declare global {
  interface Window {
    SiteConfig?: {
      domain?: string;
    };
  }
}

const getBaseUrl = (): string => {
  const tenantName = sessionStorage.getItem("tenantName");
  const domain = window.SiteConfig?.domain || "qryde.net";
  return `https://${tenantName}-bridge.${domain}/controlops/api`;
};

const getAuthHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem(btoa('authToken'));
  return {
    'Authorization': `Bearer ${token ? atob(token) : ''}`,
    'Content-Type': 'application/json'
  };
};

export interface Workflow {
  workflow_id: string;
  name: string;
  description: string;
  enabled: boolean;
  stream: string;
  version: string;
}

export interface Stream {
  stream_id: string;
  name: string;
}

export interface Actor {
  actor_id: string;
  name: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  [key: string]: any; // Allow other properties from backend
}

export async function fetchWorkflows(): Promise<ApiResponse<Workflow[]>> {
  try {
    const response = await fetch(`${getBaseUrl()}/workflows`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return { success: false, data: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export async function fetchStreams(): Promise<ApiResponse<Stream[]>> {
  try {
    const response = await fetch(`${getBaseUrl()}/streams`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching streams:', error);
    return { success: false, data: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export async function fetchActors(): Promise<ApiResponse<Actor[]>> {
  try {
    const response = await fetch(`${getBaseUrl()}/actors`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching actors:', error);
    return { success: false, data: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export async function executeWorkflow(workflowId: string, params: Record<string, any> = {}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${getBaseUrl()}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error executing workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export interface WorkspaceSummary {
  total: number;
  enabled: number;
  available: Workflow[];
  error?: string;
}

export async function getWorkspaceSummary(): Promise<WorkspaceSummary> {
  const workflowsResult = await fetchWorkflows();

  if (!workflowsResult.success && workflowsResult.error) {
    return {
      total: 0,
      enabled: 0,
      available: [],
      error: workflowsResult.error
    };
  }

  // Handle case where success might be missing but data exists (depending on backend)
  // or simple fallback
  const workflows = workflowsResult.data || [];
  const enabled = workflows.filter(w => w.enabled);

  return {
    total: workflows.length,
    enabled: enabled.length,
    available: workflows.map(w => ({
      workflow_id: w.workflow_id,
      name: w.name,
      description: w.description,
      enabled: w.enabled,
      stream: w.stream,
      version: w.version
    })),
    error: workflowsResult.error
  };
}
