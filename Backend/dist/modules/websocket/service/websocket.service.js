"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocketService = exports.WebSocketService = void 0;
const socket_io_1 = require("socket.io");
const constants_1 = require("../events/constants");
const socket_1 = require("../socket");
class WebSocketService {
    io = null;
    init(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*", // Configure based on frontend host later
                methods: ["GET", "POST"]
            }
        });
        (0, socket_1.initSocketHandlers)(this.io);
        console.log("WebSocket Server initialized.");
    }
    getIO() {
        if (!this.io) {
            throw new Error("WebSocketService has not been initialized!");
        }
        return this.io;
    }
    // Publish event to a specific room (default: FACTORY room)
    publish(event, payload, room = constants_1.WEBSOCKET_ROOMS.FACTORY) {
        if (!this.io) {
            console.warn("Attempting to publish event before WebSocket is initialized.");
            return;
        }
        this.io.to(room).emit(event, payload);
        console.log(`[WS] Published event: ${event} to room: ${room}`);
    }
    // Broadcast to everyone (regardless of room)
    broadcast(event, payload) {
        if (!this.io)
            return;
        this.io.emit(event, payload);
    }
}
exports.WebSocketService = WebSocketService;
exports.websocketService = new WebSocketService();
