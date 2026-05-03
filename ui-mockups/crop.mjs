import sharp from 'sharp';
// reference.png は 1536×1024 = 4列×2行 グリッド (各タイル 384×512)
// 各タイル内の上40px (ステータスバー) と下70px (ボタン) を除外して人物だけ抜く
const HEADER = 40, FOOTER = 70;
const tiles = [
  { name: 'hero',    left: 0,    top: 0 },     // 左上 (TRAIN HARD)
  { name: 'tile-tr', left: 1152, top: 0 },     // 右上 (上半身を鍛える日)
  { name: 'tile-bl', left: 0,    top: 512 },   // 左下 (WEEK 1)
  { name: 'tile-br', left: 1152, top: 512 },   // 右下 (実績)
  { name: 'tile-2',  left: 384,  top: 0 },     // 上から2番目 (ワークアウトを開始)
];
for (const t of tiles) {
  await sharp('img/reference.png')
    .extract({ left: t.left, top: t.top + HEADER, width: 384, height: 512 - HEADER - FOOTER })
    .toFile(`img/${t.name}.png`);
  console.log('✅', t.name);
}
