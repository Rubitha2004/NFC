-- AlterTable
ALTER TABLE "production_tasks" ADD COLUMN     "actualEnd" TIMESTAMP(3),
ADD COLUMN     "actualStart" TIMESTAMP(3),
ADD COLUMN     "scheduledEnd" TIMESTAMP(3),
ADD COLUMN     "scheduledStart" TIMESTAMP(3);
