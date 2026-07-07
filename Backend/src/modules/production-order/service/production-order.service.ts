import { ProductionOrderRepository } from "../repository/production-order.repository";
import { ProductionOrderCreateInput, ProductionOrderUpdateInput } from "../types/production-order.types";
import { OrderStatus } from "@prisma/client";

export class ProductionOrderService {
  private repository: ProductionOrderRepository;

  constructor() {
    this.repository = new ProductionOrderRepository();
  }

  async create(data: ProductionOrderCreateInput) {
    const existing = await this.repository.findByOrderNumber(data.orderNumber);
    if (existing) {
      throw new Error(`Production order with order number ${data.orderNumber} already exists`);
    }

    if (new Date(data.plannedStartDate) > new Date(data.plannedEndDate)) {
      throw new Error("Planned start date cannot be after planned end date");
    }

    return this.repository.create({
      ...data,
      plannedStartDate: new Date(data.plannedStartDate),
      plannedEndDate: new Date(data.plannedEndDate),
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new Error("Production order not found");
    }
    return order;
  }

  async update(id: number, data: ProductionOrderUpdateInput) {
    const order = await this.findById(id);
    
    if (data.orderNumber && data.orderNumber !== order.orderNumber) {
      const existing = await this.repository.findByOrderNumber(data.orderNumber);
      if (existing) {
        throw new Error(`Production order with order number ${data.orderNumber} already exists`);
      }
    }

    const startDate = data.plannedStartDate ? new Date(data.plannedStartDate) : order.plannedStartDate;
    const endDate = data.plannedEndDate ? new Date(data.plannedEndDate) : order.plannedEndDate;

    if (startDate > endDate) {
      throw new Error("Planned start date cannot be after planned end date");
    }

    const updateData: any = { ...data };
    if (data.plannedStartDate) updateData.plannedStartDate = new Date(data.plannedStartDate);
    if (data.plannedEndDate) updateData.plannedEndDate = new Date(data.plannedEndDate);

    return this.repository.update(id, updateData);
  }

  async changeStatus(id: number, status: OrderStatus) {
    await this.findById(id);
    return this.repository.changeStatus(id, status);
  }
}
