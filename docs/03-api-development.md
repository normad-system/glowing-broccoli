# API 개발 가이드 (NestJS + Prisma)

## 목차

1. [기본 개념](#기본-개념)
2. [Prisma 스키마 설계](#prisma-스키마-설계)
3. [모듈 생성](#모듈-생성)
4. [Controller 작성](#controller-작성)
5. [Service 작성](#service-작성)
6. [DTO 및 유효성 검사](#dto-및-유효성-검사)
7. [인증 및 권한](#인증-및-권한)
8. [에러 처리](#에러-처리)
9. [테스트 작성](#테스트-작성)

---

## 기본 개념

### NestJS 아키텍처

```
Controller → Service → Repository (Prisma)
    ↓          ↓            ↓
 HTTP 요청   비즈니스     데이터베이스
           로직         작업
```

### 주요 구성 요소

- **Module**: 기능 단위로 코드를 구성
- **Controller**: HTTP 요청을 처리하고 응답 반환
- **Service**: 비즈니스 로직 처리
- **DTO**: 데이터 전송 객체
- **Guard**: 인증/권한 검사
- **Interceptor**: 요청/응답 변환
- **Pipe**: 데이터 유효성 검사 및 변환

---

## Prisma 스키마 설계

### 1. 기본 모델 예시

**prisma/schema.prisma**:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// User 모델
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

// Post 모델
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?  @db.Text
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}

// Role enum
enum Role {
  USER
  ADMIN
}
```

### 2. 마이그레이션 실행

```powershell
cd server

# 마이그레이션 생성 및 적용
npx prisma migrate dev --name add_user_post_models

# Prisma Client 생성
npx prisma generate
```

---

## 모듈 생성

### 1. NestJS CLI로 모듈 생성

```powershell
cd server

# Users 모듈 생성
nest g module modules/users
nest g controller modules/users
nest g service modules/users
```

### 2. 모듈 구조

```
src/modules/users/
 ├── dto/
 │   ├── create-user.dto.ts
 │   └── update-user.dto.ts
 ├── entities/
 │   └── user.entity.ts
 ├── users.controller.ts
 ├── users.service.ts
 └── users.module.ts
```

### 3. 모듈 설정

**users.module.ts**:

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## Controller 작성

### 1. RESTful API 구현

**users.controller.ts**:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 사용자 생성
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 모든 사용자 조회
  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.usersService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 10,
    });
  }

  // 특정 사용자 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // 사용자 수정
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  // 사용자 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

---

## Service 작성

### 1. 비즈니스 로직 구현

**users.service.ts**:

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 사용자 생성
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // 이메일 중복 체크
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  // 모든 사용자 조회
  async findAll(params: { skip?: number; take?: number }) {
    const { skip = 0, take = 10 } = params;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  // 특정 사용자 조회
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
          },
        },
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // 사용자 수정
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 존재 여부 확인

    const { password, ...data } = updateUserDto;

    // 비밀번호 변경 시 해싱
    if (password) {
      data['password'] = await bcrypt.hash(password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // 사용자 삭제
  async remove(id: number) {
    await this.findOne(id); // 존재 여부 확인

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // 이메일로 사용자 찾기 (인증용)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
```

---

## DTO 및 유효성 검사

### 1. 패키지 설치

```powershell
cd server
npm install class-validator class-transformer
```

### 2. DTO 작성

**dto/create-user.dto.ts**:

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
```

**dto/update-user.dto.ts**:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### 3. 전역 Validation Pipe 설정

**main.ts**:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 Validation Pipe 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성 있으면 에러
      transform: true, // 자동 타입 변환
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

---

## 인증 및 권한

### 1. 패키지 설치

```powershell
npm install @nestjs/passport passport passport-jwt
npm install @nestjs/jwt
npm install -D @types/passport-jwt
npm install bcrypt
npm install -D @types/bcrypt
```

### 2. Auth 모듈 생성

```powershell
nest g module modules/auth
nest g controller modules/auth
nest g service modules/auth
```

### 3. JWT Strategy

**modules/auth/jwt.strategy.ts**:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### 4. Auth Guard

**modules/auth/jwt-auth.guard.ts**:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 5. Controller에 Guard 적용

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
```

---

## 에러 처리

### 1. 커스텀 Exception Filter

**filters/http-exception.filter.ts**:

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### 2. 전역 Filter 적용

**main.ts**:

```typescript
import { AllExceptionsFilter } from './filters/http-exception.filter';

app.useGlobalFilters(new AllExceptionsFilter());
```

---

## 테스트 작성

### 1. Service 테스트

**users.service.spec.ts**:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(createUserDto.email);
    });
  });
});
```

### 2. 테스트 실행

```powershell
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지
npm run test:cov
```

---

## API 문서화 (Swagger)

### 1. Swagger 설치

```powershell
npm install @nestjs/swagger swagger-ui-express
```

### 2. Swagger 설정

**main.ts**:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('FitSystem API')
  .setDescription('FitSystem API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

접속: `http://localhost:3000/api`

---

## 다음 단계

1. [프론트엔드 개발 가이드](./04-frontend-development.md)
2. [배포 가이드](./05-deployment.md)
