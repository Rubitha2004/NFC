import prisma from './src/config/prisma';

async function checkTasks() {
  const tasks = await prisma.productionTask.findMany({
    orderBy: { id: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(tasks, null, 2));
}

checkTasks().finally(() => prisma.$disconnect());
