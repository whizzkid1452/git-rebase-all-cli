import { checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

/**
 * 브랜치 다중 선택
 */
export async function selectBranches(branches: string[]): Promise<string[]> {
  try {
    const selected = await checkbox({
      message: 'Rebase할 브랜치를 선택하세요:',
      choices: branches.map(branch => ({
        name: branch,
        value: branch,
      })),
      instructions: '스페이스바: 선택/해제, ↑↓: 이동, Enter: 확인',
      pageSize: 15,
    });
    return selected;
  } catch (error: any) {
    // 사용자가 ESC로 취소한 경우
    if (error.message?.includes('User force closed')) {
      return [];
    }
    throw error;
  }
}

/**
 * 작업 확인
 */
export async function confirmAction(message: string): Promise<boolean> {
  try {
    return await confirm({
      message,
      default: false,
    });
  } catch {
    return false;
  }
}

/**
 * 충돌 해결 확인
 */
export async function handleConflict(branch: string): Promise<boolean> {
  console.log(chalk.yellow('  충돌을 해결한 후 다음 명령을 실행하세요:'));
  console.log(chalk.blue('    git add .'));
  console.log(chalk.blue('    git rebase --continue'));
  console.log('');

  return await confirm({
    message: '충돌을 해결하셨나요?',
    default: false,
  });
}
