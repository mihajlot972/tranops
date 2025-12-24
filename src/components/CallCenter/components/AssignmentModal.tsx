/**
 * AssignmentModal - Modal for assigning driver and vehicle to a trip
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, MapPin, Calendar, Clock, UserCheck, Car, AlertCircle } from 'lucide-react';
import { TRIP_TYPE_LABELS, MOCK_DRIVERS, MOCK_VEHICLES } from '../services/callCenterService';
import { Trip } from '@/components/CallCenter/types';

interface AssignmentModalProps {
  trip: Trip;
  onClose: () => void;
  onAssign: (tripId: string, driverId: string, vehicleId: string) => void;
}

export default function AssignmentModal({ trip, onClose, onAssign }: AssignmentModalProps) {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [error, setError] = useState('');

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAssign = () => {
    if (!selectedDriver || !selectedVehicle) {
      setError('Please select both a driver and vehicle');
      return;
    }

    onAssign(trip.tripId, selectedDriver, selectedVehicle);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-pink-500" />
            <span>Assign Trip</span>
            <span className="text-sm font-normal text-gray-500">
              {TRIP_TYPE_LABELS[trip.tripType as keyof typeof TRIP_TYPE_LABELS]}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Trip Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{trip.passengerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-green-500" />
            <span>{trip.pickup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{trip.dropoff}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(trip.scheduledDate)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {trip.scheduledTime}
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="space-y-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <UserCheck className="h-4 w-4" />
              Select Driver
            </label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a driver..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_DRIVERS.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Car className="h-4 w-4" />
              Select Vehicle
            </label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a vehicle..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_VEHICLES.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Return Trip Info */}
        {trip.returnTime && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-green-700 uppercase mb-1">Return Trip</div>
            <div className="text-sm text-green-800">
              Pickup at {trip.returnTime} from {trip.returnPickup || trip.dropoff}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} className="bg-pink-600 hover:bg-pink-700">
            Assign Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
