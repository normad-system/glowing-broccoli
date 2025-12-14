# macOS 환경 구축 가이드

> **대상**: macOS 사용자를 위한 FitSystem Monorepo 개발 환경 구축 가이드

---

## 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [Homebrew 설치](#homebrew-설치)
3. [Node.js 설치](#nodejs-설치)
4. [MySQL 설치 및 설정](#mysql-설치-및-설정)
5. [프로젝트 클론 및 초기 설정](#프로젝트-클론-및-초기-설정)
6. [백엔드 (NestJS) 설치 및 실행](#백엔드-nestjs-설치-및-실행)
7. [프론트엔드 (Angular) 설치 및 실행](#프론트엔드-angular-설치-및-실행)
8. [Docker 환경 (선택사항)](#docker-환경-선택사항)
9. [문제 해결](#문제-해결)

---

## 시스템 요구사항

- macOS 10.15 (Catalina) 이상
- 최소 8GB RAM (16GB 권장)
- 최소 10GB 여유 디스크 공간
- 인터넷 연결

---

## Homebrew 설치

Homebrew는 macOS용 패키지 매니저입니다.

### 1. Homebrew 설치

터미널을 열고 다음 명령어 실행:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. PATH 설정 (Apple Silicon Mac의 경우)

M1/M2/M3 Mac을 사용하는 경우:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

### 3. 설치 확인

```bash
brew --version
```

예상 출력: `Homebrew 4.x.x`

---

## Node.js 설치

### 방법 1: Homebrew로 설치 (권장)

```bash
# Node.js LTS 버전 설치
brew install node@20

# PATH 설정
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 방법 2: nvm으로 설치 (여러 버전 관리 필요 시)

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 또는
source ~/.zshrc

# Node.js 20 설치
nvm install 20
nvm use 20
nvm alias default 20
```

### 설치 확인

```bash
node --version   # v20.x.x 이상
npm --version    # 10.x.x 이상
```

### 전역 CLI 도구 설치

```bash
# NestJS CLI
npm install -g @nestjs/cli

# Angular CLI
npm install -g @angular/cli

# Prisma CLI
npm install -g prisma
```

---

## MySQL 설치 및 설정

### 1. MySQL 설치

```bash
# MySQL 8.0 설치
brew install mysql

# MySQL 서비스 시작
brew services start mysql
```

### 2. MySQL 보안 설정 (선택사항)

MySQL을 처음 설치하면 root 비밀번호가 설정되어 있지 않습니다. 보안을 강화하려면:

```bash
# 보안 설정 스크립트 실행
mysql_secure_installation
```

설정 질문에 대한 답변:
- **Root 비밀번호 설정?** Yes → 원하는 비밀번호 입력 (예: `0505`)
- **익명 사용자 제거?** Yes
- **원격 root 로그인 차단?** Yes
- **test 데이터베이스 제거?** Yes
- **권한 테이블 다시 로드?** Yes

**💡 팁**: 개발 환경이라면 이 단계를 건너뛰고 비밀번호 없이 사용해도 됩니다.

### 3. MySQL 접속 확인

```bash
mysql -u root -p
```

비밀번호 입력: 설정한 비밀번호 입력 (또는 설정하지 않았다면 Enter)

**성공 시 출력**:
```
Welcome to the MySQL monitor...
Type 'help;' or '\h' for help.
mysql>
```

### 4. 데이터베이스 및 사용자 생성

MySQL 프롬프트에서:

```sql
CREATE DATABASE fitsystem;
CREATE USER 'fitsystem'@'localhost' IDENTIFIED BY 'fitsystem123';
GRANT ALL PRIVILEGES ON *.* TO 'fitsystem'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

**⚠️ 중요**: Prisma는 마이그레이션 시 shadow database를 생성하므로 `*.*`(모든 데이터베이스)에 대한 권한이 필요합니다.

**권한 설명**:
- `GRANT ALL PRIVILEGES ON *.*`: 모든 데이터베이스에 대한 전체 권한
- `WITH GRANT OPTION`: 다른 사용자에게 권한 부여 가능 (개발 환경용)
- Shadow database는 임시로 생성되었다가 자동으로 삭제됩니다

### 5. 연결 테스트

```bash
mysql -u fitsystem -p fitsystem
```

비밀번호: `fitsystem123`

접속 성공하면 `EXIT;`로 나가기

### MySQL 명령어

```bash
# MySQL 시작
brew services start mysql

# MySQL 중지
brew services stop mysql

# MySQL 재시작
brew services restart mysql

# MySQL 상태 확인
brew services list | grep mysql
```

---

## 프로젝트 클론 및 초기 설정

### 1. 프로젝트 디렉토리로 이동

```bash
cd ~/source/normad-system/glowing-broccoli
```

또는 원하는 위치에 클론:

```bash
# Git 클론 (이미 클론했다면 생략)
cd ~/source
mkdir -p normad-system
cd normad-system
git clone <repository-url> glowing-broccoli
cd glowing-broccoli
```

### 2. 프로젝트 구조 확인

```bash
ls -la
```

예상 출력:
```
client-fitsystem/
client-math/
server/
docs/
docker-compose.yml
package.json
README.md
```

### 3. 루트 의존성 설치 (선택사항)

```bash
npm install
```

---

## 백엔드 (NestJS) 설치 및 실행

### 1. 서버 디렉토리로 이동

```bash
cd server
```

### 2. 의존성 설치

```bash
npm install
```

⏳ 설치 시간: 약 2-3분

**💡 Prisma 7.x 주의사항**: 
이 프로젝트는 Prisma 7.x를 사용하며, MySQL 연결을 위해 `@prisma/adapter-mariadb` adapter가 필요합니다. 이미 package.json에 포함되어 있어 자동으로 설치됩니다.

### 3. 환경 변수 설정

`.env` 파일 생성:

```bash
cat > .env << EOF
DATABASE_URL="mysql://fitsystem:fitsystem123@localhost:3306/fitsystem"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
EOF
```

### 4. Prisma Client 생성

```bash
npx prisma generate
```

### 5. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev --name init_blog_system
```

**예상 출력**:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "fitsystem" at "localhost:3306"

Applying migration `20241214123256_init_blog_system`
...
Your database is now in sync with your schema.
```

**⚠️ 문제 발생 시**: 
- Shadow database 권한 오류가 발생하면 [문제 해결 섹션의 문제 7](#문제-7-prisma-shadow-database-권한-오류-p3014-p1010) 참고
- `fitsystem` 사용자에게 모든 데이터베이스에 대한 권한이 필요합니다

### 6. 시드 데이터 입력 (선택사항)

```bash
npm run prisma:seed
```

**예상 출력**:
```
🚀 Starting database seeding...

🌱 Seeding users...
✅ Admin user created: admin@fitsystem.com
✨ Users seeded successfully!

🌱 Seeding categories...
✅ Category "Tutorials" created/updated
...
🎉 All seeds completed successfully!
```

이 명령어로 생성되는 데이터:
- 7개 카테고리 (튜토리얼, Git, 웹보안, Azure, AWS, 기술이슈, 성능최적화)
- 관리자 계정 (admin@fitsystem.com / admin123)

**💡 Prisma 7.x 참고**: 
- 시드 스크립트는 `@prisma/adapter-mariadb`를 사용하여 MySQL에 연결합니다
- `prisma/seed.ts` 파일에서 adapter 설정을 확인할 수 있습니다

### 7. 개발 서버 실행

```bash
npm run start:dev
```

✅ **성공 메시지:**
```
[Nest] 12345  - 12/14/2025, 10:00:00 AM     LOG [NestApplication] Nest application successfully started +2ms
```

🌐 **백엔드 접속:** http://localhost:3000/api

⚠️ **이 터미널은 실행 중으로 유지**

### 8. API 테스트

새 터미널에서:

```bash
curl http://localhost:3000/api/categories
```

또는 브라우저에서 http://localhost:3000/api/categories 접속

---

## 프론트엔드 (Angular) 설치 및 실행

### 1. 새 터미널 탭/윈도우 열기

- `Command + T` (새 탭)
- 또는 `Command + N` (새 윈도우)

### 2. 클라이언트 디렉토리로 이동

```bash
cd ~/source/normad-system/glowing-broccoli/client-fitsystem
```

### 3. 의존성 설치

```bash
npm install
```

⏳ 설치 시간: 약 2-3분

### 4. 환경 변수 설정 (선택사항)

`.env` 파일 생성:

```bash
cat > .env << EOF
API_URL=http://localhost:3000
EOF
```

### 5. 개발 서버 실행

```bash
npm start
```

또는 SSR 빌드 후 실행:

```bash
# SSR 빌드
npm run build:ssr

# SSR 서버 실행
npm run serve:ssr
```

✅ **성공 메시지:**
```
Angular Live Development Server is listening on localhost:4200
```

🌐 **프론트엔드 접속:** http://localhost:4200

⚠️ **이 터미널도 실행 중으로 유지**

---

## 전체 실행 요약

### 터미널 1: MySQL (백그라운드 실행)

```bash
brew services start mysql
```

### 터미널 2: Backend Server

```bash
cd ~/source/normad-system/glowing-broccoli/server
npm run start:dev
```

### 터미널 3: Frontend Client

```bash
cd ~/source/normad-system/glowing-broccoli/client-fitsystem
npm start
```

### 접속 URL

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Prisma Studio**: http://localhost:5555 (실행 시: `npx prisma studio`)

---

## Docker 환경 (선택사항)

Docker를 사용하면 MySQL, Backend, Frontend를 컨테이너로 실행할 수 있습니다.

### 1. Docker Desktop 설치

공식 사이트에서 다운로드:
```
https://www.docker.com/products/docker-desktop/
```

또는 Homebrew로 설치:

```bash
brew install --cask docker
```

### 2. Docker Desktop 실행

Applications 폴더에서 Docker 앱 실행

### 3. 설치 확인

```bash
docker --version
docker-compose --version
```

### 4. Docker Compose로 전체 실행

프로젝트 루트에서:

```bash
cd ~/source/normad-system/glowing-broccoli

# 전체 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f server

# 서비스 중지
docker-compose down
```

### Docker 명령어

```bash
# 컨테이너 상태 확인
docker-compose ps

# 특정 서비스 재시작
docker-compose restart server

# 이미지 재빌드
docker-compose build --no-cache

# 볼륨 포함 완전 삭제
docker-compose down -v
```

---

## 문제 해결

### 문제 1: "command not found: brew"

**원인**: Homebrew PATH 설정이 안 됨

**해결**:

```bash
# Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc

# Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

### 문제 2: MySQL 연결 오류 "Can't connect to local MySQL server"

**해결**:

```bash
# MySQL 상태 확인
brew services list | grep mysql

# MySQL 시작
brew services start mysql

# MySQL 재시작
brew services restart mysql

# 소켓 파일 확인
ls -la /tmp/mysql.sock
```

### 문제 3: 포트 충돌

#### 포트 3000 사용 중

```bash
# 포트 사용 프로세스 확인
lsof -i :3000

# 프로세스 종료 (PID 확인 후)
kill -9 <PID>
```

#### 포트 4200 사용 중

```bash
# 포트 사용 프로세스 확인
lsof -i :4200

# 다른 포트로 실행
npm start -- --port 4201
```

### 문제 4: "gyp ERR!" 빌드 오류

**원인**: Native 모듈 빌드에 필요한 도구 부족

**해결**:

```bash
# Xcode Command Line Tools 설치
xcode-select --install

# node-gyp 재설치
npm install -g node-gyp
```

### 문제 5: Prisma 7.x "PrismaClientInitializationError"

**에러 메시지**:
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

**원인**: Prisma 7.x에서는 MySQL 연결 시 adapter가 필수입니다

**해결**:

```bash
cd server

# MariaDB adapter 설치 (MySQL 호환)
npm install @prisma/adapter-mariadb mariadb

# Prisma Client 재생성
npx prisma generate

# 시드 재실행
npm run prisma:seed
```

**코드 예시** (`prisma/seed.ts`):
```typescript
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'fitsystem',
  password: 'fitsystem123',
  database: 'fitsystem',
  port: 3306,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });
```

**참고**:
- Prisma 7.x는 driver adapter를 통한 연결만 지원합니다
- MySQL/MariaDB: `@prisma/adapter-mariadb`
- PostgreSQL: `@prisma/adapter-pg`
- 자세한 내용: https://www.prisma.io/docs/orm/overview/databases

### 문제 6: 권한 오류 "EACCES"

**해결**:

```bash
# npm 글로벌 디렉토리 권한 변경
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /opt/homebrew/lib/node_modules  # Apple Silicon
sudo chown -R $(whoami) /usr/local/lib/node_modules      # Intel Mac

# 또는 nvm 사용 (권장)
```

### 문제 7: "Prisma Client did not initialize yet"

**해결**:

```bash
cd server

# Prisma Client 재생성
npx prisma generate

# 마이그레이션 재실행
npx prisma migrate dev
```

### 문제 8: Prisma Shadow Database 권한 오류 (P3014, P1010)

**에러 메시지**:
```
Error: P3014
Prisma Migrate could not create the shadow database.
User was denied access on the database `prisma_migrate_shadow_db_...`
```

**원인**: Prisma는 마이그레이션을 안전하게 수행하기 위해 임시 shadow database를 생성하는데, 사용자에게 데이터베이스 생성 권한이 없음

**해결 방법 1**: 전체 권한 부여 (개발 환경 권장)

```bash
# MySQL root로 접속
mysql -u root -p

# fitsystem 사용자에게 전체 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'fitsystem'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

**해결 방법 2**: Shadow database 직접 지정

`server/.env` 파일에 추가:
```env
DATABASE_URL="mysql://fitsystem:fitsystem123@localhost:3306/fitsystem"
SHADOW_DATABASE_URL="mysql://fitsystem:fitsystem123@localhost:3306/fitsystem_shadow"
```

그리고 shadow database 생성:
```bash
mysql -u root -p -e "CREATE DATABASE fitsystem_shadow;"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON fitsystem_shadow.* TO 'fitsystem'@'localhost';"
```

**참고**: 
- 개발 환경에서는 방법 1 (전체 권한) 권장
- 프로덕션에서는 방법 2 (명시적 shadow database) 권장
- Shadow database는 마이그레이션 완료 후 자동 삭제됨

### 문제 9: Angular 빌드 오류

**해결**:

```bash
cd client-fitsystem

# node_modules 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install

# Angular 캐시 클리어
npx ng cache clean

# 빌드 재시도
npm run build
```

### 문제 10: Docker 권한 오류

**해결**:

```bash
# Docker Desktop이 실행 중인지 확인
# Applications에서 Docker 앱 실행

# Docker 소켓 권한 확인
sudo chmod 666 /var/run/docker.sock
```

---

## 유용한 macOS 명령어

### 프로세스 관리

```bash
# 포트 사용 프로세스 확인
lsof -i :3000
lsof -i :4200

# 프로세스 종료
kill -9 <PID>

# 모든 Node.js 프로세스 종료
killall node
```

### 파일 및 디렉토리

```bash
# 숨김 파일 표시 (Finder)
defaults write com.apple.finder AppleShowAllFiles TRUE
killall Finder

# 디렉토리 크기 확인
du -sh *

# 디스크 사용량 확인
df -h
```

### 로그 확인

```bash
# 시스템 로그
log show --predicate 'process == "node"' --last 1h

# 특정 앱 로그
tail -f ~/Library/Logs/...
```

---

## VS Code 설정 (권장)

### 1. VS Code 설치

```bash
brew install --cask visual-studio-code
```

### 2. 명령줄에서 VS Code 열기

```bash
# PATH 설정
cat << EOF >> ~/.zshrc
# VS Code
export PATH="\$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
EOF

source ~/.zshrc

# 프로젝트 열기
cd ~/source/normad-system/glowing-broccoli
code .
```

### 3. 권장 확장 프로그램

VS Code에서 설치:

- **필수**
  - Prisma
  - Angular Language Service
  - ESLint
  - Prettier - Code formatter

- **권장**
  - GitLens
  - Thunder Client (API 테스트)
  - Docker
  - MySQL (cweijan.vscode-mysql-client2)

---

## 개발 워크플로우

### 일반적인 작업 흐름

```bash
# 1. MySQL 시작 (한 번만)
brew services start mysql

# 2. 프로젝트 디렉토리로 이동
cd ~/source/normad-system/glowing-broccoli

# 3. Backend 실행 (터미널 1)
cd server
npm run start:dev

# 4. Frontend 실행 (터미널 2)
cd client-fitsystem
npm start

# 5. 브라우저에서 확인
# http://localhost:4200
```

### Git 워크플로우

```bash
# 현재 브랜치 확인
git branch

# 새 브랜치 생성
git checkout -b feature/new-feature

# 변경사항 확인
git status

# 커밋
git add .
git commit -m "feat: add new feature"

# 푸시
git push origin feature/new-feature
```

---

## 성능 최적화 팁

### 1. npm 속도 향상

```bash
# npm 캐시 확인
npm cache verify

# 레지스트리 변경 (한국 사용자)
npm config set registry https://registry.npmjs.org/
```

### 2. Zsh 성능 향상

```bash
# .zshrc 최적화
# 불필요한 플러그인 제거
# lazy loading 사용
```

### 3. Node.js 메모리 증가

```bash
# package.json scripts에 추가
"start": "node --max-old-space-size=4096 dist/main.js"
```

---

## 체크리스트

설치 완료 후 확인:

- [ ] Homebrew 설치 확인
- [ ] Node.js 20.x 이상 설치
- [ ] MySQL 8.0 실행 중
- [ ] fitsystem 데이터베이스 생성
- [ ] Backend 서버 실행 (http://localhost:3000)
- [ ] Frontend 실행 (http://localhost:4200)
- [ ] API 응답 확인 (http://localhost:3000/api/categories)
- [ ] 프론트엔드 렌더링 확인
- [ ] 언어 전환 테스트 (KO/EN/JA)

---

## 다음 단계

1. **코드 탐색**: VS Code로 프로젝트 구조 파악
2. **API 개발**: [docs/03-api-development.md](./03-api-development.md) 참고
3. **컴포넌트 개발**: Angular 컴포넌트 생성 및 수정
4. **데이터베이스**: Prisma Studio로 데이터 관리

---

## 추가 리소스

### macOS 개발 환경

- [Homebrew 공식 문서](https://brew.sh/)
- [macOS 터미널 가이드](https://support.apple.com/guide/terminal/welcome/mac)
- [Zsh 설정 가이드](https://github.com/ohmyzsh/ohmyzsh)

### 프로젝트 문서

- [프로젝트 구조](./02-project-structure.md)
- [API 개발 가이드](./03-api-development.md)
- [컴포넌트 가이드](../COMPONENTS.md)

---

## 문의

문제가 발생하거나 도움이 필요한 경우:

1. 이 문서의 "문제 해결" 섹션 확인
2. 에러 메시지와 함께 로그 확인
3. GitHub Issues에 질문 등록

---

**🎉 macOS에서 개발 환경 구축이 완료되었습니다!**

Happy Coding! 🚀
