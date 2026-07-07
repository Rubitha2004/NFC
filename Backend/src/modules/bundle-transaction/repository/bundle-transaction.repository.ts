import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

export class BundleTransactionRepository {
  async create(data: Prisma.BundleTransactionUncheckedCreateInput) {
    return prisma.bundleTransaction.create({ data });
  }

  async findAll() {
    return prisma.bundleTransaction.findMany({
      include: {
        bundle: true,
        productionOrder: true,
        fromOperation: true,
        toOperation: true,
        fromWorker: true,
        toWorker: true,
        fromMachine: true,
        toMachine: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number) {
    return prisma.bundleTransaction.findUnique({
      where: { id },
      include: {
        bundle: true,
        productionOrder: true,
        fromOperation: true,
        toOperation: true,
        fromWorker: true,
        toWorker: true,
        fromMachine: true,
        toMachine: true,
      }
    });
  }

  async findByBundleId(bundleId: number) {
    return prisma.bundleTransaction.findMany({
      where: { bundleId },
      include: {
        fromOperation: true,
        toOperation: true,
        fromWorker: true,
        toWorker: true,
        fromMachine: true,
        toMachine: true,
      },
      orderBy: { transactionTime: 'asc' }
    });
  }
}
