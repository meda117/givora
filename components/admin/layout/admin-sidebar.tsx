'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users,
  Ticket, Home, Truck, Star, Bell, Globe, Settings,
  ChevronDown, ChevronRight, Sparkles, FileText, Shield,
  Image as ImageIcon, X, Menu, Box, Layers
} from 'lucide-react';
import { GivoraLogo } from '@/components/shared/givora-logo';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

interface NavGroup {
  title: { ar: string; en: string };
  items: {
    id: string;
    icon: any;
    label: { ar: string; en: string };
    href: string;
    badge?: string;
    children?: { label: { ar: string; en: string }; href: string }[];
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: { ar: 'الرئيسية', en: 'Overview' },
    items: [
      {
        id: 'overview',
        icon: LayoutDashboard,
        label: { ar: 'لوحة المؤشرات', en: 'Dashboard' },
        href: '/admin',
      },
    ],
  },
  {
    title: { ar: 'إدارة المتجر', en: 'Store Management' },
    items: [
      {
        id: 'products',
        icon: Package,
        label: { ar: 'المنتجات والهدايا', en: 'Products' },
        href: '/admin/products',
        children: [
          { label: { ar: 'جميع المنتجات', en: 'All Products' }, href: '/admin/products' },
          { label: { ar: 'إضافة منتج جديد', en: 'Add Product' }, href: '/admin/products/new' },
        ],
      },
      {
        id: 'categories',
        icon: Tags,
        label: { ar: 'الأقسام والتصنيفات', en: 'Categories' },
        href: '/admin/categories',
      },
      {
        id: 'customization',
        icon: Sparkles,
        label: { ar: 'نماذج التخصيص', en: 'Customization' },
        href: '/admin/customization',
      },
    ],
  },
  {
    title: { ar: 'المبيعات والعملاء', en: 'Orders & Customers' },
    items: [
      {
        id: 'orders',
        icon: ShoppingCart,
        label: { ar: 'الطلبات والمبيعات', en: 'Orders' },
        href: '/admin/orders',
        badge: '4',
      },
      {
        id: 'customers',
        icon: Users,
        label: { ar: 'قاعدة العملاء', en: 'Customers' },
        href: '/admin/customers',
      },
    ],
  },
  {
    title: { ar: 'التسويق والعروض', en: 'Marketing' },
    items: [
      {
        id: 'coupons',
        icon: Ticket,
        label: { ar: 'كوبونات الخصم', en: 'Coupons' },
        href: '/admin/coupons',
      },
      {
        id: 'reviews',
        icon: Star,
        label: { ar: 'تقييمات العملاء', en: 'Reviews' },
        href: '/admin/reviews',
      },
      {
        id: 'notifications',
        icon: Bell,
        label: { ar: 'حملات الإشعارات', en: 'Notifications' },
        href: '/admin/notifications',
      },
    ],
  },
  {
    title: { ar: 'إدارة الموقع والمحتوى', en: 'Website Content' },
    items: [
      {
        id: 'homepage',
        icon: Home,
        label: { ar: 'الصفحة الرئيسية', en: 'Homepage Builder' },
        href: '/admin/homepage',
      },
      {
        id: 'media',
        icon: ImageIcon,
        label: { ar: 'مكتبة وسائط ImageKit', en: 'Media Library' },
        href: '/admin/media',
      },
      {
        id: 'pages',
        icon: FileText,
        label: { ar: 'صفحات الموقع', en: 'Pages' },
        href: '/admin/pages',
      },
      {
        id: 'seo',
        icon: Globe,
        label: { ar: 'تهيئة محركات البحث (SEO)', en: 'SEO' },
        href: '/admin/seo',
      },
    ],
  },
  {
    title: { ar: 'العمليات والإعدادات', en: 'Operations & Settings' },
    items: [
      {
        id: 'shipping',
        icon: Truck,
        label: { ar: 'شحن محافظات مصر', en: 'Shipping' },
        href: '/admin/shipping',
      },
      {
        id: 'settings',
        icon: Settings,
        label: { ar: 'إعدادات المتجر', en: 'Settings' },
        href: '/admin/settings',
      },
      {
        id: 'users',
        icon: Shield,
        label: { ar: 'المشرفون والصلاحيات', en: 'Admin Roles' },
        href: '/admin/users',
      },
    ],
  },
];

interface AdminSidebarProps {
  locale: Locale;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const isAr = locale === 'ar';
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(['products']);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return pathname === full || (href !== '/admin' && pathname.startsWith(full));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--card-bg)] text-[var(--text-main)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
        <div>
          <GivoraLogo className="h-6" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] block mt-1">
            {isAr ? 'لوحة الإدارة الفاخرة' : 'Admin Workspace'}
          </span>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-6">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
              {group.title[locale]}
            </span>

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const label = item.label[locale];
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expanded.includes(item.id);

                return (
                  <li key={item.id}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggle(item.id)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium transition-colors',
                            active
                              ? 'bg-[var(--text-main)] text-[var(--bg-main)]'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]'
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 text-start">{label}</span>
                          {item.badge && (
                            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                              {item.badge}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                          )}
                        </button>

                        {isExpanded && (
                          <ul className="ms-5 mt-1 space-y-0.5 border-s border-[var(--border-color)] ps-2.5">
                            {item.children!.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={`/${locale}${child.href}`}
                                  className={cn(
                                    'block px-2.5 py-1.5 rounded-sm text-[11px] font-medium transition-colors',
                                    isActive(child.href)
                                      ? 'text-[var(--text-main)] font-semibold bg-[var(--bg-secondary)]'
                                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]'
                                  )}
                                >
                                  {child.label[locale]}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={`/${locale}${item.href}`}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium transition-colors',
                          active
                            ? 'bg-[var(--text-main)] text-[var(--bg-main)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)]'
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1">{label}</span>
                        {item.badge && (
                          <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--card-bg)] border-e border-[var(--border-color)] h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-[var(--card-bg)] h-full overflow-auto z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 end-4 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)]"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
