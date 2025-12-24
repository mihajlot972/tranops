/**
 * TripModal - Modal for trip details
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/modal';
import { User, Phone, Calendar, Clock, FileText, Tag } from 'lucide-react';
import { TRIP_TYPE_LABELS } from '../services/callCenterService';
import { Trip } from '@/components/CallCenter/types';

interface TripModalProps {
  trip: Trip;
  onClose: (open: boolean) => void;
}

export default function TripModal({ trip, onClose }: TripModalProps) {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-500" />
            <span>{TRIP_TYPE_LABELS[trip.tripType as keyof typeof TRIP_TYPE_LABELS] || 'Trip'}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Passenger Info */}
        <div className="space-y-3 py-4 border-b">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-medium">{trip.passengerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">{trip.passengerPhone}</span>
          </div>
        </div>

        {/* Route */}
        <div className="py-4 border-b space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Pickup</div>
              <div className="text-sm text-gray-800">{trip.pickup}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Dropoff</div>
              <div className="text-sm text-gray-800">{trip.dropoff}</div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="py-4 border-b space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">{formatDate(trip.scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">{trip.scheduledTime}</span>
          </div>
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="py-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 uppercase mb-1">Notes</div>
                <div className="text-sm text-gray-600">{trip.notes}</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
