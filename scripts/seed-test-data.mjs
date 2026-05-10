// kinntore テストデータ投入スクリプト
// 過去60日に渡って、週2-4回のトレーニングセッションを生成
// 各セッション: 1-2部位、3-5種目、3-5セット
// 重量は徐々に増えるよう調整

const API = 'https://kinntore-api.33322666666mm.workers.dev';

const EXERCISES = {
  chest: [
    { name:'ベンチプレス', baseWeight: 60, baseReps: 8, progress: 0.5 },
    { name:'ダンベルプレス', baseWeight: 22, baseReps: 10, progress: 0.3 },
    { name:'インクラインダンベル', baseWeight: 18, baseReps: 10, progress: 0.3 },
    { name:'ダンベルフライ', baseWeight: 14, baseReps: 12, progress: 0.2 },
    { name:'ペックフライ', baseWeight: 28, baseReps: 12, progress: 0.4 },
    { name:'ケーブルフライ', baseWeight: 18, baseReps: 12, progress: 0.3 },
  ],
  shoulder: [
    { name:'ショルダープレス', baseWeight: 28, baseReps: 10, progress: 0.4 },
    { name:'サイドレイズ', baseWeight: 8, baseReps: 12, progress: 0.15 },
    { name:'フロントレイズ', baseWeight: 8, baseReps: 12, progress: 0.15 },
    { name:'リアデルトフライ', baseWeight: 10, baseReps: 12, progress: 0.2 },
    { name:'ペックデック (リア)', baseWeight: 24, baseReps: 12, progress: 0.3 },
  ],
  back: [
    { name:'ラットプルダウン', baseWeight: 50, baseReps: 10, progress: 0.5 },
    { name:'ベントオーバーロウ', baseWeight: 40, baseReps: 10, progress: 0.4 },
    { name:'デッドリフト', baseWeight: 80, baseReps: 6, progress: 0.6 },
    { name:'ケーブルロウ', baseWeight: 45, baseReps: 12, progress: 0.4 },
    { name:'アシステッド懸垂', baseWeight: 0, baseReps: 8, progress: 0.1 },
  ],
  leg: [
    { name:'バーベルスクワット', baseWeight: 70, baseReps: 8, progress: 0.7 },
    { name:'レッグプレス', baseWeight: 120, baseReps: 12, progress: 1.2 },
    { name:'レッグエクステンション', baseWeight: 35, baseReps: 12, progress: 0.4 },
    { name:'レッグカール', baseWeight: 30, baseReps: 12, progress: 0.3 },
    { name:'カーフレイズ', baseWeight: 50, baseReps: 15, progress: 0.5 },
  ],
  abs: [
    { name:'アブクランチ', baseWeight: 25, baseReps: 15, progress: 0.2 },
    { name:'レッグレイズ', baseWeight: 0, baseReps: 15, progress: 0.05 },
    { name:'プランク', baseWeight: 0, baseReps: 60, progress: 0.5 },
    { name:'ロシアンツイスト', baseWeight: 8, baseReps: 20, progress: 0.1 },
    { name:'ハンギングレッグレイズ', baseWeight: 0, baseReps: 12, progress: 0.05 },
  ],
  hip: [
    { name:'ヒップスラスト', baseWeight: 50, baseReps: 12, progress: 0.5 },
    { name:'ブルガリアンスクワット', baseWeight: 14, baseReps: 12, progress: 0.2 },
    { name:'グルートブリッジ', baseWeight: 25, baseReps: 15, progress: 0.3 },
    { name:'キックバック', baseWeight: 12, baseReps: 12, progress: 0.15 },
  ],
};

const DAYS_BACK = 60;

function dayKeyOf(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function rand(min, max){return Math.random()*(max-min)+min}
function randInt(min, max){return Math.floor(rand(min, max+1))}
function pick(arr){return arr[randInt(0, arr.length-1)]}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}

// 1セッション分のセットを生成 (週ごとに重量が微増)
function generateSession(date, weekIdx, totalWeeks) {
  const tags = ['chest','shoulder','back','leg','abs','hip'];
  // 1セッションで1-2部位 (たまに大日で3部位)
  const numTags = Math.random() < 0.7 ? 1 : (Math.random() < 0.85 ? 2 : 3);
  const sessionTags = shuffle(tags).slice(0, numTags);
  const sets = [];
  // 進捗係数 0~1 (古い→新しい)
  const progressMul = (totalWeeks - weekIdx) / totalWeeks; // 古いほど大きい
  const growth = 1 - progressMul * 0.3; // 古い日は少なめ、新しい日は base に近い
  const startHour = randInt(6, 21);
  let minute = randInt(0, 59);

  for (const tag of sessionTags) {
    const exList = EXERCISES[tag];
    // 種目数: 3-5
    const numEx = randInt(3, Math.min(5, exList.length));
    const exercises = shuffle(exList).slice(0, numEx);
    for (const ex of exercises) {
      const setCount = randInt(3, 5);
      for (let s = 1; s <= setCount; s++) {
        // 重量: 基本 × 成長率 × ±10%、+ 最終セットは少し下げる
        const setMul = s === setCount ? 0.92 : (s === 1 ? 0.95 : 1);
        let w = Math.round(ex.baseWeight * growth * setMul * rand(0.92, 1.05));
        // 2.5 刻みに丸める
        w = Math.round(w / 2.5) * 2.5;
        if (w < 0) w = 0;
        // レップ: 基本 ± 2
        let r = ex.baseReps + randInt(-2, 2);
        if (r < 1) r = 1;
        // 時刻
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

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 過去60日について、週2-4回でランダムにセッション
  const allSets = [];
  for (let i = DAYS_BACK; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay(); // 0=日, 6=土
    // 月水金 + 土日は確率高め、火木は休み気味
    const trainProb = [0.5, 0.85, 0.4, 0.85, 0.4, 0.85, 0.6][dow];
    if (Math.random() > trainProb) continue;
    const weekIdx = Math.floor(i / 7);
    const totalWeeks = Math.ceil(DAYS_BACK / 7);
    const sets = generateSession(d, weekIdx, totalWeeks);
    allSets.push(...sets);
  }
  // 今日も少し記録
  const todaySets = generateSession(today, 0, Math.ceil(DAYS_BACK / 7));
  // 今日は最初の1部位のみ (進行中ぽく)
  const todayTag = todaySets[0]?.tag;
  allSets.push(...todaySets.filter(s => s.tag === todayTag).slice(0, 6));

  console.log(`Generating ${allSets.length} sets across ${new Set(allSets.map(s=>s.day)).size} days`);
  console.log('Posting...');

  let ok = 0, ng = 0;
  // 並列5本ずつ
  for (let i = 0; i < allSets.length; i += 5) {
    const chunk = allSets.slice(i, i + 5);
    const results = await Promise.allSettled(chunk.map(postSet));
    for (const r of results) {
      if (r.status === 'fulfilled') ok++;
      else { ng++; console.warn('fail:', r.reason?.message); }
    }
    if (i % 50 === 0) console.log(`progress ${i}/${allSets.length}`);
  }
  console.log(`✅ Done. OK: ${ok} / NG: ${ng}`);
}

main().catch(console.error);
