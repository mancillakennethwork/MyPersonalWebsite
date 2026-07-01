// =====================================================================
// PayMongo Checkout Session helper (shared by deposit + balance endpoints).
// Native fetch — no npm packages. Uses Basic auth with the secret key.
//
// ENV: PAYMONGO_SECRET_KEY  (sk_live_... or sk_test_...)
// =====================================================================
const PAYMONGO_API = 'https://api.paymongo.com/v1/checkout_sessions';

export const TIERS = {
  1: { name: 'Starter', full: 5000 },
  2: { name: 'Basic', full: 20000 },
  3: { name: 'Professional', full: 40000 }
};
export const DEPOSIT = 5000;
export const UPDATE_PRICE = 2000;

function mapMethod(method) {
  const m = String(method || '').toLowerCase();
  if (m.includes('gcash')) return 'gcash';
  if (m.includes('maya')) return 'paymaya';
  if (m.includes('bank') || m.includes('card')) return 'card';
  return '';
}

// Creates a hosted checkout session and returns { id, checkoutUrl }.
export async function createCheckoutSession({ amountPHP, name, description, metadata, method, successUrl, cancelUrl }) {
  const secret = process.env.PAYMONGO_SECRET_KEY;
  if (!secret) throw new Error('PAYMONGO_SECRET_KEY is not set.');

  const auth = btoa(secret + ':');
  const attributes = {
    send_email_receipt: true,
    show_description: true,
    description,
    metadata,
    line_items: [{ name, amount: Math.round(amountPHP) * 100, currency: 'PHP', quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl
  };
  // NOTE: we deliberately do NOT restrict payment_method_allowed. This lets
  // PayMongo's hosted checkout show ALL methods (Card, GCash, Maya, QR Ph),
  // so the client picks whatever is convenient — and you can test with the
  // test card (4343 4343 4343 4343). The chosen method is still saved in metadata.

  const res = await fetch(PAYMONGO_API, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + auth,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ data: { attributes } })
  });

  const data = await res.json();
  if (!res.ok || !data?.data?.attributes?.checkout_url) {
    throw new Error('PayMongo error: ' + JSON.stringify(data?.errors || data));
  }
  return {
    id: data.data.id,
    checkoutUrl: data.data.attributes.checkout_url
  };
}
