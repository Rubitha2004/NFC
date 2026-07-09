import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const departments = await prisma.department.findMany();
  const grades = await prisma.workerGrade.findMany();
  const skills = await prisma.skill.findMany();

  if (departments.length === 0 || grades.length === 0) {
    console.error("Missing departments or grades to seed workers.");
    return;
  }

  const newWorkers = [];
  // Get current worker count to continue employee code sequence
  const currentCount = await prisma.worker.count();

  for (let i = 1; i <= 50; i++) {
    const idNum = currentCount + i;
    const dept = departments[i % departments.length];
    const grade = grades[i % grades.length];
    
    newWorkers.push({
      employeeCode: `EMP-${idNum.toString().padStart(4, "0")}`,
      firstName: `Worker${idNum}`,
      lastName: "Auto",
      nfcCardId: `NFC-${idNum.toString().padStart(6, "0")}`,
      gender: i % 2 === 0 ? "F" : "M",
      departmentId: dept.id,
      gradeId: grade.id,
      joiningDate: new Date(),
      status: "ACTIVE"
    });
  }

  const created = await prisma.worker.createMany({
    data: newWorkers as any,
  });

  console.log(`Successfully added ${created.count} workers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
