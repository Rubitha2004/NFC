import { BundleTransactionRepository } from '../repository/bundle-transaction.repository';
import { BundleRepository } from '../../bundle/repository/bundle.repository';
import { Prisma, TransactionType, BundleStatus } from '@prisma/client';
import { websocketService, WEBSOCKET_EVENTS } from '../../websocket';

const transactionRepository = new BundleTransactionRepository();
const bundleRepository = new BundleRepository();

export class BundleTransactionService {
  async createTransaction(data: Prisma.BundleTransactionUncheckedCreateInput) {
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
    const updateData: Prisma.BundleUncheckedUpdateInput = {};
    
    if (data.toOperationId) updateData.currentOperationId = data.toOperationId;
    if (data.toMachineId) updateData.currentMachineId = data.toMachineId;
    if (data.toWorkerId) updateData.currentWorkerId = data.toWorkerId;

    if (data.transactionType === TransactionType.START) {
        updateData.status = BundleStatus.IN_PROGRESS;
    } else if (data.transactionType === TransactionType.COMPLETE) {
        // Here you might need logic to check if this is the final operation
        // For now, we will mark it QC_PENDING or COMPLETED depending on business rules
        // Usually it just transfers to next operation
    } else if (data.transactionType === TransactionType.QC) {
        updateData.status = BundleStatus.QC_PENDING;
    } else if (data.transactionType === TransactionType.FINISHED) {
        updateData.status = BundleStatus.COMPLETED;
    }
    
    if (Object.keys(updateData).length > 0) {
      const updatedBundle = await bundleRepository.update(bundle.id, updateData);
      websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
    } else {
      websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, bundle);
    }
    
    websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_TRANSFERRED, transaction);

    return transaction;
  }

  async getAllTransactions() {
    return transactionRepository.findAll();
  }

  async getTransactionById(id: number) {
    return transactionRepository.findById(id);
  }

  async getTransactionsByBundle(bundleId: number) {
    return transactionRepository.findByBundleId(bundleId);
  }
}
