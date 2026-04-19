import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { BOOST_PRICE_IDS, getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      idToken?: string;
      listingId?: string;
      productId?: string;
    };
    if (!body.idToken || !body.listingId || !body.productId) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }
    const priceId = BOOST_PRICE_IDS[body.productId];
    if (!priceId) {
      return NextResponse.json({ error: 'unknown_product' }, { status: 400 });
    }

    // Verify Firebase ID token and that the caller owns the listing.
    const decoded = await adminAuth().verifyIdToken(body.idToken);
    const listingSnap = await adminDb()
      .collection('listings')
      .doc(body.listingId)
      .get();
    if (!listingSnap.exists) {
      return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
    }
    const listing = listingSnap.data();
    if (listing?.sellerId !== decoded.uid) {
      return NextResponse.json({ error: 'not_owner' }, { status: 403 });
    }

    const origin =
      req.headers.get('origin') ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: decoded.uid,
      metadata: {
        listingId: body.listingId,
        userId: decoded.uid,
        productId: body.productId,
      },
      success_url: `${origin}/annonce/${body.listingId}?boost=success`,
      cancel_url: `${origin}/annonce/${body.listingId}?boost=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('checkout error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
