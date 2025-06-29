import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/conversation";

export default function useWebSocketMessages() {
  const socketRef = useRef<WebSocket | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsBackendRoot = "127.0.0.1:8000";
    const wsURL = `${wsProtocol}://${wsBackendRoot}/ws/chat/`;

    socketRef.current = new WebSocket(wsURL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected.");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const newMsg: Message = {
        id: `ws-${Date.now()}`,
        text: data.message,
        time: data.time || new Date().toISOString(),
        sender: data.sender || "ai",
        media_id: data.media_id,
        media_url: data.media_url,
        media_type: data.media_type,
        contacts: data.contacts,
        conversation_id: data.conversation_id,
      };

      setNewMessages((prev) => [...prev, newMsg]);
    };

    socketRef.current.onclose = () => console.log("WebSocket disconnected.");
    socketRef.current.onerror = (err) => console.error("WebSocket error", err);

    return () => socketRef.current?.close();
  }, []);

  return { newMessages };
}
