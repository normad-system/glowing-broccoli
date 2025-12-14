import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostsService.create(createBlogPostDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('published') published?: string,
  ) {
    const isPublished = published === 'false' ? false : true;
    return this.blogPostsService.findAll(page, limit, isPublished);
  }

  @Get('featured')
  getFeatured(@Query('limit', ParseIntPipe) limit = 3) {
    return this.blogPostsService.getFeatured(limit);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogPostsService.findBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostsService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostsService.remove(id);
  }

  @Post(':slug/like')
  incrementLike(@Param('slug') slug: string) {
    return this.blogPostsService.incrementLike(slug);
  }
}
