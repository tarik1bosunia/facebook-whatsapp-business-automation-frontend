// In your main layout or App component
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/features/authSlice';
import { socketManager } from './websocketManager';


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