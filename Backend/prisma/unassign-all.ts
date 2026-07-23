/**
 * unassign-all.ts
 * Unassigns all workers and machines from active assignments,
 * and ensures all workers have skills attached so they appear in Planning.
 */
import prisma from '../src/config/prisma';

async function main() {
  console.log('🔓 Unassigning all workers and machines...');

  // 1. Mark all ACTIVE assignments as COMPLETED
  const updatedAssignments = await prisma.assignment.updateMany({
    where: { status: 'ACTIVE' },
    data: {
      status: 'COMPLETED',
      releasedAt: new Date(),
    },
  });
  console.log(`✅ ${updatedAssignments.count} active Assignments released.`);

  // 2. Ensure skills are mapped to workers so requiredSkillId filter passes for any operation
  const allWorkers = await prisma.worker.findMany({ where: { status: 'ACTIVE' } });
  const allSkills = await prisma.skill.findMany({ where: { status: 'ACTIVE' } });

  console.log(`Mapping skills to ${allWorkers.length} active workers...`);
  let skillCount = 0;

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
        skillCount++;
      } catch (e) {
        // ignore duplicate errors
      }
    }
  }

  console.log(`✅ ${skillCount} WorkerSkill relations active.`);

  // 3. Print summary
  const availableWorkersCount = await prisma.worker.count({
    where: {
      status: 'ACTIVE',
      assignments: { none: { status: 'ACTIVE' } },
    },
  });

  const availableMachinesCount = await prisma.machine.count({
    where: {
      status: 'ACTIVE',
      assignments: { none: { status: 'ACTIVE' } },
    },
  });

  console.log('\n🎉 UNASSIGN COMPLETE!');
  console.log(`   - Available Workers for Planning: ${availableWorkersCount}`);
  console.log(`   - Available Machines for Planning: ${availableMachinesCount}`);
  console.log('Now refresh the Planning page — all workers and machines are ready for assignment!');
}

main()
  .catch((e) => {
    console.error('❌ Error unassigning:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
