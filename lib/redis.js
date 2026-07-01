// =====================================================================
// Tiny Upstash Redis helper (HTTP REST — no npm packages needed).
// Works in Vercel Edge functions.
//
// ENV — set EITHER way (both are read automatically):
//   • Option A — Vercel dashboard → Storage → Create → Upstash Redis
//       (auto-injects KV_REST_API_URL / KV_REST_API_TOKEN)
//   • Option B — upstash.com, paste manually:
//       UPSTASH_REDIS_REST_URL  → https://xxxxxx.upstash.io
//       UPSTASH_REDIS_REST_TOKEN → xxxxxxxxxxxxxxxx
// =====================================================================
const BASE = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export function redisConfigured() {
  return !!(BASE && TOKEN);
}

export async function redisGet(key) {
  const res = await fetch(`${BASE}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  const data = await res.json().catch(() => ({}));
  return data.result ?? null;
}

export async function redisGetJSON(key, fallback = null) {
  const raw = await redisGet(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export async function redisSet(key, value) {
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  const res = await fetch(`${BASE}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'text/plain' },
    body
  });
  const data = await res.json().catch(() => ({}));
  return data.result === 'OK';
}

// Append an orderId to the index list so the admin panel can list all orders.
export async function redisIndexPush(orderId) {
  const raw = await redisGet('kensama:orders:index');
  let arr = [];
  try { arr = raw ? JSON.parse(raw) : []; } catch { arr = []; }
  if (!arr.includes(orderId)) arr.push(orderId);
  return redisSet('kensama:orders:index', arr);
}
