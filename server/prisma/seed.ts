import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { seedCategories } from './seeds/categories.seed';
import { seedUsers } from './seeds/users.seed';
import { seedBlogPosts } from './seeds/blog-posts.seed';

// Prisma 7.x에서는 adapter 필요
const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'fitsystem',
  password: 'fitsystem123',
  database: 'fitsystem',
  port: 3306,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting database seeding...\n');

  await seedUsers(prisma);
  console.log('');
  await seedCategories(prisma);
  console.log('');
  await seedBlogPosts(prisma);

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
