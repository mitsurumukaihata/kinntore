// Cloudflare Pages 用に本番ファイルだけを dist/ に集める
// (開発用 index.html ギャラリー・pattern-a〜h・tokens-preview 等は除外)
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const DIST = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/dist';

// 本番アプリ構成ファイル
const FILES = [
  'home.html',
  'pattern-i.html',
  'record.html',
  'progress.html',
  'part-progress.html',
  'settings.html',
  'achievements.html',
  'dialogue.js',
  'manifest.json',
  'sw.js',
];

// クリーンビルド
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 個別ファイルコピー
for (const f of FILES) {
  fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));
}

// img/ 丸ごと (manga サブフォルダ含む)
fs.cpSync(path.join(SRC, 'img'), path.join(DIST, 'img'), { recursive: true });

// `/` で開けるよう home.html を index.html として複製
fs.copyFileSync(path.join(SRC, 'home.html'), path.join(DIST, 'index.html'));

// 集計
const count = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log('dist files:', count(DIST));
console.log('done ->', DIST);
