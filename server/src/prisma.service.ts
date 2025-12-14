import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Prisma 7.x에서는 adapter 필요
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'fitsystem',
      password: process.env.DB_PASSWORD || 'fitsystem123',
      database: process.env.DB_NAME || 'fitsystem',
      port: parseInt(process.env.DB_PORT || '3306'),
      connectionLimit: 5,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
