"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalController = void 0;
const terminal_service_1 = require("../service/terminal.service");
const terminal_validation_1 = require("../validation/terminal.validation");
const terminalService = new terminal_service_1.TerminalService();
class TerminalController {
    async createTerminal(req, res) {
        try {
            const validatedData = terminal_validation_1.createTerminalSchema.parse(req.body);
            const terminal = await terminalService.createTerminal(validatedData);
            return res.status(201).json({
                success: true,
                message: "Terminal created successfully",
                data: terminal,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to create terminal",
            });
        }
    }
    async getAllTerminals(req, res) {
        try {
            const result = await terminalService.getAllTerminals(req.query);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch terminals",
            });
        }
    }
    async getTerminalById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const terminal = await terminalService.getTerminalById(id);
            return res.status(200).json({
                success: true,
                data: terminal,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Terminal not found",
            });
        }
    }
    async updateTerminal(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const validatedData = terminal_validation_1.updateTerminalSchema.parse(req.body);
            const terminal = await terminalService.updateTerminal(id, validatedData);
            return res.status(200).json({
                success: true,
                message: "Terminal updated successfully",
                data: terminal,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update terminal",
            });
        }
    }
    async changeTerminalStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const { status } = terminal_validation_1.changeTerminalStatusSchema.parse(req.body);
            const terminal = await terminalService.changeTerminalStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Terminal status updated successfully",
                data: terminal,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update terminal status",
            });
        }
    }
}
exports.TerminalController = TerminalController;
