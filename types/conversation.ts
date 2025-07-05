export interface Conversation {
  id: string;
  auto_reply: boolean;
  customer: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
  };
  channel: "facebook" | "whatsapp";
  unreadCount: number;
}

export interface Contact {
  name: string;
  phones: string[];
}

// export interface Contact {
//   name?: string;
//   phones?: Array<{
//     phone: string;
//     type?: string;
//   }>;
//   emails?: Array<{
//     email: string;
//     type?: string;
//   }>;
// }


export interface Message {
  id: string;
  text: string;
  time: string;
  sender: "customer" | "business" | "ai";
  media_id?: string;
  media_type?:string;
  contacts?: Contact[];
  media_url?: string;
}

export interface SocialMediaUser {
  id: number
  name: string
  social_media_id: string
  avatar_url: string | null
  platform: string
  created_at: string
  updated_at: string
  customer: number | null
}

export interface Notification {
  id: string;
  type: 'new_message' | 'system_alert' | 'new_conversation' | 'message_failed';
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


