import { WebSocketEvent } from "@/types/websocket";
import { addMessage, setConnectionStatus } from "../redux/features/chatSlice";
import { store } from "../redux/store";
import { tokenManager } from "./tokenManager";
import { Message } from "@/types/conversation";
import { WS_BACKEND_URL } from "@/lib/utils/constants";

class WebSocketManager {
  public static instance: WebSocketManager;
  private socket: WebSocket | null = null;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnectingOrConnected()) return;

    try {
      const validToken = await tokenManager.getValidToken();
      if (!validToken) {
        store.dispatch(setConnectionStatus("error"));
        return;
      }
      store.dispatch(setConnectionStatus("connecting"));

      const wsURL = this.buildWebSocketUrl(validToken);
      this.socket = new WebSocket(wsURL);

      this.setupEventHandlers();
    } catch (error) {
      //   this.handleConnectionError(error);
      console.log(error);
    }
  }

  private isConnectingOrConnected(): boolean {
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
    return `${wsProtocol}://${WS_BACKEND_URL}/ws/chat/?token=${token}`;
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
    //   this.cleanup();
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);
    store.dispatch(setConnectionStatus("error"));
  }

  private handleEvent(event: WebSocketEvent): void {
    switch (event.type) {
      case "new_message":
        this.handleNewMessage(event.payload);
        break;
      case "new_notification":
        // this.handleNotification(event.payload);
        break;
      case "heartbeat":
        // this.handleHeartbeat();
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

    public disconnect(): void {
      if (
        this.socket &&
        (this.socket.readyState === WebSocket.OPEN ||
          this.socket.readyState === WebSocket.CONNECTING )
      ) {
        this.socket.close(1000, "User initiated disconnect");
      }
      store.dispatch(setConnectionStatus("disconnected"));
    }
}

export const socketManager = WebSocketManager.getInstance();
