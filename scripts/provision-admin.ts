/**
 * GIVORA — PROVISION SUPER ADMIN USER
 * 
 * Usage:
 *   npx ts-node scripts/provision-admin.ts [email] [password] [displayName]
 * 
 * Example:
 *   npx ts-node scripts/provision-admin.ts admin@givora.com GivoraSecurePass2026! "Givora Master Admin"
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { AdminUser, AdminPermissions } from '../types';

const FULL_PERMISSIONS: AdminPermissions = {
  products: 'full',
  categories: 'full',
  orders: 'full',
  customers: 'full',
  coupons: 'full',
  homepage: 'full',
  shipping: 'full',
  reviews: 'full',
  digitalProducts: 'none', // completely removed
  settings: 'full',
  adminUsers: 'full',
  seo: 'full',
  notifications: 'full',
};

async function provisionAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@givora.com';
  const password = args[1] || 'GivoraMaster2026!';
  const displayName = args[2] || 'Givora Super Admin';

  console.log(`[GIVORA] Initializing Admin Provisioning for: ${email}...`);

  // Initialize Firebase Admin with Application Default or Service Account
  if (getApps().length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'givora-11820',
      });
    }
  }

  const auth = getAuth();
  const db = getFirestore();

  try {
    let uid: string;

    try {
      const existingUser = await auth.getUserByEmail(email);
      uid = existingUser.uid;
      console.log(`[GIVORA] Found existing Firebase Auth user: ${uid}`);
      await auth.updateUser(uid, { password, displayName });
    } catch {
      const newUser = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      uid = newUser.uid;
      console.log(`[GIVORA] Created new Firebase Auth user: ${uid}`);
    }

    // Set Custom Claims for Next.js middleware and Firebase security rules
    await auth.setCustomUserClaims(uid, {
      role: 'super_admin',
      admin: true,
    });
    console.log(`[GIVORA] Set custom claims: { role: 'super_admin', admin: true }`);

    // Write to Firestore `admin_users` collection
    const adminUserData: AdminUser = {
      uid,
      email,
      displayName,
      role: 'super_admin',
      permissions: FULL_PERMISSIONS,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection('admin_users').doc(uid).set(adminUserData, { merge: true });
    console.log(`[GIVORA] Stored admin record in Firestore 'admin_users/${uid}' successfully.`);

    console.log('\n========================================');
    console.log(' SUPER ADMIN PROVISIONED SUCCESSFULLY');
    console.log(` Email: ${email}`);
    console.log(` Role: super_admin`);
    console.log(` URL: /ar/admin/login`);
    console.log('========================================\n');
  } catch (error) {
    console.error('[GIVORA] Failed to provision super admin:', error);
    process.exit(1);
  }
}

provisionAdmin();
