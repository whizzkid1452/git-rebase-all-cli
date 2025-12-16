# 배포 가이드

## npm에 배포하기

### 1. npm 계정 준비

```bash
npm login
```

### 2. 패키지 이름 확인

현재 패키지 이름이 `git-rebase-all-cli`입니다. npm에 이미 존재하는지 확인:

```bash
npm search git-rebase-all-cli
```

이미 존재하면 `package.json`의 `name`을 변경하세요 (예: `@yourusername/git-rebase-all-cli`).

### 3. 빌드 및 배포

```bash
cd git-rebase-all-cli
npm run build
npm publish
```

### 4. 설치 (다른 프로젝트에서)

```bash
npm install -g git-rebase-all-cli
```

또는 프로젝트별로:

```bash
npm install git-rebase-all-cli
npx git-rebase-all
```

---

## 배포 없이 사용하기

### 방법 A: npm link (로컬 개발용)

1. **패키지 디렉토리에서:**

```bash
cd git-rebase-all-cli
npm install
npm run build
npm link
```

2. **다른 프로젝트에서:**

```bash
cd /path/to/other-project
npm link git-rebase-all-cli
git-rebase-all  # 또는 gt-rebase-all
```

### 방법 B: 로컬 파일 경로로 설치

다른 프로젝트의 `package.json`에 추가:

```json
{
  "devDependencies": {
    "git-rebase-all-cli": "file:../git-rebase-all-cli"
  }
}
```

그리고:

```bash
npm install
npx git-rebase-all
```

### 방법 C: GitHub에서 직접 설치

GitHub에 푸시한 후:

```bash
npm install -g github:yourusername/git-rebase-all-cli
```

또는 `package.json`에:

```json
{
  "devDependencies": {
    "git-rebase-all-cli": "github:yourusername/git-rebase-all-cli"
  }
}
```

### 방법 D: 글로벌 스크립트로 사용

1. **빌드:**

```bash
cd git-rebase-all-cli
npm install
npm run build
```

2. **PATH에 추가:**
   - Windows: 환경 변수에 `C:\path\to\git-rebase-all-cli\dist` 추가
   - Mac/Linux: `~/.bashrc` 또는 `~/.zshrc`에 추가:
     ```bash
     export PATH="$PATH:/path/to/git-rebase-all-cli/dist"
     ```

3. **실행:**

```bash
node /path/to/git-rebase-all-cli/dist/cli.js
```

또는 별칭 추가:

```bash
alias gt-rebase-all="node /path/to/git-rebase-all-cli/dist/cli.js"
```

---

## 권장 방법

- **개인 사용만**: 방법 A (npm link) 또는 방법 B (로컬 파일 경로)
- **팀 내 공유**: 방법 C (GitHub) 또는 방법 D (글로벌 스크립트)
- **공개 배포**: npm에 배포
