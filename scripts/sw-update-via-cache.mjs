// iOS PWA の SW.js HTTP キャッシュ問題対策
// updateViaCache: 'none' を register に追加して、SW.js を常にネットから取得
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['home.html', 'pattern-i.html', 'record.html', 'progress.html', 'settings.html', 'achievements.html'];

const OLD = /navigator\.serviceWorker\.register\('sw\.js'\)/g;
const NEW = "navigator.serviceWorker.register('sw.js', {updateViaCache:'none'})";

let total = 0;
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  const m = src.match(OLD);
  if (m) {
    src = src.replace(OLD, NEW);
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${m.length} replacement(s)`);
    total += m.length;
  }
}
console.log(`---\nTotal: ${total}`);
