// =====================================================================
// Step 1 — Create DEPOSIT checkout  (POST /api/create-checkout)
// ---------------------------------------------------------------------
// Public endpoint (clients use it from the website).
// For Website Development → charges a ₱5,000 deposit, stores the full
// order (tier + balance) so a balance checkout can be created later.
// For Website Update → single ₱2,000 payment (no balance).
//
// Saves the order + a session index to Redis, so the webhook can later
// tell whether a paid session was the deposit or the balance.
// =====================================================================
import { redisSet, redisGetJSON, redisConfigured, redisIndexPush } from '../lib/redis.js';
import { createCheckoutSession, TIERS, DEPOSIT, UPDATE_PRICE } from '../lib/paymongo.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return jsonResponse(405, { error: 'Method Not Allowed' });
  if (!redisConfigured()) {
    return jsonResponse(500, { error: 'Database (Upstash Redis) is not configured.' });
  }

  let input;
  try { input = await req.json(); } catch { return jsonResponse(400, { error: 'Invalid request body.' }); }

  const clientName    = String(input.clientName || '');
  const clientEmail   = String(input.clientEmail || '');
  const purpose       = String(input.purpose || 'dev');      // "dev" | "update"
  const tier          = Number(input.tier) || 0;
  const method        = String(input.method || '');

  const isUpdate = purpose === 'update';
  if (isUpdate) {
    // One-shot ₱2,000 update — no tier needed.
    const order = newOrder({ clientName, clientEmail, purposeLabel: 'Website Update', tier: 0, totalCost: UPDATE_PRICE, depositAmount: UPDATE_PRICE, isOneShot: true });
    const session = await createCheckoutSession({
      amountPHP: UPDATE_PRICE,
      name: 'Website Update',
      description: 'Website Update — ₱2,000',
      metadata: depositMetadata(order),
      method,
      successUrl: successUrl(order.orderId, false),
      cancelUrl: siteBase() + '/payment.html'
    });
    order.depositSessionId = session.id;
    await persistOrder(order, session.id);
    return jsonResponse(200, { checkoutUrl: session.checkoutUrl, orderId: order.orderId });
  }

  // Website Development → deposit flow.
  if (!TIERS[tier]) return jsonResponse(400, { error: 'A valid tier (1–4) is required.' });
  const totalCost = TIERS[tier].full;
  const purposeLabel = 'Website Development';
  const order = newOrder({ clientName, clientEmail, purposeLabel, tier, totalCost, depositAmount: DEPOSIT, isOneShot: false });

  const session = await createCheckoutSession({
    amountPHP: DEPOSIT,
    name: 'Service Deposit',
    description: `${purposeLabel} — Tier ${tier} (${TIERS[tier].name}) deposit`,
    metadata: depositMetadata(order),
    method,
    successUrl: successUrl(order.orderId, true),
    cancelUrl: siteBase() + '/payment.html'
  });
  order.depositSessionId = session.id;
  await persistOrder(order, session.id);
  return jsonResponse(200, { checkoutUrl: session.checkoutUrl, orderId: order.orderId });
}

// ---- helpers ----
function newOrder({ clientName, clientEmail, purposeLabel, tier, totalCost, depositAmount, isOneShot }) {
  return {
    orderId: 'ksm-' + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36)),
    clientName, clientEmail,
    purposeLabel, tier, totalCost, depositAmount,
    isOneShot,
    depositSessionId: null,
    balanceSessionId: null,
    depositPaid: false,
    balancePaid: isOneShot ? true : false, // one-shot has no balance
    createdAt: new Date().toISOString()
  };
}

function depositMetadata(order) {
  return {
    type: order.isOneShot ? 'full' : 'deposit',
    order_id: order.orderId,
    client_name: order.clientName,
    client_email: order.clientEmail,
    payment_purpose: order.purposeLabel + (order.tier ? ' (Tier ' + order.tier + ')' : ''),
    total_cost: order.totalCost,
    deposit_amount: order.depositAmount
  };
}

function successUrl(orderId, isDev) {
  return siteBase() + (isDev ? '/deposit-success.html?order=' : '/payment-success.html?order=') + orderId;
}

function siteBase() {
  return (process.env.SITE_URL || 'https://kensama.com').replace(/\/$/, '');
}

async function persistOrder(order, sessionId) {
  await redisSet('kensama:order:' + order.orderId, order);     // the order record
  await redisSet('kensama:session:' + sessionId, order.orderId); // session → order index
  await redisIndexPush(order.orderId);                          // admin list
}

function jsonResponse(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
