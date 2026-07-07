"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleService = void 0;
const bundle_repository_1 = require("../repository/bundle.repository");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
class BundleService {
    repository;
    constructor() {
        this.repository = new bundle_repository_1.BundleRepository();
    }
    async create(data) {
        const existing = await this.repository.findByBundleNumber(data.bundleNumber);
        if (existing) {
            throw new Error(`Bundle with bundle number ${data.bundleNumber} already exists`);
        }
        const order = await prisma_1.default.productionOrder.findUnique({
            where: { id: data.productionOrderId },
            include: { bundles: true }
        });
        if (!order) {
            throw new Error("Production order not found");
        }
        const currentTotalQuantity = order.bundles.reduce((acc, bundle) => acc + bundle.quantity, 0);
        if (currentTotalQuantity + data.quantity > order.plannedQuantity) {
            throw new Error("Total bundle quantity cannot exceed production order planned quantity");
        }
        const bundle = await this.repository.create({
            bundleNumber: data.bundleNumber,
            productionOrderId: data.productionOrderId,
            quantity: data.quantity,
        });
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_CREATED, bundle);
        return bundle;
    }
    async findAll() {
        return this.repository.findAll();
    }
    async findById(id) {
        const bundle = await this.repository.findById(id);
        if (!bundle) {
            throw new Error("Bundle not found");
        }
        return bundle;
    }
    async update(id, data) {
        await this.findById(id);
        if (data.currentWorkerId) {
            const worker = await prisma_1.default.worker.findUnique({ where: { id: data.currentWorkerId } });
            if (!worker)
                throw new Error("Worker not found");
        }
        if (data.currentMachineId) {
            const machine = await prisma_1.default.machine.findUnique({ where: { id: data.currentMachineId } });
            if (!machine)
                throw new Error("Machine not found");
        }
        if (data.currentOperationId) {
            const operation = await prisma_1.default.operation.findUnique({ where: { id: data.currentOperationId } });
            if (!operation)
                throw new Error("Operation not found");
        }
        const updated = await this.repository.update(id, data);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_UPDATED, updated);
        return updated;
    }
    async changeStatus(id, status) {
        await this.findById(id);
        const updated = await this.repository.changeStatus(id, status);
        let eventName = websocket_1.WEBSOCKET_EVENTS.BUNDLE_UPDATED;
        if (status === client_1.BundleStatus.IN_PROGRESS)
            eventName = websocket_1.WEBSOCKET_EVENTS.BUNDLE_STARTED;
        if (status === client_1.BundleStatus.COMPLETED)
            eventName = websocket_1.WEBSOCKET_EVENTS.BUNDLE_COMPLETED;
        websocket_1.websocketService.publish(eventName, updated);
        return updated;
    }
}
exports.BundleService = BundleService;
