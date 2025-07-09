// webSocketManager.ts
import { EventEmitter } from "events";
import { Message } from "@/types/conversation";
import { WebSocketEvent } from "@/types/websocket";
import { store } from "@/lib/redux/store";
import { tokenManager } from "./tokenManager";
import { HeartbeatManager } from "./heartbeatManager";
import { MessageQueue } from "./messageQueue";
import { NotificationManager } from "./notificationManager";

import {
  addMessage,
  addNotification,
  setConnectionStatus,
} from "@/lib/redux/slices/chatSlice";
import { AppNotification } from "@/types/chat";

class WebSocketManager {
  public static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionClosedIntentionally = false;
  private heartbeatManager: HeartbeatManager;
  private messageQueue: MessageQueue;

  private isConnecting = false;

  private constructor() {
    this.heartbeatManager = new HeartbeatManager(
      25000, // 25 seconds interval
      30000, // 30 seconds timeout
      () => this.send({ type: "heartbeat" }),
      () => this.handleHeartbeatTimeout()
    );

    this.messageQueue = new MessageQueue(3, 2000);
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnectingOrConnected()) return;

    this.isConnecting = true;

    try {
      const validToken = await tokenManager.getValidToken();
      if (!validToken) {
        store.dispatch(setConnectionStatus("error"));
        this.isConnecting = false;
        return;
      }

      this.connectionClosedIntentionally = false;
      store.dispatch(setConnectionStatus("connecting"));

      const wsURL = this.buildWebSocketUrl(validToken);
      this.socket = new WebSocket(wsURL);

      this.setupEventHandlers();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  private isConnectingOrConnected(): boolean {
    if (this.isConnecting) {
      console.log("WebSocket is currently connecting"); // ✅ NEW: Guard
      return true;
    }

    if (!this.socket) return false;

    if (this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return true;
    }

    if (this.socket.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket connection in progress");
      return true;
    }

    return false;
  }

  private buildWebSocketUrl(token: string): string {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsBackendRoot = "127.0.0.1:8000";
    return `${wsProtocol}://${wsBackendRoot}/ws/chat/?token=${token}`;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => this.handleOpen();
    this.socket.onmessage = (event) => this.handleMessage(event);
    this.socket.onclose = (event) => this.handleClose(event);
    this.socket.onerror = (error) => this.handleError(error);
  }

  private handleOpen(): void {
    console.log("WebSocket connection established");
    store.dispatch(setConnectionStatus("connected"));
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.heartbeatManager.start();
    this.sendInitialHandshake();
    this.messageQueue.process((data) => this.send(data));
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as WebSocketEvent;
      this.handleEvent(data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket closed with code ${event.code}: ${event.reason}`);
    this.cleanup();

    this.isConnecting = false;

    if (event.code === 4001) {
      console.log("Token expired - attempting refresh");
      this.handleTokenExpiration();
      store.dispatch(setConnectionStatus("error"));
    } else {
      store.dispatch(setConnectionStatus("disconnected"));
    }

    this.attemptReconnect();
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    this.isConnecting = false;
    store.dispatch(setConnectionStatus("error"));
    this.attemptReconnect();
  }

  private handleConnectionError(error: unknown): void {
    console.error("WebSocket connection error:", error);
    this.isConnecting = false;
    store.dispatch(setConnectionStatus("error"));
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect()) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    console.log(`Reconnecting in ${delay}ms...`);
    setTimeout(() => this.connect(), delay);
    this.reconnectAttempts++;
  }

  private shouldReconnect(): boolean {
    return (
      !this.connectionClosedIntentionally &&
      this.reconnectAttempts < this.maxReconnectAttempts
    );
  }

  private handleEvent(event: WebSocketEvent): void {
    switch (event.type) {
      case "new_message":
        this.handleNewMessage(event.payload);
        break;
      case "new_notification":
        this.handleNotification(event.payload);
        break;
      case "heartbeat":
        this.handleHeartbeat();
        break;
      case "handshake":
        console.log("Received handshake event");
        break;
      default:
        console.warn("Unhandled WebSocket event type:", event.type);
    }
  }

  private handleNewMessage(payload: {
    conversation_id: string;
    message: Message;
  }): void {
    const { conversation_id, message } = payload;
    store.dispatch(
      addMessage({
        conversationId: conversation_id,
        message: {
          id: message.id || `ws-${Date.now()}`,
          text: message.text || "empty text",
          time: message.time || new Date().toISOString(),
          sender: message.sender || "ai",
          media_id: message.media_id,
          media_url: message.media_url,
          media_type: message.media_type,
          contacts: message.contacts,
        },
      })
    );

    const notification = NotificationManager.createMessageNotification(
      conversation_id,
      message
    );
    if (notification) {
      store.dispatch(addNotification(notification));
      NotificationManager.showBrowserNotification(notification);
    }
  }

  private handleNotification(payload: AppNotification): void {
    store.dispatch(addNotification(payload));
    NotificationManager.showBrowserNotification(payload);
  }

  private handleHeartbeat(): void {
    this.heartbeatManager.resetTimeout();
  }

  private handleHeartbeatTimeout(): void {
    console.error("Heartbeat response timeout - reconnecting...");
    this.reconnect();
  }

  private async handleTokenExpiration(): Promise<void> {
    const newToken = await tokenManager.getValidToken();
    if (newToken) {
      this.connect();
    }
  }

  public disconnect(): void {
    this.connectionClosedIntentionally = true;
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      this.socket.close(1000, "User initiated disconnect");
    }
    this.cleanup();
    this.isConnecting = false;
    store.dispatch(setConnectionStatus("disconnected"));
  }

  public reconnect(): void {
    this.cleanup();
    this.connect();
  }

  public send(data: object): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(data));
      } catch (error) {
        console.error("WebSocket send error:", error);
        this.messageQueue.add(data);
      }
    } else {
      this.messageQueue.add(data);
    }
  }

  private cleanup(): void {
    this.heartbeatManager.stop();
    this.messageQueue.clear();
  }

  private sendInitialHandshake(): void {
    this.send({ type: "handshake" });
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
}

export const socketManager = WebSocketManager.getInstance();
