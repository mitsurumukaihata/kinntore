// CORE24 温度調整③ LIGHT の整いすぎ崩し
// - LIGHT 背景に 2-3 層の radial-gradient (机の隅の影 / 古紙のくすみ)
// - ノイズ層に mask で量の不均一化 (場所による濃淡)
// - 新規演出ゼロ。「自然な不均一」として読まれるものだけ
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const TARGETS = ['home.html', 'record.html', 'progress.html', 'pattern-i.html', 'settings.html'];

// 各ページの LIGHT 背景 1層 radial → 3層 radial に置換
// (暖光 + 左下影 + 右上くすみ)
const oldLightApp = /:root\[data-theme="light"\] \.app\{\s*background:\s*radial-gradient\(160% 70% at 50% -10%, rgba\(255, 248, 232, 0\.32\), transparent 55%\),\s*#e8e6e0;\s*\}/g;
const newLightApp = `:root[data-theme="light"] .app{
  background:
    radial-gradient(160% 70% at 50% -10%, rgba(255, 248, 232, 0.32), transparent 55%),
    radial-gradient(120% 60% at 12% 110%, rgba(160, 130, 95, 0.08), transparent 50%),
    radial-gradient(80% 50% at 95% 5%, rgba(140, 115, 80, 0.04), transparent 60%),
    #e8e6e0;
}`;

// LIGHT ノイズ層に mask を入れて量を不均一に
// (mask 値: 中央 1.0、端 0.45。場所による濃淡差で "使い込まれた紙" 感)
const oldLightNoise = /:root\[data-theme="light"\] \.app::before\{opacity:\.06\}/g;
const newLightNoise = `:root[data-theme="light"] .app::before{opacity:.06;
  -webkit-mask-image: radial-gradient(120% 80% at 30% 60%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.45) 85%);
  mask-image: radial-gradient(120% 80% at 30% 60%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.45) 85%);
}`;

// DARK にも同様の "場所による濃淡差" を入れる (微弱に)
const oldDarkApp = /\.app\{\s*position:relative;background:\s*radial-gradient\(160% 70% at 50% -10%, rgba\(40, 30, 35, 0\.30\), transparent 55%\),\s*var\(--photo-bg\);\s*\}/g;
const newDarkApp = `.app{
  position:relative;
  background:
    radial-gradient(160% 70% at 50% -10%, rgba(40, 30, 35, 0.30), transparent 55%),
    radial-gradient(100% 60% at 8% 105%, rgba(0, 0, 0, 0.25), transparent 55%),
    var(--photo-bg);
}`;

let totalChanges = 0;
for (const f of TARGETS) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) { console.log(`skip: ${f}`); continue; }
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  const m1 = src.match(oldLightApp);
  if (m1) { count += m1.length; src = src.replace(oldLightApp, newLightApp); }
  const m2 = src.match(oldLightNoise);
  if (m2) { count += m2.length; src = src.replace(oldLightNoise, newLightNoise); }
  const m3 = src.match(oldDarkApp);
  if (m3) { count += m3.length; src = src.replace(oldDarkApp, newDarkApp); }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count} blocks updated`);
    totalChanges += count;
  } else {
    console.log(`${f}: 0 (no match — pattern check needed)`);
  }
}

console.log(`---\nTotal: ${totalChanges} block updates`);
