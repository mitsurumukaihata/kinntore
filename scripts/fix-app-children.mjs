// バグ修正: .app > *{position:relative;z-index:1} が fixed positioned 要素
// (.ptr, .topbar 等) の position:fixed を上書きしてレイアウトを壊していた。
// noise overlay の z-index 制御は z-index だけで十分なので、position は触らない。
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['home.html', 'record.html', 'progress.html', 'pattern-i.html', 'settings.html', 'achievements.html'];

const OLD = /\.app > \*\{position:relative;z-index:1\}/g;
const NEW = '.page-content,.head,.section,.sections{position:relative;z-index:1}';

let totalChanges = 0;
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  const m = src.match(OLD);
  if (m) {
    src = src.replace(OLD, NEW);
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: fixed`);
    totalChanges++;
  }
}
console.log(`---\nTotal: ${totalChanges}`);
