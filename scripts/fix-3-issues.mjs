// 残り3つの問題を一括修正
// ① home: チャート + ドットと下タブの間隔
// ③ 全ページ: 下タブ max-width:420px → 100%
// ④ 記録/進捗/部位進捗/実績: loading 画像を画面いっぱい (viewport fill)
import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';

// ③ 全ページの .tab max-width:420px → 100%
const TAB_FILES = ['home.html','pattern-i.html','record.html','progress.html','settings.html','achievements.html','part-progress.html'];
const tabPatterns = [
  /\.tab\{position:fixed;bottom:0;left:50%;transform:translateX\(-50%\);width:100%;max-width:420px;/g,
];
const tabNew = '.tab{position:fixed;bottom:0;left:0;transform:none;width:100%;max-width:100%;';

let tabCount = 0;
for (const f of TAB_FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  let changed = false;
  for (const pat of tabPatterns) {
    if (pat.test(src)) {
      src = src.replace(pat, tabNew);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`tab fixed: ${f}`);
    tabCount++;
  }
}

// ④ loading 画像を viewport fill に
const LOAD_FILES = ['record.html','progress.html','part-progress.html','achievements.html'];
const oldLoad = `.loading{
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

const newLoad = `.loading{
  position:relative;min-height:60vh;padding:0;
  text-align:center;color:transparent;font-size:0;
  letter-spacing:.18em;overflow:hidden;
}
.loading::before{
  /* キャラを viewport いっぱいに敷く (端が見えない自然な背景化) */
  content:'';position:fixed;
  top:0;left:0;width:100vw;height:100vh;
  background:url('img/hero-chest-light.png') no-repeat center / cover;
  opacity:.16;
  filter:grayscale(1) brightness(.6) contrast(.85);
  pointer-events:none;
  z-index:0;
}
.loading::after{
  /* 三点 "…" を画面中央にオーバーレイ */
  content:'…';position:fixed;
  top:50%;left:50%;transform:translate(-50%,-50%);
  font-size:28px;color:var(--photo-mute);letter-spacing:.3em;
  font-family:var(--f-mono);opacity:.6;z-index:1;
  pointer-events:none;
}
:root[data-theme="light"] .loading::before{opacity:.20;filter:grayscale(1) brightness(.55) contrast(.9)}`;

let loadCount = 0;
for (const f of LOAD_FILES) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  if (src.includes(oldLoad)) {
    src = src.replace(oldLoad, newLoad);
    fs.writeFileSync(p, src, 'utf8');
    console.log(`loading fullscreen: ${f}`);
    loadCount++;
  }
}

console.log(`---\ntab:${tabCount} load:${loadCount}`);
