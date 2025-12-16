#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

function checkCommand(command, installGuide) {
  try {
    // Windows에서는 'where', Unix에서는 'which' 사용
    const isWindows = process.platform === 'win32';
    const checkCmd = isWindows ? `where ${command}` : `which ${command}`;
    execSync(checkCmd, { stdio: 'ignore' });
    console.log(`${colors.green}✓${colors.reset} ${command} is installed`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${command} is not installed`);
    if (installGuide) {
      console.log(`${colors.yellow}  → ${installGuide}${colors.reset}`);
    }
    return false;
  }
}

function checkGit() {
  try {
    const version = execSync('git --version', { encoding: 'utf-8' }).trim();
    console.log(`${colors.green}✓${colors.reset} Git is installed (${version})`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Git is not installed`);
    console.log(`${colors.yellow}  → Please install Git: https://git-scm.com/downloads${colors.reset}`);
    return false;
  }
}

function checkGraphite() {
  // Check if gt is available in node_modules/.bin (after npm install)
  const isWindows = process.platform === 'win32';
  const gtBinName = isWindows ? 'gt.cmd' : 'gt';
  const gtPath = path.join(__dirname, '..', 'node_modules', '.bin', gtBinName);
  
  if (fs.existsSync(gtPath)) {
    try {
      const version = execSync(`"${gtPath}" --version`, { encoding: 'utf-8' }).trim();
      console.log(`${colors.green}✓${colors.reset} Graphite CLI is installed (${version})`);
      return true;
    } catch (error) {
      // Try system gt
      return checkCommand('gt', 'Graphite CLI will be available via npm install');
    }
  }
  
  // Check system gt
  return checkCommand('gt', 'Graphite CLI will be available via npm install');
}

function installFzf() {
  const os = process.platform;
  
  if (os === 'win32') {
    // Windows에서는 자동 설치 불가 (권한 문제 등)
    return false;
  } else if (os === 'darwin') {
    // macOS: brew로 설치 시도
    try {
      // brew가 설치되어 있는지 확인
      execSync('which brew', { stdio: 'ignore' });
      console.log(`${colors.blue}Installing fzf via brew...${colors.reset}`);
      execSync('brew install fzf', { stdio: 'inherit' });
      console.log(`${colors.green}✓ fzf installed successfully${colors.reset}`);
      return true;
    } catch (error) {
      if (error.message.includes('brew: command not found')) {
        console.log(`${colors.yellow}  → Homebrew is not installed. Install it first: https://brew.sh${colors.reset}`);
      } else {
        console.log(`${colors.yellow}  → Failed to install fzf automatically. Please install manually: brew install fzf${colors.reset}`);
      }
      return false;
    }
  } else if (os === 'linux') {
    // Linux: 패키지 매니저로 설치 시도
    try {
      // apt-get 확인
      execSync('which apt-get', { stdio: 'ignore' });
      console.log(`${colors.blue}Installing fzf via apt-get...${colors.reset}`);
      console.log(`${colors.yellow}  → Note: This requires sudo. If it fails, run manually: sudo apt-get install fzf${colors.reset}`);
      try {
        execSync('sudo apt-get install -y fzf', { stdio: 'inherit' });
        console.log(`${colors.green}✓ fzf installed successfully${colors.reset}`);
        return true;
      } catch (sudoError) {
        console.log(`${colors.yellow}  → Sudo required. Please install manually: sudo apt-get install fzf${colors.reset}`);
        return false;
      }
    } catch (aptError) {
      // yum 확인
      try {
        execSync('which yum', { stdio: 'ignore' });
        console.log(`${colors.blue}Installing fzf via yum...${colors.reset}`);
        console.log(`${colors.yellow}  → Note: This requires sudo. If it fails, run manually: sudo yum install fzf${colors.reset}`);
        try {
          execSync('sudo yum install -y fzf', { stdio: 'inherit' });
          console.log(`${colors.green}✓ fzf installed successfully${colors.reset}`);
          return true;
        } catch (sudoError) {
          console.log(`${colors.yellow}  → Sudo required. Please install manually: sudo yum install fzf${colors.reset}`);
          return false;
        }
      } catch (yumError) {
        console.log(`${colors.yellow}  → Could not detect package manager. Please install fzf manually.${colors.reset}`);
        return false;
      }
    }
  }
  
  return false;
}

function checkFzf() {
  const hasFzf = checkCommand('fzf', null);
  
  if (!hasFzf) {
    const os = process.platform;
    let installGuide = '';
    
    if (os === 'win32') {
      // Windows: Git Bash나 WSL 사용 권장
      installGuide = 'Install fzf for Windows:\n    - Git Bash: https://github.com/junegunn/fzf#windows\n    - WSL: sudo apt-get install fzf\n    - Chocolatey: choco install fzf';
      console.log(`${colors.yellow}  → Install: ${installGuide}${colors.reset}`);
      console.log(`${colors.yellow}  → Or visit: https://github.com/junegunn/fzf#installation${colors.reset}`);
    } else {
      // macOS/Linux: 자동 설치 시도
      console.log(`${colors.blue}Attempting to install fzf automatically...${colors.reset}`);
      const installed = installFzf();
      
      if (!installed) {
        // 자동 설치 실패 시 수동 설치 가이드 제공
        if (os === 'darwin') {
          installGuide = 'brew install fzf';
        } else if (os === 'linux') {
          try {
            execSync('which apt-get', { stdio: 'ignore' });
            installGuide = 'sudo apt-get install fzf';
          } catch (e) {
            try {
              execSync('which yum', { stdio: 'ignore' });
              installGuide = 'sudo yum install fzf';
            } catch (e2) {
              installGuide = 'Install fzf using your package manager';
            }
          }
        } else {
          installGuide = 'Install fzf from https://github.com/junegunn/fzf';
        }
        
        console.log(`${colors.yellow}  → Manual install: ${installGuide}${colors.reset}`);
        console.log(`${colors.yellow}  → Or visit: https://github.com/junegunn/fzf#installation${colors.reset}`);
      } else {
        // 설치 성공 시 다시 확인
        return checkCommand('fzf', null);
      }
    }
  }
  
  return hasFzf;
}

// Ensure script files have execute permissions
const scriptDir = path.join(__dirname, '..');
const scripts = ['gt-sync', 'gt-push-all'];

scripts.forEach(script => {
  const scriptPath = path.join(scriptDir, script);
  if (fs.existsSync(scriptPath)) {
    try {
      fs.chmodSync(scriptPath, 0o755);
    } catch (error) {
      // Ignore chmod errors (e.g., on Windows)
    }
  }
});

console.log(`${colors.blue}Checking dependencies for git-rebase-all-cli...${colors.reset}\n`);

const results = {
  git: checkGit(),
  graphite: checkGraphite(),
  fzf: checkFzf(),
};

console.log('');

const allInstalled = Object.values(results).every(r => r);

if (allInstalled) {
  console.log(`${colors.green}✓ All dependencies are installed!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠ Some dependencies are missing. Please install them before using the scripts.${colors.reset}`);
  console.log(`${colors.blue}See README.md for installation instructions.${colors.reset}`);
  // Don't fail the install, just warn
  process.exit(0);
}

