import { Phone, CheckSquare, Radio, Maximize2, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from './Sidebar';

interface ViewModeSelectorProps {
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    onOpenDashboard: () => void;
    onOpenAssignmentsDashboard?: () => void;
    panelOpen?: boolean;
    onTogglePanel?: () => void;
}

interface NavItem {
    id: ViewMode;
    icon: React.ElementType;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'calls', icon: Phone, label: 'Calls Management' },
    { id: 'assignments', icon: CheckSquare, label: 'Ride Assignment' },
    { id: 'dispatch', icon: Radio, label: 'Dispatch (WIP)' },
];

export default function ViewModeSelector({ activeMode, onModeChange, onOpenDashboard, onOpenAssignmentsDashboard, panelOpen, onTogglePanel }: ViewModeSelectorProps) {
    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 min-w-[240px] animate-in slide-in-from-bottom-5 duration-500 delay-100">
            {/* Toggle Panel Button */}
            {onTogglePanel && !panelOpen && (
                <button
                    onClick={onTogglePanel}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 mb-1"
                >
                    <PanelRight className="w-4 h-4" />
                    Show Panel
                </button>
            )}
            {NAV_ITEMS.map((item) => {
                const isActive = activeMode === item.id;
                const Icon = item.icon;

                return (
                    <div key={item.id} className="relative group">
                        <button
                            onClick={() => onModeChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium text-left",
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5px]")} />
                            {item.label}
                        </button>

                        {/* Open Dashboard Button - For Calls and Assignments */}
                        {(item.id === 'calls' || item.id === 'assignments') && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.id === 'calls') {
                                        onOpenDashboard();
                                    } else if (item.id === 'assignments' && onOpenAssignmentsDashboard) {
                                        onOpenAssignmentsDashboard();
                                    }
                                }}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all duration-200",
                                    isActive
                                        ? "text-slate-400 hover:text-white hover:bg-slate-700"
                                        : "text-gray-400 hover:text-slate-900 hover:bg-gray-200"
                                )}
                                title={item.id === 'calls' ? "Open Live Dashboard" : "Open Assignments Dashboard"}
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
