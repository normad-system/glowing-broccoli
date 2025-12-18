import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { BlogPostsModule } from './modules/blog-posts/blog-posts.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CategoriesModule, BlogPostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
