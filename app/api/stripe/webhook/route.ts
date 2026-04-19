import { NextResponse, type NextRequest } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import { BOOST_DURATION_DAYS, getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error('Invalid Stripe signature', err);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const listingId = session.metadata?.listingId;
  const userId = session.metadata?.userId;
  const productId = session.metadata?.productId;
  const days = productId ? BOOST_DURATION_DAYS[productId] : undefined;

  if (!listingId || !userId || !productId || !days) {
    console.warn('webhook: missing metadata', session.id);
    return NextResponse.json({ received: true });
  }

  try {
    const listingRef = adminDb().collection('listings').doc(listingId);
    const listingSnap = await listingRef.get();
    if (!listingSnap.exists) {
      console.warn('webhook: listing not found', listingId);
      return NextResponse.json({ received: true });
    }
    const data = listingSnap.data() ?? {};
    if (data.sellerId !== userId) {
      console.warn('webhook: owner mismatch', { listingId, userId });
      return NextResponse.json({ received: true });
    }

    const existing = (data.featuredUntil as Timestamp | undefined)?.toDate();
    const now = new Date();
    const startFrom = existing && existing > now ? existing : now;
    const newUntil = new Date(
      startFrom.getTime() + days * 24 * 60 * 60 * 1000,
    );

    await listingRef.update({
      featuredUntil: Timestamp.fromDate(newUntil),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb().collection('boostPurchases').add({
      listingId,
      userId,
      productId,
      days,
      amount: session.amount_total,
      currency: session.currency,
      stripeSessionId: session.id,
      featuredUntil: Timestamp.fromDate(newUntil),
      source: 'stripe',
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
