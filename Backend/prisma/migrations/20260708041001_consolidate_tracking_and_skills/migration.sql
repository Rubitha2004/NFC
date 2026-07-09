-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BundleStatus" ADD VALUE 'REWORK';
ALTER TYPE "BundleStatus" ADD VALUE 'HOLD';

-- AlterTable
ALTER TABLE "operations" ADD COLUMN     "requiredSkillId" INTEGER;

-- CreateTable
CREATE TABLE "machine_operation_assignments" (
    "id" SERIAL NOT NULL,
    "machineId" INTEGER NOT NULL,
    "operationId" INTEGER NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machine_operation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machine_operation_assignments_machineId_shiftId_key" ON "machine_operation_assignments"("machineId", "shiftId");

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_requiredSkillId_fkey" FOREIGN KEY ("requiredSkillId") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_operation_assignments" ADD CONSTRAINT "machine_operation_assignments_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_operation_assignments" ADD CONSTRAINT "machine_operation_assignments_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_operation_assignments" ADD CONSTRAINT "machine_operation_assignments_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
