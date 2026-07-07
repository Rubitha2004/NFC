// Socket.IO client (architecture only – event subscriptions come in Sprint 3)
import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/shared/utils/constants";

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(WS_URL, {
        autoConnect: false,
        transports: ["websocket"],
      });
    }
    if (!this.socket.connected) {
      this.socket.connect();
    }
    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: unknown): void {
    this.socket?.emit(event, data);
  }
}

export const socketService = new SocketService();
