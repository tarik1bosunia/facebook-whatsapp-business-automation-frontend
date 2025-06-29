import type { Message, Notification as AppNotification } from "@/types/conversation";

export type WebSocketEvent = 
  | { type: 'new_message'; payload: Message, conversation_id: string }
  | { type: 'new_notification'; payload: AppNotification }
  | { type: 'heartbeat' }
  | { type: 'connection_status'; payload: string };