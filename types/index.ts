// ============================================================
// GIVORA — MASTER TYPE DEFINITIONS
// ============================================================

// ----------------------------------------------------------------
// MULTILINGUAL
// ----------------------------------------------------------------
export type Locale = 'ar' | 'en';

export interface LocalizedString {
  ar: string;
  en: string;
  translationStatus?: TranslationStatus;
  translatedAt?: Timestamp;
  translationSource?: 'auto' | 'manual';
}

export type TranslationStatus = 
  | 'auto'          // Automatically translated
  | 'manual'        // Manually edited
  | 'pending'       // Needs translation
  | 'failed';       // Translation failed

export type Timestamp = string; // ISO 8601

// ----------------------------------------------------------------
// USERS & AUTH
// ----------------------------------------------------------------
export type AdminRole = 
  | 'super_admin' 
  | 'product_manager' 
  | 'order_manager' 
  | 'content_manager';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: AdminPermissions;
  isActive: boolean;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  avatarUrl?: string;
}

export interface AdminPermissions {
  products: PermissionLevel;
  categories: PermissionLevel;
  orders: PermissionLevel;
  customers: PermissionLevel;
  coupons: PermissionLevel;
  homepage: PermissionLevel;
  shipping: PermissionLevel;
  reviews: PermissionLevel;
  digitalProducts: PermissionLevel;
  settings: PermissionLevel;
  adminUsers: PermissionLevel;
  seo: PermissionLevel;
  notifications: PermissionLevel;
}

export type PermissionLevel = 'none' | 'read' | 'write' | 'full';

export interface Customer {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  defaultAddress?: Address;
  addresses: Address[];
  wishlist: string[]; // product IDs
  savedRecipients: GiftRecipient[];
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  isActive: boolean;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  newsletterSubscribed: boolean;
  preferredLanguage: Locale;
}

// ----------------------------------------------------------------
// ADDRESSES
// ----------------------------------------------------------------
export interface Address {
  id: string;
  label?: string; // "Home", "Work", etc.
  fullName: string;
  phone: string;
  whatsappNumber?: string;
  governorate: string;
  governorateName?: string;
  city: string;
  cityName?: string;
  district?: string;
  street: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  buildingDetails?: string;
  landmark?: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface GiftRecipient {
  id: string;
  name: string;
  phone?: string;
  relationship?: string;
  notes?: string;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// CATEGORIES
// ----------------------------------------------------------------
export type MainCategory = 'gift-boxes' | 'trending-gifts';

export interface Category {
  id: string;
  slug: LocalizedString;
  name: LocalizedString;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  mainCategory: MainCategory;
  parentId?: string;
  imageUrl?: string;
  imageAlt?: LocalizedString;
  order: number;
  isVisible: boolean;
  isFeatured: boolean;
  productCount?: number;
  seo: SEOFields;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// PRODUCTS & SPECIALIZED WORKFLOWS
// ----------------------------------------------------------------
export type ProductType = 
  | 'gift_box' 
  | 'standard' 
  | 'printed' 
  | 'engraved' 
  // Backward compatibility:
  | 'physical' 
  | 'gift-box';

export type ProductStatus = 'draft' | 'published' | 'hidden' | 'out_of_stock' | 'archived';

export type GiftBoxAudience = 'women' | 'men' | 'couples' | 'unisex';

export type ProductBadge = 'new' | 'best_seller' | 'featured' | 'sale' | 'limited' | 'exclusive';

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution?: Record<number, number>;
}

export interface Product {
  id: string;
  slug: LocalizedString;
  name: LocalizedString;
  description: LocalizedString;
  shortDescription: LocalizedString;
  type: ProductType;
  status: ProductStatus;
  
  categoryIds: string[];
  mainCategory: MainCategory;
  
  images: ProductImage[];
  videos: ProductVideo[];
  
  basePrice: number;
  discountedPrice?: number;
  discountPercent?: number;
  currency: string;
  
  sku?: string;
  inventory?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  
  // Gift Box Specific Workflow
  targetAudience?: GiftBoxAudience;
  boxContents?: GiftBoxItem[];
  
  // Standard Product Attributes & Variants
  attributes?: ProductAttribute[];
  variantCombinations?: ProductVariantCombination[];
  variants?: ProductVariant[]; // legacy support
  
  // Printed Product Customization Schema
  printedCustomization?: PrintedProductCustomization;
  
  // Engraved Product Customization Schema
  engravedCustomization?: EngravedProductCustomization;
  
  customizationFormId?: string;
  
  badges: ProductBadge[];
  tags: string[];
  
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  
  weight?: number;
  dimensions?: Dimensions;
  
  // Related
  relatedProductIds: string[];
  
  ratings: RatingSummary;
  
  seo: SEOFields;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: LocalizedString;
  isCover: boolean;
  order: number;
  imagekitFileId?: string;
}

export interface ProductVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: LocalizedString;
  order: number;
  imagekitFileId?: string;
}

// ----------------------------------------------------------------
// GIFT BOX CONTENTS BUILDER (External Items + Catalog Products)
// ----------------------------------------------------------------
export interface GiftBoxItem {
  id: string;
  source: 'external' | 'catalog';
  name: LocalizedString;
  description?: LocalizedString;
  imageUrl?: string;
  quantity: number;
  price?: number;
  isOptional?: boolean;
  order: number;
  
  // Catalog Product link
  productId?: string;
  productPrice?: number;
  productSku?: string;
}

// ----------------------------------------------------------------
// STANDARD PRODUCT ATTRIBUTES & VARIANTS
// ----------------------------------------------------------------
export interface ProductAttribute {
  id: string;
  name: LocalizedString;
  values: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: string;
  label: LocalizedString;
  colorHex?: string;
  priceModifier?: number;
  imageUrl?: string;
}

export interface ProductVariantCombination {
  id: string;
  attributes: Record<string, string>; // { [attributeId]: valueId }
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isAvailable: boolean;
}

// Legacy variant support
export interface ProductVariant {
  id: string;
  name: LocalizedString;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  value: LocalizedString;
  priceModifier?: number;
  inventory?: number;
  imageUrl?: string;
  isAvailable: boolean;
}

// ----------------------------------------------------------------
// PRINTED & ENGRAVED CUSTOMIZATION SCHEMAS
// ----------------------------------------------------------------
export interface PrintedProductCustomization {
  requiredCustomerText: boolean;
  textLabel: LocalizedString;
  textMaxLength?: number;
  allowCustomerImage: boolean;
  imageUploadPrompt?: LocalizedString;
  printPositions?: { id: string; label: LocalizedString; priceModifier?: number }[];
  specialInstructionsAllowed: boolean;
  customizationFee?: number;
}

export interface EngravedProductCustomization {
  requireNameToEngrave: boolean;
  nameLabel: LocalizedString;
  allowDate: boolean;
  dateLabel?: LocalizedString;
  fontOptions?: { id: string; label: LocalizedString; previewUrl?: string }[];
  engravingPositions?: { id: string; label: LocalizedString; priceModifier?: number }[];
  allowReferenceImage: boolean;
  specialInstructionsAllowed: boolean;
  customizationFee?: number;
}

// ----------------------------------------------------------------
// DIGITAL PRODUCTS
// ----------------------------------------------------------------
export type DigitalCategory = 
  | 'memory-pages'
  | 'romantic'
  | 'surprises'
  | 'greeting-cards'
  | 'games'
  | 'wedding-invitations'
  | 'engagement-invitations'
  | 'birthday-invitations'
  | 'event-invitations';

export type DigitalFulfillmentMode = 'manual' | 'automated';

export interface DigitalProduct {
  id: string;
  productId: string; // Links to main Product
  digitalCategory: DigitalCategory;
  fulfillmentMode: DigitalFulfillmentMode;
  templateId?: string;
  
  supportedCustomizations: DigitalCustomizationOption[];
  
  deliveryInstructions: LocalizedString;
  estimatedDeliveryHours?: number;
  
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DigitalCustomizationOption {
  id: string;
  type: 'name' | 'message' | 'date' | 'image' | 'music' | 'theme' | 'text';
  label: LocalizedString;
  isRequired: boolean;
  maxLength?: number;
  options?: LocalizedString[];
}

// ----------------------------------------------------------------
// CUSTOMIZATION FORMS
// ----------------------------------------------------------------
export type CustomFieldType = 
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'image_upload'
  | 'date'
  | 'number';

export interface CustomizationForm {
  id: string;
  name: string; // internal admin name
  fields: CustomizationField[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CustomizationField {
  id: string;
  type: CustomFieldType;
  label: LocalizedString;
  description?: LocalizedString;
  placeholder?: LocalizedString;
  isRequired: boolean;
  order: number;
  priceModifier?: number;
  
  // For dropdown/radio/checkbox
  options?: CustomFieldOption[];
  
  // For text/textarea
  minLength?: number;
  maxLength?: number;
  
  // For number
  min?: number;
  max?: number;
  
  // For image_upload
  maxFileSizeMB?: number;
  acceptedFormats?: string[];
  
  // Validation message
  validationMessage?: LocalizedString;
}

export interface CustomFieldOption {
  id: string;
  label: LocalizedString;
  value: string;
  priceModifier?: number;
  imageUrl?: string;
}

// ----------------------------------------------------------------
// ORDERS
// ----------------------------------------------------------------
export type OrderStatus = 
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_shipping'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type DigitalOrderStatus = 
  | 'new'
  | 'awaiting_customization'
  | 'in_progress'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'cash_on_delivery'
  | 'manual_transfer'
  | 'online';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string; // null = guest
  
  items: OrderItem[];
  
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  
  couponCode?: string;
  couponId?: string;
  
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  
  shippingAddress: Address;
  billingAddress?: Address;
  
  recipientName?: string;
  giftMessage?: string;
  hidePrice: boolean;
  
  orderNotes?: string;
  adminNotes?: string;
  
  trackingNumber?: string;
  shippingCarrier?: string;
  
  timeline: OrderEvent[];
  
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
  
  invoiceUrl?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderCustomizationSnapshot {
  productType?: ProductType;
  // Customer text / engraving:
  customerText?: string;
  nameToEngrave?: string;
  engravingDate?: string;
  fontStyle?: string;
  position?: string;
  specialInstructions?: string;
  // Customer uploaded reference or printing images via ImageKit:
  uploadedImages?: {
    url: string;
    fileId?: string;
    fileName?: string;
    size?: number;
  }[];
  // Selected variant attributes:
  selectedAttributes?: Record<string, string>;
  variantSku?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: LocalizedString;
  productImage?: string;
  productSlug: LocalizedString;
  productType?: ProductType;
  quantity: number;
  unitPrice: number;
  customizationPrice: number;
  total: number;
  
  selectedVariants?: { variantId: string; optionId: string; label: LocalizedString; value: LocalizedString }[];
  customizationData?: { fieldId: string; label: LocalizedString; value: string }[];
  
  // Permanent customization snapshot:
  customizationSnapshot?: OrderCustomizationSnapshot;
  
  isDigital?: boolean;
  digitalStatus?: DigitalOrderStatus;
  digitalDeliveryLink?: string;
}

export interface OrderEvent {
  id: string;
  status: OrderStatus | DigitalOrderStatus;
  note?: string;
  isInternal: boolean;
  createdAt: Timestamp;
  createdBy: string;
}

// ----------------------------------------------------------------
// COUPONS
// ----------------------------------------------------------------
export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';

export interface Coupon {
  id: string;
  code: string;
  description: LocalizedString;
  discountType: DiscountType;
  discountValue: number;
  
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  excludedProductIds?: string[];
  
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  
  customerIds?: string[]; // restricted to specific customers
  
  startsAt?: Timestamp;
  expiresAt?: Timestamp;
  
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// REVIEWS
// ----------------------------------------------------------------
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  customerId?: string;
  customerName: string;
  
  rating: number; // 1-5
  title?: string;
  body: string;
  
  images?: string[];
  
  status: ReviewStatus;
  isFeatured: boolean;
  
  adminReply?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// HOMEPAGE SECTIONS
// ----------------------------------------------------------------
export type HomeSectionType = 
  | 'hero_banner'
  | 'category_cards'
  | 'product_grid'
  | 'promotional_banner'
  | 'testimonials'
  | 'instagram_gallery'
  | 'newsletter'
  | 'custom_html';

export interface HomeSection {
  id: string;
  type: HomeSectionType;
  title: LocalizedString;
  description?: LocalizedString;
  
  isVisible: boolean;
  visibleOnMobile: boolean;
  visibleOnDesktop: boolean;
  
  order: number;
  
  config: HomeSectionConfig;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HomeSectionConfig {
  // Hero
  bannerIds?: string[];
  
  // Product grids
  productIds?: string[];
  categoryIds?: string[];
  productSource?: 'manual' | 'best_sellers' | 'new_arrivals' | 'featured' | 'trending';
  maxProducts?: number;
  
  // Promotional
  imageUrl?: string;
  linkUrl?: string;
  
  // Testimonials
  reviewIds?: string[];
  
  // Custom
  customHtml?: LocalizedString;
  
  // Misc
  backgroundColor?: string;
  textColor?: string;
  layout?: string;
}

// ----------------------------------------------------------------
// BANNERS
// ----------------------------------------------------------------
export interface Banner {
  id: string;
  name: string; // internal
  title: LocalizedString;
  subtitle?: LocalizedString;
  ctaText?: LocalizedString;
  ctaUrl?: string;
  
  imageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  
  imagekitFileId?: string;
  
  isActive: boolean;
  order: number;
  
  startsAt?: Timestamp;
  endsAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// SHIPPING
// ----------------------------------------------------------------
export interface ShippingZone {
  id: string;
  name: LocalizedString;
  governorates: Governorate[];
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Governorate {
  id: string;
  name: LocalizedString;
  cities: ShippingCity[];
  isActive: boolean;
}

export interface ShippingCity {
  id: string;
  name: LocalizedString;
  shippingFee: number;
  freeShippingThreshold?: number;
  estimatedDays: string; // e.g. "2-3"
  isActive: boolean;
}

// ----------------------------------------------------------------
// WEBSITE SETTINGS
// ----------------------------------------------------------------
export interface WebsiteSettings {
  id: 'global';
  
  siteName: LocalizedString;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  
  primaryColor?: string;
  accentColor?: string;
  
  currency: string;
  currencySymbol: string;
  
  defaultLocale: Locale;
  supportedLocales: Locale[];
  
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  address?: LocalizedString;
  
  socialLinks: SocialLinks;
  
  announcementBar: AnnouncementBar;
  footer: FooterConfig;
  
  maintenanceMode: boolean;
  maintenanceMessage?: LocalizedString;
  
  allowGuestCheckout: boolean;
  allowCustomerRegistration: boolean;
  
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  ogImageUrl?: string;
  
  updatedAt: Timestamp;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  snapchat?: string;
  pinterest?: string;
}

export interface AnnouncementBar {
  isVisible: boolean;
  messages: LocalizedString[];
  backgroundColor?: string;
  textColor?: string;
  rotationIntervalMs?: number;
}

export interface FooterConfig {
  copyrightText: LocalizedString;
  columns: FooterColumn[];
}

export interface FooterColumn {
  id: string;
  title: LocalizedString;
  links: FooterLink[];
  order: number;
}

export interface FooterLink {
  id: string;
  label: LocalizedString;
  href: string;
  isExternal?: boolean;
}

// ----------------------------------------------------------------
// SEO
// ----------------------------------------------------------------
export interface SEOFields {
  title?: LocalizedString;
  description?: LocalizedString;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// ----------------------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------------------
export type NotificationType = 
  | 'order_confirmation'
  | 'order_status_update'
  | 'shipping_update'
  | 'digital_delivery'
  | 'promotional';

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: LocalizedString;
  body: LocalizedString;
  isActive: boolean;
  channels: NotificationChannel[];
  updatedAt: Timestamp;
}

export type NotificationChannel = 'push' | 'email' | 'sms';

// ----------------------------------------------------------------
// WEBSITE PAGES
// ----------------------------------------------------------------
export type PageSlug = 
  | 'about-us'
  | 'contact-us'
  | 'faq'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'shipping-policy'
  | 'returns-policy';

export interface WebsitePage {
  id: string;
  slug: PageSlug;
  title: LocalizedString;
  content: LocalizedString;
  seo: SEOFields;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// NEWSLETTER
// ----------------------------------------------------------------
export interface NewsletterSubscriber {
  id: string;
  email: string;
  locale: Locale;
  isActive: boolean;
  subscribedAt: Timestamp;
  source?: string;
}

// ----------------------------------------------------------------
// CART (CLIENT-SIDE)
// ----------------------------------------------------------------
export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  productName: LocalizedString;
  productImage?: string;
  productSlug: LocalizedString;
  productType?: ProductType;
  unitPrice: number;
  customizationPrice: number;
  quantity: number;
  isDigital?: boolean;
  
  selectedVariants?: { variantId: string; optionId: string; label: LocalizedString; value: LocalizedString }[];
  customizationData?: { fieldId: string; label: LocalizedString; value: string }[];
  customizationSnapshot?: OrderCustomizationSnapshot;
}

// ----------------------------------------------------------------
// IMAGEKIT
// ----------------------------------------------------------------
export interface ImageKitFile {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  filePath: string;
  fileType: 'image' | 'video' | 'non-image';
  size: number;
  width?: number;
  height?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ----------------------------------------------------------------
// TRANSLATIONS
// ----------------------------------------------------------------
export interface TranslationRecord {
  id: string;
  contentType: string; // 'product_name', 'category_description', etc.
  contentId: string;
  fieldName: string;
  originalText: string;
  originalLanguage: Locale;
  translatedText?: string;
  targetLanguage: Locale;
  status: TranslationStatus;
  provider?: string;
  translatedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
