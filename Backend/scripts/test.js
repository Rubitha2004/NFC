const prisma = require('./src/config/prisma').default;

prisma.operation.findMany().then(console.log).finally(() => prisma.$disconnect());
