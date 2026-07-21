import prisma from './src/config/prisma';
async function main() { 
  const lineB = await prisma.machine.findMany({ 
    where: { rowIndex: 1 }, 
    include: { assignments: { where: { status: 'ACTIVE' } } } 
  }); 
  console.log('Line B machines pos 2 and 10:', lineB.filter((m:any) => m.positionIndex === 2 || m.positionIndex === 10).map((m:any) => ({ id: m.id, pos: m.positionIndex, assignments: m.assignments.length }))); 
} 
main().finally(() => prisma.$disconnect());
