// PWA icon: 白背景 + 少し角丸 で全サイズ書き出し
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
const IMG = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups/img';

// 元 (原寸 ChatGPT 生成画像) はバックアップ済みのものを使う
const ORIG = path.join(IMG, 'icon-1024-source.png');
const SRC = fs.existsSync(ORIG) ? ORIG : path.join(IMG, 'icon-1024.png');
if (!fs.existsSync(ORIG)) fs.copyFileSync(SRC, ORIG);  // 初回だけバックアップ
const srcBuf = fs.readFileSync(SRC);

const targets = [
  { size: 1024, name: 'icon-1024.png' },
  { size: 512,  name: 'icon-512.png' },
  { size: 192,  name: 'icon-192.png' },
  { size: 180,  name: 'apple-touch-icon.png' },
  { size: 64,   name: 'favicon.png' },
];

const RADIUS_RATIO = 0.10;  // 少し角丸

for (const t of targets) {
  const r = Math.round(t.size * RADIUS_RATIO);
  const maskSvg = Buffer.from(
    `<svg width="${t.size}" height="${t.size}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${t.size}" height="${t.size}" rx="${r}" ry="${r}" fill="white"/>
     </svg>`
  );
  await sharp(srcBuf)
    .flatten({ background: { r:255, g:255, b:255 } })
    .resize(t.size, t.size, { fit: 'contain', background: { r:255, g:255, b:255, alpha:1 } })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toFile(path.join(IMG, t.name));
  console.log(`✓ ${t.name} (${t.size}x${t.size}, r=${r}px)`);
}
console.log('done');
