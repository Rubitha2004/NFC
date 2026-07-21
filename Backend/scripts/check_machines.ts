import prisma from './src/config/prisma';

async function checkTasks() {
  const count = await prisma.machine.count({
    where: { assignments: { none: { status: 'ACTIVE' } } }
  });
  console.log("Free machines:", count);

  const mCount = await prisma.machine.count();
  console.log("Total machines:", mCount);
}

checkTasks().finally(() => prisma.$disconnect());
