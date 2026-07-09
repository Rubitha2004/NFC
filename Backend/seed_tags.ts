import prisma from './src/config/prisma';
import { TagStatus } from '@prisma/client';

async function seedTags() {
  console.log('Seeding NFC Tags...');
  
  const tagsToCreate = [];
  for (let i = 1; i <= 500; i++) {
    tagsToCreate.push({
      tagCode: `NFC-TAG-${String(i).padStart(4, '0')}`,
      status: TagStatus.AVAILABLE,
    });
  }

  try {
    const result = await prisma.bundleTagAssignment.createMany({
      data: tagsToCreate,
      skipDuplicates: true,
    });

    console.log(`Successfully seeded ${result.count} tags.`);
  } catch (error) {
    console.error('Error seeding tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTags();
