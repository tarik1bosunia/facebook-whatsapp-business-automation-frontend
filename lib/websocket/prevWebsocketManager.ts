// TODO :: there is an issue i need to fix the type of incoming message and remove any message type

import { Message } from "@/types/conversation";
import { WebSocketEvent } from "@/types/websocket";
import { store } from "@/lib/redux/store";

import {
  logout,
  selectAccessToken,
  selectRefreshToken,
  setCredentials,
} from "@/lib/redux/slices/authSlice";

import {
  addMessage,
  addNotification,
  markNotificationRead,
  setConnectionStatus,
} from "@/lib/redux/slices/chatSlice";
import { AppNotification } from "@/types/chat";
import { isTokenExpired } from "../utils/jwt";
import { WS_BACKEND_URL } from "@/constants";

class WebSocketManager {
  public static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private authToken: string | null = null;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private heartbeatInterval: number | null = null;
  private heartbeatTimeout: number | null = null;
  private readonly heartbeatIntervalTime = 25000; // 25 seconds
  private readonly heartbeatTimeoutTime = 30000; // 30 seconds
  private connectionClosedIntentionally = false;

  // handle message sending failed
  private pendingMessages: Array<{
    data: object;
    timestamp: number;
    retries: number;
  }> = [];
  private readonly maxRetryAttempts = 3;
  private readonly retryDelay = 2000; // 2 seconds

  // for token
  private isRefreshingToken = false;
  private tokenRefreshQueue: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }

    return WebSocketManager.instance;
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  private shouldReconnect(): boolean {
    return (
      !this.connectionClosedIntentionally &&
      this.reconnectAttempts < this.maxReconnectAttempts
    );
  }

  private async ensureValidToken(): Promise<string | null> {
    const currentToken = selectAccessToken(store.getState());

    // Check if token is valid
    if (currentToken && !isTokenExpired(currentToken)) {
      return currentToken;
    }

    // If token is being refreshed, wait for it
    if (this.isRefreshingToken) {
      return new Promise((resolve) => {
        this.tokenRefreshQueue.push(() => {
          resolve(selectAccessToken(store.getState()));
        });
      });
    }

    // Refresh token
    this.isRefreshingToken = true;
    try {
      const refreshToken = selectRefreshToken(store.getState());
      if (!refreshToken) {
        store.dispatch(logout());
        return null;
      }

      const response = await fetch("/account/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      store.dispatch(
        setCredentials({
          accessToken: data.access,
          refreshToken: data.refresh || refreshToken,
        })
      );

      // Process queued callbacks
      this.tokenRefreshQueue.forEach((cb) => cb());
      this.tokenRefreshQueue = [];

      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      store.dispatch(logout());
      return null;
    } finally {
      this.isRefreshingToken = false;
    }
  }

  public async connect(): Promise<void> {
    console.log("Attempting WebSocket connect...");

    if (this.socket) {
      console.log("Socket already exists:", this.socket.readyState);
    }
    // Don't attempt to connect if already connected or connecting
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected");
        return;
      }
      if (this.socket.readyState === WebSocket.CONNECTING) {
        console.log("WebSocket connection in progress");
        return;
      }
      // Clean up previous socket if in closing/closed state
      this.socket.onclose = null; // Remove previous handlers
      this.socket.onerror = null;
      this.socket.close(); // Ensure clean closure
    }

    try {
      //First ensure we have a valid token before connecting
      const validToken = await this.ensureValidToken();
      if (!validToken) {
        console.error("Cannot connect - no auth token available");
        store.dispatch(setConnectionStatus("error"));
        return;
      }

      // Set the auth token and connection flags
      this.setAuthToken(validToken);
      
      this.connectionClosedIntentionally = false;
      store.dispatch(setConnectionStatus("connecting"));

      // Prepare WebSocket URL
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsURL = `${wsProtocol}://${WS_BACKEND_URL}/ws/chat/?token=${this.authToken}`;
      console.log("WebSocket connecting to:", wsURL);

      // Create new WebSocket connection
      this.socket = new WebSocket(wsURL);

      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        store.dispatch(setConnectionStatus("connected"));
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.sendInitialHandshake();
        this.processPendingQueue();
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
        console.log(
          `WebSocket closed with code ${event.code}: ${event.reason}`
        );
        this.cleanup();

        if (event.code === 4001) {
          // Specific code for token expiration
          console.log("Token expired - attempting refresh");
          this.handleTokenExpiration();
          store.dispatch(setConnectionStatus("error"));
        } else {
          store.dispatch(setConnectionStatus("disconnected"));
        }

        if (this.shouldReconnect()) {
          const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
          console.log(`Reconnecting in ${delay}ms...`);
          setTimeout(() => this.connect(), delay);
          this.reconnectAttempts++;
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        store.dispatch(setConnectionStatus("error"));

        // For certain errors, we might want to attempt immediate reconnect
        if (this.shouldReconnect() && this.reconnectAttempts === 0) {
          setTimeout(() => this.connect(), 1000);
          this.reconnectAttempts++;
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      store.dispatch(setConnectionStatus("error"));

      if (this.shouldReconnect()) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        setTimeout(() => this.connect(), delay);
        this.reconnectAttempts++;
      }
    }
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const state = store.getState();
      const refreshToken = selectRefreshToken(state);

      if (!refreshToken) {
        console.error("No refresh token available");
        return null;
      }

      // Example - implement your actual token refresh API call
      const response = await fetch("/account/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      const newAccessToken = data.access;

      // Update the store with new tokens
      store.dispatch(
        setCredentials({
          accessToken: newAccessToken,
          refreshToken: data.refresh || refreshToken,
        })
      );

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      store.dispatch(logout());
      return null;
    }
  }

  private async handleTokenExpiration(): Promise<void> {
    const newToken = await this.refreshToken();

    if (newToken) {
      this.setAuthToken(newToken);
      this.connect();
    }

    // try {
    //   // Implement your token refresh logic here
    //   // const newToken = await refreshToken();
    //   // if (newToken) {
    //   //   this.setAuthToken(newToken);
    //   //   this.connect();
    //   // }
    //   console.log("Token expired - please reauthenticate");
    // } catch (error) {
    //   console.error("Failed to refresh token:", error);
    // }
  }

  private handleEvent(event: WebSocketEvent) {
    switch (event.type) {
      case "new_message":
        console.log(
          "=======================================NEW WEBSOCKET (new_message) EVENT ==========================="
        );

        console.log("event", event);

        this.handleNewMessage(event.payload);
        break;

      case "new_notification":
        this.handleNotification(event.payload);

        //   store.dispatch(addNotification(event.payload));
        //   this.triggerBrowserNotification(event.payload as AppNotification);
        break;

      case "heartbeat":
        // Heartbeat event received
        // Clear the timeout since we got a response
        this.handleHeartbeat();

        break;
      // case "error":
      //   console.error("WebSocket error:", event.payload);
      //   if (event.payload.code === "auth_error") {
      //     this.handleTokenExpiration();
      //   }

      default:
        console.warn("Unhandled WebSocket event type:", event.type);
    }
  }

  private handleNewMessage({
    conversation_id,
    message,
  }: {
    conversation_id: string;
    message: Message;
  }): void {
    console.log("New message(Received):", message);
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

    this.handleMessageNotification(conversation_id, message);
  }

  private handleNotification(payload: AppNotification): void {
    store.dispatch(addNotification(payload));
    this.triggerBrowserNotification(payload);
  }

  private handleHeartbeat(): void {
    console.log("Heartbeat received");
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
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

  public reconnect(): void {
    this.cleanup();

    this.connect();
  }

  public send(data: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(data));
        // Remove from pending if it was there
        this.pendingMessages = this.pendingMessages.filter(
          (msg) => msg.data !== data
        );
      } catch (error) {
        console.error("WebSocket send error:", error);
        this.addToPendingQueue(data);
      }
    } else {
      console.warn("WebSocket not open. Adding message to pending queue.");
      this.addToPendingQueue(data);
    }
  }

  private addToPendingQueue(data: object) {
    // Check if this message is already in the queue
    const existingIndex = this.pendingMessages.findIndex(
      (msg) => JSON.stringify(msg.data) === JSON.stringify(data)
    );

    if (existingIndex === -1) {
      this.pendingMessages.push({
        data,
        timestamp: Date.now(),
        retries: 0,
      });
    }

    // Try to reconnect if not already attempting
    if (!this.connectionClosedIntentionally && !this.reconnectAttempts) {
      this.reconnect();
    }
  }

  private processPendingQueue() {
    if (!this.pendingMessages.length) return;

    this.pendingMessages = this.pendingMessages.filter((msg) => {
      if (msg.retries >= this.maxRetryAttempts) {
        console.warn("Max retries reached for message:", msg.data);
        // You might want to dispatch a failure action here
        store.dispatch(
          addNotification({
            id: `msg-failed-${Date.now()}`,
            type: "message_failed",
            title: "Message failed to send",
            content: "Could not deliver your message",
            timestamp: new Date().toISOString(),
            read: false,
          })
        );
        return false;
      }

      if (this.socket?.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(JSON.stringify(msg.data));
          return false; // Remove from queue if sent successfully
        } catch (error) {
          console.error("Retry send failed:", error);
          msg.retries++;
          msg.timestamp = Date.now(); // Update timestamp for backoff
        }
      }
      return true; // Keep in queue
    });

    // Schedule next retry if queue isn't empty
    if (this.pendingMessages.length) {
      setTimeout(() => this.processPendingQueue(), this.retryDelay);
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

  private handleMessageNotification(
    conversationId: string,
    message: Message
  ): void {
    const state = store.getState();

    // Skip notification if:
    // 1. This conversation is alredy active
    // 2. The message is from current user

    const isActive = state.chat.activeConversationId === conversationId;
    const isFromCurrentUser = message.sender === "business";
    if (isActive || isFromCurrentUser) {
      return;
    }

    const notification: AppNotification = {
      id: `msg-${message.id}`,

      type: "new_message",
      title: "New Message",
      content: message.text,
      meta: {
        conversationId,
        sender: message.sender,
      },
      timestamp: new Date().toISOString(),
      read: false,
    };
    console.log("Notification:", notification);

    store.dispatch(addNotification(notification));
    this.triggerBrowserNotification(notification);
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
