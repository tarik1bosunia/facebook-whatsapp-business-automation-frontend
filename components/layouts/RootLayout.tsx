import { useEffect } from 'react';
// import { socketManager } from '@/lib/websocket/websocketService';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks/reduxHooks';
import { setConnectionStatus } from '@/lib/redux/slices/chatSlice';
// import { useGetCurrentUserQuery } from '@/lib/redux/services/authApi';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { socketManager } from '@/features/conversations/hooks/websoketService';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  //   const { data: user, isLoading } = useGetCurrentUserQuery();

  //   useEffect(() => {
  //     if (!isLoading && user) {
  //       dispatch(setConnectionStatus('connecting'));

  //       socketManager.connect(
  //         user.id.toString(),
  //         localStorage.getItem('authToken') || ''
  //       );
  //     }

  //     return () => {
  //       socketManager.disconnect();
  //     };
  //   }, [user, isLoading, dispatch]);

  useEffect(() => {
    socketManager.connect();

    return () => {
      socketManager.disconnect();
    };
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>Logo</div>
          <div className="flex items-center space-x-6">
            <NotificationCenter />
            {/* User avatar, etc */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      <ConnectionStatusBar />
    </div>
  );
}

function ConnectionStatusBar() {
  const status = useAppSelector(state => state.chat.connectionStatus);
  const dispatch = useAppDispatch();

  if (status === 'connected') return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-3 text-center ${status === 'error' ? 'bg-red-500' :
        status === 'connecting' ? 'bg-yellow-500' : 'bg-gray-500'
      } text-white`}>
      <div className="container mx-auto flex justify-between items-center">
        <span>
          {status === 'connecting' ? 'Connecting to server...' :
            status === 'error' ? 'Connection lost. Reconnecting...' :
              'Disconnected from server'}
        </span>
        <button
          onClick={() => {
            socketManager.disconnect();
            dispatch(setConnectionStatus('connecting'));
            setTimeout(() => {
              // socketManager.connect("user id", "authToken");
              socketManager.connect();
            }, 1000);
          }}
          className="ml-4 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
}