// heartbeatManager.ts
export class HeartbeatManager {
  private intervalId: number | null = null;
  private timeoutId: number | null = null;
  private readonly intervalTime: number;
  private readonly timeoutTime: number;
  private onTimeout: () => void;
  private onSendHeartbeat: () => void;

  constructor(
    intervalTime: number,
    timeoutTime: number,
    onSendHeartbeat: () => void,
    onTimeout: () => void
  ) {
    this.intervalTime = intervalTime;
    this.timeoutTime = timeoutTime;
    this.onSendHeartbeat = onSendHeartbeat;
    this.onTimeout = onTimeout;
  }

  public start(): void {
    this.stop();
    this.intervalId = window.setInterval(() => {
      this.onSendHeartbeat();
      this.timeoutId = window.setTimeout(this.onTimeout, this.timeoutTime);
    }, this.intervalTime);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public resetTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}