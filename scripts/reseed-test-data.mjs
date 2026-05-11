// kinntore テストデータ再投入
// 1. 既存データ削除 (過去90日)
// 2. 右肩上がりの新規データ投入
//    - 多くの種目は時間とともに重量増加
//    - 一部の種目は意図的に「苦戦中」(横ばい・微減)
//    - 週ごとに少しの上下動 (現実感)
//
// 実行: node scripts/reseed-test-data.mjs

const API = 'https://kinntore-api.33322666666mm.workers.dev';

// 各種目: progressing (伸びる) / struggling (苦戦中・横ばい) / mixed
// progressRate = 60日で base からどれだけ伸びるかの倍率 (1.3 = +30%)
const EXERCISES = {
  chest: [
    { name:'ベンチプレス',         baseWeight: 50, baseReps: 8,  progressRate: 1.30 }, // しっかり伸びる
    { name:'ダンベルプレス',       baseWeight: 20, baseReps: 10, progressRate: 1.25 },
    { name:'インクラインダンベル', baseWeight: 16, baseReps: 10, progressRate: 1.20 },
    { name:'ダンベルフライ',       baseWeight: 12, baseReps: 12, progressRate: 1.05, struggling: true }, // 苦戦中
    { name:'ペックフライ',         baseWeight: 25, baseReps: 12, progressRate: 1.20 },
    { name:'ケーブルフライ',       baseWeight: 15, baseReps: 12, progressRate: 1.08, struggling: true }, // 苦戦中
  ],
  shoulder: [
    { name:'ショルダープレス',     baseWeight: 22, baseReps: 10, progressRate: 1.25 },
    { name:'サイドレイズ',         baseWeight: 6,  baseReps: 12, progressRate: 1.10, struggling: true }, // 苦戦
    { name:'フロントレイズ',       baseWeight: 6,  baseReps: 12, progressRate: 1.15 },
    { name:'リアデルトフライ',     baseWeight: 8,  baseReps: 12, progressRate: 1.20 },
    { name:'ペックデック (リア)',  baseWeight: 20, baseReps: 12, progressRate: 1.22 },
  ],
  back: [
    { name:'ラットプルダウン',     baseWeight: 40, baseReps: 10, progressRate: 1.30 },
    { name:'ベントオーバーロウ',   baseWeight: 30, baseReps: 10, progressRate: 1.28 },
    { name:'デッドリフト',         baseWeight: 60, baseReps: 6,  progressRate: 1.35 }, // ベスト伸び
    { name:'ケーブルロウ',         baseWeight: 35, baseReps: 12, progressRate: 1.25 },
    { name:'アシステッド懸垂',     baseWeight: 0,  baseReps: 6,  progressRate: 1.40, repsProgress: true }, // 重量0、reps が伸びる
  ],
  leg: [
    { name:'バーベルスクワット',   baseWeight: 50, baseReps: 8,  progressRate: 1.35 },
    { name:'レッグプレス',         baseWeight: 100, baseReps: 12, progressRate: 1.30 },
    { name:'レッグエクステンション', baseWeight: 28, baseReps: 12, progressRate: 1.22 },
    { name:'レッグカール',         baseWeight: 25, baseReps: 12, progressRate: 1.10, struggling: true }, // 苦戦
    { name:'カーフレイズ',         baseWeight: 40, baseReps: 15, progressRate: 1.25 },
  ],
  abs: [
    { name:'アブクランチ',         baseWeight: 20, baseReps: 15, progressRate: 1.18 },
    { name:'レッグレイズ',         baseWeight: 0,  baseReps: 12, progressRate: 1.25, repsProgress: true },
    { name:'プランク',             baseWeight: 0,  baseReps: 45, progressRate: 1.40, repsProgress: true }, // 秒数として
    { name:'ロシアンツイスト',     baseWeight: 6,  baseReps: 20, progressRate: 1.05, struggling: true },
    { name:'ハンギングレッグレイズ', baseWeight: 0, baseReps: 8, progressRate: 1.30, repsProgress: true },
  ],
  hip: [
    { name:'ヒップスラスト',       baseWeight: 40, baseReps: 12, progressRate: 1.30 },
    { name:'ブルガリアンスクワット', baseWeight: 10, baseReps: 12, progressRate: 1.20 },
    { name:'グルートブリッジ',     baseWeight: 20, baseReps: 15, progressRate: 1.10, struggling: true },
    { name:'キックバック',         baseWeight: 8,  baseReps: 12, progressRate: 1.25 },
  ],
};

const DAYS_BACK = 60;

function dayKeyOf(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function rand(min, max){return Math.random()*(max-min)+min}
function randInt(min, max){return Math.floor(rand(min, max+1))}
function pick(arr){return arr[randInt(0, arr.length-1)]}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}

// 進捗計算: progress = 0(古い) → 1(新しい)
//   progressing: base * (1 → progressRate) で右肩上がり
//   struggling : progressRate 弱い (週ごとの揺らぎが目立つ)
function calcWeight(ex, progress, setIdx, totalSets) {
  // 基本成長
  const rate = 1 + (ex.progressRate - 1) * progress;
  // 週ごとの揺らぎ (3-4週周期で疲労/回復を模倣)
  const wobble = ex.struggling
    ? Math.sin(progress * Math.PI * 6) * 0.08  // 苦戦: 大きく上下
    : Math.sin(progress * Math.PI * 3) * 0.04; // 普通: 小さく上下
  // セット内変動 (1セット目 95% / 中盤 100% / 最終 92%)
  const setMul = setIdx === 0 ? 0.95 : (setIdx === totalSets - 1 ? 0.92 : 1.0);
  // ランダム微揺れ
  const noise = rand(0.97, 1.03);
  let w = ex.baseWeight * (rate + wobble) * setMul * noise;
  // 2.5刻みで丸め
  w = Math.round(w / 2.5) * 2.5;
  if (w < 0) w = 0;
  return w;
}

function calcReps(ex, progress, setIdx, totalSets) {
  if (ex.repsProgress) {
    // reps が伸びる種目 (重量0系)
    const r = ex.baseReps * (1 + (ex.progressRate - 1) * progress);
    return Math.max(1, Math.round(r + rand(-1, 1)));
  }
  // 通常: base ± 2
  return Math.max(1, ex.baseReps + randInt(-2, 2));
}

function generateSession(date, progress) {
  const tags = ['chest','shoulder','back','leg','abs','hip'];
  const numTags = Math.random() < 0.7 ? 1 : (Math.random() < 0.85 ? 2 : 3);
  const sessionTags = shuffle(tags).slice(0, numTags);
  const sets = [];
  const startHour = randInt(6, 21);
  let minute = randInt(0, 59);
  for (const tag of sessionTags) {
    const exList = EXERCISES[tag];
    const numEx = randInt(3, Math.min(5, exList.length));
    const exercises = shuffle(exList).slice(0, numEx);
    for (const ex of exercises) {
      const setCount = randInt(3, 5);
      for (let s = 0; s < setCount; s++) {
        const w = calcWeight(ex, progress, s, setCount);
        const r = calcReps(ex, progress, s, setCount);
        const t = `${String(startHour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
        sets.push({
          tag,
          exercise_name: ex.name,
          weight: w,
          reps: r,
          day: dayKeyOf(date),
          recorded_at: t,
        });
        minute += randInt(2, 4);
        if (minute >= 60) { minute -= 60; }
      }
    }
  }
  return sets;
}

async function postSet(set) {
  const r = await fetch(API + '/api/sets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(set),
  });
  if (!r.ok) throw new Error('POST failed: ' + r.status);
  return r.json();
}

async function getDay(day) {
  try {
    const r = await fetch(API + '/api/sets?day=' + day);
    if (!r.ok) return [];
    return (await r.json()).sets || [];
  } catch { return []; }
}

async function deleteSet(id) {
  try {
    const r = await fetch(API + '/api/sets/' + id, { method: 'DELETE' });
    return r.ok;
  } catch { return false; }
}

async function clearAll() {
  console.log('🧹 既存データ削除中...');
  const today = new Date(); today.setHours(0,0,0,0);
  const days = [];
  for (let i = 0; i <= DAYS_BACK + 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(dayKeyOf(d));
  }
  // 並列5本で fetch
  let allIds = [];
  for (let i = 0; i < days.length; i += 5) {
    const chunk = days.slice(i, i+5);
    const results = await Promise.all(chunk.map(d => getDay(d)));
    for (const sets of results) {
      for (const s of sets) if (s.id) allIds.push(s.id);
    }
  }
  console.log(`  → ${allIds.length} 件のセットを削除`);
  let ok = 0, ng = 0;
  for (let i = 0; i < allIds.length; i += 10) {
    const chunk = allIds.slice(i, i+10);
    const results = await Promise.all(chunk.map(id => deleteSet(id)));
    for (const r of results) r ? ok++ : ng++;
    if (i % 100 === 0 && i > 0) console.log(`  削除 ${i}/${allIds.length}`);
  }
  console.log(`  ✅ 削除完了 OK:${ok} NG:${ng}`);
}

async function main() {
  await clearAll();

  console.log('🌱 新規データ生成中...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const allSets = [];
  // 過去60日: 古い→新しい順で progress を 0→1 にスケール
  for (let i = DAYS_BACK; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const trainProb = [0.5, 0.85, 0.4, 0.85, 0.4, 0.85, 0.6][dow];
    if (Math.random() > trainProb) continue;
    // progress: 古い日 0 → 新しい日 1
    const progress = (DAYS_BACK - i) / DAYS_BACK;
    const sets = generateSession(d, progress);
    allSets.push(...sets);
  }
  // 今日も少し
  const todaySets = generateSession(today, 1.0);
  const todayTag = todaySets[0]?.tag;
  allSets.push(...todaySets.filter(s => s.tag === todayTag).slice(0, 6));

  console.log(`  → ${allSets.length} sets / ${new Set(allSets.map(s=>s.day)).size} days`);

  let ok = 0, ng = 0;
  for (let i = 0; i < allSets.length; i += 5) {
    const chunk = allSets.slice(i, i + 5);
    const results = await Promise.allSettled(chunk.map(postSet));
    for (const r of results) {
      if (r.status === 'fulfilled') ok++;
      else { ng++; console.warn('  fail:', r.reason?.message); }
    }
    if (i % 100 === 0 && i > 0) console.log(`  投入 ${i}/${allSets.length}`);
  }
  console.log(`\n✅ 完了 OK:${ok} NG:${ng}`);
  console.log('\n伸びる種目:');
  console.log('  胸: ベンチ +30% / DBプレス +25% / インクライン +20% / ペックフライ +20%');
  console.log('  肩: ショルダープレス +25% / フロントレイズ +15% / リアデルト +20%');
  console.log('  背: ラット +30% / ベントオーバー +28% / デッド +35% / ケーブルロウ +25%');
  console.log('  脚: スクワット +35% / レッグプレス +30% / レッグエクステ +22%');
  console.log('  腹: アブクランチ +18% / プランク (秒数) +40%');
  console.log('  尻: ヒップスラスト +30% / ブルガリアン +20%');
  console.log('\n苦戦中の種目:');
  console.log('  DBフライ +5% / ケーブルフライ +8% / サイドレイズ +10%');
  console.log('  レッグカール +10% / ロシアンツイスト +5% / グルートブリッジ +10%');
}

main().catch(console.error);
