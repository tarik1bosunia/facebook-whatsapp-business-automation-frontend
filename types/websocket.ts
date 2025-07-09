import type {
  Message,
  Notification as AppNotification,
} from "@/types/conversation";

export type NewMessageEvent = {
  type: "new_message";
  payload: {
    conversation_id: string;
    message: Message;
  };
};
export type WebSocketEvent =
  | NewMessageEvent
  | { type: "new_notification"; payload: AppNotification }
  | { type: "heartbeat" }
  | { type: "connection_status"; payload: string }
  | {type: "handshake",}
