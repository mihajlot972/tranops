/**
* LiveActivityModal - Full screen dashboard for live call center activity
*/

import { Dialog, DialogContent } from '@/components/ui/modal';
import { LiveCall, QueueCall } from '@/components/CallCenter/types';
import { Phone, User, Clock, MessageSquare, X, MonitorPlay, ListOrdered } from 'lucide-react';
import { useCallDuration } from '@/components/CallCenter/hooks/useCallCenter';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LiveActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    liveCalls: LiveCall[];
    queueCalls: QueueCall[];
}

function TranscriptMessage({ role, text }: { role: string, text: string }) {
    const isAgent = role === 'agent';
    return (
        <div className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} mb-3`}>
            <div className="flex items-center gap-1 mb-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isAgent ? 'text-blue-500' : 'text-gray-500'}`}>
                    {isAgent ? 'Agent' : 'Caller'}
                </span>
            </div>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${isAgent
                ? 'bg-blue-50 text-slate-800 rounded-tr-none'
                : 'bg-white border border-gray-100 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                {text}
            </div>
        </div>
    );
}

function LiveCallCard({ call }: { call: LiveCall }) {
    const duration = useCallDuration(call.startTime);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 animate-pulse">
                            LIVE
                        </Badge>
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {duration}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{call.phoneFormatted || call.phone}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <User className="w-3 h-3" /> Caller
                    </div>
                </div>

                {/* Agent Info */}
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{call.agentName || 'Assigning...'}</div>
                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">Agent</div>
                </div>
            </div>

            {/* Transcript Area */}
            <div className="flex-1 bg-gray-50/30 overflow-hidden relative flex flex-col">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-gray-50/50 to-transparent z-10 pointer-events-none" />

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-1">
                        {call.transcript.map((msg, idx) => (
                            <TranscriptMessage key={idx} role={msg.role} text={msg.text} />
                        ))}
                        {call.transcript.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-50">
                                <MessageSquare className="w-8 h-8" />
                                <span className="text-sm">Connecting to transcript...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Footer Status */}
            <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Audio Connected
                </div>
                <div className="text-gray-400">
                    ID: {call.callId}
                </div>
            </div>
        </div>
    );
}

function QueueCallCard({ call }: { call: QueueCall }) {
    const duration = useCallDuration(call.queueStartTime);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between h-[180px]">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Queue #{call.queuePosition}
                    </Badge>
                    <span className="font-mono text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {duration}
                    </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">{call.phoneFormatted || call.phone}</h3>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Waiting
                </span>
                <span className="text-amber-600 font-medium">Pending Agent</span>
            </div>
        </div>
    );
}

export default function LiveActivityModal({ isOpen, onClose, liveCalls, queueCalls }: LiveActivityModalProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden bg-slate-50 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-md z-20">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200">
                            <MonitorPlay className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 leading-none">Live Operations</h2>
                            <p className="text-slate-500 text-sm mt-1">Real-time Command Center</p>
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

                {/* Content Tabs */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
                        <div className="px-8 pt-6 pb-2 flex-shrink-0">
                            <TabsList className="grid w-[400px] grid-cols-2">
                                <TabsTrigger value="all">Active Calls ({liveCalls.length})</TabsTrigger>
                                <TabsTrigger value="queue">Queue ({queueCalls.length})</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="all" className="flex-1 mt-0 min-h-0">
                            <ScrollArea className="h-full">
                                <div className="px-8 pb-8 pt-2">
                                    {liveCalls.length === 0 ? (
                                        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                                            <Phone className="w-16 h-16 mb-4 opacity-20" />
                                            <h3 className="text-xl font-medium text-gray-500">No Active Calls</h3>
                                            <p className="text-gray-400">The lines are currently quiet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {liveCalls.map(call => (
                                                <LiveCallCard key={call.callId} call={call} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="queue" className="flex-1 mt-0 min-h-0">
                            <ScrollArea className="h-full">
                                <div className="px-8 pb-8 pt-2">
                                    {queueCalls.length === 0 ? (
                                        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                                            <ListOrdered className="w-16 h-16 mb-4 opacity-20" />
                                            <h3 className="text-xl font-medium text-gray-500">Empty Queue</h3>
                                            <p className="text-gray-400">All caught up!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                            {queueCalls.map(call => (
                                                <QueueCallCard key={call.callId} call={call} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
