/**
 * Sidebar - Vertical navigation for Call Center modes
 */

import { Phone, CheckSquare, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export type ViewMode = 'calls' | 'assignments' | 'dispatch';

interface SidebarProps {
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
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

export default function Sidebar({ activeMode, onModeChange }: SidebarProps) {
    return (
        <div className="w-16 flex-shrink-0 bg-slate-900 flex flex-col items-center py-4 gap-4 z-[1002] border-r border-slate-800">
            {/* Brand Icon or Spacer */}
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-green-900/20">
                TR
            </div>

            <TooltipProvider delayDuration={0}>
                <div className="flex flex-col gap-2 w-full px-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeMode === item.id;
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onModeChange(item.id)}
                                        className={cn(
                                            "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-white text-slate-900 shadow-md"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />

                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full" />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-700">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>

            <div className="flex-1" />

            {/* Bottom Actions if needed */}
        </div>
    );
}
