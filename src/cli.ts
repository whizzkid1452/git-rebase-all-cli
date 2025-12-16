#!/usr/bin/env node

import { Git } from './git.js';
import { selectBranches, confirmAction, handleConflict } from './prompts.js';
import chalk from 'chalk';

interface RebaseResult {
  branch: string;
  success: boolean;
  skipped: boolean;
  hasConflict: boolean;
}

async function main() {
  try {
    // Git 저장소 루트 찾기
    const gitRoot = await Git.findRoot();
    const git = new Git(gitRoot);

    console.log(chalk.blue(`📁 Git 저장소: ${gitRoot}`));
    console.log('');

    // main 브랜치 업데이트
    await git.updateMain();
    console.log('');

    // 브랜치 목록 가져오기
    const allBranches = await git.getBranches();

    if (allBranches.length === 0) {
      console.log(chalk.yellow('⚠️  rebase할 브랜치가 없습니다.'));
      process.exit(0);
    }

    // 브랜치 선택
    console.log(chalk.blue('[STEP 1/2] Rebase할 브랜치를 선택하세요:'));
    const selectedBranches = await selectBranches(allBranches);

    if (selectedBranches.length === 0) {
      console.log(chalk.yellow('🚫 선택된 브랜치가 없습니다. 취소합니다.'));
      process.exit(0);
    }

    // 최종 확인
    console.log('');
    console.log(chalk.blue('선택된 브랜치들:'));
    selectedBranches.forEach(branch => console.log(`  - ${branch}`));
    console.log('');

    const confirmed = await confirmAction('위 브랜치들을 main에 rebase하시겠습니까?');

    if (!confirmed) {
      console.log(chalk.yellow('🚫 취소되었습니다.'));
      process.exit(0);
    }

    // Rebase 수행
    console.log('');
    console.log(chalk.green('🚀 Rebase 시작...'));
    console.log('');

    const results: RebaseResult[] = [];
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (const branch of selectedBranches) {
      const result = await processBranch(git, branch);
      results.push(result);

      if (result.success) {
        successCount++;
      } else if (result.skipped) {
        skippedCount++;
      } else {
        failCount++;
      }
    }

    // 결과 요약
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green('📊 Rebase 결과 요약'));
    console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green(`✅ 성공: ${successCount}`));
    console.log(chalk.yellow(`⏭️  스킵: ${skippedCount}`));
    console.log(chalk.red(`❌ 실패: ${failCount}`));
    console.log('');

    // Push 옵션
    if (successCount > 0) {
      const shouldPush = await confirmAction(
        'Rebase된 브랜치들을 원격에 push하시겠습니까?\n⚠️  주의: force push가 필요할 수 있습니다.'
      );

      if (shouldPush) {
        console.log('');
        console.log(chalk.green('🚀 Push 시작...'));
        console.log('');

        for (const result of results) {
          if (result.success) {
            try {
              console.log(chalk.yellow(`  → Pushing ${result.branch}...`));
              await git.pushForceWithLease(result.branch);
              console.log(chalk.green(`  ✅ ${result.branch} push 완료`));
            } catch (error) {
              console.log(chalk.red(`  ❌ ${result.branch} push 실패`));
            }
            console.log('');
          }
        }

        console.log(chalk.green('🎉 모든 브랜치 push 완료!'));
      } else {
        console.log(chalk.yellow('🚫 Push 취소됨.'));
        console.log(chalk.blue('나중에 수동으로 push하려면:'));
        console.log(chalk.blue('  git push --force-with-lease origin <브랜치명>'));
      }
    }

    console.log('');
    console.log(chalk.green('✨ git-rebase-all 완료!'));

  } catch (error: any) {
    console.error(chalk.red(`❌ 오류 발생: ${error.message}`));
    process.exit(1);
  }
}

async function processBranch(git: Git, branch: string): Promise<RebaseResult> {
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow(`📦 브랜치: ${branch}`));
  console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // 브랜치 존재 확인
  const localExists = await git.branchExists(branch, false);
  const remoteExists = await git.branchExists(branch, true);

  if (!localExists && !remoteExists) {
    console.log(chalk.red(`❌ 브랜치 '${branch}'를 찾을 수 없습니다.`));
    console.log('');
    return { branch, success: false, skipped: false, hasConflict: false };
  }

  // 브랜치 체크아웃
  try {
    if (!localExists && remoteExists) {
      console.log(chalk.yellow('  → 원격 브랜치에서 체크아웃 중...'));
      await git.checkout(branch, `origin/${branch}`);
    } else {
      await git.checkout(branch);
    }
  } catch (error: any) {
    console.log(chalk.red(`  ❌ 브랜치 전환 실패: ${error.message}`));
    console.log('');
    return { branch, success: false, skipped: false, hasConflict: false };
  }

  // 이미 rebase된 경우 스킵
  const isAncestor = await git.isAncestor('main', branch);
  const isSame = await git.isSameAsMain(branch);

  if (isAncestor && isSame) {
    console.log(chalk.yellow('  ⏭️  이미 main과 동일합니다. 스킵합니다.'));
    console.log('');
    return { branch, success: false, skipped: true, hasConflict: false };
  }

  // Rebase 수행
  console.log(chalk.yellow('  → main에 rebase 중...'));

  const rebaseResult = await git.rebase('main');

  if (rebaseResult.success) {
    console.log(chalk.green(`  ✅ ${branch} rebase 완료`));
    console.log('');
    return { branch, success: true, skipped: false, hasConflict: false };
  }

  if (rebaseResult.hasConflict) {
    console.log('');
    console.log(chalk.red(`  ⚠️  ${branch} rebase 중 충돌 발생!`));
    
    const conflictFiles = await git.getConflictFiles();
    if (conflictFiles.length > 0) {
      console.log(chalk.yellow('  충돌 파일:'));
      conflictFiles.forEach(file => console.log(chalk.yellow(`    - ${file}`)));
    }

    const resolved = await handleConflict(branch);

    if (resolved) {
      try {
        await git.rebaseContinue();
        console.log(chalk.green(`  ✅ ${branch} rebase 완료 (충돌 해결됨)`));
        console.log('');
        return { branch, success: true, skipped: false, hasConflict: true };
      } catch (error: any) {
        console.log(chalk.red(`  ❌ ${branch} rebase 실패 (충돌 해결 필요)`));
        console.log(chalk.yellow('  rebase를 중단하려면: git rebase --abort'));
        console.log('');
        return { branch, success: false, skipped: false, hasConflict: true };
      }
    } else {
      console.log(chalk.yellow(`  ⏸️  ${branch} rebase 중단됨 (git rebase --abort 실행)`));
      await git.rebaseAbort();
      console.log('');
      return { branch, success: false, skipped: false, hasConflict: true };
    }
  }

  // 기타 에러
  console.log(chalk.red(`  ❌ ${branch} rebase 실패`));
  console.log('');
  return { branch, success: false, skipped: false, hasConflict: false };
}

main().catch(error => {
  console.error(chalk.red(`❌ 예상치 못한 오류: ${error.message}`));
  process.exit(1);
});
