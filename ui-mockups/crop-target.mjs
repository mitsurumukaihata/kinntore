import sharp from 'sharp';
// 1402×1122 = 3列×2行 / 各タイル ~467×561
const SRC = '../画像/本日のターゲット用.png';
const W = Math.floor(1402 / 3), H = Math.floor(1122 / 2);
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
    .toFile(`img/target-${t.name}.png`);
  console.log('OK target-' + t.name);
}
