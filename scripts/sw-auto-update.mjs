// PWA SW 自動更新 + 内部ナビ時のキャッシュ更新
// 各 HTML の SW 登録を強化:
// - 毎ロードで reg.update() で SW チェック
// - 新 SW が controlling になったら自動リロード (初回ロードは除外)
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['home.html', 'pattern-i.html', 'record.html', 'progress.html', 'settings.html', 'achievements.html', 'part-progress.html'];

// 既存の 1 行登録パターン
const OLD_INLINE = /if \('serviceWorker' in navigator\) window\.addEventListener\('load', \(\) => navigator\.serviceWorker\.register\('sw\.js'\)\.catch\(\(\)=>\{\}\)\);?/g;

// 既存の複数行パターン (home.html, pattern-i.html)
const OLD_MULTILINE = /if \('serviceWorker' in navigator\) \{\s*window\.addEventListener\('load', \(\) => \{?\s*navigator\.serviceWorker\.register\('sw\.js'\)\.catch\(\(\)=>\{\}\);?\s*\}?\);?\s*\}/g;

const NEW = `if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      // 毎ロードで SW 更新チェック (PWA 内部ナビ時もキャッシュを新しく)
      reg.update();
      // 新 SW が controlling になったら自動リロード (初回ロード除外)
      const wasControlled = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (wasControlled && !window.__swReloading) {
          window.__swReloading = true;
          window.location.reload();
        }
      });
    } catch(_) {}
  });
}`;

let totalChanges = 0;
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  if (src.match(OLD_INLINE)) { src = src.replace(OLD_INLINE, NEW); count++; }
  if (src.match(OLD_MULTILINE)) { src = src.replace(OLD_MULTILINE, NEW); count++; }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count} replacement(s)`);
    totalChanges += count;
  } else {
    console.log(`${f}: 0 (no match)`);
  }
}
console.log(`---\nTotal: ${totalChanges}`);
