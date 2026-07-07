import { StageLogRepository } from '../repository/stage-log.repository';
import { ScanInDTO, ScanOutDTO } from '../dto/stage-log.dto';
import prisma from '../../../config/prisma';

const repo = new StageLogRepository();

export class StageLogService {
  async getAll(bundleId?: number) {
    return repo.findAll(bundleId);
  }

  async getByBundle(bundleId: number) {
    return repo.findByBundle(bundleId);
  }

  async scanIn(dto: ScanInDTO) {
    // Validate entities exist
    const [bundle, tag, operation, operator] = await Promise.all([
      prisma.bundle.findUnique({ where: { id: dto.bundleId } }),
      prisma.bundleTagAssignment.findUnique({ where: { id: dto.tagId } }),
      prisma.operation.findUnique({ where: { id: dto.operationId } }),
      prisma.worker.findUnique({ where: { id: dto.operatorId } }),
    ]);
    if (!bundle) throw new Error('Bundle not found');
    if (!tag) throw new Error('Tag not found');
    if (!operation) throw new Error('Operation not found');
    if (!operator) throw new Error('Operator not found');

    // Check no open scan for this bundle+operation
    const open = await repo.findOpenScan(dto.bundleId, dto.operationId);
    if (open) throw new Error(`Bundle already has an open scan for operation "${operation.operationName}". Please scan out first.`);

    const log = await repo.scanIn(dto);
    // Update bundle current operation
    await prisma.bundle.update({
      where: { id: dto.bundleId },
      data: { currentOperationId: dto.operationId, status: 'IN_PROGRESS' }
    });
    return log;
  }

  async scanOut(logId: number, dto: ScanOutDTO) {
    const existing = await repo.findById(logId);
    if (!existing) throw new Error('Stage log not found');
    if (existing.outTime) throw new Error('This scan has already been closed (scan out recorded)');
    return repo.scanOut(logId, dto.remarks);
  }
}
