import prisma from './src/config/prisma';
async function main() { 
  const machines = await prisma.machine.findMany({ include: { room: true } }); 
  console.log('Total machines:', machines.length); 
  const lineB = machines.filter((m:any) => m.rowIndex === 1); 
  console.log('Line B machines:', lineB.map((m:any) => ({ id: m.id, code: m.machineCode, pos: m.positionIndex, status: m.status })).sort((a:any,b:any)=>a.pos - b.pos)); 
} 
main().finally(() => prisma.$disconnect());
