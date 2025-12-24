/**
 * HistoryDrawer - Side drawer showing past call history
 */

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Phone, MapPin, Clock, Check, X, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { usePastTranscripts } from '../hooks/useCallCenter';
import { formatCallTime, formatCallDate, getOutcomeInfo } from '../services/transcriptService';
import TranscriptView from './TranscriptView';
import { PastTranscript } from '@/components/CallCenter/types';

interface OutcomeIconProps {
  outcome: PastTranscript['outcome'];
}

const OutcomeIcon = ({ outcome }: OutcomeIconProps) => {
  const icons = {
    accepted: <Check className="h-4 w-4 text-green-500" />,
    rejected: <X className="h-4 w-4 text-red-500" />,
    missed: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    transferred: <ArrowRightLeft className="h-4 w-4 text-blue-500" />,
  };
  return icons[outcome] || null;
};

interface HistoryDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export default function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
  const {
    transcripts,
    selectedTranscript,
    searchQuery,
    outcomeFilter,
    setSearchQuery,
    setOutcomeFilter,
    selectTranscript,
    clearSelection,
  } = usePastTranscripts();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent side="right" className="w-full max-w-md">
        <DrawerHeader>
          <DrawerTitle>
            {selectedTranscript ? (
              <button
                onClick={clearSelection}
                className="text-blue-600 hover:text-blue-700 text-sm font-normal"
              >
                ← Back to list
              </button>
            ) : (
              'Call History'
            )}
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          {selectedTranscript ? (
            // Detail View
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="text-lg font-medium">{selectedTranscript.phoneFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedTranscript.location?.display}</span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedTranscript.duration}
                </div>
                <span>{formatCallDate(selectedTranscript.startTime)}</span>
                <span>{formatCallTime(selectedTranscript.startTime)}</span>
              </div>

              {/* Outcome */}
              <div className="flex items-center gap-2">
                <OutcomeIcon outcome={selectedTranscript.outcome} />
                <span className={getOutcomeInfo(selectedTranscript.outcome).color}>
                  {getOutcomeInfo(selectedTranscript.outcome).label}
                </span>
              </div>

              {/* Transcript */}
              <div className="bg-gray-50 rounded-lg p-4">
                <TranscriptView transcript={selectedTranscript.transcript} />
              </div>
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {/* Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search calls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={outcomeFilter || 'all'}
                  onValueChange={(v) => {
                    // Properly cast string value back to PastTranscript['outcome'] or null
                    const validOutcomes: PastTranscript['outcome'][] = ['accepted', 'rejected', 'missed', 'transferred'];
                    if (v === 'all') {
                      setOutcomeFilter(null);
                    } else if (validOutcomes.includes(v as PastTranscript['outcome'])) {
                      setOutcomeFilter(v as PastTranscript['outcome']);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All outcomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All outcomes</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* List */}
              <div className="space-y-2">
                {transcripts.map((call) => {
                  const outcomeInfo = getOutcomeInfo(call.outcome);
                  return (
                    <button
                      key={call.callId}
                      onClick={() => selectTranscript(call.callId)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{call.phoneFormatted}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatCallTime(call.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {call.location?.display}
                        </div>
                        <div className="flex items-center gap-1">
                          <OutcomeIcon outcome={call.outcome} />
                          <span className={`text-xs ${outcomeInfo.color}`}>
                            {outcomeInfo.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {transcripts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No calls found
                  </div>
                )}
              </div>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
