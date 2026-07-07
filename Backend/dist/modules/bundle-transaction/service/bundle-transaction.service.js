"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleTransactionService = void 0;
const bundle_transaction_repository_1 = require("../repository/bundle-transaction.repository");
const bundle_repository_1 = require("../../bundle/repository/bundle.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
const transactionRepository = new bundle_transaction_repository_1.BundleTransactionRepository();
const bundleRepository = new bundle_repository_1.BundleRepository();
class BundleTransactionService {
    async createTransaction(data) {
        // Verify bundle exists
        const bundle = await bundleRepository.findById(data.bundleId);
        if (!bundle) {
            throw new Error('Bundle not found');
        }
        // Validate quantity
        if (data.quantity > bundle.quantity) {
            throw new Error('Transaction quantity cannot exceed bundle quantity');
        }
        // Create the transaction
        const transaction = await transactionRepository.create(data);
        // Auto-update bundle status and locations
        const updateData = {};
        if (data.toOperationId)
            updateData.currentOperationId = data.toOperationId;
        if (data.toMachineId)
            updateData.currentMachineId = data.toMachineId;
        if (data.toWorkerId)
            updateData.currentWorkerId = data.toWorkerId;
        if (data.transactionType === client_1.TransactionType.START) {
            updateData.status = client_1.BundleStatus.IN_PROGRESS;
        }
        else if (data.transactionType === client_1.TransactionType.COMPLETE) {
            // Here you might need logic to check if this is the final operation
            // For now, we will mark it QC_PENDING or COMPLETED depending on business rules
            // Usually it just transfers to next operation
        }
        else if (data.transactionType === client_1.TransactionType.QC) {
            updateData.status = client_1.BundleStatus.QC_PENDING;
        }
        else if (data.transactionType === client_1.TransactionType.FINISHED) {
            updateData.status = client_1.BundleStatus.COMPLETED;
        }
        if (Object.keys(updateData).length > 0) {
            const updatedBundle = await bundleRepository.update(bundle.id, updateData);
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
        }
        else {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_UPDATED, bundle);
        }
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.BUNDLE_TRANSFERRED, transaction);
        return transaction;
    }
    async getAllTransactions() {
        return transactionRepository.findAll();
    }
    async getTransactionById(id) {
        return transactionRepository.findById(id);
    }
    async getTransactionsByBundle(bundleId) {
        return transactionRepository.findByBundleId(bundleId);
    }
}
exports.BundleTransactionService = BundleTransactionService;
