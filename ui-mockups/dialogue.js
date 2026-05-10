// kinntore Dialogue v1.1
// CORE24 世界観: モリゾウとリンは「同じジムにいる存在」。寄り添うが踏み込まない。
// 270行 = 15 states × 2 chars × 3 styles × 3 variations
// レビューは review-as-you-go (Notion DB Status で個別NGマーク可、ここから除外時は再生成)

window.DIALOGUE_DATA = {
  set_recorded: {
    morizou: {
      gentle: ['1セット、いいリズムだな。', '完遂、お疲れ。', '悪くない流れだぞ。'],
      balanced: ['1セット完了。', '次もいけるな。', 'やり切ったな。'],
      strict: ['……まだ行けそうだな。', 'もう一段、上を狙ってもいいぞ。', '次もそのまま行け。']
    },
    rin: {
      gentle: ['1セット、お疲れさま。', 'ちゃんと積み上がってる。', '呼吸、整えてね。'],
      balanced: ['1セット完了ね。', '次へ進みましょう。', '順調よ。'],
      strict: ['まだ伸びる余地、あるはずよ。', 'ここから一段、上を見て。', 'そのまま積み上げましょう。']
    }
  },
  first_session: {
    morizou: {
      gentle: ['おう、はじめましてだな。', 'ここに来てくれたな。', 'ゆっくりでいい、始めようぜ。'],
      balanced: ['ここからだ。', '1セット目、いくか。', '始めるか。'],
      strict: ['本気で来たな、いいぞ。', 'ここからが本番だ。', '1から、積んでいくぞ。']
    },
    rin: {
      gentle: ['はじめまして。', '今日から、よろしくね。', 'ゆっくりで大丈夫よ。'],
      balanced: ['始めましょう。', 'ここからね。', '1セット目、いきましょう。'],
      strict: ['本気で続ける気なら、応えるわ。', 'ここから、続けていきましょう。', '真っ直ぐ、いきましょう。']
    }
  },
  comeback_short: {
    morizou: {
      gentle: ['おう、ちょっとぶりだな。', '戻ってきたな。', 'また会えたな。'],
      balanced: ['{days}日ぶりだな。', '再開だな。', '今日も来たな。'],
      strict: ['{days}日。続けていくぞ。', '戻ってきたら、また積むぞ。', 'ペース、戻していくぞ。']
    },
    rin: {
      gentle: ['おかえりなさい。', '{days}日ぶりね。', 'また会えたわね。'],
      balanced: ['{days}日ぶり。', '再開ね。', '戻ってきたわね。'],
      strict: ['{days}日、空いたわね。ここから戻していきましょう。', 'リズム、取り戻していくわ。', 'ペース、もう一度作っていきましょう。']
    }
  },
  comeback_long: {
    morizou: {
      gentle: ['{days}日ぶりだな。', 'また来てくれたな。', 'おかえり。'],
      balanced: ['{days}日か。再開だな。', 'ここからまた積むぞ。', '戻ってきたな。'],
      strict: ['{days}日、空いたな。1から行くぞ。', '焦らずに、戻していくぞ。', 'ここからまた本気でな。']
    },
    rin: {
      gentle: ['{days}日ぶり、おかえりなさい。', 'また会えてよかった。', 'ゆっくりで大丈夫よ。'],
      balanced: ['{days}日ぶりね。', '再開、いいタイミングよ。', 'ここからもう一度、ね。'],
      strict: ['{days}日のブランク、ここから埋めていきましょう。', '焦らずに、でも真剣に。', 'また積み上げていくわよ。']
    }
  },
  streak_3: {
    morizou: {
      gentle: ['3日続けたな、いい流れだ。', 'リズムができてきたな。', '悪くない調子だぞ。'],
      balanced: ['3日連続。', '続いてるな。', 'リズム、保ってるな。'],
      strict: ['3日。まだ序の口だ、続けるぞ。', 'ここからが本番だぞ。', '勢い、止めるな。']
    },
    rin: {
      gentle: ['3日連続、すごいね。', 'リズム、できてきてる。', 'いい流れね。'],
      balanced: ['3日続いたわね。', 'リズム、できてるわ。', '順調ね。'],
      strict: ['3日、まだスタート地点。続けて。', 'ここから本当の継続が始まるわ。', '勢いを、止めないで。']
    }
  },
  streak_7: {
    morizou: {
      gentle: ['7日続けたか。すごいな。', '1週間、立派だぞ。', 'ここまで来たな。'],
      balanced: ['7日連続。', '1週間、ちゃんと続いてるな。', 'ここまで積んだか。'],
      strict: ['7日続いたな。次の壁、行くぞ。', '1週間。これを当たり前にしろ。', '勢い、加速させていくぞ。']
    },
    rin: {
      gentle: ['7日連続、本当に偉い。', '1週間、続けてくれたのね。', 'ちゃんと積み上がってる。'],
      balanced: ['7日連続ね。', '1週間、続いたわ。', '順調そのものね。'],
      strict: ['7日。ここからが本当の継続よ。', '1週間を当たり前にしましょう。', '次の階段、上りましょう。']
    }
  },
  streak_30: {
    morizou: {
      gentle: ['30日続いたな。本当にすごいぞ。', '1ヶ月、立派だ。', 'ここまで積んだか、認めるしかないな。'],
      balanced: ['30日連続。', '1ヶ月続いたな。', 'もう習慣だな。'],
      strict: ['30日。これが標準だ、続けろ。', 'もう完全に流れできてるな。', 'ここまで来たら、止まる理由がないだろ。']
    },
    rin: {
      gentle: ['30日、本当に尊敬する。', '1ヶ月続けたあなたを、見ていたわ。', 'ちゃんと積み上がったわね。'],
      balanced: ['30日連続ね。', '1ヶ月、続いたわ。', 'もう習慣ね。'],
      strict: ['30日。これが当たり前よ。', '1ヶ月、ここからが面白くなる。', '止まる理由、なくなったわね。']
    }
  },
  achievement_unlock: {
    morizou: {
      gentle: ['新しいバッジ、いいな。', '実績、増えたな。', '積み上げてきた証だ。'],
      balanced: ['バッジ解除。', '実績、追加されたな。', 'ひとつ達成。'],
      strict: ['次も、見えてきたな。', '1個獲っても、終わりじゃないぞ。', 'ここからが本番だ。']
    },
    rin: {
      gentle: ['新しいバッジ、おめでとう。', 'ちゃんと積み上がった証ね。', '実績、ひとつ増えたわ。'],
      balanced: ['バッジ解除ね。', '実績、追加。', 'ひとつ達成。'],
      strict: ['次のバッジも、視野に入れて。', '1個で満足しないで。', 'ここから先も、続けていきましょう。']
    }
  },
  new_pb: {
    morizou: {
      gentle: ['新記録だな、認めるわ。', 'PR更新、お前の力だ。', 'ここまで伸ばしたな。'],
      balanced: ['PR更新。', '記録、塗り替えたな。', '新しい数字、入ったぞ。'],
      strict: ['新記録だ。次はこれが基準だぞ。', 'PR更新、まだ序の口だ。', 'ここからまた伸ばすぞ。']
    },
    rin: {
      gentle: ['新記録、おめでとう。', 'PR更新ね、すごいわ。', 'ちゃんと伸びてる。'],
      balanced: ['PR更新ね。', '記録、塗り替えたわ。', '新しい数字、入ったわ。'],
      strict: ['新記録。次はこれが標準よ。', 'PR、まだまだ伸びる。', 'ここから、また上を見て。']
    }
  },
  broke_101pct: {
    morizou: {
      gentle: ['昨日を超えたな、いい仕事だ。', '101%、達成だ。', '1%、ちゃんと積んだな。'],
      balanced: ['101%、超えた。', '昨日より上、いいな。', 'ルール、守ったな。'],
      strict: ['101%。明日もこれを超えるぞ。', '1%、止まるな。', 'ここから毎日積むぞ。']
    },
    rin: {
      gentle: ['101%、おつかれさま。', '昨日を超えたわね。', '1%、ちゃんと積み上げた。'],
      balanced: ['101%、達成ね。', '昨日より上、いいわ。', 'ルール、守ったわね。'],
      strict: ['101%。明日も超えていきましょう。', '1%、止めないで。', 'ここから、毎日積むのよ。']
    }
  },
  huge_overshoot: {
    morizou: {
      gentle: ['今日は飛ばしたな、すごいぞ。', '圧倒的だな、認めるわ。', '別格の数字だ。'],
      balanced: ['130%超え。', '今日は別物だな。', '数字、跳ねたな。'],
      strict: ['化け物か。', 'ここまで持ち上げたか。', '今日のお前、止められないな。']
    },
    rin: {
      gentle: ['今日は別格ね、すごいわ。', '圧倒的、おつかれさま。', 'ちゃんと振り切ったのね。'],
      balanced: ['130%超えね。', '今日は別物。', '数字、跳ねたわ。'],
      strict: ['これがあなたの本気ね。', 'ここまで持ち上げるとは。', '今日のあなた、誰も止められないわ。']
    }
  },
  shoulder_focus: {
    morizou: {
      gentle: ['肩、今日もいくか。', '肩は俺の領域だな。', '今日のメニュー、悪くないな。'],
      balanced: ['肩、いくか。', '今日は肩だな。', 'サイド・リア・フロント、攻めるぞ。'],
      strict: ['肩、効かせていくぞ。', '今日はぱんぱんにしていけ。', '三角筋、追い込め。']
    },
    rin: {
      gentle: ['肩の日ね、おつかれさま。', 'ゆっくり可動域、取ってね。', '丁寧にいきましょう。'],
      balanced: ['肩、いきましょう。', '今日は肩ね。', '三角筋、刺激していくわ。'],
      strict: ['肩、しっかり効かせて。', '姿勢を崩さずに、いきましょう。', 'ここで追い込むのよ。']
    }
  },
  glutes_focus: {
    morizou: {
      gentle: ['お尻の日か、いいな。', 'ヒップ、効かせていけ。', '下半身、固めていくぞ。'],
      balanced: ['お尻、いくか。', '今日はお尻だな。', '下半身の日。'],
      strict: ['お尻、追い込んでいけ。', 'ヒップヒンジ、丁寧にな。', 'ここ、丁寧にいこうぜ。']
    },
    rin: {
      gentle: ['お尻の日ね、私の領域。', 'ヒップ、丁寧に効かせていきましょう。', '姿勢から、整えていきましょう。'],
      balanced: ['お尻、いきましょう。', '今日はお尻ね。', 'ヒップヒンジ、意識して。'],
      strict: ['お尻、しっかり効かせて。', '可動域、最大限に。', 'ここでバランス、作っていくの。']
    }
  },
  late_night: {
    morizou: {
      gentle: ['こんな時間まで、お疲れ。', '夜だな、無理すんなよ。', '今日もよく来たな。'],
      balanced: ['夜だな。', 'こんな時間か。', '今日も来たか。'],
      strict: ['夜中だろうが、関係ないな。', '時間関係なく、積むんだろ。', '夜こそ、集中できるかもな。']
    },
    rin: {
      gentle: ['夜遅くまで、おつかれさま。', '無理しないでね。', 'ゆっくりでいいわ。'],
      balanced: ['こんな時間ね。', '夜ね。', '今日も来たわね。'],
      strict: ['夜中でも、続ける。それがあなた。', '時間は関係ないわね。', '静かな時間、集中できるはずよ。']
    }
  },
  all_done: {
    morizou: {
      gentle: ['今日も終わりだな、お疲れ。', 'やり切ったな、いい1日だ。', 'ちゃんと積んだな。'],
      balanced: ['セッション完了。', '今日はここまで。', '全部終わったな。'],
      strict: ['今日の積み上げ、明日に繋げろ。', '回復も大事だからな。', '次もこのレベル、保つぞ。']
    },
    rin: {
      gentle: ['今日もおつかれさま。', 'ちゃんと終えたわね。', 'ゆっくり休んでね。'],
      balanced: ['セッション完了ね。', '今日はここまで。', '全部、終わったわ。'],
      strict: ['今日の積み上げ、明日に活かして。', '回復も大事よ。', '次もこの調子で、続けていきましょう。']
    }
  }
};

// 担当部位 (出現率 bias)
window.DIALOGUE_PARTS = {
  morizou: ['肩', '腕', '胸'],
  rin: ['お尻', '脚', '腹']
  // 背中, ふくらはぎ は共通 (50:50)
};

// セリフ選択
// state: dialogue state key
// opts: { character?, style?, bodyPart?, recent?: [], vars?: {} }
window.pickDialogue = function(state, opts) {
  opts = opts || {};
  var data = window.DIALOGUE_DATA;
  if (!data || !data[state]) return null;

  // キャラ選択 (Body Part bias)
  var chars = ['morizou', 'rin'];
  if (opts.bodyPart) {
    if (window.DIALOGUE_PARTS.morizou.indexOf(opts.bodyPart) >= 0) {
      chars = Math.random() < 0.8 ? ['morizou'] : ['rin'];
    } else if (window.DIALOGUE_PARTS.rin.indexOf(opts.bodyPart) >= 0) {
      chars = Math.random() < 0.8 ? ['rin'] : ['morizou'];
    }
  }
  var character = opts.character || chars[Math.floor(Math.random() * chars.length)];

  // スタイル選択 (default: localStorage / balanced)
  var style = opts.style || localStorage.getItem('kinntore_interaction_style') || 'balanced';

  function getPool(ch, st) {
    return (data[state][ch] && data[state][ch][st]) ? data[state][ch][st] : null;
  }
  // fallback: balanced → other char balanced
  var pool = getPool(character, style) || getPool(character, 'balanced');
  if (!pool) {
    var other = character === 'morizou' ? 'rin' : 'morizou';
    pool = getPool(other, style) || getPool(other, 'balanced');
    if (pool) character = other;
  }
  if (!pool || !pool.length) return null;

  // 直近 24h で出したものを除外
  var recent = opts.recent || [];
  var candidates = pool.filter(function(p) { return recent.indexOf(p) < 0; });
  var list = candidates.length ? candidates : pool;
  var line = list[Math.floor(Math.random() * list.length)];

  // 変数注入 {days} など
  if (opts.vars) {
    Object.keys(opts.vars).forEach(function(k) {
      line = line.replace(new RegExp('\\{' + k + '\\}', 'g'), opts.vars[k]);
    });
  }

  return { line: line, character: character, style: style };
};

// 状態判定: 101% カードの計算結果から dialogue state を選ぶ
// ctx: { isNewPB, isHuge, achieved, lastVol, todayVol, daysSinceLast, dailyStreak, isLateNight }
window.mapToDialogueState = function(ctx) {
  if (ctx.isNewPB) return 'new_pb';
  if (ctx.isHuge) return 'huge_overshoot';
  if (ctx.achieved) return 'broke_101pct';
  if (ctx.dailyStreak >= 30) return 'streak_30';
  if (ctx.dailyStreak >= 7) return 'streak_7';
  if (ctx.dailyStreak >= 3) return 'streak_3';
  if (ctx.daysSinceLast >= 7) return 'comeback_long';
  if (ctx.daysSinceLast >= 3) return 'comeback_short';
  if (ctx.lastVol === 0 && ctx.todayVol === 0) return 'first_session';
  if (ctx.isLateNight) return 'late_night';
  return 'set_recorded';
};
