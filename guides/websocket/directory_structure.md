
```plaintext
src/
├── lib/
│   ├── websocket/               # All WebSocket related code
│   │   ├── websocketService.ts  # Singleton WebSocket manager
│   │   ├── events/              # Event handlers
│   │   │   ├── messageHandler.ts
│   │   │   ├── notificationHandler.ts
│   │   │   └── index.ts         # Exports all handlers
│   │   └── types.ts             # WebSocket specific types
│   │
│   └── redux/
│       ├── slices/
│       │   ├── chatSlice.ts      # Combined chat/notification state
│       │   └── ...              # Your other slices
│       │
│       ├── services/
│       │   ├── conversationApi.ts  # Existing RTK Query API
│       │   └── notificationApi.ts  # New notification endpoints
│       │
│       └── hooks/
│           ├── useWebSocket.ts    # Custom hook for components
│           └── useNotifications.ts
│
├── components/
│   ├── chat/                    # Existing chat components
│   │   ├── Conversation/
│   │   └── Message/
│   │
│   ├── notifications/
│   │   ├── NotificationCenter.tsx  # Popover notification UI
│   │   ├── NotificationBadge.tsx   # Bell icon with counter
│   │   └── NotificationItem.tsx    # Individual notification
│   │
│   └── providers/
│       ├── WebSocketProvider.tsx   # Context provider if needed
│       └── NotificationProvider.tsx
│
├── hooks/
│   ├── useConversationMessages.ts # Modified existing hook
│   └── useUnreadCount.ts          # New hook for notifications
│
├── types/
│   ├── chat.ts                   # Extended with notification types
│   └── websocket.ts              # WebSocket event payloads
│
└── utils/
    ├── notificationUtils.ts      # Helpers for notifications
    └── websocketUtils.ts        # Connection helpers
```


# WebSocket Core

- **`websocketService.ts`**: Main singleton class managing connection  
- **`events/`**: Dedicated handlers for different event types  
- **`types.ts`**: Strict types for WebSocket messages  

# Redux Integration

- **`chatSlice.ts`**: Combines messages + notifications state  
- **`useWebSocket.ts`**: Hook for components to access WebSocket  

# Notification System

- **`NotificationCenter.tsx`**: Full notification dropdown UI  
- **`NotificationBadge.tsx`**: Small counter badge component  
- **`useUnreadCount.ts`**: Hook for tracking unread count  

# Modified Existing

- **`useConversationMessages.ts`**: Now uses global WebSocket connection  
- **`conversationApi.ts`**: Keeps REST endpoints but is less critical  
