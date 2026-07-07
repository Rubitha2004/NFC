import prisma from '../../../config/prisma';
import { QCTier, QCCheckStatus } from '@prisma/client';

export class QCCheckRepository {
  private include = {
    bundle: { include: { productionOrder: true } },
    tag: true,
    qcPerson: true,
    operation: true,
    worker: true,
  };

  async findAll(filters?: { bundleId?: number; qcTier?: QCTier; status?: QCCheckStatus }) {
    return prisma.qCCheckLog.findMany({
      where: {
        ...(filters?.bundleId ? { bundleId: filters.bundleId } : {}),
        ...(filters?.qcTier ? { qcTier: filters.qcTier } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      },
      include: this.include,
      orderBy: { checkedAt: 'desc' }
    });
  }

  async findById(id: number) {
    return prisma.qCCheckLog.findUnique({ where: { id }, include: this.include });
  }

  async findByBundle(bundleId: number) {
    return prisma.qCCheckLog.findMany({
      where: { bundleId },
      include: this.include,
      orderBy: { checkedAt: 'asc' }
    });
  }

  async create(data: {
    bundleId: number;
    tagId?: number;
    qcPersonId: number;
    qcTier: QCTier;
    operationId?: number;
    workerId?: number;
    status: QCCheckStatus;
    defectNotes?: string;
  }) {
    return prisma.qCCheckLog.create({ data, include: this.include });
  }

  async getAccountabilityTrail(bundleId: number) {
    // Get all checks with tier info for accountability
    const checks = await prisma.qCCheckLog.findMany({
      where: { bundleId },
      include: {
        qcPerson: true,
        operation: true,
        worker: true,
        tag: true,
      },
      orderBy: { checkedAt: 'asc' }
    });

    const failed = checks.filter(c => c.status === 'FAIL' || c.status === 'REWORK');
    const tier2Failures = failed.filter(c => c.qcTier === 'FINAL_QC');

    // For each Tier 2 failure, trace back to the Tier 1 person responsible for the same operation/worker
    const trails = tier2Failures.map(t2 => {
      const tier1Miss = checks.find(
        c => c.qcTier === 'LINE_QC' && c.workerId === t2.workerId && c.status === 'PASS'
      );
      return { tier2Failure: t2, missedByTier1: tier1Miss ?? null };
    });

    return { checks, failureTrails: trails };
  }
}
