import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './client';
import { COLLECTIONS } from './collections';
import type { Product, Category, Order, WebsiteSettings, Coupon, Review } from '@/types';

// Products Service
export const ProductsService = {
  async getAll(): Promise<Product[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (err) {
      console.warn('Firebase not connected, using fallback');
      return [];
    }
  },

  async getByCategory(mainCategory: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('mainCategory', '==', mainCategory),
        where('status', '==', 'published')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    } catch (err) {
      return [];
    }
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS), where('slug.ar', '==', slug), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
      return null;
    } catch (err) {
      return null;
    }
  },

  async save(product: Partial<Product>): Promise<string> {
    const id = product.id || doc(collection(db, COLLECTIONS.PRODUCTS)).id;
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, id), { ...product, id, updatedAt: new Date().toISOString() }, { merge: true });
    return id;
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  },
};

// Orders Service
export const OrdersService = {
  async create(order: Partial<Order>): Promise<string> {
    const id = order.id || doc(collection(db, COLLECTIONS.ORDERS)).id;
    await setDoc(doc(db, COLLECTIONS.ORDERS, id), {
      ...order,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return id;
  },

  async getById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Order;
    return null;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  },
};

// Settings Service
export const SettingsService = {
  async get(): Promise<WebsiteSettings | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'global'));
      if (snap.exists()) return snap.data() as WebsiteSettings;
      return null;
    } catch (err) {
      return null;
    }
  },

  async save(settings: Partial<WebsiteSettings>): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'global'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  },
};
