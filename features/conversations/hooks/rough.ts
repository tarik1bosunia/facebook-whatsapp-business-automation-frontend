// websocket.ts
import { store } from '@/lib/redux/store';
import { addMessage, addNotification, markNotificationRead } from '@/lib/redux/slices/chatSlice';
import type { Message, Notification as AppNotification } from '@/types/conversation';

interface WebSocketEvent {
  type: 'new_message' | 'new_notification' | 'heartbeat';
  payload: any;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: number | null = null;
  private heartbeatTimeout: number | null = null;
  private readonly heartbeatIntervalTime = 25000; // 25 seconds
  private readonly heartbeatTimeoutTime = 30000; // 30 seconds
  private connectionClosedIntentionally = false;
  private userId: string | null = null;
  private authToken: string | null = null;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(userId: string, authToken: string): void {
    if (this.socket) {
      return;
    }

    this.userId = userId;
    this.authToken = authToken;
    this.connectionClosedIntentionally = false;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${window.location.host}/ws/notifications/?token=${authToken}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.sendInitialHandshake();
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent;
        this.handleEvent(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.reason}`);
      this.cleanup();

      if (!this.connectionClosedIntentionally && this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(() => this.connect(this.userId!, this.authToken!), delay);
        this.reconnectAttempts++;
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private sendInitialHandshake(): void {
    if (this.socket?.readyState === WebSocket.OPEN && this.userId) {
      this.send({
        type: 'handshake',
        payload: {
          user_id: this.userId,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.send({ type: 'heartbeat' });
        
        // Set timeout to detect server non-responsiveness
        this.heartbeatTimeout = window.setTimeout(() => {
          console.error('Heartbeat response timeout - reconnecting...');
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
    if (this.userId && this.authToken) {
      this.connect(this.userId, this.authToken);
    }
  }

  private handleEvent(event: WebSocketEvent): void {
    switch (event.type) {
      case 'new_message':
        store.dispatch(
          addMessage({
            conversationId: event.payload.conversation_id,
            message: event.payload,
          })
        );
        this.handleMessageNotification(event.payload);
        break;

      case 'new_notification':
        store.dispatch(addNotification(event.payload));
        this.triggerBrowserNotification(event.payload as AppNotification);
        break;

      case 'heartbeat':
        // Clear the timeout since we got a response
        if (this.heartbeatTimeout) {
          clearTimeout(this.heartbeatTimeout);
          this.heartbeatTimeout = null;
        }
        break;

      default:
        console.warn('Unhandled WebSocket event type:', event.type);
    }
  }

  private handleMessageNotification(message: Message): void {
    const state = store.getState();
    const isActive = state.chat.activeConversationId === message.conversation_id;

    if (!isActive) {
      const notification: AppNotification = {
        id: `msg-${message.id}`,
        type: 'new_message',
        title: 'New Message',
        content: message.text,
        meta: {
          conversationId: message.conversation_id,
          sender: message.sender,
        },
        timestamp: new Date().toISOString(),
        read: false,
      };

      store.dispatch(addNotification(notification));
      this.triggerBrowserNotification(notification);
    }
  }

  private triggerBrowserNotification(notification: AppNotification): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      this.showNotification(notification);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showNotification(notification);
        }
      });
    }
  }

  private showNotification(notification: AppNotification): void {
    const notif = new Notification(notification.title, {
      body: notification.content,
      icon: '/notification-icon.png',
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

  public send(data: object): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not open. Message not sent.');
    }
  }

  public disconnect(): void {
    this.connectionClosedIntentionally = true;
    this.cleanup();
    if (this.socket) {
      this.socket.close(1000, 'User initiated disconnect');
      this.socket = null;
    }
  }

  private cleanup(): void {
    this.stopHeartbeat();
    this.userId = null;
    this.authToken = null;
  }

  public getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

export const socketManager = WebSocketManager.getInstance();