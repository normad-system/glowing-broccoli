# FitSystem Monorepo 개발 환경 구축 가이드

## 목차

1. [개요](#개요)
2. [필수 도구 설치](#필수-도구-설치)
3. [프로젝트 초기 설정](#프로젝트-초기-설정)
4. [Server (NestJS) 구축](#server-nestjs-구축)
5. [Client (Angular 21 SSR) 구축](#client-angular-21-ssr-구축)
6. [Docker 설정](#docker-설정)
7. [로컬 개발 환경 실행](#로컬-개발-환경-실행)
8. [데이터베이스 설정](#데이터베이스-설정)
9. [트러블슈팅](#트러블슈팅)

---

## 개요

이 프로젝트는 독립적인 Monorepo 구조로 설계되었습니다.

### 프로젝트 구조

```
NestAngular/
 ├── server/              # NestJS + Prisma + MySQL API 서버
 ├── client-fitsystem/    # Angular 21 SSR 클라이언트 (fit-system.net)
 ├── client-math/         # Angular 21 SSR 관리용 클라이언트
 ├── docker-compose.yml   # Docker Compose 설정
 ├── package.json         # 루트 패키지 설정
 └── docs/                # 문서
```

### 기술 스택

**Backend (Server)**
- NestJS (Node.js 프레임워크)
- Prisma ORM
- MySQL 8.0
- TypeScript

**Frontend (Clients)**
- Angular 21 SSR (Server-Side Rendering)
- Vite 빌드 도구
- SCSS 스타일
- TypeScript

---

## 필수 도구 설치

### 1. Node.js 설치

**Windows:**
- [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
- 설치 후 확인:

```powershell
node --version  # v18 이상 권장
npm --version
```

**macOS:**
```bash
# Homebrew 사용
brew install node

# 또는 공식 사이트에서 다운로드
```

### 2. 패키지 매니저 선택

이 프로젝트는 **npm**을 사용합니다. (pnpm도 가능)

```powershell
# npm은 Node.js 설치 시 자동으로 설치됨
npm --version

# pnpm 사용 시 (선택사항)
npm install -g pnpm
```

### 3. CLI 도구 설치

```powershell
# NestJS CLI
npm install -g @nestjs/cli

# Angular CLI
npm install -g @angular/cli

# Prisma CLI
npm install -g prisma
```

### 4. Docker Desktop 설치

**Windows:**
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) 다운로드 및 설치
- WSL 2 활성화 필요

**macOS:**
- [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) 다운로드 및 설치

설치 확인:
```powershell
docker --version
docker-compose --version
```

### 5. 에디터 설치 (권장)

- **Visual Studio Code**: [다운로드](https://code.visualstudio.com/)
- 권장 확장 프로그램:
  - Prisma
  - Angular Language Service
  - ESLint
  - Prettier

---

## 프로젝트 초기 설정

### 1. 루트 디렉토리 생성

```powershell
# 프로젝트 루트 디렉토리 생성
mkdir NestAngular
cd NestAngular
```

### 2. 루트 package.json 생성

```powershell
# package.json 초기화
npm init -y
```

**package.json 내용:**

```json
{
  "name": "fitsystem-monorepo",
  "version": "1.0.0",
  "description": "FitSystem Monorepo with NestJS + Angular 21 SSR",
  "private": true,
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:restart": "docker-compose restart",
    "install:all": "cd server && npm install && cd ../client-fitsystem && npm install && cd ../client-math && npm install",
    "dev:server": "cd server && npm run start:dev",
    "dev:fitsystem": "cd client-fitsystem && npm run serve:ssr",
    "dev:math": "cd client-math && npm run serve:ssr",
    "build:all": "cd server && npm run build && cd ../client-fitsystem && npm run build:ssr && cd ../client-math && npm run build:ssr"
  },
  "keywords": [
    "monorepo",
    "nestjs",
    "angular",
    "ssr",
    "prisma",
    "mysql"
  ],
  "author": "",
  "license": "MIT"
}
```

### 3. .gitignore 생성

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Production
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml

# Prisma
prisma/migrations/

# Angular
.angular/
*.tsbuildinfo
```

---

## Server (NestJS) 구축

### 1. NestJS 프로젝트 생성

```powershell
# 루트 디렉토리에서 실행
npx @nestjs/cli new server --package-manager npm --skip-git

# server 디렉토리로 이동
cd server
```

### 2. 의존성 설치 (설치 실패 시)

```powershell
npm install
```

### 3. Prisma 설치 및 초기화

```powershell
# Prisma 설치
npm install prisma @prisma/client
npm install -D prisma

# Prisma 초기화
npx prisma init
```

### 4. Prisma 스키마 설정

**prisma/schema.prisma** 파일 수정:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5. 환경 변수 설정

**.env** 파일 수정:

```env
DATABASE_URL="mysql://fitsystem:fitsystem123@localhost:3306/fitsystem"
NODE_ENV=development
PORT=3000
```

**.env.example** 파일 생성:

```env
DATABASE_URL="mysql://username:password@localhost:3306/database"
NODE_ENV=development
PORT=3000
```

### 6. Prisma Service 생성

**src/prisma.service.ts** 파일 생성:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

### 7. App Module에 Prisma 추가

**src/app.module.ts** 파일 수정:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

### 8. Docker 파일 생성

**Dockerfile** (프로덕션용):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
```

**Dockerfile.dev** (개발용):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
```

---

## Client (Angular 21 SSR) 구축

### 1. Client FitSystem 생성

```powershell
# 루트 디렉토리에서 실행
npx @angular/cli@21 new client-fitsystem --routing=true --style=scss --ssr=true --skip-git=true --package-manager=npm
```

설치 중 질문:
- **AI tools**: None 선택

### 2. Client Math 생성

```powershell
npx @angular/cli@21 new client-math --routing=true --style=scss --ssr=true --skip-git=true --package-manager=npm
```

### 3. package.json 스크립트 수정

**client-fitsystem/package.json** 및 **client-math/package.json**에 스크립트 추가:

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "build:ssr": "ng build --configuration production",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "serve:ssr": "node dist/client-fitsystem/server/server.mjs",
  "serve:ssr:client-fitsystem": "node dist/client-fitsystem/server/server.mjs"
}
```

**client-math**의 경우 `client-fitsystem` 대신 `client-math`로 변경

### 4. 환경 변수 설정

**.env** 파일 생성 (각 클라이언트 폴더):

```env
API_URL=http://localhost:3000
```

### 5. Docker 파일 생성

**client-fitsystem/Dockerfile** (프로덕션):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4200

CMD ["node", "dist/client-fitsystem/server/server.mjs"]
```

**client-fitsystem/Dockerfile.dev** (개발):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "serve:ssr:client-fitsystem"]
```

**client-math** 폴더에도 동일하게 생성 (포트를 4300으로 변경)

---

## Docker 설정

### docker-compose.yml 생성

루트 디렉토리에 **docker-compose.yml** 파일 생성:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: fitsystem-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: fitsystem
      MYSQL_USER: fitsystem
      MYSQL_PASSWORD: fitsystem123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - fitsystem-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: fitsystem-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://fitsystem:fitsystem123@mysql:3306/fitsystem
      NODE_ENV: development
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - fitsystem-network
    command: npm run start:dev

  client-fitsystem:
    build:
      context: ./client-fitsystem
      dockerfile: Dockerfile
    container_name: fitsystem-client
    restart: unless-stopped
    ports:
      - "4200:4200"
    environment:
      API_URL: http://server:3000
    volumes:
      - ./client-fitsystem:/app
      - /app/node_modules
    networks:
      - fitsystem-network
    command: npm run serve:ssr:fitsystem

  client-math:
    build:
      context: ./client-math
      dockerfile: Dockerfile
    container_name: fitsystem-client-math
    restart: unless-stopped
    ports:
      - "4300:4300"
    environment:
      API_URL: http://server:3000
    volumes:
      - ./client-math:/app
      - /app/node_modules
    networks:
      - fitsystem-network
    command: npm run serve:ssr:math

volumes:
  mysql_data:
    driver: local

networks:
  fitsystem-network:
    driver: bridge
```

---

## 로컬 개발 환경 실행

### 방법 1: Docker Compose 사용 (권장)

```powershell
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f server

# 서비스 중지
docker-compose down

# 볼륨 포함 완전 삭제
docker-compose down -v
```

**접속 URL:**
- MySQL: `localhost:3306`
- Server API: `http://localhost:3000`
- Client FitSystem: `http://localhost:4200`
- Client Math: `http://localhost:4300`

### 방법 2: 개별 실행

#### Server 실행

```powershell
cd server

# 의존성 설치
npm install

# Prisma Client 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev --name init

# 개발 서버 실행
npm run start:dev
```

#### Client FitSystem 실행

```powershell
cd client-fitsystem

# 의존성 설치
npm install

# SSR 빌드
npm run build:ssr

# SSR 서버 실행
npm run serve:ssr
```

#### Client Math 실행

```powershell
cd client-math

# 의존성 설치
npm install

# SSR 빌드
npm run build:ssr

# SSR 서버 실행
npm run serve:ssr
```

### 방법 3: 루트에서 간편 실행

```powershell
# 모든 프로젝트 의존성 설치
npm run install:all

# Server 개발 서버 실행
npm run dev:server

# Client FitSystem 실행
npm run dev:fitsystem

# Client Math 실행
npm run dev:math

# 모든 프로젝트 빌드
npm run build:all
```

---

## 데이터베이스 설정

### 1. Prisma Migrate

```powershell
cd server

# 마이그레이션 생성
npx prisma migrate dev --name init

# 마이그레이션 적용 (프로덕션)
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status
```

### 2. Prisma Studio (데이터베이스 GUI)

```powershell
cd server

# Prisma Studio 실행
npx prisma studio
```

브라우저에서 `http://localhost:5555` 접속

### 3. 데이터베이스 초기화

```powershell
cd server

# 데이터베이스 초기화 (모든 데이터 삭제 주의!)
npx prisma migrate reset
```

### 4. Prisma Client 재생성

스키마 변경 후 반드시 실행:

```powershell
npx prisma generate
```

---

## 트러블슈팅

### Docker 관련

#### 컨테이너가 시작되지 않을 때

```powershell
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs

# 컨테이너 재시작
docker-compose restart

# 이미지 재빌드
docker-compose build --no-cache
docker-compose up -d
```

#### 포트 충돌

```powershell
# 포트 사용 중인 프로세스 확인 (Windows)
netstat -ano | findstr :3306
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID> /F
```

### Prisma 관련

#### 마이그레이션 오류

```powershell
# Prisma Client 재생성
npx prisma generate

# 마이그레이션 초기화
npx prisma migrate reset

# 데이터베이스 재연결
npx prisma db pull
```

#### 연결 오류

- `.env` 파일의 `DATABASE_URL` 확인
- MySQL 서버 실행 확인
- 방화벽 설정 확인

### Angular 관련

#### 빌드 오류

```powershell
# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
npm install

# Angular 캐시 클리어
npx ng cache clean
```

#### SSR 실행 오류

```powershell
# 빌드 먼저 실행
npm run build:ssr

# 그 다음 SSR 실행
npm run serve:ssr
```

### NestJS 관련

#### 모듈을 찾을 수 없음

```powershell
# node_modules 재설치
Remove-Item -Recurse -Force node_modules
npm install

# Prisma Client 재생성
npx prisma generate
```

### Windows 특정 이슈

#### 파일 경로 오류

PowerShell에서 경로 구분자는 자동 처리되지만, 문제 발생 시:

```powershell
# 백슬래시 대신 슬래시 사용
cd /projects/normad-system/NestAngular
```

#### 권한 오류

PowerShell을 **관리자 권한**으로 실행

---

## 추가 리소스

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [Angular 공식 문서](https://angular.dev/)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Docker 공식 문서](https://docs.docker.com/)

---

## 다음 단계

1. [API 개발 가이드](./02-api-development.md)
2. [프론트엔드 개발 가이드](./03-frontend-development.md)
3. [배포 가이드](./04-deployment.md)
