// =====================================================================
// Step 2 — Create BALANCE checkout  (POST /api/create-balance-checkout)
// ---------------------------------------------------------------------
// DEV-ONLY endpoint (requires the ADMIN_TOKEN header).
// Called after you finish the client's website: it looks up the order,
// computes the remaining balance (totalCost − deposit), and creates a
// hosted checkout for it. You then send the returned URL to the client.
//
// ENV: PAYMONGO_SECRET_KEY, ADMIN_TOKEN, SITE_URL
// =====================================================================
import { redisGetJSON, redisSet } from '../lib/redis.js';
import { createCheckoutSession } from '../lib/paymongo.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return jsonResponse(405, { error: 'Method Not Allowed' });

  // ---- Admin auth ----
  const token = req.headers.get('x-admin-token') || '';
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return jsonResponse(401, { error: 'Unauthorized — invalid admin token.' });
  }

  let input;
  try { input = await req.json(); } catch { return jsonResponse(400, { error: 'Invalid request body.' }); }

  const orderId = String(input.orderId || '');
  const order = await redisGetJSON('kensama:order:' + orderId, null);
  if (!order) return jsonResponse(404, { error: 'Order not found.' });
  if (order.isOneShot) return jsonResponse(400, { error: 'This order is a one-shot payment with no balance.' });
  if (!order.depositPaid) return jsonResponse(400, { error: 'The deposit has not been paid yet.' });
  if (order.balancePaid) return jsonResponse(400, { error: 'This order is already fully paid.' });

  const balanceAmount = Math.max(0, order.totalCost - order.depositAmount);
  if (balanceAmount <= 0) return jsonResponse(400, { error: 'No balance is due for this order.' });

  const session = await createCheckoutSession({
    amountPHP: balanceAmount,
    name: 'Service Balance',
    description: `${order.purposeLabel} — balance (${fmt(balanceAmount)})`,
    metadata: {
      type: 'balance',
      order_id: order.orderId,
      client_name: order.clientName,
      client_email: order.clientEmail,
      payment_purpose: order.purposeLabel + ' — balance',
      balance_amount: balanceAmount
    },
    method: String(input.method || ''),
    successUrl: siteBase() + '/balance-success.html?order=' + order.orderId,
    cancelUrl: siteBase() + '/payment.html'
  });

  order.balanceSessionId = session.id;
  await redisSet('kensama:order:' + order.orderId, order);
  await redisSet('kensama:session:' + session.id, order.orderId);

  return jsonResponse(200, {
    checkoutUrl: session.checkoutUrl,
    orderId: order.orderId,
    clientName: order.clientName,
    clientEmail: order.clientEmail,
    balanceAmount: fmt(balanceAmount)
  });
}

function siteBase() { return (process.env.SITE_URL || 'https://kensama.com').replace(/\/$/, ''); }
function fmt(n) { return '₱' + Number(n).toLocaleString('en-PH'); }
function jsonResponse(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
