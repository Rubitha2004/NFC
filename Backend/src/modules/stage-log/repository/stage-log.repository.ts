import prisma from '../../../config/prisma';

export class StageLogRepository {
  async findAll(bundleId?: number) {
    return prisma.bundleStageLog.findMany({
      where: bundleId ? { bundleId } : undefined,
      include: {
        bundle: true,
        tag: true,
        operation: true,
        operator: true,
      },
      orderBy: { inTime: 'asc' }
    });
  }

  async findById(id: number) {
    return prisma.bundleStageLog.findUnique({
      where: { id },
      include: { bundle: true, tag: true, operation: true, operator: true }
    });
  }

  async findByBundle(bundleId: number) {
    return prisma.bundleStageLog.findMany({
      where: { bundleId },
      include: { operation: true, operator: true, tag: true },
      orderBy: { inTime: 'asc' }
    });
  }

  async scanIn(data: { bundleId: number; tagId: number; operationId: number; operatorId: number; remarks?: string }) {
    return prisma.bundleStageLog.create({ data });
  }

  async scanOut(id: number, remarks?: string) {
    return prisma.bundleStageLog.update({
      where: { id },
      data: { outTime: new Date(), remarks: remarks ?? undefined }
    });
  }

  async findOpenScan(bundleId: number, operationId: number) {
    return prisma.bundleStageLog.findFirst({
      where: { bundleId, operationId, outTime: null },
      orderBy: { inTime: 'desc' }
    });
  }
}
