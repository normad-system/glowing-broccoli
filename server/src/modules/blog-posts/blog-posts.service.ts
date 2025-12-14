import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogPostDto: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: {
        ...createBlogPostDto,
        metaKeywords: createBlogPostDto.metaKeywords.join(','),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, published = true) {
    const where = published ? { published: true } : {};
    
    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
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
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
          },
        },
        category: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return {
      ...post,
      metaKeywords: post.metaKeywords.split(','),
    };
  }

  async update(id: number, updateBlogPostDto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...updateBlogPostDto,
        metaKeywords: updateBlogPostDto.metaKeywords
          ? updateBlogPostDto.metaKeywords.join(',')
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
    });
  }

  async remove(id: number) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with id ${id} not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async incrementLike(slug: string) {
    return this.prisma.blogPost.update({
      where: { slug },
      data: { likeCount: { increment: 1 } },
      select: {
        slug: true,
        likeCount: true,
      },
    });
  }

  async getFeatured(limit = 3) {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' },
      ],
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
        category: {
          select: {
            slug: true,
            nameKo: true,
            nameEn: true,
            nameJa: true,
            icon: true,
            color: true,
          },
        },
      },
    });
  }
}
