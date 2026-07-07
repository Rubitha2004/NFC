import { Server as SocketIOServer, Socket } from 'socket.io';
import { WEBSOCKET_ROOMS } from '../events/constants';

export const initSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Automatically join the factory room upon connection
    // This room receives all global production events
    socket.join(WEBSOCKET_ROOMS.FACTORY);
    console.log(`[WS] Client ${socket.id} joined room: ${WEBSOCKET_ROOMS.FACTORY}`);

    socket.on('disconnect', () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
    
    // Future: Handle specific client-to-server events here if needed
  });
};
