// messageQueue.ts
import { store } from "@/lib/redux/store";
import { addNotification } from "@/lib/redux/slices/chatSlice";

interface PendingMessage {
  data: object;
  timestamp: number;
  retries: number;
}

export class MessageQueue {
  private queue: PendingMessage[] = [];
  private readonly maxRetryAttempts: number;
  private readonly retryDelay: number;

  constructor(maxRetryAttempts: number, retryDelay: number) {
    this.maxRetryAttempts = maxRetryAttempts;
    this.retryDelay = retryDelay;
  }

  public add(data: object): void {
    const existingIndex = this.queue.findIndex(
      (msg) => JSON.stringify(msg.data) === JSON.stringify(data)
    );

    if (existingIndex === -1) {
      this.queue.push({
        data,
        timestamp: Date.now(),
        retries: 0,
      });
    }
  }

  public process(sendFn: (data: object) => void): void {
    if (!this.queue.length) return;

    this.queue = this.queue.filter((msg) => {
      if (msg.retries >= this.maxRetryAttempts) {
        this.handleFailedMessage(msg);
        return false;
      }

      try {
        sendFn(msg.data);
        return false;
      } catch (error) {
        console.error("Retry send failed:", error);
        msg.retries++;
        msg.timestamp = Date.now();
        return true;
      }
    });

    if (this.queue.length) {
      setTimeout(() => this.process(sendFn), this.retryDelay);
    }
  }

  public clear(): void {
    this.queue = [];
  }

  private handleFailedMessage(msg: PendingMessage): void {
    console.log(msg)
    store.dispatch(
      addNotification({
        id: `msg-failed-${Date.now()}`,
        type: "message_failed",
        title: "Message failed to send",
        content: "Could not deliver your message",
        timestamp: new Date().toISOString(),
        read: false,
      })
    );
  }
}