import sharp from 'sharp';
// 1536×1024 = 3列×2行 / 各タイル 512×512 (キャラのみ、UI無し)
const SRC = '../画像/部位ページのトップ (2).png';
const W = 512, H = 512;
const tiles = [
  { name: 'chest',    col: 0, row: 0 },
  { name: 'shoulder', col: 1, row: 0 },
  { name: 'back',     col: 2, row: 0 },
  { name: 'leg',      col: 0, row: 1 },
  { name: 'abs',      col: 1, row: 1 },
  { name: 'hip',      col: 2, row: 1 },
];
for (const t of tiles) {
  await sharp(SRC)
    .extract({ left: t.col * W, top: t.row * H, width: W, height: H })
    .toFile(`img/hero-${t.name}.png`);
  console.log('OK hero-' + t.name);
}
