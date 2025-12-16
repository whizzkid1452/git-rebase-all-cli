import { execa } from 'execa';
import chalk from 'chalk';

/**
 * Git 명령어 실행 헬퍼
 */
export class Git {
  private cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  /**
   * Git 명령어 실행
   */
  async exec(command: string, args: string[] = [], options: { silent?: boolean } = {}): Promise<string> {
    try {
      const result = await execa('git', [command, ...args], {
        cwd: this.cwd,
        stdout: 'pipe',
        stderr: options.silent ? 'pipe' : 'inherit',
      });
      return result.stdout.trim();
    } catch (error: any) {
      if (error.exitCode !== undefined) {
        throw new Error(`Git command failed: git ${command} ${args.join(' ')}\n${error.stderr || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Git 저장소 루트 찾기
   */
  static async findRoot(cwd: string = process.cwd()): Promise<string> {
    try {
      const result = await execa('git', ['rev-parse', '--show-toplevel'], {
        cwd,
        stdout: 'pipe',
      });
      return result.stdout.trim();
    } catch {
      throw new Error('Git repository를 찾을 수 없습니다. Git repository 내에서 실행해주세요.');
    }
  }

  /**
   * 현재 브랜치 가져오기
   */
  async getCurrentBranch(): Promise<string> {
    return this.exec('rev-parse', ['--abbrev-ref', 'HEAD']);
  }

  /**
   * 브랜치 목록 가져오기
   */
  async getBranches(): Promise<string[]> {
    const output = await this.exec('branch', ['-a']);
    return output
      .split('\n')
      .map(line => line.trim().replace(/^\*\s*/, '').replace(/^remotes\/origin\//, ''))
      .filter(branch => {
        // main, develop, HEAD 제외
        if (branch === 'main' || branch === 'develop' || branch === 'HEAD' || !branch) {
          return false;
        }
        // (needs restack) 제거
        return branch.replace(/ \(needs restack\)$/, '');
      })
      .map(branch => branch.replace(/ \(needs restack\)$/, ''))
      .filter((branch, index, self) => self.indexOf(branch) === index) // 중복 제거
      .sort();
  }

  /**
   * 브랜치 체크아웃
   */
  async checkout(branch: string, createFromRemote?: string): Promise<void> {
    if (createFromRemote) {
      await this.exec('checkout', ['-b', branch, createFromRemote]);
    } else {
      await this.exec('checkout', [branch]);
    }
  }

  /**
   * 브랜치 존재 여부 확인
   */
  async branchExists(branch: string, remote: boolean = false): Promise<boolean> {
    try {
      const ref = remote ? `refs/remotes/origin/${branch}` : `refs/heads/${branch}`;
      await this.exec('show-ref', ['--verify', '--quiet', ref], { silent: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * main 브랜치 업데이트
   */
  async updateMain(): Promise<void> {
    console.log(chalk.yellow('🔄 main 브랜치를 최신으로 업데이트 중...'));
    
    try {
      await this.exec('fetch', ['origin', 'main'], { silent: true });
    } catch {
      // fetch 실패해도 계속 진행
    }

    try {
      await this.exec('checkout', ['main']);
    } catch {
      throw new Error('main 브랜치로 전환할 수 없습니다.');
    }

    try {
      await this.exec('pull', ['origin', 'main'], { silent: true });
    } catch {
      // pull 실패해도 계속 진행 (이미 최신일 수 있음)
    }

    console.log(chalk.green('✅ main 브랜치 업데이트 완료'));
  }

  /**
   * Rebase 수행
   */
  async rebase(baseBranch: string = 'main'): Promise<{ success: boolean; hasConflict: boolean }> {
    try {
      await this.exec('rebase', [baseBranch]);
      return { success: true, hasConflict: false };
    } catch (error: any) {
      // rebase 충돌 확인
      const status = await this.exec('status', ['--porcelain']);
      const hasConflict = status.includes('UU') || status.includes('AA') || status.includes('DD');
      
      if (hasConflict) {
        return { success: false, hasConflict: true };
      }
      
      // 다른 종류의 에러
      throw error;
    }
  }

  /**
   * Rebase 계속
   */
  async rebaseContinue(): Promise<void> {
    await this.exec('rebase', ['--continue']);
  }

  /**
   * Rebase 중단
   */
  async rebaseAbort(): Promise<void> {
    await this.exec('rebase', ['--abort'], { silent: true });
  }

  /**
   * 브랜치가 main의 후손인지 확인
   */
  async isAncestor(baseBranch: string, branch: string): Promise<boolean> {
    try {
      await this.exec('merge-base', ['--is-ancestor', baseBranch, branch], { silent: true });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 브랜치가 main과 동일한지 확인
   */
  async isSameAsMain(branch: string, mainBranch: string = 'main'): Promise<boolean> {
    try {
      const branchCommit = await this.exec('rev-parse', [branch]);
      const mainCommit = await this.exec('rev-parse', [mainBranch]);
      return branchCommit === mainCommit;
    } catch {
      return false;
    }
  }

  /**
   * Force push with lease
   */
  async pushForceWithLease(branch: string, remote: string = 'origin'): Promise<void> {
    await this.exec('push', ['--force-with-lease', remote, branch]);
  }

  /**
   * 충돌 파일 목록 가져오기
   */
  async getConflictFiles(): Promise<string[]> {
    try {
      const status = await this.exec('status', ['--porcelain']);
      return status
        .split('\n')
        .filter(line => line.match(/^UU|^AA|^DD/))
        .map(line => line.substring(3).trim());
    } catch {
      return [];
    }
  }
}
