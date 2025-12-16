# npm 배포 가이드

## 배포 전 확인사항

1. **npm 로그인 확인**

```bash
npm whoami
```

2. **패키지 이름 확인**

   - `git-rebase-all-cli`가 이미 사용 중일 수 있습니다
   - 사용 중이면 `package.json`의 `name` 필드를 변경하세요

3. **버전 확인**
   - `package.json`의 `version` 필드 확인

## 배포 방법

### 1. npm 로그인 (처음 한 번만)

```bash
npm login
```

### 2. 배포 테스트 (dry-run)

```bash
npm pack --dry-run
```

실제로 어떤 파일들이 포함되는지 확인할 수 있습니다.

### 3. 배포

```bash
npm publish
```

### 4. 공개 배포 (스코프가 없는 경우)

```bash
npm publish --access public
```

## 배포 후 사용

다른 프로젝트에서:

```bash
npm install -g git-rebase-all-cli
gt-sync
gt-push-all
```

## 버전 업데이트

버전을 올리고 다시 배포:

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
npm publish
```

## 주의사항

- ⚠️ npm에 배포하면 전 세계 누구나 사용할 수 있습니다
- ⚠️ 패키지 이름은 고유해야 합니다
- ⚠️ 한 번 배포된 버전은 수정할 수 없습니다 (새 버전을 배포해야 함)
