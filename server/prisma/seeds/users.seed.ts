import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fitsystem.com' },
    update: {},
    create: {
      email: 'admin@fitsystem.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'FitSystem 관리자',
      avatar: null,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);
  console.log('✨ Users seeded successfully!');
}

// Run if executed directly
if (require.main === module) {
  const prisma = new PrismaClient();
  seedUsers(prisma)
    .catch((e) => {
      console.error('❌ Error seeding users:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
