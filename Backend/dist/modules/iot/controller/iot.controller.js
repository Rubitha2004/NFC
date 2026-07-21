"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotController = void 0;
const iot_service_1 = require("../service/iot.service");
const zod_1 = require("zod");
const service = new iot_service_1.IotService();
const ScanSchema = zod_1.z.object({
    tagCode: zod_1.z.string(),
    workerCardId: zod_1.z.string(),
    terminalCode: zod_1.z.string()
});
class IotController {
    async handleScan(req, res) {
        try {
            const data = ScanSchema.parse(req.body);
            const result = await service.handleScan(data.tagCode, data.workerCardId, data.terminalCode);
            return res.json({ success: true, data: result });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    async getDemoData(req, res) {
        try {
            const machineIdentifier = req.params.machineId;
            if (!machineIdentifier)
                throw new Error("Invalid machine ID");
            const data = await service.getDemoData(machineIdentifier);
            return res.json({ success: true, data });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
}
exports.IotController = IotController;
