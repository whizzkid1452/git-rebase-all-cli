# pnpm으로 npm 배포 가이드

## 📦 pnpm으로 npm에 패키지 배포하기

pnpm도 npm 레지스트리에 배포할 수 있습니다. 대부분의 명령어가 npm과 동일하지만 몇 가지 차이점이 있습니다.

### 1단계: npm 계정 준비

npm 계정이 없으면 먼저 생성하세요:

```bash
# npm 웹사이트에서 계정 생성
# https://www.npmjs.com/signup
```

그 다음 로그인 (pnpm도 npm 레지스트리 사용):

```bash
pnpm login
# 또는
npm login
```

### 2단계: 패키지 이름 확인 및 수정

현재 패키지 이름이 `git-rebase-all-cli`입니다. npm에 이미 존재하는지 확인:

```bash
pnpm search git-rebase-all-cli
# 또는
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

# 의존성 설치 (pnpm 사용)
pnpm install

# 빌드
pnpm run build

# 빌드 결과 확인
ls dist/
# dist/cli.js 파일이 있어야 합니다
```

### 5단계: 배포 전 확인

배포할 파일만 포함되는지 확인:

```bash
pnpm pack --dry-run
# 또는
npm pack --dry-run
```

### 6단계: npm에 배포

**pnpm으로 배포:**

```bash
pnpm publish
```

**스코프 패키지인 경우:**

```bash
pnpm publish --access public
```

**또는 npm 레지스트리 명시:**

```bash
pnpm publish --registry https://registry.npmjs.org/
```

### 7단계: 배포 확인

배포가 성공했는지 확인:

```bash
pnpm view git-rebase-all-cli
# 또는
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
pnpm version patch

# 마이너 버전 (1.0.0 -> 1.1.0)
pnpm version minor

# 메이저 버전 (1.0.0 -> 2.0.0)
pnpm version major
```

또는 `package.json`에서 직접 수정:

```json
{
  "version": "1.0.1"
}
```

2. **빌드 및 배포:**

```bash
pnpm run build
pnpm publish
```

---

## 🚨 pnpm vs npm 차이점

### 레지스트리 설정

pnpm은 기본적으로 npm 레지스트리를 사용하지만, 명시적으로 설정할 수 있습니다:

```bash
# .npmrc 파일 생성 또는 수정
echo "registry=https://registry.npmjs.org/" > .npmrc
```

### 배포 명령어 차이

| 작업          | npm                 | pnpm                 |
| ------------- | ------------------- | -------------------- |
| 로그인        | `npm login`         | `pnpm login`         |
| 배포          | `npm publish`       | `pnpm publish`       |
| 버전 업데이트 | `npm version patch` | `pnpm version patch` |
| 패키지 확인   | `npm view <name>`   | `pnpm view <name>`   |

### pnpm 특화 옵션

```bash
# 배포 시 태그 지정
pnpm publish --tag beta

# 배포 시 버전 범위 확인
pnpm publish --dry-run

# 특정 레지스트리에 배포
pnpm publish --registry https://registry.npmjs.org/
```

---

## 🚨 문제 해결

### "Package name already exists" 에러

패키지 이름이 이미 사용 중입니다. `package.json`의 `name`을 변경하세요.

### "You must verify your email" 에러

npm 계정의 이메일 인증이 필요합니다. npm 웹사이트에서 이메일을 확인하세요.

### "Incorrect password" 에러

pnpm 로그인 정보가 잘못되었습니다. 다시 로그인:

```bash
pnpm logout
pnpm login
```

### "You do not have permission" 에러

패키지가 이미 다른 사용자에게 등록되어 있습니다. 이름을 변경하세요.

### pnpm 특정 에러

pnpm이 npm 레지스트리에 접근하지 못하는 경우:

```bash
# 레지스트리 확인
pnpm config get registry

# 레지스트리 설정
pnpm config set registry https://registry.npmjs.org/
```

---

## 📝 배포 후 사용 방법

배포가 완료되면 전 세계 어디서나 설치 가능:

```bash
# pnpm으로 전역 설치
pnpm add -g git-rebase-all-cli

# 또는 npm으로 설치 (동일한 레지스트리 사용)
npm install -g git-rebase-all-cli

# 사용
git-rebase-all
```

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] npm 계정 로그인 완료 (`pnpm login`)
- [ ] 패키지 이름이 고유한지 확인
- [ ] `package.json`의 author, repository 정보 업데이트
- [ ] `pnpm install` 성공
- [ ] `pnpm run build` 성공
- [ ] `dist/cli.js` 파일 존재 확인
- [ ] `pnpm pack --dry-run`으로 배포 파일 확인
- [ ] 버전 번호 확인
- [ ] 레지스트리 설정 확인 (`pnpm config get registry`)

---

## 🎯 빠른 배포 명령어 (pnpm)

```bash
# 한 번에 실행
cd git-rebase-all-cli && \
pnpm install && \
pnpm run build && \
pnpm publish
```

### package.json에 스크립트 추가

`package.json`에 배포 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "publish:pnpm": "pnpm run build && pnpm publish",
    "publish:public": "pnpm run build && pnpm publish --access public"
  }
}
```

그러면:

```bash
pnpm run publish:pnpm
```

---

## 💡 팁

1. **pnpm과 npm 혼용 가능**: pnpm으로 배포해도 npm으로 설치 가능 (같은 레지스트리 사용)
2. **.npmrc 파일**: 프로젝트 루트에 `.npmrc` 파일을 만들어 레지스트리 설정 가능
3. **태그 사용**: 베타 버전 등 특정 태그로 배포 가능
4. **dry-run**: 실제 배포 전에 `--dry-run`으로 확인 권장

---

## 📚 참고

- [pnpm 공식 문서 - Publishing](https://pnpm.io/cli/publish)
- [npm 레지스트리](https://www.npmjs.com/)
