/**
 * RegionFilter - Filter by Delaware county regions
 */

import { MapPin, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DELAWARE_REGIONS } from '../constants/delawareRegions';

interface RegionFilterProps {
    value: string | null;
    onChange: (region: string | null) => void;
}

const REGIONS = [
    { id: 'new-castle', name: 'New Castle County', description: 'Wilmington, Newark' },
    { id: 'kent', name: 'Kent County', description: 'Dover, Smyrna' },
    { id: 'sussex', name: 'Sussex County', description: 'Rehoboth, Georgetown' },
];

export default function RegionFilter({ value, onChange }: RegionFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedRegion = value ? REGIONS.find(r => r.id === value) : null;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[200px]"
            >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="flex-1 text-left">
                    {selectedRegion ? selectedRegion.name : 'All Delaware'}
                </span>
                {value ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded"
                    >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                ) : (
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                            Delaware Regions
                        </div>

                        {/* All Delaware Option */}
                        <button
                            onClick={() => {
                                onChange(null);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                                !value
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <div className="font-medium">All Delaware</div>
                            <div className="text-xs text-gray-500">View entire state</div>
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        {/* Region Options */}
                        {REGIONS.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => {
                                    onChange(region.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                                    value === region.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <div className="font-medium">{region.name}</div>
                                <div className="text-xs text-gray-500">{region.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
