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

### 자동 설치되는 의존성
- **Graphite CLI** (`@withgraphite/graphite-cli`) - npm 설치 시 자동으로 설치됩니다. Windows, macOS, Linux 모두 지원합니다.
- **fzf** (fuzzy finder) - macOS/Linux에서 자동 설치를 시도합니다:
  - **macOS**: `brew install fzf` (Homebrew 필요)
  - **Linux**: `apt-get` 또는 `yum`을 통해 자동 설치 시도 (sudo 권한 필요)
  - **Windows**: 수동 설치 필요 (Git Bash 또는 WSL 사용)

### 시스템에 설치가 필요한 의존성
- **Git** - 시스템에 Git이 설치되어 있어야 합니다. (Windows: Git for Windows 포함)
- **Bash** - Unix 시스템에 기본 포함. Windows에서는 Git Bash 또는 WSL 필요.

## 설치

### npm을 통한 설치 (권장)

```bash
npm install -g git-rebase-all-cli
```

또는

```bash
pnpm add -g git-rebase-all-cli
```

**설치 시 자동으로:**
- Graphite CLI (`@withgraphite/graphite-cli`)가 자동으로 설치됩니다.
- 의존성 확인 스크립트가 실행되어 Git과 fzf 설치 여부를 확인합니다.
- **fzf 자동 설치 시도**:
  - macOS: Homebrew가 있으면 `brew install fzf` 자동 실행
  - Linux: `apt-get` 또는 `yum`을 통해 자동 설치 시도 (sudo 권한 필요)
  - Windows: 자동 설치 불가, 수동 설치 필요
- 설치 실패 시 수동 설치 가이드가 표시됩니다.

**fzf 수동 설치 (자동 설치 실패 시):**
```bash
# macOS (Homebrew가 없는 경우)
brew install fzf

# Linux (Ubuntu/Debian) - sudo 권한이 없는 경우
sudo apt-get install fzf

# Linux (CentOS/RHEL) - sudo 권한이 없는 경우
sudo yum install fzf

# Windows (Git Bash)
# Git Bash에서 다음 명령어 실행:
# https://github.com/junegunn/fzf#windows 참고

# Windows (WSL)
sudo apt-get install fzf

# Windows (Chocolatey)
choco install fzf

# 기타
# https://github.com/junegunn/fzf#installation 참고
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

2. 의존성 설치:

```bash
npm install
# 또는
pnpm install
```

이 명령어는 Graphite CLI를 자동으로 설치하고 의존성을 확인합니다.

3. 스크립트에 실행 권한 부여:

```bash
chmod +x gt-sync gt-push-all
```

4. Git 저장소 내에서 실행:

```bash
cd /path/to/your/git/repo
/path/to/git-rebase-all-cli/gt-sync
# 또는
/path/to/git-rebase-all-cli/gt-push-all
```

## Windows 지원

이 패키지는 Windows에서도 작동합니다. 다음 방법 중 하나를 사용하세요:

### 방법 1: Git Bash (권장)
1. [Git for Windows](https://git-scm.com/download/win) 설치
2. Git Bash에서 npm 설치:
   ```bash
   npm install -g git-rebase-all-cli
   ```
3. Git Bash에서 스크립트 실행:
   ```bash
   cd /c/path/to/your/git/repo
   gt-sync
   # 또는
   gt-push-all
   ```

### 방법 2: WSL (Windows Subsystem for Linux)
1. WSL 설치 및 설정
2. WSL 터미널에서 npm 설치:
   ```bash
   npm install -g git-rebase-all-cli
   ```
3. WSL에서 스크립트 실행

**참고:**
- Graphite CLI는 npm 패키지로 설치되므로 Windows에서도 정상 작동합니다.
- fzf는 Git Bash나 WSL 환경에서 설치해야 합니다.
- Windows 명령 프롬프트(CMD)나 PowerShell에서는 bash 스크립트가 작동하지 않으므로 Git Bash나 WSL을 사용해야 합니다.

## 주의사항

- ⚠️ `gt-push-all`은 `--force-with-lease`를 사용하여 force push를 수행합니다.
- ⚠️ 다른 사람과 공유하는 브랜치에 force push를 하기 전에 주의하세요.
- ⚠️ Windows에서는 Git Bash 또는 WSL에서 실행하세요.

## 라이선스

MIT
