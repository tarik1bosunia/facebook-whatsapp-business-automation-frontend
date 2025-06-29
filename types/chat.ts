export interface Message {
  id: string;
  conversation_id: string;
  text: string;
  sender: 'user' | 'customer' | 'system';
  timestamp: string;
  media_url?: string;
  media_type?: string;
  read?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'new_message' | 'system_alert' | 'new_conversation';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  meta?: {
    conversationId?: string;
    sender?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}