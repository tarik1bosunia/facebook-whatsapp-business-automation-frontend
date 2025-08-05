'use client'

import { socketManager } from "@/lib/websocket/websocketManager";
import { setConnectionStatus } from "@/lib/redux/features/chatSlice";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";

export default function ConnectionStatusBar() {
  const status = useAppSelector((state) => state.chat.connectionStatus);
  const dispatch = useAppDispatch();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (socketManager.getConnectionState() !== "connected") {
          await socketManager.connect();
        }
      } catch (error) {
        console.error("Initial connection failed:", error);
        setLastError("Failed to establish initial connection");
        dispatch(setConnectionStatus("error"));
      }
    };

    const handleBeforeUnload = () => {
      socketManager.disconnect();
    };

    initializeConnection();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  const handleReconnect = async () => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    setLastError(null);
    
    try {
      dispatch(setConnectionStatus("connecting"));
      await socketManager.connect();
    } catch (error) {
      console.error("Reconnection failed:", error);
      setLastError("Failed to reconnect. Please try again.");
      dispatch(setConnectionStatus("error"));
    } finally {
      setIsReconnecting(false);
    }
  };

  const getStatusText = () => {
    if (lastError) return lastError;
    
    switch (status) {
      case "connecting":
        return isReconnecting ? "Reconnecting..." : "Connecting to server...";
      case "error":
        return "Connection lost";
      case "disconnected":
        return "Disconnected from server";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "disconnected":
        return "bg-gray-500";
      default:
        return "";
    }
  };

  if (status === "connected") return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 rounded-xl shadow-lg ${getStatusColor()} text-white transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className={`inline-block w-2 h-2 rounded-full ${status === "connecting" ? "bg-white animate-pulse" : "bg-white"}`} />
          <span>{getStatusText()}</span>
        </div>
        
        {(status === "error" || status === "disconnected") && (
          <button
            onClick={handleReconnect}
            disabled={isReconnecting}
            className={`flex items-center gap-1 text-black  px-3 py-1.5 text-sm font-medium rounded transition 
              ${isReconnecting 
                ? "bg-white bg-opacity-30 cursor-not-allowed" 
                : "bg-white bg-opacity-20 hover:bg-opacity-30"}`}
            aria-label="Reconnect to server"
          >
            <RefreshCw className={`w-4 h-4 ${isReconnecting ? "animate-spin" : ""}`} />
            {isReconnecting ? "Connecting..." : "Reconnect"}
          </button>
        )}
      </div>
    </div>
  );
}






















// 'use client'

// import { socketManager } from "@/lib/websocket/websocketManager";
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";
// import { setConnectionStatus } from "@/lib/redux/slices/chatSlice";
// import { useEffect, useRef } from "react";
// import { RefreshCw } from "lucide-react";

// export default function ConnectionStatusBar() {
//   const status = useAppSelector((state) => state.chat.connectionStatus);
//   const dispatch = useAppDispatch();



//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     // Initialize connection

//     if (socketManager.getConnectionState() !== "connected") {
//       socketManager.connect();
//     }



//     // Cleanup on window unload
//     const handleBeforeUnload = () => {
//       socketManager.disconnect();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // ✅ Single cleanup function
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };

//   }, []);

//   if (status === "connected") return null;

//   const getStatusText = () => {
//     switch (status) {
//       case "connecting":
//         return "Connecting to server...";
//       case "error":
//         return "Connection lost. Reconnecting...";
//       default:
//         return "Disconnected from server";
//     }
//   };

//   const getStatusColor = () => {
//     switch (status) {
//       case "connecting":
//         return "bg-yellow-500";
//       case "error":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className={`fixed bottom-4 left-4 right-4 z-50 rounded-xl shadow-lg ${getStatusColor()} text-white`}>
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-sm sm:text-base">
//           <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
//           <span>{getStatusText()}</span>
//         </div>
//         <button
//           onClick={() => {
//             socketManager.disconnect();
//             dispatch(setConnectionStatus("connecting"));
//             setTimeout(() => {
//               socketManager.connect();
//             }, 1000);
//           }}
//           className="flex text-black items-center gap-1 px-3 py-1.5 text-sm font-medium border border-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition"
//         >
//           <RefreshCw className="w-4 h-4 animate-spin-slow" />
//           Reconnect
//         </button>
//       </div>
//     </div>
//   );
// }

