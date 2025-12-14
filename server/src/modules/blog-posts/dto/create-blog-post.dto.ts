import { IsString, IsInt, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export class CreateBlogPostDto {
  @IsString()
  slug: string;

  @IsString()
  titleKo: string;

  @IsString()
  titleEn: string;

  @IsString()
  titleJa: string;

  @IsString()
  @IsOptional()
  excerptKo?: string;

  @IsString()
  @IsOptional()
  excerptEn?: string;

  @IsString()
  @IsOptional()
  excerptJa?: string;

  @IsString()
  contentKo: string;

  @IsString()
  contentEn: string;

  @IsString()
  contentJa: string;

  @IsInt()
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  metaKeywords: string[];

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsInt()
  @IsOptional()
  readingTime?: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsInt()
  @IsOptional()
  relatedServiceId?: number;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsInt()
  authorId: number;
}
