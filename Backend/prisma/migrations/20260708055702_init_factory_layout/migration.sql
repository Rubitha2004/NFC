-- AlterTable
ALTER TABLE "machines" ADD COLUMN     "positionIndex" INTEGER,
ADD COLUMN     "roomId" INTEGER,
ADD COLUMN     "rowIndex" INTEGER;

-- CreateTable
CREATE TABLE "floors" (
    "id" SERIAL NOT NULL,
    "factoryName" TEXT,
    "name" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "floorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "roomType" TEXT,
    "rowsCount" INTEGER NOT NULL DEFAULT 1,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "floors_floorNumber_key" ON "floors"("floorNumber");

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
