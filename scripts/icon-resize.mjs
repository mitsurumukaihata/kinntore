// PWA icon resize: 1024 → 512 / 192 / 180 / 64
import sharp from 'sharp';
import path from 'path';
const IMG = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups/img';
const src = path.join(IMG, 'icon-1024.png');

const targets = [
  { size: 512, name: 'icon-512.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 64,  name: 'favicon.png' },
];

for (const t of targets) {
  await sharp(src)
    .resize(t.size, t.size, { fit: 'contain', background: { r:255, g:255, b:255, alpha:1 } })
    .png()
    .toFile(path.join(IMG, t.name));
  console.log(`✓ ${t.name} (${t.size}x${t.size})`);
}
console.log('done');
