"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalService = void 0;
const terminal_repository_1 = require("../repository/terminal.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
class TerminalService {
    terminalRepo;
    constructor() {
        this.terminalRepo = new terminal_repository_1.TerminalRepository();
    }
    async createTerminal(data) {
        const existing = await this.terminalRepo.findByCode(data.terminalCode);
        if (existing) {
            throw new Error(`Terminal with code ${data.terminalCode} already exists`);
        }
        return this.terminalRepo.create(data);
    }
    async getAllTerminals(params) {
        return this.terminalRepo.findAll(params);
    }
    async getTerminalById(id) {
        const terminal = await this.terminalRepo.findById(id);
        if (!terminal)
            throw new Error("Terminal not found");
        return terminal;
    }
    async updateTerminal(id, data) {
        const terminal = await this.terminalRepo.findById(id);
        if (!terminal)
            throw new Error("Terminal not found");
        return this.terminalRepo.update(id, data);
    }
    async changeTerminalStatus(id, status) {
        const terminal = await this.terminalRepo.findById(id);
        if (!terminal)
            throw new Error("Terminal not found");
        const updated = await this.terminalRepo.changeStatus(id, status);
        if (status === client_1.RecordStatus.ACTIVE) {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_ONLINE, updated);
        }
        else {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_OFFLINE, updated);
        }
        return updated;
    }
}
exports.TerminalService = TerminalService;
