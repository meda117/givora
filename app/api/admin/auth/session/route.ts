import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken, setAdminSessionCookie } from '@/lib/firebase/admin-auth';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import type { AdminRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid Firebase ID token' },
        { status: 400 }
      );
    }

    // 1. Verify token directly with Google / Firebase
    const verifiedUser = await verifyFirebaseIdToken(idToken);
    if (!verifiedUser) {
      return NextResponse.json(
        { success: false, error: 'Firebase authentication failed or token is expired' },
        { status: 401 }
      );
    }

    const { uid, email } = verifiedUser;
    const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();

    // 2. Verify Administrator Authorization
    let role: AdminRole | null = null;
    let isSuperAdmin = false;

    // Check if user is the designated initial Super Admin
    if (initialAdminEmail && email.toLowerCase() === initialAdminEmail) {
      role = 'super_admin';
      isSuperAdmin = true;
    }

    // Check Firestore admin_users document if not already verified
    if (!role) {
      try {
        const adminDocSnap = await getDoc(doc(db, 'admin_users', uid));
        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          if (adminData.isActive !== false) {
            role = adminData.role || 'super_admin';
          }
        }
      } catch (err) {
        console.warn('Firestore admin check fallback:', err);
      }
    }

    // If still not an authorized admin, reject with 403 Forbidden
    if (!role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: This Firebase account is not authorized as an administrator.',
          code: 'UNAUTHORIZED_NOT_ADMIN',
          email,
        },
        { status: 403 }
      );
    }

    // Persist super admin in Firestore admin_users collection
    if (isSuperAdmin) {
      try {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'admin_users', uid), {
          uid,
          email,
          role: 'super_admin',
          isActive: true,
          displayName: 'Super Admin',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn('Super admin Firestore record update (non-fatal):', firestoreErr);
      }
    }

    // 3. Set secure HTTP-only session cookie
    const sessionPayload = {
      uid,
      email,
      role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    await setAdminSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        role,
        isSuperAdmin,
      },
    });
  } catch (error: any) {
    console.error('Admin session error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
