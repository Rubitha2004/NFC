import prisma from './src/config/prisma';

async function main() {
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS bundle_transactions CASCADE`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS qc_inspections CASCADE`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
