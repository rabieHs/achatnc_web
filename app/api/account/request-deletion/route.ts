import { NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getBearerToken(request: Request) {
  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
}

function isAllowedHost(request: Request) {
  const host = request.headers.get('host');

  return (
    host === 'achats.nc' ||
    host === 'www.achats.nc' ||
    host === 'localhost:3000'
  );
}

export async function POST(request: Request) {
  try {
    if (!isAllowedHost(request)) {
      return NextResponse.json({ error: 'Forbidden host' }, { status: 403 });
    }

    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth().verifyIdToken(token);

    const uid = decodedToken.uid;
    const email = decodedToken.email ?? null;

    const now = new Date();
    const deleteAfter = new Date(now.getTime() + THIRTY_DAYS_MS);

    const db = adminDb();
    const batch = db.batch();

    const deletionRequestRef = db.collection('deletionRequests').doc(uid);
    const userRef = db.collection('users').doc(uid);

    batch.set(
      deletionRequestRef,
      {
        uid,
        email,
        status: 'scheduled',
        requestedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        deleteAfter: Timestamp.fromDate(deleteAfter),
        processedAt: null,
      },
      { merge: true },
    );

    batch.set(
      userRef,
      {
        deletionRequested: true,
        deletionRequestedAt: FieldValue.serverTimestamp(),
        deletionDeleteAfter: Timestamp.fromDate(deleteAfter),
      },
      { merge: true },
    );

    await batch.commit();

    return NextResponse.json({
      ok: true,
      deleteAfter: deleteAfter.toISOString(),
    });
  } catch (error) {
    console.error('request-deletion error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
