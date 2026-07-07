import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { WEBSOCKET_ROOMS } from '../events/constants';
import { initSocketHandlers } from '../socket';

export class WebSocketService {
  private io: SocketIOServer | null = null;

  init(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*", // Configure based on frontend host later
        methods: ["GET", "POST"]
      }
    });

    initSocketHandlers(this.io);
    console.log("WebSocket Server initialized.");
  }

  getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error("WebSocketService has not been initialized!");
    }
    return this.io;
  }

  // Publish event to a specific room (default: FACTORY room)
  publish(event: string, payload: any, room: string = WEBSOCKET_ROOMS.FACTORY) {
    if (!this.io) {
      console.warn("Attempting to publish event before WebSocket is initialized.");
      return;
    }
    this.io.to(room).emit(event, payload);
    console.log(`[WS] Published event: ${event} to room: ${room}`);
  }

  // Broadcast to everyone (regardless of room)
  broadcast(event: string, payload: any) {
    if (!this.io) return;
    this.io.emit(event, payload);
  }
}

export const websocketService = new WebSocketService();
