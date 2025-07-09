// notificationManager.ts
import { store } from "@/lib/redux/store";
import { AppNotification } from "@/types/chat";
import { markNotificationRead, addNotification } from "@/lib/redux/slices/chatSlice";
import { Message } from "@/types/conversation";

export class NotificationManager {
  public static showBrowserNotification(notification: AppNotification): void {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      this.createNotification(notification);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.createNotification(notification);
        }
      });
    }
  }

  private static createNotification(notification: AppNotification): void {
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

  public static createMessageNotification(
    conversationId: string,
    message: Message
  ): AppNotification | null {
    const state = store.getState();
    const isActive = state.chat.activeConversationId === conversationId;
    const isFromCurrentUser = message.sender === "business";

    if (isActive || isFromCurrentUser) return null;

    return {
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
  }
}