import { QCRepository } from '../repository/qc.repository';
import { BundleRepository } from '../../bundle/repository/bundle.repository';
import { Prisma, BundleStatus } from '@prisma/client';
import { websocketService, WEBSOCKET_EVENTS } from '../../websocket';

const qcRepository = new QCRepository();
const bundleRepository = new BundleRepository();

export class QCService {
  async createQC(data: Prisma.QCUncheckedCreateInput) {
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
    const updateData: Prisma.BundleUncheckedUpdateInput = {
        completedQuantity: data.passQuantity
    };

    if (data.rejectQuantity > 0 || data.reworkQuantity > 0) {
        // According to user flow, if rejected/rework it goes to REWORK. 
        // We will put IN_PROGRESS for now since REWORK doesn't exist in BundleStatus enum.
        updateData.status = BundleStatus.IN_PROGRESS; 
    } else {
        updateData.status = BundleStatus.QC_COMPLETED;
    }

    const updatedBundle = await bundleRepository.update(bundle.id, updateData);

    if (data.rejectQuantity > 0 || data.reworkQuantity > 0) {
        websocketService.publish(WEBSOCKET_EVENTS.QC_FAILED, qc);
    } else {
        websocketService.publish(WEBSOCKET_EVENTS.QC_COMPLETED, qc);
    }
    websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);

    return qc;
  }

  async getAllQC() {
    return qcRepository.findAll();
  }

  async getQCById(id: number) {
    return qcRepository.findById(id);
  }

  async updateQC(id: number, data: Prisma.QCUncheckedUpdateInput) {
    return qcRepository.update(id, data);
  }
}
