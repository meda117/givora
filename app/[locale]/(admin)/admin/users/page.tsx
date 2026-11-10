'use client';
import { useState } from 'react';
import { Shield, Plus, UserCheck, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, AdminRole } from '@/types';

interface AdminEntry {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string;
}

const INITIAL_ADMINS: AdminEntry[] = [
  { id: '1', name: 'المدير العام (Super Admin)', email: 'admin@givora.com', role: 'super_admin', isActive: true, lastLogin: '2026-11-10 07:15' },
  { id: '2', name: 'مدير المنتجات', email: 'products@givora.com', role: 'product_manager', isActive: true, lastLogin: '2026-11-09 14:30' },
  { id: '3', name: 'مدير الطلبات والعمليات', email: 'orders@givora.com', role: 'order_manager', isActive: true, lastLogin: '2026-11-10 06:00' },
  { id: '4', name: 'مدير المحتوى والتسويق', email: 'content@givora.com', role: 'content_manager', isActive: true, lastLogin: '2026-11-08 19:20' },
];

const ROLE_LABELS: Record<AdminRole, { ar: string; en: string }> = {
  super_admin: { ar: 'المدير العام (Super Admin)', en: 'Super Admin' },
  product_manager: { ar: 'مدير المنتجات', en: 'Product Manager' },
  order_manager: { ar: 'مدير الطلبات', en: 'Order Manager' },
  content_manager: { ar: 'مدير المحتوى', en: 'Content Manager' },
};

export default function AdminUsersPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('product_manager');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const newAdmin: AdminEntry = {
      id: Date.now().toString(),
      name,
      email,
      role,
      isActive: true,
      lastLogin: isAr ? 'لم يسجل دخول بعد' : 'Never logged in',
    };
    setAdmins([...admins, newAdmin]);
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'إدارة المشرفين والصلاحيات' : 'Admin Users & Permissions'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr
              ? 'تحديد أدوار الإدارة (مدير عام، مدير منتجات، مدير طلبات، مدير محتوى)'
              : 'Manage administrator accounts, roles, and server-side RBAC access'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          {isAr ? 'إضافة مشرف جديد' : 'Add Admin User'}
        </Button>
      </div>

      {showAddModal && (
        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm space-y-4 max-w-lg">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'دعوة مشرف جديد' : 'Invite New Admin'}
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <Input
              label={isAr ? 'اسم المشرف' : 'Full Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal">
                {isAr ? 'الدور والصلاحيات' : 'Role & Permissions'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="h-11 rounded-sm border border-gray-200 px-3 text-sm bg-white"
              >
                <option value="super_admin">{ROLE_LABELS.super_admin[locale]}</option>
                <option value="product_manager">{ROLE_LABELS.product_manager[locale]}</option>
                <option value="order_manager">{ROLE_LABELS.order_manager[locale]}</option>
                <option value="content_manager">{ROLE_LABELS.content_manager[locale]}</option>
              </select>
            </div>
            <div className="flex gap-2 pt-3">
              <Button type="submit">{isAr ? 'إضافة المشرف' : 'Add User'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? 'المشرف' : 'Administrator'}</th>
              <th>{isAr ? 'الدور' : 'Role'}</th>
              <th>{isAr ? 'الحالة' : 'Status'}</th>
              <th>{isAr ? 'آخر تسجيل دخول' : 'Last Login'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-semibold">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{admin.name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant={admin.role === 'super_admin' ? 'info' : 'default'}>
                    {ROLE_LABELS[admin.role][locale]}
                  </Badge>
                </td>
                <td>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-50 text-green-700">
                    {isAr ? 'نشط' : 'Active'}
                  </span>
                </td>
                <td className="text-xs text-gray-400">{admin.lastLogin}</td>
                <td>
                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => setAdmins(admins.filter(a => a.id !== admin.id))}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
