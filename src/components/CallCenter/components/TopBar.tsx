/**
 * TopBar - Navbar at the top of the call center
 */

import { useState } from 'react';
import { Clock, Car, Users, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/modal';

interface TopBarStats {
  activeCalls?: number;
  queueLength?: number;
  tripsCreated?: number;
  pendingAssignment?: number;
}

interface TopBarProps {
  stats?: TopBarStats;
  onHistoryClick?: () => void;
  onLogout?: () => void;
}

export default function TopBar({ stats = {}, onHistoryClick, onLogout }: TopBarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const {
    activeCalls = 0,
    queueLength = 0,
    tripsCreated = 0,
    pendingAssignment = 0,
  } = stats;

  return (
    <div className="relative z-[1001] bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      {/* Title */}
      <h1 className="text-xl font-bold text-green-600">TranOps</h1>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Live Calls */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-sm font-semibold text-gray-700">{activeCalls}</span>
          <span className="text-xs text-gray-400">Live</span>
        </div>

        {/* Queue */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
          <Clock className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700">{queueLength}</span>
          <span className="text-xs text-gray-400">Queue</span>
        </div>

        <div className="w-px h-6 bg-gray-100" />

        {/* Trips Created */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
          <Car className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">{tripsCreated}</span>
          <span className="text-xs text-gray-400">Trips</span>
        </div>

        {/* Pending Assignment */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-lg">
          <Users className="h-4 w-4 text-pink-500" />
          <span className="text-sm font-semibold text-gray-700">{pendingAssignment}</span>
          <span className="text-xs text-gray-400">Pending</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onHistoryClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <History className="h-4 w-4" />
          History
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout?.();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
