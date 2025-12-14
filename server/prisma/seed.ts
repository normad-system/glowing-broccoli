import { PrismaClient } from '@prisma/client';
import { seedCategories } from './seeds/categories.seed';
import { seedUsers } from './seeds/users.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding...\n');

  await seedUsers();
  console.log('');
  await seedCategories();

  console.log('\n🎉 All seeds completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
