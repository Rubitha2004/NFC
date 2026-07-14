const prisma = require('./src/config/prisma').default; 
async function main() { 
  const room = await prisma.room.findFirst(); 
  if(!room) { console.log('No room found'); return; }
  const totalSlots = room.rowsCount * room.machinesPerRow; 
  let roomMachines = await prisma.machine.findMany({ where: { roomId: room.id }, orderBy: { id: 'asc' } }); 
  if (roomMachines.length < totalSlots) { 
    const needed = totalSlots - roomMachines.length; 
    const unassigned = await prisma.machine.findMany({ where: { roomId: null }, take: needed, orderBy: { id: 'asc' } }); 
    if (unassigned.length > 0) { 
      await prisma.machine.updateMany({ where: { id: { in: unassigned.map((m: any) => m.id) } }, data: { roomId: room.id } }); 
      roomMachines = [...roomMachines, ...unassigned]; 
    } 
  } 
  await prisma.machine.updateMany({ where: { roomId: room.id }, data: { rowIndex: null, positionIndex: null } }); 
  let machineIndex = 0; 
  for (let r = 0; r < room.rowsCount; r++) { 
    for (let p = 0; p < room.machinesPerRow; p++) { 
      if (machineIndex < roomMachines.length) { 
        const m = roomMachines[machineIndex]; 
        await prisma.machine.update({ where: { id: m.id }, data: { rowIndex: r, positionIndex: p } }); 
        machineIndex++; 
      } else { break; } 
    } 
  } 
  console.log('Done allocating', machineIndex, 'machines to Room:', room.name); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
