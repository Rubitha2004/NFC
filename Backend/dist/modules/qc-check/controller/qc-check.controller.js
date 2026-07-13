"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCCheckController = void 0;
const qc_check_service_1 = require("../service/qc-check.service");
const qc_check_dto_1 = require("../dto/qc-check.dto");
const service = new qc_check_service_1.QCCheckService();
class QCCheckController {
    async getAll(req, res) {
        try {
            const bundleId = req.query.bundleId ? Number(req.query.bundleId) : undefined;
            const qcTier = req.query.qcTier;
            const status = req.query.status;
            const checks = await service.getAll({ bundleId, qcTier, status });
            return res.json({ success: true, data: checks });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async getById(req, res) {
        try {
            const check = await service.getById(Number(req.params.id));
            return res.json({ success: true, data: check });
        }
        catch (e) {
            return res.status(404).json({ success: false, error: e.message });
        }
    }
    async getByBundle(req, res) {
        try {
            const checks = await service.getByBundle(Number(req.params.bundleId));
            return res.json({ success: true, data: checks });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async getAccountabilityTrail(req, res) {
        try {
            const trail = await service.getAccountabilityTrail(Number(req.params.bundleId));
            return res.json({ success: true, data: trail });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async scan(req, res) {
        try {
            const { tagCode, qcPersonCardId } = req.body;
            if (!tagCode || !qcPersonCardId) {
                return res.status(400).json({ success: false, error: 'tagCode and qcPersonCardId are required' });
            }
            const data = await service.scanTagForQC(tagCode, qcPersonCardId);
            return res.json({ success: true, data });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    async create(req, res) {
        try {
            const dto = qc_check_dto_1.CreateQCCheckSchema.parse(req.body);
            const check = await service.create(dto);
            return res.status(201).json({ success: true, data: check });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
}
exports.QCCheckController = QCCheckController;
