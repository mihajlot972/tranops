/**
 * DashboardPanel - Right side panel for Call Center View Modes
 */

import { Phone, Clock, MessageSquare, MapPin, User, ArrowRight, Radio, CheckSquare, X } from 'lucide-react';
import { ViewMode } from './Sidebar';
import { LiveCall, QueueCall, Trip } from '@/components/CallCenter/types';
import { useCallDuration } from '../hooks/useCallCenter';
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// Replaced with inline styles for stability
const Badge = ({ children, className, variant = "default" }: any) => (
    <span className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className} ${variant === 'outline' ? 'border-amber-200 text-amber-700' : 'bg-primary text-primary-foreground'}`}>
        {children}
    </span>
);
const ScrollArea = ({ children, className }: any) => (
    <div className={`overflow-y-auto ${className}`}>{children}</div>
);

interface DashboardPanelProps {
    viewMode: ViewMode;
    liveCalls: LiveCall[];
    queueCalls: QueueCall[];
    assignmentTrips: Trip[];
    onCallClick: (call: LiveCall | QueueCall) => void;
    onTripClick: (trip: Trip) => void;
    onClose?: () => void;
}

function CallItem({ call, onClick }: { call: LiveCall; onClick: () => void }) {
    const duration = useCallDuration(call.startTime);
    const lastMessage = call.transcript && call.transcript.length > 0
        ? call.transcript[call.transcript.length - 1]
        : null;

    return (
        <div
            onClick={onClick}
            className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{call.phoneFormatted || call.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    <Clock className="h-3 w-3" />
                    {duration}
                </div>
            </div>

            {/* Transcript Snippet */}
            {lastMessage && (
                <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 border border-gray-100 mb-2">
                    <div className="flex items-center gap-1 mb-1 text-xs font-medium text-gray-400 uppercase">
                        <MessageSquare className="h-3 w-3" />
                        Live Transcript
                    </div>
                    <p className="line-clamp-2 italic">"{lastMessage.text}"</p>
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Caller
                </span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                    Active
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </span>
            </div>
        </div>
    );
}

function QueueItem({ call, onClick }: { call: QueueCall; onClick: () => void }) {
    const duration = useCallDuration(call.queueStartTime);

    return (
        <div
            onClick={onClick}
            className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-gray-900">{call.phoneFormatted || call.phone}</span>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                    Queue
                </Badge>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                <span>Position: #{call.queuePosition}</span>
                <span className="font-mono">Waited: {duration}</span>
            </div>
        </div>
    );
}

function AssignmentItem({ trip, onClick }: { trip: Trip; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg cursor-pointer transition-colors shadow-sm"
        >
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-900">{trip.passengerName}</span>
                <Badge variant="secondary" className="text-xs">{trip.tripType}</Badge>
            </div>
            <div className="text-xs text-gray-500 flex flex-col gap-1">
                <div className="flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                    <span className="line-clamp-1">{trip.pickup}</span>
                </div>
                <div className="flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 text-red-500 shrink-0" />
                    <span className="line-clamp-1">{trip.dropoff}</span>
                </div>
            </div>
            <div className="mt-2 text-xs flex justify-end text-blue-600 font-medium">
                Assign Driver <ArrowRight className="h-3 w-3 ml-1" />
            </div>
        </div>
    );
}

export default function DashboardPanel({
    viewMode,
    liveCalls,
    queueCalls,
    assignmentTrips,
    onCallClick,
    onTripClick,
    onClose
}: DashboardPanelProps) {

    if (viewMode === 'dispatch') {
        return (
            <div className="w-80 h-full bg-white border-l border-gray-200 shadow-xl flex flex-col p-6 items-center justify-center text-center text-gray-500">
                <Radio className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispatch View</h3>
                <p>Dispatch implementation coming soon.</p>
            </div>
        );
    }

    return (
        <div className="w-96 h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col z-[1100]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {viewMode === 'calls' ? <Phone className="h-5 w-5" /> : <CheckSquare className="h-5 w-5" />}
                        {viewMode === 'calls' ? 'Live Actions' : 'Pending Assignments'}
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {viewMode === 'calls'
                        ? `${liveCalls.length} active calls • ${queueCalls.length} in queue`
                        : `${assignmentTrips.length} unassigned rides waiting`
                    }
                </p>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">

                    {viewMode === 'calls' && (
                        <>
                            {/* Live Calls Section */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                    Active Calls
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{liveCalls.length}</Badge>
                                </h3>
                                {liveCalls.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm italic">
                                        No active calls.
                                    </div>
                                ) : (
                                    liveCalls.map(call => (
                                        <CallItem key={call.callId} call={call} onClick={() => onCallClick(call)} />
                                    ))
                                )}
                            </div>

                            {/* Queue Section */}
                            {queueCalls.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between pt-4 border-t border-gray-100">
                                        Call Queue
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{queueCalls.length}</Badge>
                                    </h3>
                                    {queueCalls.map(call => (
                                        <QueueItem key={call.callId} call={call} onClick={() => onCallClick(call)} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {viewMode === 'assignments' && (
                        <div className="space-y-3">
                            {assignmentTrips.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm italic">
                                    All rides assigned. Good job!
                                </div>
                            ) : (
                                assignmentTrips.map(trip => (
                                    <AssignmentItem key={trip.tripId} trip={trip} onClick={() => onTripClick(trip)} />
                                ))
                            )}
                        </div>
                    )}

                </div>
            </ScrollArea>
        </div>
    );
}
