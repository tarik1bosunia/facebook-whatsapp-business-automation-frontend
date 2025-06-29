import { Message, Notification } from "@/types/conversation";

export type WebSocketEvent = 
  | { type: 'new_message'; payload: Message & { conversation_id: string } }
  | { type: 'new_notification'; payload: Notification }
  | { type: 'heartbeat' }
  | { type: 'connection_status'; payload: string };
