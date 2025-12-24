import { useState, useEffect, useCallback } from 'react';
import Login from '@/components/Login';
import CallCenter from '@/components/CallCenter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { logout as authLogout, UserData, isAuthenticated as checkAuth, getAccessToken, isTokenExpired } from '@/services/restAuthService';

// Check token expiry every 60 seconds
const TOKEN_CHECK_INTERVAL = 60 * 1000;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());

  const handleLogout = useCallback(() => {
    authLogout();
    setIsAuthenticated(false);
  }, []);

  const handleLogin = (userData: UserData) => {
    console.log('User logged in:', userData);
    setIsAuthenticated(true);
  };

  // Check token expiry on mount and periodically
  useEffect(() => {
    const checkTokenExpiry = () => {
      const accessToken = getAccessToken();
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('Access token expired, logging out automatically');
        handleLogout();
      }
    };

    // Check immediately on mount
    checkTokenExpiry();

    // Set up periodic check
    const intervalId = setInterval(checkTokenExpiry, TOKEN_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [handleLogout]);

  return (
    <TooltipProvider>
      {/* Always render CallCenter so map loads in background */}
      <CallCenter onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      {/* Login overlay */}
      {!isAuthenticated && <Login onLogin={handleLogin} />}
    </TooltipProvider>
  );
}

export default App;
