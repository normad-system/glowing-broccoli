# FitSystem Monorepo

독립적으로 구성된 Monorepo 프로젝트입니다.

## 프로젝트 구조

```
root/
 ├── server/              # NestJS + Prisma + MySQL API 서버
 ├── client-fitsystem/    # Angular 21 SSR 클라이언트 (fit-system.net)
 └── client-math/         # Angular 21 SSR 관리용 클라이언트
```

## 기술 스택

### Server
- **NestJS** - Node.js 프레임워크
- **Prisma** - ORM
- **MySQL 8.0** - 데이터베이스
- **TypeScript**

### Clients
- **Angular 21** - SSR (Angular Universal)
- **Vite** - 빌드 도구
- **TypeScript**

## 필수 도구

- Node.js LTS (v18 이상)
- pnpm (권장) 또는 npm
- Docker Desktop
- Prisma CLI
- Nest CLI
- Angular CLI

## 설치 방법

### 1. 전체 도구 설치

```bash
# pnpm 설치 (권장)
npm install -g pnpm

# CLI 도구 설치
pnpm install -g @nestjs/cli @angular/cli prisma
```

### 2. 각 프로젝트 의존성 설치

```bash
# Server
cd server
pnpm install

# Client FitSystem
cd ../client-fitsystem
pnpm install

# Client Math
cd ../client-math
pnpm install
```

## 로컬 개발 실행

### 방법 1: Docker Compose 사용 (권장)

루트 디렉토리에서:

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

접속 URL:
- MySQL: `localhost:3306`
- Server API: `http://localhost:3000`
- Client FitSystem: `http://localhost:4200`
- Client Math: `http://localhost:4300`

### 방법 2: 개별 실행

#### Server

```bash
cd server

# Prisma 설정
pnpm prisma generate
pnpm prisma migrate dev

# 개발 서버 실행
pnpm start:dev
```

#### Client FitSystem

```bash
cd client-fitsystem

# SSR 개발 서버 실행
pnpm serve:ssr
```

#### Client Math

```bash
cd client-math

# SSR 개발 서버 실행
pnpm serve:ssr
```

## 데이터베이스 관리

```bash
cd server

# Prisma Studio 실행 (GUI)
pnpm prisma studio

# 마이그레이션 생성
pnpm prisma migrate dev --name init

# 마이그레이션 적용
pnpm prisma migrate deploy
```

## 프로덕션 빌드

### Server

```bash
cd server
pnpm build
pnpm start:prod
```

### Clients

```bash
cd client-fitsystem
pnpm build:ssr

cd ../client-math
pnpm build:ssr
```

## Windows / Mac 호환성

이 프로젝트는 Windows와 macOS 모두에서 동일하게 작동합니다.
- Docker Desktop이 설치되어 있으면 동일한 명령어로 실행 가능
- 경로 구분자는 자동으로 처리됨

## 트러블슈팅

### Docker 관련

```bash
# 컨테이너 재시작
docker-compose restart

# 볼륨 포함 완전 삭제 후 재시작
docker-compose down -v
docker-compose up -d
```

### Prisma 관련

```bash
# Prisma Client 재생성
cd server
pnpm prisma generate

# 데이터베이스 초기화
pnpm prisma migrate reset
```

## 라이선스

MIT
