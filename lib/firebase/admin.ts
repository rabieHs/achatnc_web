import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Used by server-side routes (SSR, route handlers, webhooks).
// Never import this from a client component.

let cachedApp: App | null = null;

function parseCredentials(raw: string): Record<string, unknown> {
  // Vercel's env var UI does not strip surrounding quotes the way dotenv
  // does locally. If the pasted JSON was wrapped in single or double
  // quotes we strip them before parsing.
  let value = raw.trim();
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }
  return JSON.parse(value) as Record<string, unknown>;
}

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

  const credentials = parseCredentials(raw);
  cachedApp = initializeApp({
    credential: cert(credentials as Parameters<typeof cert>[0]),
    projectId: credentials.project_id as string,
  });
  return cachedApp;
}

// Lazy getters so that importing this module doesn't initialize the SDK
// (which can throw at build time if env vars aren't available to the
// page-data collection step).
export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}
