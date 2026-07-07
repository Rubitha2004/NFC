-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'WAITING', 'COMPLETED', 'QC_PENDING', 'QC_COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREATE', 'START', 'COMPLETE', 'TRANSFER', 'HOLD', 'REWORK', 'QC', 'FINISHED');

-- CreateTable
CREATE TABLE "production_orders" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "styleNumber" TEXT NOT NULL,
    "styleName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "plannedQuantity" INTEGER NOT NULL,
    "completedQuantity" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PLANNED',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" SERIAL NOT NULL,
    "bundleNumber" TEXT NOT NULL,
    "productionOrderId" INTEGER NOT NULL,
    "currentOperationId" INTEGER,
    "currentMachineId" INTEGER,
    "currentWorkerId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "completedQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "BundleStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_transactions" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "productionOrderId" INTEGER NOT NULL,
    "fromOperationId" INTEGER,
    "toOperationId" INTEGER,
    "fromWorkerId" INTEGER,
    "toWorkerId" INTEGER,
    "fromMachineId" INTEGER,
    "toMachineId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "transactionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_inspections" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "workerId" INTEGER,
    "machineId" INTEGER,
    "inspectorName" TEXT,
    "passQuantity" INTEGER NOT NULL,
    "rejectQuantity" INTEGER NOT NULL,
    "reworkQuantity" INTEGER NOT NULL,
    "inspectionTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qc_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_orderNumber_key" ON "production_orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_bundleNumber_key" ON "bundles"("bundleNumber");

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_currentOperationId_fkey" FOREIGN KEY ("currentOperationId") REFERENCES "operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_currentMachineId_fkey" FOREIGN KEY ("currentMachineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundles" ADD CONSTRAINT "bundles_currentWorkerId_fkey" FOREIGN KEY ("currentWorkerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_fromOperationId_fkey" FOREIGN KEY ("fromOperationId") REFERENCES "operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_toOperationId_fkey" FOREIGN KEY ("toOperationId") REFERENCES "operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_fromWorkerId_fkey" FOREIGN KEY ("fromWorkerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_toWorkerId_fkey" FOREIGN KEY ("toWorkerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_fromMachineId_fkey" FOREIGN KEY ("fromMachineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_transactions" ADD CONSTRAINT "bundle_transactions_toMachineId_fkey" FOREIGN KEY ("toMachineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "bundle_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_inspections" ADD CONSTRAINT "qc_inspections_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
