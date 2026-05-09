import sharp from 'sharp';
// 1055x1491 = 3列×2行 / 各タイル ~351×745
// 各タイル上部の キャラクター部分のみ (タグバー＋焼込タイトル除外) を切出して hero にする
const SRC = '../画像/部位ページのトップ.png';
const TILE_W = 351, TILE_H = 745;
// 各タイルの「キャラクターだけ」を切出し (UI要素・タイトル・タグバー除外)
// 赤リボンは全画像で baked されているわけではないので CSS 側で共通追加する
const CROP_TOP = 110, CROP_HEIGHT = 145;
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
    .extract({
      left: t.col * TILE_W,
      top: t.row * TILE_H + CROP_TOP,
      width: TILE_W,
      height: CROP_HEIGHT,
    })
    .toFile(`img/hero-${t.name}.png`);
  console.log('OK hero-' + t.name);
}
