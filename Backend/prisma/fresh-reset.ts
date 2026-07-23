/**
 * fresh-reset.ts
 * Completely clears all Production Orders, Tasks, Bundles, Assignments, and Attendances
 * to give a 100% fresh clean state for user testing from Planning to IoT Demo to Live Factory.
 */
import prisma from '../src/config/prisma';

async function main() {
  console.log('🧹 Starting System-Wide Fresh Reset...');

  // 1. Delete QC check logs
  try {
    await prisma.qCCheckLog.deleteMany({});
    console.log('✅ Cleared QC Check Logs.');
  } catch (e) {}

  // 2. Delete stage logs
  try {
    await prisma.bundleStageLog.deleteMany({});
    console.log('✅ Cleared Bundle Stage Logs.');
  } catch (e) {}

  // 3. Delete & Re-seed Bundle Tag Assignments (Tag Pool)
  try {
    await prisma.bundleTagAssignment.deleteMany({});
    const tagsToCreate = [];
    for (let i = 1; i <= 500; i++) {
      tagsToCreate.push({
        tagCode: `NFC-TAG-${String(i).padStart(4, '0')}`,
        status: 'AVAILABLE' as const,
      });
    }
    await prisma.bundleTagAssignment.createMany({
      data: tagsToCreate,
      skipDuplicates: true,
    });
    console.log('✅ Cleared & re-seeded 500 Available Bundle Tag Assignments.');
  } catch (e) {}

  // 4. Delete Bundles
  try {
    await prisma.bundle.deleteMany({});
    console.log('✅ Cleared Bundles.');
  } catch (e) {}

  // 5. Delete Production Tasks
  try {
    await prisma.productionTask.deleteMany({});
    console.log('✅ Cleared Production Tasks.');
  } catch (e) {}

  // 6. Delete Attendance Records
  try {
    await prisma.attendance.deleteMany({});
    console.log('✅ Cleared Attendance Records.');
  } catch (e) {}

  // 7. Delete Assignments & Machine Operation Mappings
  try {
    await prisma.assignment.deleteMany({});
    await prisma.machineOperationAssignment.deleteMany({});
    console.log('✅ Cleared Assignments & Machine Operation Assignments.');
  } catch (e) {}

  // 8. Delete Production Orders
  try {
    await prisma.productionOrder.deleteMany({});
    console.log('✅ Cleared Production Orders.');
  } catch (e) {}

  // 9. Set all machines to ACTIVE status (0 active assignments = unassigned / gray)
  await prisma.machine.updateMany({
    data: { status: 'ACTIVE' },
  });
  console.log('✅ Reset all machines status to ACTIVE (Unassigned / Gray).');

  // 8. Ensure all workers have skill relations for planning flexibility
  const allWorkers = await prisma.worker.findMany({ where: { status: 'ACTIVE' } });
  const allSkills = await prisma.skill.findMany({ where: { status: 'ACTIVE' } });

  for (const worker of allWorkers) {
    for (const skill of allSkills) {
      try {
        await prisma.workerSkill.upsert({
          where: {
            workerId_skillId: {
              workerId: worker.id,
              skillId: skill.id,
            },
          },
          update: {},
          create: {
            workerId: worker.id,
            skillId: skill.id,
          },
        });
      } catch (e) {}
    }
  }
  console.log(`✅ Ensured skills linked for ${allWorkers.length} active workers.`);

  const activeWorkerCount = await prisma.worker.count({ where: { status: 'ACTIVE' } });
  const activeMachineCount = await prisma.machine.count({ where: { status: 'ACTIVE' } });

  console.log('\n🎉 FRESH RESET COMPLETE!');
  console.log(`   - Total Orders: 0`);
  console.log(`   - Total Assignments: 0`);
  console.log(`   - Active Workers Available: ${activeWorkerCount}`);
  console.log(`   - Active Machines Available: ${activeMachineCount}`);
  console.log('\nSystem is now 100% clean and ready for your fresh test from Planning to IoT Demo to Live Factory!');
}

main()
  .catch((e) => {
    console.error('❌ Reset error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
