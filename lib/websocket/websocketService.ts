// import { store } from '@/lib/redux/store';
// import { addMessage, addNotification, markNotificationRead } from '@/lib/redux/slices/chatSlice';
// import { WebSocketEvent } from '@/types/websocket';
// import type { Message, Notification as AppNotification } from '@/types/conversation';

// class WebSocketManager {
//   private static instance: WebSocketManager;
//   private socket: WebSocket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;

//   private heartbeatInterval: number | null = null;
//   private heartbeatTimeout: number | null = null;
//   private readonly heartbeatIntervalTime = 25000; // 25 seconds
//   private readonly heartbeatTimeoutTime = 30000; // 30 seconds
//   private connectionClosedIntentionally = false;

//   private constructor() {}

//   public static getInstance(): WebSocketManager {
//     if (!WebSocketManager.instance) {
//       WebSocketManager.instance = new WebSocketManager();
//     }
//     return WebSocketManager.instance;
//   }

//   public connect(userId: string, authToken: string) {
//     if (this.socket) return;
    

//     const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
//     // const wsUrl = `${wsProtocol}://127.0.0.1:8000/ws/notifications/?user_id=${userId}&token=${authToken}`;
//     const wsUrl = `${wsProtocol}://127.0.0.1:8000/ws/notifications/`;

//     this.socket = new WebSocket(wsUrl);

//     this.socket.onopen = () => {
//       console.log("WebSocket connected");
//       this.reconnectAttempts = 0;
//       this.startHeartbeat();
//     };

//     this.socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data) as WebSocketEvent;
//         this.handleEvent(data);
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     this.socket.onclose = (event) => {
//       console.log(`WebSocket closed: ${event.reason}`);
//       this.cleanup();

//       if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
//         const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
//         console.log(`Reconnecting in ${delay}ms...`);
//         setTimeout(() => this.connect(userId, authToken), delay);
//         this.reconnectAttempts++;
//       }
//     };

//     this.socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };
//   }

//   private handleEvent(event: WebSocketEvent) {
//     switch (event.type) {
//       case 'new_message':
//         store.dispatch(addMessage({
//           conversationId: event.payload.conversation_id,
//           message: event.payload
//         }));
//         this.handleMessageNotification(event.payload);
//         break;

//       case 'new_notification':
//         store.dispatch(addNotification(event.payload));
//         this.triggerBrowserNotification(event.payload as AppNotification);
//         break;

//       case 'heartbeat':
//         // Heartbeat event received
//         break;

//       default:
//         console.warn('Unhandled WebSocket event type:', event.type);
//     }
//   }

//   private handleMessageNotification(message: Message) {
//     const state = store.getState();
//     const isActive = state.chat.activeConversationId === message.conversation_id;

//     if (!isActive) {
//       const notification: AppNotification = {
//         id: `msg-${message.id}`,
//         type: 'new_message',
//         title: 'New Message',
//         content: message.text,
//         meta: {
//           conversationId: message.conversation_id,
//           sender: message.sender
//         },
//         timestamp: new Date().toISOString(),
//         read: false
//       };

//       store.dispatch(addNotification(notification));
//       this.triggerBrowserNotification(notification);
//     }
//   }

//   private triggerBrowserNotification(notification: AppNotification) {
//     if ('Notification' in window && Notification.permission === 'granted') {
//       const notif = new Notification(notification.title, {
//         body: notification.content,
//         icon: '/notification-icon.png',
//         data: notification.meta
//       });

//       notif.onclick = () => {
//         if (notification.meta?.conversationId) {
//           store.dispatch(markNotificationRead(notification.id));
//         }
//       };
//     }
//   }

//   private startHeartbeat() {
//     this.heartbeatInterval = window.setInterval(() => {
//       if (this.socket?.readyState === WebSocket.OPEN) {
//         this.send({ type: 'heartbeat' });
//       }
//     }, 30000);
//   }

//   public send(data: object) {
//     if (this.socket?.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(data));
//     } else {
//       console.warn("WebSocket not open. Message not sent.");
//     }
//   }

//   public disconnect() {
//     this.cleanup();
//     if (this.socket) {
//       this.socket.close(1000, "User initiated disconnect");
//       this.socket = null;
//     }
//   }

//   private cleanup() {
//     if (this.heartbeatInterval) {
//       clearInterval(this.heartbeatInterval);
//       this.heartbeatInterval = null;
//     }
//   }
// }

// export const socketManager = WebSocketManager.getInstance();
