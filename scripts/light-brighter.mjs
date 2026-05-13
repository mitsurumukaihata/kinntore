// CORE24 LIGHT を「冬晴れ / 朝の白い光」方向に引き上げ
// 直前の Phase 7 で 古紙寄り に振りすぎた可能性を補正
// "汚す" のではなく "明るく静か" へ
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const TARGETS = ['home.html', 'record.html', 'progress.html', 'pattern-i.html', 'settings.html', 'achievements.html'];

// 直前の LIGHT app 3層 radial → 軽量化 (茶色影を半減・くすみ撤去)
const oldLightApp = /:root\[data-theme="light"\] \.app\{\s*background:\s*radial-gradient\(160% 70% at 50% -10%, rgba\(255, 248, 232, 0\.32\), transparent 55%\),\s*radial-gradient\(120% 60% at 12% 110%, rgba\(160, 130, 95, 0\.08\), transparent 50%\),\s*radial-gradient\(80% 50% at 95% 5%, rgba\(140, 115, 80, 0\.04\), transparent 60%\),\s*#e8e6e0;\s*\}/g;
const newLightApp = `:root[data-theme="light"] .app{
  background:
    /* 上から差し込む白い光 (冬晴れ / 朝10時の窓光) */
    radial-gradient(180% 80% at 50% -15%, rgba(255, 252, 246, 0.38), transparent 60%),
    /* 左下に薄ーいニュートラルな影 (机の隅、青みも入れて夏冬中庸) */
    radial-gradient(110% 55% at 10% 110%, rgba(120, 125, 130, 0.035), transparent 55%),
    /* 少し明るくした紙色 (#e8e6e0 → #ECEAE3、Apple白には行かない) */
    #ECEAE3;
}`;

// ノイズ mask: 端の薄まり方を緩やかに (0.45 → 0.78)、より均一寄りに
const oldLightNoise = /:root\[data-theme="light"\] \.app::before\{opacity:\.06;\s*-webkit-mask-image: radial-gradient\(120% 80% at 30% 60%, rgba\(0,0,0,1\) 30%, rgba\(0,0,0,0\.45\) 85%\);\s*mask-image: radial-gradient\(120% 80% at 30% 60%, rgba\(0,0,0,1\) 30%, rgba\(0,0,0,0\.45\) 85%\);\s*\}/g;
const newLightNoise = `:root[data-theme="light"] .app::before{opacity:.04;
  -webkit-mask-image: radial-gradient(130% 90% at 35% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 90%);
  mask-image: radial-gradient(130% 90% at 35% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 90%);
}`;

let totalChanges = 0;
for (const f of TARGETS) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) { continue; }
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  const m1 = src.match(oldLightApp);
  if (m1) { count += m1.length; src = src.replace(oldLightApp, newLightApp); }
  const m2 = src.match(oldLightNoise);
  if (m2) { count += m2.length; src = src.replace(oldLightNoise, newLightNoise); }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count}`);
    totalChanges += count;
  } else {
    console.log(`${f}: 0 (no match)`);
  }
}
console.log(`---\nTotal: ${totalChanges}`);
