export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface User {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface Category {
  id: number;
  slug: string;
  nameKo: string;
  nameEn: string;
  nameJa: string;
  descriptionKo?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  icon?: string;
  color?: string;
  order: number;
  _count?: {
    posts: number;
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  titleKo: string;
  titleEn: string;
  titleJa: string;
  excerptKo?: string;
  excerptEn?: string;
  excerptJa?: string;
  contentKo?: string;
  contentEn?: string;
  contentJa?: string;
  thumbnailUrl?: string;
  difficulty: Difficulty;
  readingTime?: number;
  viewCount: number;
  likeCount: number;
  publishedAt?: string;
  author: User;
  category: Category;
}

export interface BlogPostDetail extends BlogPost {
  contentKo: string;
  contentEn: string;
  contentJa: string;
  metaKeywords: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: Pagination;
}

export interface CategoryWithPosts {
  category: Category;
  posts: BlogPost[];
  pagination: Pagination;
}
