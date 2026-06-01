// core24.pages.dev へ 1 コマンドでデプロイ
//   1) dist/ をクリーンビルド (本番ファイルのみ)
//   2) wrangler pages deploy で core24 プロジェクトへ直アップロード
// 使い方: node scripts/deploy-pages.mjs
import { execSync } from 'child_process';

const ROOT = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore';
const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: 'inherit' });

console.log('[1/2] build dist...');
run('node scripts/build-pages.mjs');

console.log('[2/2] deploy to core24.pages.dev...');
run('npx wrangler pages deploy dist --project-name core24 --branch main --commit-dirty=true');

console.log('\n✅ https://core24.pages.dev/');
