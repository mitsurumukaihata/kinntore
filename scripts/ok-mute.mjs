// CORE24 温度調整④: 達成緑 (--ok) を mute 化
// "完了/達成" 演出色を中和。CORE24 は "達成感" を表示しない
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const TARGETS = ['home.html', 'record.html', 'progress.html', 'pattern-i.html', 'settings.html', 'achievements.html', 'part-progress.html'];

const REPLACEMENTS = [
  // メインの達成緑 → ニュートラルな mute (灰がかった暗緑)
  [/--ok:\s*#4FB07A/g, '--ok:#6E7A6E'],
  // 達成 glow / 達成 fill 系の RGB 79,176,122 → 中和
  [/rgba\(79,\s*176,\s*122/g, 'rgba(110, 122, 110'],
  // ペールグリーン (gradient end) → 撤廃 (まだ可視のところで主張する場合)
  [/#86efac/g, '#9aa39a'],
];

let totalChanges = 0;
for (const f of TARGETS) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) { continue; }
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  for (const [pat, rep] of REPLACEMENTS) {
    const m = src.match(pat);
    if (m) { count += m.length; src = src.replace(pat, rep); }
  }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count}`);
    totalChanges += count;
  }
}
console.log(`---\nTotal: ${totalChanges}`);
