// ふくらはぎ (calf) 関連を全削除
import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';

function patch(file, fn) {
  const p = path.join(DIR, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after, 'utf8');
    console.log(`✓ ${file}`);
  } else {
    console.log(`- ${file} (no change)`);
  }
}

// home.html: calf 部位タイル削除
patch('home.html', s => s
  .replace(/\s*<a class="p" href="pattern-i\.html#calf"[^>]*>[\s\S]*?<\/a>\n/, '\n')
  .replace(/,\s*calf:'ふくらはぎ'/g, '')
);

// pattern-i.html: ORDER, calf pattern, カーフレイズ, calf 配列要素, muscles 'カーフ'
patch('pattern-i.html', s => s
  .replace(/,calf:1/g, '')
  .replace(/,'calf'/g, '')
  .replace(/'calf',/g, '')
  .replace(/,\s*calf:'ふくらはぎ'/g, '')
  // カーフレイズ メニュー行 (leg内) 削除
  .replace(/\s*\{name:'カーフレイズ'[^}]*\},\n/, '\n')
  // leg.muscles から 'カーフ' 削除
  .replace(/,'カーフ'/g, '')
  // calf パターン定義ブロック全体削除
  .replace(/\s*calf:\s*\{[\s\S]*?items:\[[\s\S]*?\],\s*\},\n/, '\n')
);

// 残り5ファイル: TAG_LABEL / TAG_EN / 配列 から calf 削除
for (const f of ['record.html','progress.html','part-progress.html','settings.html','achievements.html']) {
  patch(f, s => s
    .replace(/,\s*calf:'ふくらはぎ'/g, '')
    .replace(/,\s*calf:'CALVES'/g, '')
    .replace(/,'calf'/g, '')
    .replace(/'calf',/g, '')
  );
}

// dialogue.js: コメント更新
patch('dialogue.js', s => s.replace('背中, ふくらはぎ は共通', '背中 は共通'));
