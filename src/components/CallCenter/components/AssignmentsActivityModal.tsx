/**
 * AssignmentsActivityModal - Full screen dashboard for ride assignments
 */

import { Dialog, DialogContent } from '@/components/ui/modal';
import { Trip } from '@/components/CallCenter/types';
import { Car, User, Clock, MapPin, X, ClipboardList, Calendar, Phone, UserPlus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AssignmentsActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentTrips: Trip[];
    onAssignClick?: (trip: Trip) => void;
}

function TripCard({ trip, onAssign }: { trip: Trip; onAssign?: (trip: Trip) => void }) {
    // Parse date - scheduledDate may be ISO string or date string
    const tripDate = new Date(trip.scheduledDate);
    const isUrgent = tripDate.getTime() <= Date.now() + 2 * 60 * 60 * 1000;
    const displayDate = tripDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[280px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={isUrgent
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }>
                            {isUrgent ? 'URGENT' : 'PENDING'}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {trip.tripType}
                        </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{trip.passengerName}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Phone className="w-3 h-3" /> {trip.passengerPhone}
                    </div>
                </div>

                {/* Time Info */}
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {displayDate}
                    </div>
                    <div className="text-xs text-blue-600 font-medium flex items-center gap-1 justify-end mt-1">
                        <Clock className="w-3 h-3" />
                        {trip.scheduledTime}
                    </div>
                </div>
            </div>

            {/* Route Info */}
            <div className="flex-1 p-4 space-y-3">
                <div className="flex items-start gap-2">
                    <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-200" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pickup</div>
                        <div className="text-sm text-gray-700 line-clamp-2">{trip.pickup}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-200" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Dropoff</div>
                        <div className="text-sm text-gray-700 line-clamp-2">{trip.dropoff}</div>
                    </div>
                </div>

                {trip.notes && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic line-clamp-2">
                        {trip.notes}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-gray-100">
                <button
                    onClick={() => onAssign?.(trip)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Assign Driver
                </button>
            </div>
        </div>
    );
}

export default function AssignmentsActivityModal({
    isOpen,
    onClose,
    assignmentTrips,
    onAssignClick
}: AssignmentsActivityModalProps) {
    if (!isOpen) return null;

    // Separate urgent and regular trips
    const twoHoursFromNow = Date.now() + 2 * 60 * 60 * 1000;

    const urgentTrips = assignmentTrips.filter(trip => {
        const tripTime = new Date(trip.scheduledDate).getTime();
        return tripTime <= twoHoursFromNow;
    });

    const regularTrips = assignmentTrips.filter(trip => {
        const tripTime = new Date(trip.scheduledDate).getTime();
        return tripTime > twoHoursFromNow;
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden bg-slate-50 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-md z-20 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-2 rounded-lg shadow-lg shadow-amber-200">
                            <ClipboardList className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 leading-none">Ride Assignments</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {assignmentTrips.length} rides waiting for driver assignment
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="group flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500 hover:text-slate-800 font-medium border border-transparent hover:border-slate-200"
                    >
                        <span>Close Dashboard</span>
                        <div className="bg-slate-200 group-hover:bg-slate-300 rounded p-1">
                            <X className="w-4 h-4" />
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <ScrollArea className="h-full">
                        <div className="px-8 pb-8 pt-6">
                            {assignmentTrips.length === 0 ? (
                                <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                                    <Car className="w-16 h-16 mb-4 opacity-20" />
                                    <h3 className="text-xl font-medium text-gray-500">All Rides Assigned</h3>
                                    <p className="text-gray-400">Great job! No pending assignments.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Urgent Section */}
                                    {urgentTrips.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider">
                                                    Urgent - Within 2 Hours
                                                </h3>
                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                                    {urgentTrips.length}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {urgentTrips.map(trip => (
                                                    <TripCard
                                                        key={trip.tripId}
                                                        trip={trip}
                                                        onAssign={onAssignClick}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Regular Section */}
                                    {regularTrips.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                                    Upcoming Rides
                                                </h3>
                                                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                    {regularTrips.length}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {regularTrips.map(trip => (
                                                    <TripCard
                                                        key={trip.tripId}
                                                        trip={trip}
                                                        onAssign={onAssignClick}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
