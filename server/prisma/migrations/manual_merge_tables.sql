-- 1. Customer 테이블의 데이터를 User 테이블로 마이그레이션
INSERT INTO User (email, password, name, phoneNumber, address, profileImage, isActive, lastLoginAt, createdAt, updatedAt, role)
SELECT email, password, name, phoneNumber, address, profileImage, isActive, lastLoginAt, createdAt, updatedAt, 'CUSTOMER'
FROM Customer
WHERE email NOT IN (SELECT email FROM User);

-- 2. User 테이블에 새 컬럼 추가
ALTER TABLE User 
  ADD COLUMN IF NOT EXISTS phoneNumber VARCHAR(191),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS profileImage VARCHAR(191),
  ADD COLUMN IF NOT EXISTS isActive BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS lastLoginAt DATETIME(3);

-- 3. Role enum 업데이트 (기존 값 유지)
ALTER TABLE User MODIFY COLUMN role ENUM('CUSTOMER', 'EDITOR', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- 4. 인덱스 추가
CREATE INDEX IF NOT EXISTS User_role_idx ON User(role);
CREATE INDEX IF NOT EXISTS User_isActive_idx ON User(isActive);

-- 5. Customer 테이블 삭제
DROP TABLE IF EXISTS Customer;
