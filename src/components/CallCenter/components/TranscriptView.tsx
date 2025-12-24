/**
 * TranscriptView - Displays call transcript messages
 */

import { TranscriptMessage } from '../types';

interface TranscriptViewProps {
  transcript?: TranscriptMessage[];
}

export default function TranscriptView({ transcript = [] }: TranscriptViewProps) {
  if (transcript.length === 0) {
    return (
      <div className="text-center text-gray-400 italic py-4">
        No transcript available yet...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transcript.map((message, index) => {
        const isCaller = message.role === 'caller';
        const isAgent = message.role === 'agent';

        return (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm ${isCaller
              ? 'bg-blue-50'
              : isAgent
                ? 'bg-green-50'
                : 'bg-amber-50 italic'
              }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`font-semibold text-xs uppercase ${isCaller
                  ? 'text-blue-600'
                  : isAgent
                    ? 'text-green-600'
                    : 'text-amber-600'
                  }`}
              >
                {message.role}:
              </span>
              <span className="text-gray-700 flex-1">{message.text}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {message.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
