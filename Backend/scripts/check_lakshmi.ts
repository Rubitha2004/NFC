import prisma from './src/config/prisma';

async function checkLakshmi() {
  const lakshmi = await prisma.worker.findFirst({
    where: { firstName: 'Lakshmi' },
    include: {
      assignments: true,
      department: true
    }
  });
  console.log(JSON.stringify(lakshmi, null, 2));
}

checkLakshmi().finally(() => prisma.$disconnect());
