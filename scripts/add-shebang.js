import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');
const cliFile = join(distDir, 'cli.js');

try {
  const content = readFileSync(cliFile, 'utf-8');
  
  // 이미 shebang이 있으면 스킵
  if (content.startsWith('#!/usr/bin/env node')) {
    console.log('Shebang already exists');
    process.exit(0);
  }
  
  // shebang 추가
  const newContent = '#!/usr/bin/env node\n' + content;
  writeFileSync(cliFile, newContent, 'utf-8');
  
  console.log('Shebang added to dist/cli.js');
} catch (error) {
  console.error('Error adding shebang:', error.message);
  process.exit(1);
}
