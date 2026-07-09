
import prisma from "../src/config/prisma";

async function main() {
  const floor = await prisma.floor.findFirst();
  if (!floor) {
    console.log("No floor found");
    return;
  }

  // Get all departments
  const departments = await prisma.department.findMany();
  
  if (departments.length === 0) {
    console.log("No departments found");
    return;
  }

  let mType = await prisma.machineType.findFirst();
  if (!mType) {
    mType = await prisma.machineType.create({ data: { code: "MT1", name: "Sewing Machine" } });
  }

  const roomTypeMap: Record<string, any> = {
    "DEPT-SEW": "Stitching",
    "DEPT-FIN": "Finishing",
    "DEPT-QC": "QC",
    "DEPT-CUT": "Cutting",
  };

  // For each department, create a Room and 105 machines
  for (const dept of departments) {
    const roomTypeName = roomTypeMap[dept.code] || "Stitching";
    
    let room = await prisma.room.findFirst({ where: { floorId: floor.id, name: dept.name } });
    if (!room) {
      room = await prisma.room.create({
        data: {
          name: dept.name, // The room represents the department visually
          roomType: roomTypeName,
          rowsCount: 3,
          machinesPerRow: 35,
          floorId: floor.id,
        }
      });
    }

    // Generate 105 machines
    for (let row = 1; row <= 3; row++) {
      for (let pos = 1; pos <= 35; pos++) {
        // Use a unique code prefix per department so they do not collide
        const prefix = dept.code.split("-")[1] || dept.code;
        const code = `M-${prefix}-${row}-${pos.toString().padStart(2, "0")}`;
        
        let term = await prisma.terminal.findFirst({ where: { terminalCode: code } });
        if (!term) {
          term = await prisma.terminal.create({ data: { terminalCode: code, terminalName: code } });
        }

        await prisma.machine.upsert({
          where: { machineCode: code },
          update: { roomId: room.id, rowIndex: row, positionIndex: pos, departmentId: dept.id },
          create: {
            machineCode: code,
            machineName: `Machine ${code}`,
            departmentId: dept.id,
            machineTypeId: mType.id,
            terminalId: term.id,
            status: "ACTIVE",
            roomId: room.id,
            rowIndex: row,
            positionIndex: pos,
          }
        });
      }
    }
  }
  console.log(`Seeded 105 machines for each of the ${departments.length} departments successfully.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
