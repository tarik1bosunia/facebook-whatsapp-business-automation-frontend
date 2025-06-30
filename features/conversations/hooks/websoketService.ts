import { Message } from "@/types/conversation";
import { WebSocketEvent } from "@/types/websocket";
import { store } from "@/lib/redux/store";

import {
  addMessage,
  addNotification,
  markNotificationRead,
  setConnectionStatus,
} from "@/lib/redux/slices/chatSlice";
import { AppNotification } from "@/types/chat";

class WebSocketManager {
  public static instance: WebSocketManager;
  private socket: WebSocket | null = null;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private heartbeatInterval: number | null = null;
  private heartbeatTimeout: number | null = null;
  private readonly heartbeatIntervalTime = 25000; // 25 seconds
  private readonly heartbeatTimeoutTime = 30000; // 30 seconds
  private connectionClosedIntentionally = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }

    return WebSocketManager.instance;
  }

  private shouldReconnect(): boolean {
    return (
      !this.connectionClosedIntentionally &&
      this.reconnectAttempts < this.maxReconnectAttempts
    );
  }

  public connect() {
    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) return;

    this.connectionClosedIntentionally = false;

    store.dispatch(setConnectionStatus("connecting"));

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsBackendRoot = "127.0.0.1:8000";
    const wsURL = `${wsProtocol}://${wsBackendRoot}/ws/chat/`;
    console.log("websocket::URL", wsURL);
    this.socket = new WebSocket(wsURL);

    this.socket.onopen = () => {
      console.log("WebSocket connected........ class");
      store.dispatch(setConnectionStatus("connected"));
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.sendInitialHandshake();
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent;
        this.handleEvent(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.reason}`);
      this.cleanup();
      store.dispatch(setConnectionStatus("disconnected"));

      if (this.shouldReconnect()) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(() => this.connect(), delay);
        this.reconnectAttempts++;
      }
    };

    this.socket.onerror = (error) => {
      store.dispatch(setConnectionStatus("error"));
      console.error("WebSocket error:", error);
    };
  }

  private handleEvent(event: WebSocketEvent) {
    switch (event.type) {
      case "new_message":
        console.log("an event occured... event_type:: ", "new_message");

        console.log(event);
        store.dispatch(
          addMessage({
            conversationId: event.payload.conversation_id,
            message: {
              id: `ws-${Date.now()}`,
              text: event.payload.text,
              time: event.payload.time || new Date().toISOString(),
              sender: event.payload.sender || "ai",
              media_id: event.payload.media_id,
              media_url: event.payload.media_url,
              media_type: event.payload.media_type,
              contacts: event.payload.contacts,
              conversation_id: event.payload.conversation_id,
            },
          })
        );
        this.handleMessageNotification(event.payload);
        break;

      case "new_notification":
        //   store.dispatch(addNotification(event.payload));
        //   this.triggerBrowserNotification(event.payload as AppNotification);
        break;

      case "heartbeat":
        // Heartbeat event received
        // Clear the timeout since we got a response
        console.log("heartbeat received...");
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
          this.heartbeatTimeout = null;
        }
        break;

      default:
        console.warn("Unhandled WebSocket event type:", event.type);
    }
  }

  public disconnect() {
    this.connectionClosedIntentionally = true;
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      this.socket.close(1000, "User initiated disconnect");
    }
    this.cleanup();
    this.socket = null;
    store.dispatch(setConnectionStatus("disconnected"));
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.send({ type: "heartbeat" });

        // Set timeout to detect server non-responsiveness
        this.heartbeatTimeout = window.setTimeout(() => {
          console.error("Heartbeat response timeout - reconnecting...");
          this.reconnect();
        }, this.heartbeatTimeoutTime);
      }
    }, this.heartbeatIntervalTime);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private reconnect(): void {
    this.cleanup();

    this.connect();
  }

  public send(data: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open. Message not sent.");
    }
  }

  private cleanup(): void {
    this.stopHeartbeat();
    // this.userId = null;
    // this.authToken = null;
  }

  public getConnectionState(): string {
    if (!this.socket) return "disconnected";
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }

  private sendInitialHandshake(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.send({
        type: "handshake",
      });
    }
  }

  private handleMessageNotification(message: Message): void {
    const state = store.getState();
    const isActive =
      state.chat.activeConversationId === message.conversation_id;

    if (!isActive) {
      const notification: AppNotification = {
        id: `ws-${Date.now()}`,
        // `msg-${message.id}`,
        type: "new_message",
        title: "New Message",
        content: message.text,
        meta: {
          conversationId: message.conversation_id,
          sender: message.sender,
        },
        timestamp: new Date().toISOString(),
        read: false,
      };
      console.log("Notification:", notification);

      store.dispatch(addNotification(notification));
      this.triggerBrowserNotification(notification);
    }
  }

  private triggerBrowserNotification(notification: AppNotification): void {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "granted") {
      this.showNotification(notification);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.showNotification(notification);
        }
      });
    }
  }

  private showNotification(notification: AppNotification): void {
    const notif = new Notification(notification.title, {
      body: notification.content,
      icon: "/notification-icon.png",
      data: notification.meta,
    });

    notif.onclick = () => {
      if (notification.meta?.conversationId) {
        store.dispatch(markNotificationRead(notification.id));
      }
      notif.close();
      window.focus();
    };
  }
}

export const socketManager = WebSocketManager.getInstance();
