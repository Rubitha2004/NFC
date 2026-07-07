import prisma from '../../../config/prisma';
import { TagStatus } from '@prisma/client';

export class TagRepository {
  async findAll() {
    return prisma.bundleTagAssignment.findMany({
      include: {
        bundle: { include: { productionOrder: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number) {
    return prisma.bundleTagAssignment.findUnique({
      where: { id },
      include: {
        bundle: { include: { productionOrder: true } },
        stageLogs: { include: { operation: true, operator: true }, orderBy: { inTime: 'asc' } },
        qcChecks: { include: { qcPerson: true, operation: true, worker: true }, orderBy: { checkedAt: 'asc' } }
      }
    });
  }

  async findByCode(tagCode: string) {
    return prisma.bundleTagAssignment.findUnique({
      where: { tagCode },
      include: { bundle: true }
    });
  }

  async findAvailable() {
    return prisma.bundleTagAssignment.findMany({
      where: { status: TagStatus.AVAILABLE },
      orderBy: { tagCode: 'asc' }
    });
  }

  async create(tagCode: string, assignedBy?: string) {
    return prisma.bundleTagAssignment.create({
      data: { tagCode, assignedBy }
    });
  }

  async assign(id: number, bundleId: number, assignedBy?: string) {
    return prisma.bundleTagAssignment.update({
      where: { id },
      data: {
        bundleId,
        status: TagStatus.ASSIGNED,
        assignedAt: new Date(),
        releasedAt: null,
        assignedBy: assignedBy ?? null
      }
    });
  }

  async release(id: number) {
    return prisma.bundleTagAssignment.update({
      where: { id },
      data: {
        bundleId: null,
        status: TagStatus.AVAILABLE,
        releasedAt: new Date()
      }
    });
  }
}
