# git-rebase-all-cli

여러 PR 브랜치를 main에 rebase하여 충돌을 자동으로 해결하는 Git CLI 도구입니다.

## 특징

- 🚀 **자동화**: 여러 브랜치를 한 번에 rebase
- 🎯 **인터랙티브**: 브랜치를 쉽게 선택할 수 있는 UI
- 🔒 **안전**: `--force-with-lease`로 안전한 push
- ⚠️ **충돌 처리**: 충돌 발생 시 안내 및 해결 지원
- 📊 **결과 요약**: rebase 결과를 한눈에 확인

## 설치

### 방법 1: npm에 배포 후 설치 (공개 사용)

먼저 npm에 배포:

```bash
cd git-rebase-all-cli
npm run build
npm publish
```

그 다음 다른 프로젝트에서:

```bash
npm install -g git-rebase-all-cli
```

### 방법 2: npm link (로컬 개발용, 배포 불필요)

**1단계: 패키지 디렉토리에서**

```bash
cd git-rebase-all-cli
npm install
npm run build
npm link
```

**2단계: 다른 프로젝트에서**

```bash
cd /path/to/your-project
npm link git-rebase-all-cli
git-rebase-all  # 이제 사용 가능!
```

### 방법 3: 로컬 파일 경로로 설치 (배포 불필요)

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

### 방법 4: GitHub에서 직접 설치 (배포 불필요)

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

### 방법 5: 전역 설치 (권장 - npm 배포 후)

```bash
npm install -g git-rebase-all-cli
```

또는

```bash
pnpm add -g git-rebase-all-cli
```

## 사용 방법

### 기본 사용

Git 저장소 루트에서 실행:

```bash
git-rebase-all
```

또는 짧은 단축키:

```bash
gra
```

### 실행 흐름

1. **main 브랜치 자동 업데이트**: rebase 전에 main을 최신 상태로 업데이트합니다.
2. **브랜치 선택**: 인터랙티브 UI에서 rebase할 브랜치를 선택합니다.
   - 스페이스바: 선택/해제
   - ↑↓: 이동
   - Enter: 확인
3. **Rebase 수행**: 선택한 브랜치를 main에 rebase합니다.
4. **충돌 처리**: 충돌 발생 시 안내를 받고 해결할 수 있습니다.
5. **Push 옵션**: rebase 완료 후 원격 저장소에 push할지 선택합니다.

### 실제 시나리오

**상황**: 여러 PR 브랜치가 있고, `main`이 업데이트되어 모든 브랜치를 rebase해야 하는 경우

예를 들어:

- `feature/A` 브랜치에서 작업 중
- `main`이 업데이트되어 `feature/A`를 rebase해야 함
- `feature/B`, `feature/C`도 rebase가 필요

**이 경우**:

- `feature/A`에서 실행해도 됩니다 ✅
- `main`에서 실행해도 됩니다 ✅
- 다른 브랜치에서 실행해도 됩니다 ✅

**도구가 자동으로**:

1. `main`으로 전환하여 업데이트
2. 선택한 브랜치들(`feature/A`, `feature/B`, `feature/C`)을 각각 체크아웃하여 rebase

> 💡 **팁**: 어느 브랜치에서든 실행 가능합니다. 다만 작업 중인 변경사항이 있다면 먼저 커밋하거나 stash한 후 실행하세요.

## 예시

```bash
$ git-rebase-all

📁 Git 저장소: /path/to/repo

🔄 main 브랜치를 최신으로 업데이트 중...
✅ main 브랜치 업데이트 완료

[STEP 1/2] Rebase할 브랜치를 선택하세요:
? Rebase할 브랜치를 선택하세요: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
 ❯◯ feature/export
  ◯ feature/track_edit
  ◯ feature/volume
  ◯ refactor/design

선택된 브랜치들:
  - feature/export
  - feature/track_edit

? 위 브랜치들을 main에 rebase하시겠습니까? (y/N)

🚀 Rebase 시작...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 브랜치: feature/export
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → main에 rebase 중...
  ✅ feature/export rebase 완료

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 브랜치: feature/track_edit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  → main에 rebase 중...
  ✅ feature/track_edit rebase 완료

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Rebase 결과 요약
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 성공: 2
⏭️  스킵: 0
❌ 실패: 0

? Rebase된 브랜치들을 원격에 push하시겠습니까?
⚠️  주의: force push가 필요할 수 있습니다. (y/N)

🚀 Push 시작...

  → Pushing feature/export...
  ✅ feature/export push 완료

  → Pushing feature/track_edit...
  ✅ feature/track_edit push 완료

🎉 모든 브랜치 push 완료!

✨ git-rebase-all 완료!
```

## 충돌 해결

rebase 중 충돌이 발생하면:

1. 충돌 파일 목록이 표시됩니다.
2. 충돌을 수동으로 해결합니다.
3. `git add .`로 변경사항을 스테이징합니다.
4. 스크립트에서 "충돌을 해결하셨나요?" 질문에 `y`로 답합니다.
5. 스크립트가 `git rebase --continue`를 실행합니다.

## 주의사항

- ⚠️ rebase는 Git 히스토리를 변경합니다. 중요한 브랜치는 백업하세요.
- ⚠️ 이미 push된 브랜치를 rebase하면 force push가 필요합니다.
- ⚠️ 다른 사람과 공유하는 브랜치는 rebase를 피하세요.

## 요구사항

- Node.js >= 18.0.0
- Git

## 라이선스

MIT
