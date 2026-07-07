import { Prisma } from "@prisma/client";

export type ProductionOrderCreateInput = Omit<Prisma.ProductionOrderCreateInput, "id" | "createdAt" | "updatedAt" | "status" | "completedQuantity">;
export type ProductionOrderUpdateInput = Partial<ProductionOrderCreateInput>;
