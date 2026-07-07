"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCController = void 0;
const qc_service_1 = require("../service/qc.service");
const qc_dto_1 = require("../dto/qc.dto");
const service = new qc_service_1.QCService();
class QCController {
    async create(req, res) {
        try {
            const validatedData = qc_dto_1.createQCSchema.parse(req.body);
            const qc = await service.createQC(validatedData);
            return res.status(201).json(qc);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || error });
        }
    }
    async getAll(req, res) {
        try {
            const qcs = await service.getAllQC();
            return res.json(qcs);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const qc = await service.getQCById(Number(req.params.id));
            if (!qc) {
                return res.status(404).json({ error: 'QC record not found' });
            }
            return res.json(qc);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const validatedData = qc_dto_1.updateQCSchema.parse(req.body);
            const qc = await service.updateQC(Number(req.params.id), validatedData);
            return res.json(qc);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || error });
        }
    }
}
exports.QCController = QCController;
