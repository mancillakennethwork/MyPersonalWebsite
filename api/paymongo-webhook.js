// =====================================================================
// Step 3 — PayMongo Webhook Handler  (POST /api/paymongo-webhook)
// ---------------------------------------------------------------------
//  1. Read raw body + paymongo-signature header
//  2. Verify the HMAC-SHA256 signature (prevents forged notifications)
//  3. On payment success → match the session to an order (deposit or balance)
//  4. Set depositPaid / balancePaid flags (persisted to Redis)
//  5. Email you via FormSubmit (your existing email service)
//  6. Always return 200 OK so PayMongo stops retrying
//
// ENV: PAYMONGO_WEBHOOK_SECRET, OWNER_EMAIL
// =====================================================================
import { redisGetJSON, redisGet, redisSet } from '../lib/redis.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const signatureHeader = req.headers.get('paymongo-signature') || '';
  const rawBody = await req.text(); // RAW — required for verification
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('PAYMONGO_WEBHOOK_SECRET is not set.');
    return new Response('Webhook secret not configured', { status: 200 });
  }

  // ---- 1) Verify signature ----
  let valid = false;
  try { valid = await verifyPayMongoSignature(signatureHeader, rawBody, webhookSecret); }
  catch (err) { console.error('Signature verification error:', err); }
  if (!valid) return new Response('Unauthorized - Invalid Signature', { status: 401 });

  // ---- 2) Parse payload ----
  let payload;
  try { payload = JSON.parse(rawBody); }
  catch { return new Response('Invalid payload', { status: 400 }); }

  const eventType = payload?.data?.attributes?.type || '';
  const isSuccess = eventType.includes('payment.paid') || eventType.includes('payment_succeeded');
  if (!isSuccess) return new Response('Event ignored', { status: 200 });

  // ---- 3) Find the session id + metadata, then the order ----
  const sessionId = payload?.data?.id || '';
  const metadata = payload?.data?.attributes?.data?.attributes?.metadata
                || payload?.data?.attributes?.metadata || {};
  const amountPaid = formatCurrency((payload?.data?.attributes?.data?.attributes?.amount || 0) / 100);

  // Resolve the order: by metadata.order_id first, then by the session index.
  let order = null;
  if (metadata.order_id) order = await redisGetJSON('kensama:order:' + metadata.order_id, null);
  if (!order && sessionId) {
    const orderIdBySession = await redisGet('kensama:session:' + sessionId);
    if (orderIdBySession) order = await redisGetJSON('kensama:order:' + orderIdBySession, null);
  }

  const paymentType = metadata.type || (order && sessionId === order.balanceSessionId ? 'balance' : 'deposit');

  if (order) {
    if (sessionId === order.depositSessionId || paymentType === 'deposit' || paymentType === 'full') {
      order.depositPaid = true;
      if (order.isOneShot) order.balancePaid = true;
    }
    if (sessionId === order.balanceSessionId || paymentType === 'balance') {
      order.balancePaid = true;
    }
    await redisSet('kensama:order:' + order.orderId, order);
  }

  // ---- 4) Email you via FormSubmit ----
  try {
    await sendEmail({
      to: process.env.OWNER_EMAIL || 'kensama1206@gmail.com',
      subject: buildSubject(order, paymentType, amountPaid),
      body: buildBody(order, paymentType, amountPaid)
    });
    console.log('Payment alert sent:', order?.orderId, paymentType);
  } catch (emailError) {
    // Payment succeeded — never fail the webhook because of the email.
    console.error('Email failed but payment was successful:', emailError);
  }

  return new Response('Event received', { status: 200 });
}

function buildSubject(order, type, amount) {
  const label = type === 'balance' ? 'BALANCE' : (order && order.isOneShot ? 'PAYMENT' : 'DEPOSIT');
  const who = order ? ` — ${order.clientName}` : '';
  return `💰 ${label} Received (${amount})${who}`;
}

function buildBody(order, type, amount) {
  if (!order) return `A payment of ${amount} was received.\n\n(Session metadata was minimal; check your PayMongo dashboard.)`;
  const lines = [
    'A payment was received successfully.',
    '',
    'Client:',
    '- Name: ' + order.clientName,
    '- Email: ' + order.clientEmail,
    '',
    'Order:',
    '- Order ID: ' + order.orderId,
    '- Purpose: ' + order.purposeLabel + (order.tier ? ' (Tier ' + order.tier + ')' : ''),
    '- Total cost: ' + fmt(order.totalCost),
    '- This payment: ' + amount + ' (' + (type === 'balance' ? 'balance' : order.isOneShot ? 'full' : 'deposit') + ')',
    '',
    'Status:',
    '- Deposit paid: ' + (order.depositPaid ? 'YES' : 'no'),
    '- Balance paid: ' + (order.balancePaid ? 'YES' : 'no'),
    '- Fully paid: ' + (order.depositPaid && order.balancePaid ? 'YES ✅' : 'no')
  ];
  return lines.join('\n');
}

function fmt(n) { return '₱' + Number(n).toLocaleString('en-PH'); }
function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------------------------------------------------------------------
// Signature verification: header = t=<timestamp>,te=<sig>
// signature = HMAC-SHA256( secret , "<timestamp>.<rawBody>" )
// ---------------------------------------------------------------------
async function verifyPayMongoSignature(header, rawBody, secret) {
  if (!header) return false;
  let timestamp = '', signature = '';
  for (const part of header.split(',')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === 't') timestamp = v; else signature = v;
  }
  if (!timestamp || !signature) return false;

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (isNaN(age) || age > 300 || age < -300) return false; // 5-min tolerance

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(timestamp + '.' + rawBody));
  const computed = bufferToHex(sigBuf);
  return timingSafeEqualHex(computed, signature);
}
function bufferToHex(buf) { return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''); }
function timingSafeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------------------------------------------------------------------
// Email via FormSubmit (reuses your activated address — no new service)
// ---------------------------------------------------------------------
async function sendEmail({ to, subject, body }) {
  const endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(to);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ _subject: subject, _template: 'table', message: body })
  });
  const data = await res.json().catch(() => ({}));
  const ok = res.ok && (data.success === 'true' || data.success === true);
  if (!ok) throw new Error('FormSubmit error: ' + (data.message || res.status));
  return data;
}
