// =====================================================================
// Step 4 — Order status  (GET /api/order-status)
// ---------------------------------------------------------------------
//   ?token=ADMIN_TOKEN&order=<id>   → one order
//   ?token=ADMIN_TOKEN&list=1       → all orders (for the admin panel)
// Requires the ADMIN_TOKEN so order data stays private.
// =====================================================================
import { redisGetJSON, redisGet } from '../lib/redis.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return jsonResponse(401, { error: 'Unauthorized — invalid admin token.' });
  }

  // List all orders
  if (url.searchParams.get('list') === '1') {
    const raw = await redisGet('kensama:orders:index');
    let ids = [];
    try { ids = raw ? JSON.parse(raw) : []; } catch { ids = []; }
    const orders = [];
    for (const id of ids) {
      const o = await redisGetJSON('kensama:order:' + id, null);
      if (o) orders.push(o);
    }
    // newest first
    orders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return jsonResponse(200, { orders });
  }

  const orderId = url.searchParams.get('order') || '';
  const order = await redisGetJSON('kensama:order:' + orderId, null);
  if (!order) return jsonResponse(404, { error: 'Order not found.' });
  return jsonResponse(200, { order, fullyPaid: !!(order.depositPaid && order.balancePaid) });
}

function jsonResponse(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
