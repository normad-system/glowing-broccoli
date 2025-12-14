import { Module } from '@nestjs/common';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [BlogPostsController],
  providers: [BlogPostsService, PrismaService],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}
