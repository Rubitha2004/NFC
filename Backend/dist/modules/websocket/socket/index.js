"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketHandlers = void 0;
const constants_1 = require("../events/constants");
const initSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`[WS] Client connected: ${socket.id}`);
        // Automatically join the factory room upon connection
        // This room receives all global production events
        socket.join(constants_1.WEBSOCKET_ROOMS.FACTORY);
        console.log(`[WS] Client ${socket.id} joined room: ${constants_1.WEBSOCKET_ROOMS.FACTORY}`);
        socket.on('disconnect', () => {
            console.log(`[WS] Client disconnected: ${socket.id}`);
        });
        // Future: Handle specific client-to-server events here if needed
    });
};
exports.initSocketHandlers = initSocketHandlers;
