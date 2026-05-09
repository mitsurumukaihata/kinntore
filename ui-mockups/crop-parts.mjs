import sharp from 'sharp';
// 1254x1254 / 2行×3列 → 各タイル 418×627
const SRC = '../画像/部位別（ダッシュボード用）.png';
const W = 418, H = 627;
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
    .toFile(`img/part-${t.name}.png`);
  console.log('OK', t.name);
}
