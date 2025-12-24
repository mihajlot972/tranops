/**
 * Delaware state regions (counties) configuration
 */

export const DELAWARE_REGIONS = {
  'new-castle': {
    name: 'New Castle County',
    center: [39.68, -75.65] as [number, number],
    bounds: [[39.52, -75.79], [39.84, -75.40]] as [[number, number], [number, number]],
    zoom: 11,
    cities: ['Wilmington', 'Newark', 'New Castle', 'Bear', 'Middletown']
  },
  'kent': {
    name: 'Kent County',
    center: [39.15, -75.52] as [number, number],
    bounds: [[38.91, -75.75], [39.52, -75.35]] as [[number, number], [number, number]],
    zoom: 11,
    cities: ['Dover', 'Smyrna', 'Milford', 'Camden', 'Harrington']
  },
  'sussex': {
    name: 'Sussex County',
    center: [38.68, -75.35] as [number, number],
    bounds: [[38.45, -75.62], [38.91, -74.98]] as [[number, number], [number, number]],
    zoom: 10,
    cities: ['Georgetown', 'Lewes', 'Rehoboth Beach', 'Seaford', 'Milton']
  }
};

// Delaware state bounds
export const DE_BOUNDS: [[number, number], [number, number]] = [[38.45, -75.79], [39.84, -74.98]];
export const DE_CENTER: [number, number] = [39.15, -75.42];
// Wider bounds for comfortable panning (includes some surrounding area)
export const DE_MAX_BOUNDS: [[number, number], [number, number]] = [[38.0, -76.2], [40.2, -74.5]];
