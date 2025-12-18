import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async findBySlugWithPosts(slug: string, page = 1, limit = 10) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { published: true },
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            slug: true,
            titleKo: true,
            titleEn: true,
            titleJa: true,
            excerptKo: true,
            excerptEn: true,
            excerptJa: true,
            thumbnailUrl: true,
            difficulty: true,
            readingTime: true,
            viewCount: true,
            likeCount: true,
            publishedAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            category: {
              select: {
                id: true,
                slug: true,
                nameKo: true,
                nameEn: true,
                nameJa: true,
                icon: true,
                color: true,
              },
            },
          },
        },
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    const total = category._count.posts;
    const totalPages = Math.ceil(total / limit);

    return {
      category,
      posts: category.posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
