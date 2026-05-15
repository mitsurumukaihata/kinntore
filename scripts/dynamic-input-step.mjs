// 設定の weight_step / rep_step を動的にinput step属性へ反映
import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['record.html', 'pattern-i.html'];

const replacements = [
  // 重量 input step="2.5" → 動的読込
  [/step="2\.5"/g, `step="\${localStorage.getItem('kinntore_weight_step')||'2.5'}"`],
  // 回数 input step="1" → 動的読込
  [/step="1"/g, `step="\${localStorage.getItem('kinntore_rep_step')||'1'}"`],
];

let total = 0;
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  for (const [pat, rep] of replacements) {
    const m = src.match(pat);
    if (m) { count += m.length; src = src.replace(pat, rep); }
  }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count}`);
    total += count;
  }
}
console.log(`---\nTotal: ${total}`);
