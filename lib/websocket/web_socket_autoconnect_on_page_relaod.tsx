// In your main layout or App component
import { useEffect } from 'react';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { socketManager } from '@/lib/websocket/websocketManager';
import { useSelector } from 'react-redux';


export default function WebSocketInitializer () {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socketManager.connect();
    }

    return () => {
      socketManager.disconnect();
    };
  }, [isAuthenticated]);

  return null;
};

// Use this component in your app layout