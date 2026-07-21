import prisma from './src/config/prisma';

async function test() {
  try {
    const res = (prisma.bundle as any).createManyAndReturn ? "YES" : "NO";
    console.log("SUPPORTED:", res);
  } catch(e) {
    console.log("ERROR", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
