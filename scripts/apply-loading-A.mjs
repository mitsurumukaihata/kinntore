// CORE24 loading Phase A を progress/part-progress/achievements に適用
import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['progress.html', 'part-progress.html', 'achievements.html'];

const NEW = `/* CORE24 loading (Phase A): キャラの影だけ + 三点 "…"
   "読込中" は監視UI感が強いので消す。画像で「居る気配」を残す */
.loading{
  position:relative;min-height:240px;padding:80px 20px 0;
  text-align:center;color:transparent;font-size:0;
  letter-spacing:.18em;overflow:hidden;
}
.loading::before{
  content:'';position:absolute;bottom:0;left:50%;
  transform:translateX(-50%);
  width:64%;max-width:240px;aspect-ratio:941/1672;
  background:url('img/hero-chest-light.png') no-repeat center bottom / cover;
  opacity:.10;
  filter:grayscale(1) brightness(.6) contrast(.85);
  pointer-events:none;
}
.loading::after{
  content:'…';position:relative;display:block;
  font-size:20px;color:var(--photo-mute);letter-spacing:.3em;
  font-family:var(--f-mono);opacity:.55;z-index:1;
  padding-top:8px;
}
:root[data-theme="light"] .loading::before{opacity:.13;filter:grayscale(1) brightness(.55) contrast(.9)}`;

const PATTERNS = [
  /\.loading\{text-align:center;padding:40px 20px;color:var\(--photo-mute\);font-family:var\(--f-display\);font-size:11px;letter-spacing:\.18em\}/,
  /\.loading\{text-align:center;padding:40px;color:var\(--photo-mute\);font-family:var\(--f-display\);font-size:11px;letter-spacing:\.18em\}/,
];

let total = 0;
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  let applied = false;
  for (const pat of PATTERNS) {
    if (pat.test(src)) {
      src = src.replace(pat, NEW);
      applied = true;
      break;
    }
  }
  if (applied) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: applied`);
    total++;
  } else {
    console.log(`${f}: no match`);
  }
}
console.log(`---\nTotal: ${total}`);
