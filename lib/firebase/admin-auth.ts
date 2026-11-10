// ============================================================
// GIVORA — SERVER-SIDE ADMIN AUTHENTICATION & SESSION MANAGEMENT
// Trusted server-side token verification and HMAC-signed session cookies
// ============================================================
import * as crypto from 'crypto';
import { cookies } from 'next/headers';
import type { AdminRole } from '@/types';

export interface AdminSession {
  uid: string;
  email: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
}

const SESSION_COOKIE_NAME = 'givora_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const SECRET_KEY = process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || 'givora_luxury_secure_admin_secret_key_2026';

/**
 * Sign session payload with HMAC-SHA256
 */
export function signSession(payload: AdminSession): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify and parse HMAC-SHA256 session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AdminSession = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Verify Firebase ID Token via Google Identity Toolkit
 * This validates directly with Google's servers that the token was issued by our Firebase project
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string; email: string; emailVerified: boolean } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error('Firebase configuration missing on server');
  }

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Firebase ID token verification failed:', errorData);
    return null;
  }

  const data = await response.json();
  const user = data.users?.[0];

  if (!user || !user.localId) {
    return null;
  }

  return {
    uid: user.localId,
    email: user.email || '',
    emailVerified: user.emailVerified || false,
  };
}

/**
 * Set secure HTTP-only admin session cookie
 */
export async function setAdminSessionCookie(session: AdminSession) {
  const cookieStore = await cookies();
  const token = signSession(session);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

/**
 * Get current admin session from HTTP-only cookie
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
