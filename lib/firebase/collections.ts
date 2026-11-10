// ============================================================
// GIVORA — FIRESTORE COLLECTION NAMES
// Single source of truth for all collection paths
// ============================================================

export const COLLECTIONS = {
  USERS: 'users',
  ADMINS: 'admins',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  COUPONS: 'coupons',
  REVIEWS: 'reviews',
  HOME_SECTIONS: 'homepage_sections',
  BANNERS: 'banners',
  WEBSITE_SETTINGS: 'website_settings',
  SHIPPING_ZONES: 'shipping_zones',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_TEMPLATES: 'notification_templates',
  DIGITAL_PRODUCTS: 'digital_products',
  GIFT_RECIPIENTS: 'gift_recipients',
  WISHLIST: 'wishlist',
  TRANSLATIONS: 'translations',
  CUSTOMIZATION_FORMS: 'customization_forms',
  WEBSITE_PAGES: 'website_pages',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
