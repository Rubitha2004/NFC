import prisma from './src/config/prisma';

prisma.operation.findMany().then(console.log).finally(() => prisma.$disconnect());
