const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.assignment.deleteMany({});
  console.log('Assignments cleared!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
