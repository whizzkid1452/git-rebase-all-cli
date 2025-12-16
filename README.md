# git-rebase-all-cli

Git Town 브랜치 관리를 위한 스크립트 모음입니다.

## 스크립트

### gt-sync

브랜치를 Move하고 Untrack하는 인터랙티브 스크립트입니다.

**기능:**

- STEP 1: Move할 브랜치를 선택하여 `gt move` 실행
- STEP 2: Untrack할 브랜치를 선택하여 `gt untrack` 실행

**사용법:**

```bash
./gt-sync
```

또는 실행 권한 부여 후:

```bash
chmod +x gt-sync
./gt-sync
```

### gt-push-all

여러 브랜치를 선택하여 force push하는 스크립트입니다.

**기능:**

- fzf를 사용하여 여러 브랜치 선택
- 선택한 브랜치들을 `git push --force-with-lease origin`으로 푸시

**사용법:**

```bash
./gt-push-all
```

또는 실행 권한 부여 후:

```bash
chmod +x gt-push-all
./gt-push-all
```

## 요구사항

- Git
- Git Town (`gt` 명령어)
- fzf (fuzzy finder)
- Bash

## 설치

### npm을 통한 설치 (권장)

```bash
npm install -g git-rebase-all-cli
```

또는

```bash
pnpm add -g git-rebase-all-cli
```

설치 후 전역 명령어로 사용:

```bash
cd /path/to/your/git/repo
gt-sync
# 또는
gt-push-all
```

### 로컬 설치

1. 저장소 클론:

```bash
git clone https://github.com/whizzkid1452/git-rebase-all-cli.git
cd git-rebase-all-cli
```

2. 스크립트에 실행 권한 부여:

```bash
chmod +x gt-sync gt-push-all
```

3. Git 저장소 내에서 실행:

```bash
cd /path/to/your/git/repo
/path/to/git-rebase-all-cli/gt-sync
# 또는
/path/to/git-rebase-all-cli/gt-push-all
```

## 주의사항

- ⚠️ `gt-push-all`은 `--force-with-lease`를 사용하여 force push를 수행합니다.
- ⚠️ 다른 사람과 공유하는 브랜치에 force push를 하기 전에 주의하세요.
- ⚠️ Windows에서는 Git Bash 또는 WSL에서 실행하세요.

## 라이선스

MIT
