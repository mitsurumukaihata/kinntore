// レガシー LIGHT 演出 (赤グラデ・白カードbg !important) を無効化
// CORE24 解体 (透明・行化) を遮断していたため
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';

const PATCHES = [
  // progress.html: part-vol/gain-row/pr-row の白bg !important を撤廃
  { file:'progress.html', from:
`:root[data-theme="light"] .part-vol{background:rgba(255,255,255,.6) !important;border-color:rgba(0,0,0,.06) !important}
:root[data-theme="light"] .gain-row{background:rgba(255,255,255,.6) !important;border-color:rgba(0,0,0,.06) !important}
:root[data-theme="light"] .pr-row{background:rgba(255,255,255,.6) !important;border-color:rgba(0,0,0,.06) !important}`,
    to:
`/* CORE24: レガシー LIGHT カード bg (.part-vol/.gain-row/.pr-row) は
   Phase 4 で行化したため透明維持。これらルールは無効化 */`
  },
  // pattern-i.html: program 赤グラデ
  { file:'pattern-i.html', from:
`:root[data-theme="light"] .program{background:linear-gradient(135deg,#ffe9eb 0%,var(--photo-card) 60%) !important;border-color:rgba(125, 37, 48,.25) !important}
:root[data-theme="light"] .program::before{background:radial-gradient(circle,rgba(125, 37, 48,.14) 0%,transparent 70%) !important}`,
    to:
`/* CORE24: program LIGHT 赤グラデ撤廃 (Phase 5 で透明行化済) */`
  },
  // achievements.html: summary 赤グラデ
  { file:'achievements.html', from:
`:root[data-theme="light"] .summary{background:linear-gradient(135deg,#ffe9eb,#fff 70%) !important}`,
    to:
`/* CORE24: summary LIGHT 赤グラデ撤廃 (Phase 8 で透明行化済) */`
  },
  // part-progress.html: summary 赤グラデ
  { file:'part-progress.html', from:
`:root[data-theme="light"] .summary{background:linear-gradient(135deg,rgba(255,236,238,.6),rgba(255,255,255,.4) 70%) !important;border-color:rgba(125, 37, 48,.18) !important}`,
    to:
`/* CORE24: summary LIGHT 赤グラデ撤廃 */`
  },
];

let total = 0;
for (const p of PATCHES) {
  const fp = path.join(DIR, p.file);
  if (!fs.existsSync(fp)) { console.log(`skip: ${p.file}`); continue; }
  let src = fs.readFileSync(fp, 'utf8');
  if (src.includes(p.from)) {
    src = src.replace(p.from, p.to);
    fs.writeFileSync(fp, src, 'utf8');
    console.log(`${p.file}: patched`);
    total++;
  } else {
    console.log(`${p.file}: no match`);
  }
}
console.log(`---\nTotal: ${total}`);
