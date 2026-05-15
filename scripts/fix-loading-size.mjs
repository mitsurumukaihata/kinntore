// loading 画像をフルサイズで表示 (clipping 撤廃)
import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['record.html', 'progress.html', 'part-progress.html', 'achievements.html'];

const OLD = `.loading{
  position:relative;min-height:240px;padding:80px 20px 0;
  text-align:center;color:transparent;font-size:0;
  letter-spacing:.18em;overflow:hidden;
}
.loading::before{
  /* 部位キャラの影 (どの部位でも汎用に chest を採用) */
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

const NEW = `.loading{
  position:relative;padding:32px 20px 24px;
  text-align:center;color:transparent;font-size:0;
  letter-spacing:.18em;
}
.loading::before{
  /* 部位キャラの影 — block flow で高さは画像のアスペクト比から決まる */
  content:'';display:block;
  width:78%;max-width:320px;aspect-ratio:941/1672;
  margin:0 auto;
  background:url('img/hero-chest-light.png') no-repeat center / cover;
  opacity:.12;
  filter:grayscale(1) brightness(.6) contrast(.85);
  pointer-events:none;
}
.loading::after{
  /* 三点 "…" を画像の中央にオーバーレイ */
  content:'…';position:absolute;
  top:50%;left:50%;transform:translate(-50%,-50%);
  font-size:24px;color:var(--photo-mute);letter-spacing:.3em;
  font-family:var(--f-mono);opacity:.6;z-index:1;
}
:root[data-theme="light"] .loading::before{opacity:.15;filter:grayscale(1) brightness(.55) contrast(.9)}`;

const OLD_RECORD = OLD.replace('/* 部位キャラの影 (どの部位でも汎用に chest を採用) */\n  ', '');
// (注: record/その他で同じパターンを使用しているはず。違いはコメントだけ。試す)

let total = 0;
const PATTERNS = [OLD, OLD_RECORD];
for (const f of FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  let applied = false;
  for (const pat of PATTERNS) {
    if (src.includes(pat)) {
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
