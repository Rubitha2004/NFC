import prisma from './src/config/prisma';

async function findProperWorker() {
  const sideSeam = await prisma.operation.findFirst({
    where: { operationName: { contains: "Side Seam" } }
  });

  if (!sideSeam) {
    console.log("Could not find Side Seam operation");
    return;
  }

  console.log(`Operation: ${sideSeam.operationName}`);

  if (sideSeam.requiredSkillId) {
    const skilledWorkers = await prisma.worker.findMany({
      where: {
        skills: {
          some: {
            skillId: sideSeam.requiredSkillId
          }
        }
      }
    });

    console.log("\nWorkers with this skill:");
    skilledWorkers.forEach(w => console.log(`- ${w.firstName} ${w.lastName} (ID: ${w.employeeCode})`));
  } else {
    console.log("No skill required for this operation.");
  }
}

findProperWorker().finally(() => prisma.$disconnect());
