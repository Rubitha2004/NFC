"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageLogController = void 0;
const stage_log_service_1 = require("../service/stage-log.service");
const stage_log_dto_1 = require("../dto/stage-log.dto");
const service = new stage_log_service_1.StageLogService();
class StageLogController {
    async getAll(req, res) {
        try {
            const bundleId = req.query.bundleId ? Number(req.query.bundleId) : undefined;
            const logs = await service.getAll(bundleId);
            return res.json({ success: true, data: logs });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async getByBundle(req, res) {
        try {
            const logs = await service.getByBundle(Number(req.params.bundleId));
            return res.json({ success: true, data: logs });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async scanIn(req, res) {
        try {
            const dto = stage_log_dto_1.ScanInSchema.parse(req.body);
            const log = await service.scanIn(dto);
            return res.status(201).json({ success: true, data: log });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    async scanOut(req, res) {
        try {
            const dto = stage_log_dto_1.ScanOutSchema.parse(req.body);
            const log = await service.scanOut(Number(req.params.id), dto);
            return res.json({ success: true, data: log });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
}
exports.StageLogController = StageLogController;
