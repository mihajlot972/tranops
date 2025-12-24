/**
 * CallDetailModal - Modal for live call details with transcript and actions
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
import { Input } from '@/components/ui/input';
import { Phone, MapPin, PhoneOff, ArrowRightLeft, Flag, X } from 'lucide-react';
import { useCallDuration } from '../hooks/useCallCenter';
import TranscriptView from './TranscriptView';
import { LiveCall } from '@/components/CallCenter/types';

interface CallDetailModalProps {
  call: LiveCall;
  onClose: (open: boolean) => void;
  onEndCall: (callId: string) => void;
  onTransfer: (callId: string, destination: string) => void;
  onFlag: (callId: string, reason: string) => void;
}

export default function CallDetailModal({ call, onClose, onEndCall, onTransfer, onFlag }: CallDetailModalProps) {
  const duration = useCallDuration(call.startTime);
  const [showTransferInput, setShowTransferInput] = useState(false);
  const [transferDestination, setTransferDestination] = useState('');
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  const handleEndCall = () => {
    onEndCall(call.callId);
    onClose(false);
  };

  const handleTransfer = () => {
    if (transferDestination.trim()) {
      onTransfer(call.callId, transferDestination);
      onClose(false);
    }
  };

  const handleFlag = () => {
    onFlag(call.callId, 'Flagged for review');
    onClose(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-600 font-semibold">LIVE CALL</span>
              <span className="font-mono text-gray-600 ml-2">{duration}</span>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Contact Info */}
        <div className="space-y-3 py-4 border-b">
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

        {/* Transcript */}
        <div className="py-4">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Live Transcript</h4>
          <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
            <TranscriptView transcript={call.transcript || []} />
          </div>
        </div>

        {/* Transfer Input */}
        {showTransferInput && (
          <div className="flex gap-2 py-2">
            <Input
              placeholder="Enter destination (extension, department)"
              value={transferDestination}
              onChange={(e) => setTransferDestination(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTransfer} disabled={!transferDestination.trim()}>
              Transfer
            </Button>
            <Button variant="ghost" onClick={() => setShowTransferInput(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Confirm End */}
        {showConfirmEnd && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-3">Are you sure you want to end this call?</p>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleEndCall}>
                Yes, End Call
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmEnd(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!showTransferInput && !showConfirmEnd && (
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowConfirmEnd(true)}
              className="flex items-center gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              End Call
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTransferInput(true)}
              className="flex items-center gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </Button>
            <Button
              variant="outline"
              onClick={handleFlag}
              className="flex items-center gap-2"
            >
              <Flag className="h-4 w-4" />
              Flag
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
