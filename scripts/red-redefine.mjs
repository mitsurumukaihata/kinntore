// CORE24 温度調整: 赤の再定義
// 鮮やかな朱赤 → 古いインク / 残留温度 (#7D2530 系)
// 演出変更なし、色値のみ
import fs from 'fs';
import path from 'path';

const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const TARGETS = [
  'home.html', 'record.html', 'progress.html', 'pattern-i.html',
  'settings.html', 'achievements.html', 'part-progress.html',
  'tokens-preview.html'
];

// 色置換マップ (用途別に濃淡を残す)
const REPLACEMENTS = [
  // メイン: 鮮やか朱赤 → 古いインク
  [/#E63946/g, '#7D2530'],
  [/#e63946/g, '#7D2530'],
  // deep: 暗赤 → さらに沈ませる
  [/#B22838/g, '#5F1E27'],
  [/#b22838/g, '#5F1E27'],
  // morning: 明るめ朱 → やや赤紫寄りの faded
  [/#E85565/g, '#8C2F3D'],
  [/#e85565/g, '#8C2F3D'],
  // day/evening: 中間 → メインに揃え
  [/#D43D4D/g, '#7A2530'],
  [/#d43d4d/g, '#7A2530'],
  // night: 既に暗いが、もう一段沈める
  [/#B83340/g, '#5F1E27'],
  [/#b83340/g, '#5F1E27'],
  // rgba 値: 230,57,70 系 → 125,37,48 系 (アルファ保存)
  [/rgba\(230,\s*57,\s*70/g, 'rgba(125, 37, 48'],
  [/rgba\(232,\s*85,\s*101/g, 'rgba(140, 47, 61'],
  [/rgba\(212,\s*61,\s*77/g, 'rgba(122, 37, 48'],
  [/rgba\(184,\s*51,\s*64/g, 'rgba(95, 30, 39'],
  // CORE24 トークン (core24-tokens.css) 用 — 既に #A61E2D で faded だが、温度を揃える
  // 注: tokens-preview.html は core24-tokens.css 経由なので、CSS 側で対応
];

const css = path.join(DIR, 'css', 'core24-tokens.css');
const cssReplacements = [
  [/--accent-rust:\s*#A61E2D/g, '--accent-rust:       #7D2530'],
  [/--accent-rust-deep:\s*#7D1622/g, '--accent-rust-deep:  #5F1E27'],
  [/rgba\(166,\s*30,\s*45,\s*0\.14\)/g, 'rgba(125, 37, 48, 0.16)'],
  [/rgba\(166,\s*30,\s*45,\s*0\.10\)/g, 'rgba(125, 37, 48, 0.12)'],
];

let totalChanges = 0;
for (const f of TARGETS) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) {
    console.log(`skip (not found): ${f}`);
    continue;
  }
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  for (const [pat, rep] of REPLACEMENTS) {
    const m = src.match(pat);
    if (m) {
      count += m.length;
      src = src.replace(pat, rep);
    }
  }
  if (count > 0) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(`${f}: ${count} replacements`);
    totalChanges += count;
  } else {
    console.log(`${f}: 0 (no red)`);
  }
}

// CORE24 tokens CSS
if (fs.existsSync(css)) {
  let src = fs.readFileSync(css, 'utf8');
  let count = 0;
  for (const [pat, rep] of cssReplacements) {
    const m = src.match(pat);
    if (m) {
      count += m.length;
      src = src.replace(pat, rep);
    }
  }
  if (count > 0) {
    fs.writeFileSync(css, src, 'utf8');
    console.log(`css/core24-tokens.css: ${count} replacements`);
    totalChanges += count;
  }
}

console.log(`---\nTotal: ${totalChanges} replacements`);
