/**
 * StateFilter - Floating filter control on the map
 */

import { MapPin } from 'lucide-react';

interface LocationSummary {
  state: string;
  totalCount: number;
}

interface StateFilterProps {
  states: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  locations: LocationSummary[];
}

export default function StateFilter({ states, value, onChange, locations }: StateFilterProps) {
  // Count calls per state
  interface StateCounts {
    [key: string]: number;
  }

  const stateCounts = locations.reduce<StateCounts>((acc, loc) => {
    acc[loc.state] = (acc[loc.state] || 0) + loc.totalCount;
    return acc;
  }, {});

  const totalCalls = locations.reduce((sum, loc) => sum + loc.totalCount, 0);

  if (states.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[240px] animate-in slide-in-from-bottom-5 duration-500">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5" />
        Filter by Region
      </div>

      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer hover:bg-gray-100"
        >
          <option value="">Full Country View ({totalCalls})</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state} ({stateCounts[state] || 0})
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {value && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Zooming into <span className="font-bold text-gray-800">{value}</span></div>
          <button
            onClick={() => onChange(null)}
            className="w-full px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Reset Zoom
          </button>
        </div>
      )}
    </div>
  );
}
