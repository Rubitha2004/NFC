import prisma from './config/prisma';

async function main() {
  const machines = await prisma.machine.findMany({
    where: {
      roomId: { not: null },
      OR: [{ rowIndex: null }, { positionIndex: null }]
    }
  });

  for (const machine of machines) {
    if (!machine.roomId) continue;
    const room = await prisma.room.findUnique({ where: { id: machine.roomId } });
    if (!room) continue;

    const occupied = await prisma.machine.findMany({
      where: { roomId: room.id, id: { not: machine.id } },
      select: { rowIndex: true, positionIndex: true }
    });

    let r = 0;
    let p = 0;
    while (occupied.some((o: any) => o.rowIndex === r && o.positionIndex === p)) {
      p++;
      if (p >= room.machinesPerRow) {
        p = 0;
        r++;
      }
    }

    await prisma.machine.update({
      where: { id: machine.id },
      data: { rowIndex: r, positionIndex: p }
    });
    console.log('Fixed machine', machine.id, 'to row', r, 'pos', p);
  }
  console.log('Done');
}

main().catch(console.error).finally(() => process.exit(0));
