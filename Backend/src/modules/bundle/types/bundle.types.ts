import { Prisma } from "@prisma/client";

export type BundleCreateInput = Omit<Prisma.BundleCreateInput, "id" | "createdAt" | "updatedAt" | "status" | "completedQuantity">;
export type BundleUpdateInput = Partial<BundleCreateInput>;
