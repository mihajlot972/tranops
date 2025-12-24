/**
 * QueueModal - Modal for queued call details
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, PhoneIncoming } from 'lucide-react';
import { useQueueWaitTime } from '../hooks/useCallCenter';
import { QueueCall } from '@/components/CallCenter/types';

interface QueueModalProps {
  call: QueueCall;
  onClose: (open: boolean) => void;
  onAnswer: (callId: string) => void;
}

export default function QueueModal({ call, onClose, onAnswer }: QueueModalProps) {
  const waitTime = useQueueWaitTime(call.queueStartTime);

  const handleAnswer = () => {
    onAnswer(call.callId);
    onClose(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-amber-600">Queue Position #{call.queuePosition}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Wait Time */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-amber-600">{waitTime}</div>
          <div className="text-sm text-amber-700">Waiting Time</div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 py-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-medium">{call.phoneFormatted}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className={`text-gray-600 ${call.location?.isApproximate ? 'italic' : ''}`}>
              {call.location?.display || 'Unknown location'}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAnswer}
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <PhoneIncoming className="h-4 w-4" />
            Answer Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
