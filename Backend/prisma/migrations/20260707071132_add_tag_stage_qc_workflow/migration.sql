-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('CREATED', 'PLANNED', 'ASSIGNED', 'ACCEPTED', 'RUNNING', 'COMPLETED', 'QC', 'TRANSFERRED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TagStatus" AS ENUM ('AVAILABLE', 'ASSIGNED');

-- CreateEnum
CREATE TYPE "QCTier" AS ENUM ('LINE_QC', 'FINAL_QC');

-- CreateEnum
CREATE TYPE "QCCheckStatus" AS ENUM ('PASS', 'FAIL', 'REWORK');

-- CreateTable
CREATE TABLE "production_tasks" (
    "id" SERIAL NOT NULL,
    "taskId" TEXT NOT NULL,
    "productionOrderId" INTEGER NOT NULL,
    "bundleId" INTEGER,
    "operationId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "machineId" INTEGER,
    "workerId" INTEGER,
    "shiftId" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "estimatedTime" INTEGER NOT NULL,
    "targetQuantity" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'CREATED',
    "supervisor" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_tag_assignments" (
    "id" SERIAL NOT NULL,
    "tagCode" TEXT NOT NULL,
    "bundleId" INTEGER,
    "assignedAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "status" "TagStatus" NOT NULL DEFAULT 'AVAILABLE',
    "assignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_tag_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_stage_logs" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "operationId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "inTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outTime" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_stage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_check_logs" (
    "id" SERIAL NOT NULL,
    "bundleId" INTEGER NOT NULL,
    "tagId" INTEGER,
    "qcPersonId" INTEGER NOT NULL,
    "qcTier" "QCTier" NOT NULL,
    "operationId" INTEGER,
    "workerId" INTEGER,
    "status" "QCCheckStatus" NOT NULL,
    "defectNotes" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qc_check_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "production_tasks_taskId_key" ON "production_tasks"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_tag_assignments_tagCode_key" ON "bundle_tag_assignments"("tagCode");

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tasks" ADD CONSTRAINT "production_tasks_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_tag_assignments" ADD CONSTRAINT "bundle_tag_assignments_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_stage_logs" ADD CONSTRAINT "bundle_stage_logs_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_stage_logs" ADD CONSTRAINT "bundle_stage_logs_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "bundle_tag_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_stage_logs" ADD CONSTRAINT "bundle_stage_logs_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_stage_logs" ADD CONSTRAINT "bundle_stage_logs_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_check_logs" ADD CONSTRAINT "qc_check_logs_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_check_logs" ADD CONSTRAINT "qc_check_logs_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "bundle_tag_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_check_logs" ADD CONSTRAINT "qc_check_logs_qcPersonId_fkey" FOREIGN KEY ("qcPersonId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_check_logs" ADD CONSTRAINT "qc_check_logs_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_check_logs" ADD CONSTRAINT "qc_check_logs_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
