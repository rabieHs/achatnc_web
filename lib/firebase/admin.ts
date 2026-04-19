import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Used by server-side routes (SSR, route handlers, webhooks).
// Never import this from a client component.

let cachedApp: App | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  const existing = getApps()[0];
  if (existing) {
    cachedApp = existing;
    return existing;
  }

  const raw = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (!raw) {
    throw new Error(
      'FIREBASE_ADMIN_CREDENTIALS is missing. Generate a service account key in Firebase Console → Project Settings → Service accounts and paste the JSON into .env.local.',
    );
  }

  const credentials = JSON.parse(raw);
  cachedApp = initializeApp({
    credential: cert(credentials),
    projectId: credentials.project_id,
  });
  return cachedApp;
}

export const adminAuth: Auth = getAuth(getAdminApp());
export const adminDb: Firestore = getFirestore(getAdminApp());
