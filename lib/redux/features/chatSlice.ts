import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Notification as AppNotification } from "@/types/conversation";

interface ChatState {
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  notifications: AppNotification[];
  connectionStatus: "connected" | "disconnected" | "connecting" | "error";
}

const initialState: ChatState = {
  activeConversationId: null,
  messages: {},
  notifications: [],
  connectionStatus: "disconnected",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      console.log("added message from chatslice:: ", message);

      // Initialize array if it doesn't exist
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Prevent duplicates
      const messageExists = state.messages[conversationId].some(
        (m) => m.id === message.id
      );

      if (!messageExists) {
        state.messages[conversationId].push(message); // Add new messages at start
      }
    },

    addMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      const existingIds = new Set(
        state.messages[conversationId].map((m) => m.id)
      );

      const newMessages = messages.filter((m) => !existingIds.has(m.id));
      state.messages[conversationId].push(...newMessages);
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const notification = action.payload;

      // Prevent duplicates
      if (!state.notifications.some((n) => n.id === notification.id)) {
        state.notifications.unshift(notification);
      }
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) notification.read = true;
    },
    clearConversationNotifications: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) =>
          !(
            n.type === "new_message" &&
            n.meta?.conversationId === action.payload
          )
      );
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<ChatState["connectionStatus"]>
    ) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const {
  setActiveConversation,
  addMessage,
  addMessages,
  addNotification,
  markNotificationRead,
  clearConversationNotifications,
  setConnectionStatus,

} = chatSlice.actions;

export default chatSlice.reducer;

export const selectMessagesByConversationId =
  (conversationId: string | undefined) => (state: { chat: ChatState }) =>
    conversationId ? state.chat.messages[conversationId] || [] : [];

export const selectAllMessages = (state: { chat: ChatState }) => {
  return Object.values(state.chat.messages).flat();
};
