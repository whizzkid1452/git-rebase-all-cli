# npm 2FA 설정 가이드

## 🔐 2단계 인증 (2FA) 설정하기

npm은 패키지 배포 시 보안을 위해 2FA를 요구합니다. 다음 방법 중 하나를 선택하세요.

### 방법 1: npm 웹사이트에서 2FA 활성화 (권장)

1. **npm 웹사이트 로그인**
   - https://www.npmjs.com/ 접속
   - 로그인

2. **2FA 설정**
   - 우측 상단 프로필 클릭 → "Account Settings"
   - "Two-Factor Authentication" 섹션으로 이동
   - "Enable 2FA" 클릭
   - 인증 앱(Google Authenticator, Authy 등)으로 QR 코드 스캔
   - 6자리 코드 입력하여 확인

3. **모드 선택**
   - **Authorization only**: 로그인 시에만 2FA 필요 (권장)
   - **Authorization and writes**: 로그인 및 배포 시 2FA 필요 (더 안전)

### 방법 2: Access Token 사용 (2FA 우회)

2FA를 설정하지 않고도 배포할 수 있는 방법입니다.

#### 1. npm 웹사이트에서 토큰 생성

1. https://www.npmjs.com/ 접속 → 로그인
2. 우측 상단 프로필 → "Access Tokens"
3. "Generate New Token" 클릭
4. 토큰 설정:
   - **Token name**: `git-rebase-all-cli-publish` (원하는 이름)
   - **Type**: **Granular Access Token** (권장) 또는 **Classic Token**
   - **Granular Token 설정**:
     - **Expiration**: 원하는 만료 기간
     - **Packages**: `git-rebase-all-cli` 선택
     - **Permissions**: `Read and Publish` 선택
     - **Automation**: 체크 (2FA 우회 가능)

5. "Generate Token" 클릭
6. **토큰 복사** (한 번만 보여줍니다!)

#### 2. 토큰으로 로그인

```bash
# 토큰으로 로그인
npm login --auth-type=legacy

# Username: npm 사용자명
# Password: (토큰을 입력)
# Email: npm 이메일
```

또는 `.npmrc` 파일에 직접 추가:

```bash
# Windows
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > %USERPROFILE%\.npmrc

# Mac/Linux
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > ~/.npmrc
```

#### 3. 배포

```bash
npm publish
```

---

## 🚨 현재 에러 해결 방법

현재 발생한 에러:

```
403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required
```

### 빠른 해결 (Access Token 사용)

1. **npm 웹사이트에서 토큰 생성**
   - https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - "Generate New Token" → "Granular Access Token"
   - **Automation** 체크 (중요!)

2. **토큰으로 로그인**

```bash
npm logout
npm login --auth-type=legacy
# Password에 토큰 입력
```

3. **다시 배포**

```bash
npm publish
```

---

## ✅ 2FA 설정 확인

현재 2FA 상태 확인:

```bash
npm profile get
```

또는 npm 웹사이트에서:

- https://www.npmjs.com/settings/YOUR_USERNAME/security

---

## 🔄 pnpm 사용 시

pnpm도 동일한 토큰을 사용합니다:

```bash
# 토큰으로 로그인
pnpm login --auth-type=legacy

# 또는 .npmrc에 직접 추가
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" > ~/.npmrc
```

---

## 💡 권장 방법

**개인 프로젝트**: Access Token (Automation 활성화)

- 설정이 간단
- 2FA 설정 불필요
- 자동화 스크립트에 사용 가능

**회사/팀 프로젝트**: 2FA 활성화

- 더 안전
- Authorization only 모드 권장

---

## 📝 참고

- [npm 2FA 문서](https://docs.npmjs.com/about-two-factor-authentication)
- [npm Access Tokens](https://docs.npmjs.com/about-access-tokens)
