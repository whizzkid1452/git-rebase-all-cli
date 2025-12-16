# npm 배포 가이드

## 📦 npm에 패키지 배포하기

### 1단계: npm 계정 준비

npm 계정이 없으면 먼저 생성하세요:

```bash
# npm 웹사이트에서 계정 생성
# https://www.npmjs.com/signup
```

그 다음 로그인:

```bash
npm login
```

사용자명, 비밀번호, 이메일을 입력하세요.

### 2단계: 패키지 이름 확인 및 수정

현재 패키지 이름이 `git-rebase-all-cli`입니다. npm에 이미 존재하는지 확인:

```bash
npm search git-rebase-all-cli
```

**이미 존재하는 경우:**

`package.json`의 `name`을 고유한 이름으로 변경하세요:

```json
{
  "name": "@yourusername/git-rebase-all-cli",
  // 또는
  "name": "yourusername-git-rebase-all-cli"
}
```

**스코프 패키지 사용 시 (`@yourusername/...`):**

공개 배포하려면:

```bash
npm publish --access public
```

### 3단계: package.json 정보 업데이트

`package.json`의 다음 항목들을 실제 정보로 수정하세요:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/git-rebase-all-cli.git"
  }
}
```

### 4단계: 빌드 및 테스트

```bash
cd git-rebase-all-cli

# 의존성 설치
npm install

# 빌드
npm run build

# 빌드 결과 확인
ls dist/
# dist/cli.js 파일이 있어야 합니다
```

### 5단계: 배포 전 확인

배포할 파일만 포함되는지 확인:

```bash
npm pack --dry-run
```

이 명령은 실제로 배포하지 않고 어떤 파일이 포함될지 보여줍니다.

### 6단계: npm에 배포

```bash
npm publish
```

**스코프 패키지인 경우:**

```bash
npm publish --access public
```

### 7단계: 배포 확인

배포가 성공했는지 확인:

```bash
npm view git-rebase-all-cli
```

또는 npm 웹사이트에서 확인:
https://www.npmjs.com/package/git-rebase-all-cli

---

## 🔄 업데이트 배포하기

패키지를 업데이트하려면:

1. **버전 업데이트:**

```bash
# 패치 버전 (1.0.0 -> 1.0.1)
npm version patch

# 마이너 버전 (1.0.0 -> 1.1.0)
npm version minor

# 메이저 버전 (1.0.0 -> 2.0.0)
npm version major
```

또는 `package.json`에서 직접 수정:

```json
{
  "version": "1.0.1"
}
```

2. **빌드 및 배포:**

```bash
npm run build
npm publish
```

---

## 🚨 문제 해결

### "Package name already exists" 에러

패키지 이름이 이미 사용 중입니다. `package.json`의 `name`을 변경하세요.

### "You must verify your email" 에러

npm 계정의 이메일 인증이 필요합니다. npm 웹사이트에서 이메일을 확인하세요.

### "Incorrect password" 에러

npm 로그인 정보가 잘못되었습니다. 다시 로그인:

```bash
npm logout
npm login
```

### "You do not have permission" 에러

패키지가 이미 다른 사용자에게 등록되어 있습니다. 이름을 변경하세요.

---

## 📝 배포 후 사용 방법

배포가 완료되면 전 세계 어디서나 설치 가능:

```bash
# 전역 설치
npm install -g git-rebase-all-cli

# 사용
git-rebase-all
```

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] npm 계정 로그인 완료
- [ ] 패키지 이름이 고유한지 확인
- [ ] `package.json`의 author, repository 정보 업데이트
- [ ] `npm run build` 성공
- [ ] `dist/cli.js` 파일 존재 확인
- [ ] `npm pack --dry-run`으로 배포 파일 확인
- [ ] 버전 번호 확인

---

## 🎯 빠른 배포 명령어

```bash
# 한 번에 실행
cd git-rebase-all-cli && \
npm install && \
npm run build && \
npm publish
```
