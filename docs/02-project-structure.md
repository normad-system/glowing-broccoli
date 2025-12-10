# 프로젝트 구조 설명

## 전체 구조

```
NestAngular/
 ├── server/                    # Backend API 서버
 │   ├── src/                   # 소스 코드
 │   │   ├── modules/           # 도메인 모듈
 │   │   ├── app.module.ts      # 루트 모듈
 │   │   ├── app.controller.ts  # 루트 컨트롤러
 │   │   ├── app.service.ts     # 루트 서비스
 │   │   ├── main.ts            # 진입점
 │   │   └── prisma.service.ts  # Prisma 서비스
 │   ├── prisma/                # Prisma 설정
 │   │   └── schema.prisma      # 데이터베이스 스키마
 │   ├── test/                  # E2E 테스트
 │   ├── .env                   # 환경 변수
 │   ├── .env.example           # 환경 변수 예시
 │   ├── Dockerfile             # Docker 설정 (프로덕션)
 │   ├── Dockerfile.dev         # Docker 설정 (개발)
 │   ├── nest-cli.json          # NestJS CLI 설정
 │   ├── package.json           # 의존성 관리
 │   └── tsconfig.json          # TypeScript 설정
 │
 ├── client-fitsystem/          # 메인 클라이언트 (fit-system.net)
 │   ├── src/                   # 소스 코드
 │   │   ├── app/               # 앱 컴포넌트
 │   │   │   ├── app.ts         # 루트 컴포넌트
 │   │   │   ├── app.html       # 루트 템플릿
 │   │   │   ├── app.scss       # 루트 스타일
 │   │   │   ├── app.config.ts  # 앱 설정
 │   │   │   └── app.routes.ts  # 라우팅 설정
 │   │   ├── main.ts            # 클라이언트 진입점
 │   │   ├── main.server.ts     # 서버 진입점
 │   │   ├── server.ts          # SSR 서버
 │   │   ├── index.html         # HTML 템플릿
 │   │   └── styles.scss        # 글로벌 스타일
 │   ├── public/                # 정적 파일
 │   ├── .env                   # 환경 변수
 │   ├── Dockerfile             # Docker 설정 (프로덕션)
 │   ├── Dockerfile.dev         # Docker 설정 (개발)
 │   ├── angular.json           # Angular 설정
 │   ├── package.json           # 의존성 관리
 │   └── tsconfig.json          # TypeScript 설정
 │
 ├── client-math/               # 관리용 클라이언트
 │   ├── (client-fitsystem과 동일한 구조)
 │
 ├── docs/                      # 문서
 │   ├── 01-setup-guide.md      # 개발 환경 구축 가이드
 │   ├── 02-project-structure.md # 프로젝트 구조 설명
 │   ├── 03-api-development.md   # API 개발 가이드
 │   ├── 04-frontend-development.md # 프론트엔드 개발 가이드
 │   └── 05-deployment.md        # 배포 가이드
 │
 ├── docker-compose.yml         # Docker Compose 설정
 ├── package.json               # 루트 패키지 설정
 ├── .gitignore                 # Git 제외 파일
 └── README.md                  # 프로젝트 README
```

## 각 디렉토리 설명

### 1. server/ (NestJS Backend)

Backend API 서버로 NestJS 프레임워크를 사용합니다.

#### 주요 파일

- **src/main.ts**: 애플리케이션 진입점
- **src/app.module.ts**: 루트 모듈, 모든 모듈을 여기서 임포트
- **src/prisma.service.ts**: Prisma ORM 서비스
- **prisma/schema.prisma**: 데이터베이스 스키마 정의

#### 모듈 구조 (예시)

```
src/
 ├── modules/
 │   ├── users/
 │   │   ├── users.module.ts
 │   │   ├── users.controller.ts
 │   │   ├── users.service.ts
 │   │   └── dto/
 │   │       ├── create-user.dto.ts
 │   │       └── update-user.dto.ts
 │   ├── auth/
 │   └── posts/
```

### 2. client-fitsystem/ (Angular 21 SSR)

메인 클라이언트 애플리케이션입니다.

#### 주요 파일

- **src/main.ts**: 브라우저 진입점
- **src/main.server.ts**: SSR 서버 진입점
- **src/server.ts**: Express 서버 설정
- **src/app/app.config.ts**: 애플리케이션 설정
- **src/app/app.routes.ts**: 라우팅 설정

#### 컴포넌트 구조 (예시)

```
src/app/
 ├── pages/
 │   ├── home/
 │   │   ├── home.component.ts
 │   │   ├── home.component.html
 │   │   └── home.component.scss
 │   ├── about/
 │   └── contact/
 ├── shared/
 │   ├── components/
 │   │   ├── header/
 │   │   ├── footer/
 │   │   └── sidebar/
 │   ├── services/
 │   │   ├── api.service.ts
 │   │   └── auth.service.ts
 │   └── models/
 │       └── user.model.ts
```

### 3. client-math/ (Angular 21 SSR)

관리용 클라이언트로 client-fitsystem과 동일한 구조입니다.

### 4. docs/

프로젝트 문서가 저장되는 곳입니다.

---

## 데이터 흐름

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ HTTP Request
       ↓
┌──────────────┐      ┌──────────────┐
│   Angular    │◄────►│  Express SSR │
│   Client     │      │    Server    │
└──────┬───────┘      └──────────────┘
       │
       │ API Call
       ↓
┌──────────────┐
│    NestJS    │
│    Server    │
└──────┬───────┘
       │
       │ Prisma ORM
       ↓
┌──────────────┐
│    MySQL     │
│   Database   │
└──────────────┘
```

---

## 독립 실행 가능 구조

이 프로젝트는 Monorepo이지만 각 프로젝트는 완전히 독립적으로 실행 가능합니다.

### 개별 프로젝트 실행

```powershell
# Server만 실행
cd server
npm install
npm run start:dev

# Client FitSystem만 실행
cd client-fitsystem
npm install
npm run build:ssr
npm run serve:ssr

# Client Math만 실행
cd client-math
npm install
npm run build:ssr
npm run serve:ssr
```

### 공유 라이브러리 없음

- NX와 달리 공유 라이브러리가 없습니다
- 각 프로젝트는 자체 `node_modules`를 가집니다
- 프로젝트 간 의존성이 없어 관리가 단순합니다

---

## 환경 변수 관리

### Server (.env)

```env
DATABASE_URL="mysql://fitsystem:fitsystem123@localhost:3306/fitsystem"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
```

### Client (.env)

```env
API_URL=http://localhost:3000
ENVIRONMENT=development
```

### Docker Compose

`docker-compose.yml`에서 환경 변수를 직접 설정:

```yaml
environment:
  DATABASE_URL: mysql://fitsystem:fitsystem123@mysql:3306/fitsystem
  NODE_ENV: development
```

---

## 빌드 결과물

### Server

```
server/dist/
 ├── src/
 │   ├── main.js
 │   ├── app.module.js
 │   └── ...
 └── prisma/
     └── (Prisma Client)
```

### Client

```
client-fitsystem/dist/
 ├── browser/              # 클라이언트 번들
 │   ├── index.html
 │   ├── main-*.js
 │   └── ...
 └── server/               # SSR 서버 번들
     └── server.mjs
```

---

## 개발 vs 프로덕션

### 개발 환경

- 핫 리로드 활성화
- Source maps 포함
- 개발 도구 활성화
- 최적화 비활성화

### 프로덕션 환경

- 코드 최소화
- Tree shaking
- AOT 컴파일
- Source maps 제거
- 최적화 활성화

---

## 포트 구성

| 서비스 | 포트 | 용도 |
|--------|------|------|
| MySQL | 3306 | 데이터베이스 |
| NestJS Server | 3000 | Backend API |
| Client FitSystem | 4200 | 메인 클라이언트 |
| Client Math | 4300 | 관리용 클라이언트 |
| Prisma Studio | 5555 | 데이터베이스 GUI |

---

## 다음 단계

1. [API 개발 시작하기](./03-api-development.md)
2. [프론트엔드 개발 시작하기](./04-frontend-development.md)
