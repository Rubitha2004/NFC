import prisma from './src/config/prisma';

async function checkOp() {
  const op = await prisma.operation.findFirst({ where: { operationName: 'Body Joining' } });
  console.log(op);
}

checkOp().finally(() => prisma.$disconnect());
