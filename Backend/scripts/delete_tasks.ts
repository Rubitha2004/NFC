const prisma = require('./src/config/prisma').default; 
async function main() { 
  await prisma.productionTask.deleteMany({}); 
  console.log('Deleted all production tasks'); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
