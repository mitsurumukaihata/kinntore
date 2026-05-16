import fs from 'fs';
import path from 'path';
const DIR = 'C:/Users/Mitsuru Mukaihata/Desktop/kinntore/ui-mockups';
const FILES = ['home.html','pattern-i.html','record.html','progress.html','part-progress.html','settings.html','achievements.html'];

for (const f of FILES) {
  const p = path.join(DIR, f);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  s = s.replace(
    /<link rel="apple-touch-icon" href="img\/icon-192\.png">/,
    '<link rel="apple-touch-icon" href="img/apple-touch-icon.png?v=icon1">\n<link rel="icon" href="img/favicon.png?v=icon1">'
  );
  if (s !== before) {
    fs.writeFileSync(p, s, 'utf8');
    console.log(`✓ ${f}`);
  }
}
