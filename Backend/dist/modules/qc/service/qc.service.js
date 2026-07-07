"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCService = void 0;
const qc_repository_1 = require("../repository/qc.repository");
const bundle_repository_1 = require("../../bundle/repository/bundle.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
const qcRepository = new qc_repository_1.QCRepository();
const bundleRepository = new bundle_repository_1.BundleRepository();
class QCService {
    async createQC(data) {
        // Verify bundle exists
        const bundle = await bundleRepository.findById(data.bundleId);
        if (!bundle) {
            throw new Error('Bundle not found');
        }
        const totalQCQuantity = data.passQuantity + data.rejectQuantity + data.reworkQuantity;
        if (totalQCQuantity !== bundle.quantity) {
            throw new Error(`Sum of pass, reject, and rework quantities (${totalQCQuantity}) must equal bundle quantity (${bundle.quantity})`);
        }
        const qc = await qcRepository.create(data);
        // Update bundle based on QC results
        const updateData = {
            completedQuantity: data.passQuantity
        };
        if (data.rejectQuantity > 0 || data.reworkQuantity > 0) {
            // According to user flow, if rejected/rework it goes to REWORK. 
            // We will put IN_PROGRESS for now since REWORK doesn't exist in BundleStatus enum.
            updateData.status = client_1.BundleStatus.IN_PROGRESS;
        }
        else {
            updateData.status = client_1.BundleStatus.QC_COMPLETED;
        }
        const updatedBundle = await bundleRepository.update(bundle.id, updateData);
        if (data.rejectQuantity > 0 || data.reworkQuantity > 0) {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.QC_FAILED, qc);
        }
        else {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.QC_COMPLETED, qc);
        }
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
        return qc;
    }
    async getAllQC() {
        return qcRepository.findAll();
    }
    async getQCById(id) {
        return qcRepository.findById(id);
    }
    async updateQC(id, data) {
        return qcRepository.update(id, data);
    }
}
exports.QCService = QCService;
