import prisma from './config/prisma';

async function main() {
  const unassignedMachines = await prisma.machine.findMany({ where: { roomId: null } });
  if (unassignedMachines.length === 0) {
    console.log("No unassigned machines.");
    return;
  }

  const rooms = await prisma.room.findMany();
  let mIdx = 0;

  for (const room of rooms) {
    const occupiedList = await prisma.machine.findMany({
      where: { roomId: room.id },
      select: { rowIndex: true, positionIndex: true }
    });

    // Create a Set for easy lookup
    const occupiedSet = new Set(occupiedList.map(o => `${o.rowIndex}-${o.positionIndex}`));

    let r = 0;
    let p = 0;

    while (mIdx < unassignedMachines.length && r < room.rowsCount) {
      // Find next empty position
      while (occupiedSet.has(`${r}-${p}`)) {
        p++;
        if (p >= room.machinesPerRow) {
          p = 0;
          r++;
        }
      }

      if (r >= room.rowsCount) break; // Room is full

      const machine = unassignedMachines[mIdx++];
      
      try {
        await prisma.machine.update({
          where: { id: machine.id },
          data: { roomId: room.id, rowIndex: r, positionIndex: p }
        });
        console.log(`Assigned machine ${machine.machineCode} to Room ${room.id} Row ${r} Pos ${p}`);
        
        // Mark as occupied
        occupiedSet.add(`${r}-${p}`);
        
        p++;
        if (p >= room.machinesPerRow) {
          p = 0;
          r++;
        }
      } catch (e: any) {
        console.log(`Failed to assign machine ${machine.machineCode}:`, e.message);
      }
    }
  }

  console.log(`Assigned ${mIdx} machines.`);
}

main().catch(console.error).finally(() => process.exit(0));
