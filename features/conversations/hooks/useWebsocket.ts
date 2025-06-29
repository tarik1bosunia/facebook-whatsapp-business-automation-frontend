import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Message } from "@/types/conversation";

export default function useWebSocket(
  setMessages: Dispatch<SetStateAction<Message[]>>
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsBackendRoot = "127.0.0.1:8000";
    const wsURL = `${wsProtocol}://${wsBackendRoot}/ws/chat/`;

    console.log("websocket::URL", wsURL);

    socketRef.current = new WebSocket(wsURL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected.....");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("incoming data::", data);

      const newMessage: Message = {
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
      setMessages((prev) => [...prev, newMessage]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (conversationId: string, message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ conversation_id: conversationId, message })
      );
    }
  };

  return {socketRef, sendMessage};
}

// ============= BACKUP ===============
// import { useEffect, useRef, Dispatch, SetStateAction } from "react";
// import { Message } from "@/types/conversation";

// export default function useWebSocket(
//   conversationId: string | undefined,
//   setMessages: Dispatch<SetStateAction<Message[]>>
// ) {
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     if (!conversationId) return;

//     const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
//     const wsBackendRoot = "127.0.0.1:8000";
//     // const wsURL = `${wsProtocol}://${wsBackendRoot}/ws/chat/?conversation_id=${conversationId}`;
//     const wsURL = `${wsProtocol}://${wsBackendRoot}/ws/chat/`;

//     console.log("websocket::URL", wsURL);

//     socketRef.current = new WebSocket(wsURL);

//     socketRef.current.onopen = () => {
//       console.log("WebSocket connected.");

//       socketRef.current?.send(
//         JSON.stringify({
//           conversation_id: conversationId,
//           message: "placeholder message ... testing....", // optional placeholder if needed
//         })
//       );

//     };

//     socketRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("incoming data::", data);

//       const newMessage: Message = {
//         id: `ws-${Date.now()}`,
//         text: data.message,
//         time: data.time || new Date().toISOString(),
//         sender: data.sender || "ai",
//         media_id: data.media_id,
//         media_url: data.media_url,
//         media_type: data.media_type,
//         contacts: data.contacts,
//         conversation_id: data.conversation_id,
//       };
//       setMessages((prev) => [...prev, newMessage]);
//     };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket disconnected.");
//     };

//     socketRef.current.onerror = (err) => {
//       console.error("WebSocket error", err);
//     };

//     return () => {
//       socketRef.current?.close();
//     };
//   }, [conversationId]);

//   return socketRef;
// }

