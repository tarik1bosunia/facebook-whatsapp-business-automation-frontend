'use client'

import { socketManager } from "@/features/conversations/hooks/websoketService";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks/reduxHooks";
import { setConnectionStatus } from "@/lib/redux/slices/chatSlice";
import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

export default function ConnectionStatusBar() {
  const status = useAppSelector((state) => state.chat.connectionStatus);
  const dispatch = useAppDispatch();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize connection

    if (socketManager.getConnectionState() !== "connected") {
      socketManager.connect();
    }



    // Cleanup on window unload
    const handleBeforeUnload = () => {
      socketManager.disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // ✅ Single cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, []);

  if (status === "connected") return null;

  const getStatusText = () => {
    switch (status) {
      case "connecting":
        return "Connecting to server...";
      case "error":
        return "Connection lost. Reconnecting...";
      default:
        return "Disconnected from server";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 rounded-xl shadow-lg ${getStatusColor()} text-white`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{getStatusText()}</span>
        </div>
        <button
          onClick={() => {
            socketManager.disconnect();
            dispatch(setConnectionStatus("connecting"));
            setTimeout(() => {
              socketManager.connect();
            }, 1000);
          }}
          className="flex text-black items-center gap-1 px-3 py-1.5 text-sm font-medium border border-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Reconnect
        </button>
      </div>
    </div>
  );
}
