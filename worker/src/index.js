// kinntore-api Worker — D1 で筋トレ記録の保存/取得
// CORS: GitHub Pages + ローカル開発用に *.github.io と localhost を許可

const ALLOW_ORIGINS = [
  'https://mitsurumukaihata.github.io',
  'http://localhost:8765',
  'http://127.0.0.1:8765',
];

function cors(origin) {
  const allow = ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}

function todayUTCDate() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    try {
      // GET /api/sets?day=YYYY-MM-DD&tag=chest&exercise=...
      if (url.pathname === '/api/sets' && request.method === 'GET') {
        const day = url.searchParams.get('day') || todayUTCDate();
        const tag = url.searchParams.get('tag');
        const exercise = url.searchParams.get('exercise');

        let sql = 'SELECT id, day, tag, exercise_name, set_no, weight, reps, recorded_at FROM workout_logs WHERE day = ?';
        const args = [day];
        if (tag) { sql += ' AND tag = ?'; args.push(tag); }
        if (exercise) { sql += ' AND exercise_name = ?'; args.push(exercise); }
        sql += ' ORDER BY tag, exercise_name, set_no';

        const r = await env.DB.prepare(sql).bind(...args).all();
        return json({ sets: r.results || [] }, 200, origin);
      }

      // POST /api/sets  body: { tag, exercise_name, weight, reps, day?, recorded_at? }
      if (url.pathname === '/api/sets' && request.method === 'POST') {
        const body = await request.json();
        const day = body.day || todayUTCDate();
        const now = new Date();
        const recordedAt = body.recorded_at
          || (String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'));

        if (!body.tag || !body.exercise_name) {
          return json({ error: 'tag and exercise_name required' }, 400, origin);
        }

        // 次のセット番号を計算
        const cnt = await env.DB
          .prepare('SELECT COUNT(*) as c FROM workout_logs WHERE day = ? AND tag = ? AND exercise_name = ?')
          .bind(day, body.tag, body.exercise_name)
          .first();
        const setNo = (cnt?.c || 0) + 1;

        const r = await env.DB
          .prepare('INSERT INTO workout_logs (day, tag, exercise_name, set_no, weight, reps, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(day, body.tag, body.exercise_name, setNo, +body.weight, +body.reps, recordedAt)
          .run();
        return json({ ok: true, id: r.meta.last_row_id, set_no: setNo }, 200, origin);
      }

      // DELETE /api/sets/:id (個別削除)
      const delMatch = url.pathname.match(/^\/api\/sets\/(\d+)$/);
      if (delMatch && request.method === 'DELETE') {
        const id = +delMatch[1];
        await env.DB.prepare('DELETE FROM workout_logs WHERE id = ?').bind(id).run();
        return json({ ok: true }, 200, origin);
      }

      // PATCH /api/sets/:id  body: { weight?, reps?, recorded_at? }  (個別編集)
      if (delMatch && request.method === 'PATCH') {
        const id = +delMatch[1];
        const body = await request.json();
        const fields = [];
        const args = [];
        if (body.weight !== undefined) { fields.push('weight = ?'); args.push(+body.weight); }
        if (body.reps !== undefined) { fields.push('reps = ?'); args.push(+body.reps); }
        if (body.recorded_at !== undefined) { fields.push('recorded_at = ?'); args.push(body.recorded_at); }
        if (fields.length === 0) return json({ error:'no fields' }, 400, origin);
        args.push(id);
        await env.DB.prepare(`UPDATE workout_logs SET ${fields.join(', ')} WHERE id = ?`).bind(...args).run();
        return json({ ok: true }, 200, origin);
      }

      // DELETE /api/sets/last  body: { day?, tag, exercise_name } 直近1セット削除 (Undo用)
      if (url.pathname === '/api/sets/last' && request.method === 'POST') {
        const body = await request.json();
        const day = body.day || todayUTCDate();
        const last = await env.DB
          .prepare('SELECT id FROM workout_logs WHERE day = ? AND tag = ? AND exercise_name = ? ORDER BY set_no DESC LIMIT 1')
          .bind(day, body.tag, body.exercise_name)
          .first();
        if (last) {
          await env.DB.prepare('DELETE FROM workout_logs WHERE id = ?').bind(last.id).run();
          return json({ ok: true, deleted_id: last.id }, 200, origin);
        }
        return json({ ok: false, message: 'no set to delete' }, 200, origin);
      }

      // GET /api/summary?from=YYYY-MM-DD&to=YYYY-MM-DD (期間集計、ボリューム推移用)
      if (url.pathname === '/api/summary' && request.method === 'GET') {
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to') || todayUTCDate();
        const tag = url.searchParams.get('tag');
        let sql = 'SELECT day, tag, SUM(weight * reps) as volume, COUNT(*) as sets FROM workout_logs WHERE day BETWEEN ? AND ?';
        const args = [from || '2024-01-01', to];
        if (tag) { sql += ' AND tag = ?'; args.push(tag); }
        sql += ' GROUP BY day, tag ORDER BY day';
        const r = await env.DB.prepare(sql).bind(...args).all();
        return json({ summary: r.results || [] }, 200, origin);
      }

      // ヘルスチェック
      if (url.pathname === '/' || url.pathname === '/health') {
        return json({ ok: true, service: 'kinntore-api' }, 200, origin);
      }

      return json({ error: 'not found' }, 404, origin);
    } catch (e) {
      return json({ error: String(e?.message || e) }, 500, origin);
    }
  },
};
