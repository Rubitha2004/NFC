import prisma from "../../../config/prisma";
import { Prisma, OrderStatus } from "@prisma/client";

export class ProductionOrderRepository {
  async create(data: Prisma.ProductionOrderCreateInput) {
    return prisma.productionOrder.create({ data });
  }

  async findAll() {
    return prisma.productionOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number) {
    return prisma.productionOrder.findUnique({
      where: { id },
      include: { bundles: true }
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.productionOrder.findUnique({
      where: { orderNumber }
    });
  }

  async update(id: number, data: Prisma.ProductionOrderUpdateInput) {
    return prisma.productionOrder.update({
      where: { id },
      data
    });
  }

  async changeStatus(id: number, status: OrderStatus) {
    return prisma.productionOrder.update({
      where: { id },
      data: { status }
    });
  }
}
