# 🚀 지금 바로 시작하기

> **현재 상태**: Docker 미설치, MySQL 필요, 백엔드/프론트엔드 미실행

---

## ✅ 체크리스트

- [ ] MySQL 8.0 설치
- [ ] 데이터베이스 생성
- [ ] 백엔드 설치 및 실행
- [ ] 프론트엔드 설치 및 실행
- [ ] 브라우저에서 확인

---

## 📝 단계별 실행 가이드

### ⭐ STEP 1: MySQL 설치 (약 10분)

#### 1-1. MySQL Installer 다운로드
```
https://dev.mysql.com/downloads/installer/
```
- "Windows (x86, 32-bit), MSI Installer" 다운로드
- 용량 큰 것 선택 (mysql-installer-community-8.x.x.msi)

#### 1-2. MySQL 설치
1. 다운로드한 파일 실행
2. Setup Type: **Developer Default** 선택
3. Check Requirements: 모두 Next
4. Installation: Execute 클릭
5. Product Configuration:
   - Type and Networking: 기본값 (Port 3306)
   - Authentication Method: 기본값 선택
   - **Root Password 설정**: `rootpassword` (또는 원하는 비밀번호)
   - MySQL User Accounts: Skip
6. Windows Service: 기본값으로 Next
7. Apply Configuration: Execute
8. Finish

#### 1-3. 설치 확인
PowerShell에서 실행:
```powershell
mysql --version
```

---

### ⭐ STEP 2: 데이터베이스 생성 (약 2분)

#### 2-1. MySQL 접속
PowerShell에서:
```powershell
mysql -u root -p
```
- 비밀번호 입력: `rootpassword` (또는 설정한 비밀번호)

#### 2-2. 데이터베이스 및 사용자 생성
MySQL 프롬프트에서 실행:
```sql
CREATE DATABASE fitsystem;
CREATE USER 'fitsystem'@'localhost' IDENTIFIED BY 'fitsystem123';
GRANT ALL PRIVILEGES ON fitsystem.* TO 'fitsystem'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2-3. 연결 테스트
```powershell
mysql -u fitsystem -p fitsystem
```
- 비밀번호: `fitsystem123`
- 접속 성공하면 `EXIT;`로 나가기

---

### ⭐ STEP 3: 백엔드 설치 및 실행 (약 5분)

#### 3-1. 서버 디렉토리로 이동
```powershell
cd C:\projects\normad-system\NestAngular\server
```

#### 3-2. 의존성 설치
```powershell
npm install
```
⏳ 설치 완료까지 약 2-3분 소요

#### 3-3. Prisma Client 생성
```powershell
npx prisma generate
```

#### 3-4. 데이터베이스 마이그레이션 (테이블 생성)
```powershell
npx prisma migrate dev --name init_blog_system
```

#### 3-5. 시드 데이터 입력 (초기 데이터)
```powershell
npm run prisma:seed
```

이제 다음 정보가 데이터베이스에 생성됩니다:
- 7개 카테고리 (튜토리얼, Git, 웹보안, Azure, AWS, 기술이슈, 성능최적화)
- 관리자 계정 (admin@normad-system.com / admin123)

#### 3-6. 백엔드 서버 실행
```powershell
npm run start:dev
```

✅ **성공 메시지 확인:**
```
Nest application successfully started
```

🌐 **백엔드 API 접속:** http://localhost:3000/api

⚠️ **이 터미널은 닫지 말고 그대로 두세요!**

---

### ⭐ STEP 4: 프론트엔드 설치 및 실행 (약 3분)

#### 4-1. 새 PowerShell 터미널 열기
- Windows 키 + X → "Windows PowerShell" 또는 "Terminal"

#### 4-2. 클라이언트 디렉토리로 이동
```powershell
cd C:\projects\normad-system\NestAngular\client-fitsystem
```

#### 4-3. 의존성 설치
```powershell
npm install
```
⏳ 설치 완료까지 약 2-3분 소요

#### 4-4. 개발 서버 실행
```powershell
npm start
```

✅ **성공 메시지 확인:**
```
Angular Live Development Server is listening on localhost:4200
```

🌐 **프론트엔드 접속:** http://localhost:4200

⚠️ **이 터미널도 닫지 말고 그대로 두세요!**

---

## 🎉 완료 확인

### 1. 백엔드 API 확인
브라우저에서 열기: http://localhost:3000/api/categories

**예상 결과:**
```json
[
  {
    "id": 1,
    "slug": "tutorials",
    "nameKo": "튜토리얼",
    "nameEn": "Tutorials",
    "icon": "📚",
    ...
  }
]
```

### 2. 프론트엔드 확인
브라우저에서 열기: http://localhost:4200

**예상 화면:**
- 헤더: FitSystem 로고, 네비게이션, 언어 선택기
- 히어로 섹션: "혁신적인 웹 시스템 개발"
- 카테고리 그리드: 7개 카테고리 카드
- 푸터: 회사 정보

### 3. 언어 전환 테스트
- 우측 상단 언어 선택기 클릭
- KO → EN → JA 전환 확인

---

## 🛠️ 문제 해결

### 문제 1: "mysql 명령을 찾을 수 없습니다"
**해결:**
1. MySQL 설치 경로를 환경 변수에 추가
2. 보통: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
3. 시스템 환경 변수 → Path → 편집 → 새로 만들기 → 경로 추가

### 문제 2: "P1001: Can't reach database server"
**해결:**
1. MySQL 서비스 실행 확인:
   ```powershell
   Get-Service -Name MySQL80
   ```
2. 실행 안 됐으면:
   ```powershell
   Start-Service -Name MySQL80
   ```

### 문제 3: "포트 3000이 이미 사용 중"
**해결:**
```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :3000

# 프로세스 종료 (PID 확인 후)
taskkill /PID <PID번호> /F
```

### 문제 4: "포트 4200이 이미 사용 중"
**해결:**
```powershell
# 다른 포트로 실행
npm start -- --port 4201
```

### 문제 5: "npm install 중 에러"
**해결:**
```powershell
# npm 캐시 클리어
npm cache clean --force

# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📱 주요 페이지

설치 완료 후 이 페이지들을 확인하세요:

| 페이지 | URL | 설명 |
|--------|-----|------|
| 홈 | http://localhost:4200 | 메인 페이지 |
| 블로그 목록 | http://localhost:4200/blog | 전체 블로그 글 |
| 카테고리 | http://localhost:4200/category/tutorials | 튜토리얼 카테고리 |
| 회사 소개 | http://localhost:4200/about | 회사 정보 |
| 문의하기 | http://localhost:4200/contact | 연락처 폼 |
| API 문서 | http://localhost:3000/api | REST API |
| Prisma Studio | http://localhost:5555 | DB 관리 GUI |

---

## 🔑 기본 계정 정보

### 관리자 계정
- **이메일:** admin@normad-system.com
- **비밀번호:** admin123

⚠️ **주의:** 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!

---

## 📂 다음 단계

설치가 완료되면 이 문서들을 참고하세요:

1. **COMPONENTS.md** - 만든 컴포넌트 상세 설명
2. **SETUP.md** - 전체 설정 가이드
3. **docs/01-setup-guide.md** - 상세 개발 환경 구축
4. **docs/03-api-development.md** - API 개발 가이드

---

## 🎯 개발 시작

### 백엔드 개발
```powershell
cd C:\projects\normad-system\NestAngular\server

# 새 모듈 생성
nest g module modules/comments
nest g controller modules/comments
nest g service modules/comments

# Prisma Studio (DB GUI) 열기
npx prisma studio
```

### 프론트엔드 개발
```powershell
cd C:\projects\normad-system\NestAngular\client-fitsystem

# 새 컴포넌트 생성
ng generate component pages/admin

# 빌드
npm run build
```

---

## 💡 유용한 명령어

### 백엔드 (server/)
```powershell
npm run start:dev      # 개발 모드 실행
npm run start:prod     # 프로덕션 모드 실행
npm run test           # 테스트 실행
npx prisma studio      # DB GUI 열기
npx prisma migrate dev # 마이그레이션 생성
npx prisma generate    # Client 재생성
```

### 프론트엔드 (client-fitsystem/)
```powershell
npm start              # 개발 서버 실행
npm run build          # 프로덕션 빌드
npm run build:ssr      # SSR 빌드
npm test               # 테스트 실행
ng generate component  # 컴포넌트 생성
```

---

## 📞 도움이 필요하신가요?

문제가 발생하면:
1. 에러 메시지를 정확히 확인
2. 위 "문제 해결" 섹션 참고
3. GitHub Issues에 질문 등록

---

**🎊 축하합니다! 이제 개발을 시작할 준비가 되었습니다!**
