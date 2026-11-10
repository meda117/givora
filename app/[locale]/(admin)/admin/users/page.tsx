'use client';
import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, RefreshCw, UserCheck, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
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
  createdAt?: string;
}

const ROLE_LABELS: Record<AdminRole, { ar: string; en: string }> = {
  super_admin: { ar: 'المدير العام (Super Admin)', en: 'Super Admin' },
  product_manager: { ar: 'مدير المنتجات', en: 'Product Manager' },
  order_manager: { ar: 'مدير الطلبات والعمليات', en: 'Order Manager' },
  content_manager: { ar: 'مدير المحتوى والتسويق', en: 'Content Manager' },
};

export default function AdminUsersPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('product_manager');

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admin_users'));
      const list: AdminEntry[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || (data.email ? data.email.split('@')[0] : 'مشرف جيفورا'),
          email: data.email || '',
          role: (data.role as AdminRole) || 'product_manager',
          isActive: data.isActive !== false,
          lastLogin: data.lastLoginAt
            ? new Date(data.lastLoginAt).toLocaleString('ar-EG')
            : isAr ? 'نشط' : 'Active',
          createdAt: data.createdAt,
        };
      });
      setAdmins(list);
    } catch (err) {
      console.error('Failed to fetch admin users from Firestore:', err);
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSaving(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const newId = cleanEmail.replace(/[^a-z0-9]/g, '_');
      const newAdmin: AdminEntry = {
        id: newId,
        name: name.trim(),
        email: cleanEmail,
        role,
        isActive: true,
        lastLogin: isAr ? 'لم يسجل دخول بعد' : 'Never logged in',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'admin_users', newId), {
        ...newAdmin,
        createdAt: new Date().toISOString(),
      });

      setAdmins((prev) => [...prev, newAdmin]);
      setName('');
      setEmail('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add admin user:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'admin_users', id));
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete admin user:', err);
    }
  };

  const handleToggleActive = async (admin: AdminEntry) => {
    const nextVal = !admin.isActive;
    try {
      await updateDoc(doc(db, 'admin_users', admin.id), { isActive: nextVal });
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, isActive: nextVal } : a))
      );
    } catch (err) {
      console.error('Failed to toggle admin status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isAr ? 'إدارة المشرفين والصلاحيات الحقيقية' : 'Admin Users & Roles'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isAr
              ? `الحسابات المعتمدة في قاعدة البيانات ومتحكمات الأمان • ${admins.length} مشرفين`
              : `Authorized administrator accounts in live Firestore • ${admins.length} accounts`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdmins}
            isLoading={isLoading}
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
            {isAr ? 'إضافة مشرف جديد' : 'Add Admin User'}
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm space-y-4 max-w-lg">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            {isAr ? 'منح صلاحيات إدارية لحساب جديد' : 'Invite New Admin'}
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <Input
              label={isAr ? 'اسم المشرف' : 'Full Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'مثال: أحمد عبد الله' : 'Admin Name'}
              required
            />
            <Input
              label={isAr ? 'البريد الإلكتروني المعتمد' : 'Authorized Email Address'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@givora.com"
              required
              dir="ltr"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {isAr ? 'الدور الإداري والصلاحيات' : 'Role & Permissions'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full h-11 rounded-sm border border-neutral-200 dark:border-neutral-700 px-3.5 text-xs font-semibold bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="super_admin">{isAr ? 'المدير العام (Super Admin) - صلاحيات مطلقة' : 'Super Admin'}</option>
                <option value="product_manager">{isAr ? 'مدير المنتجات - إدارة الكتالوج وبوكسات الهدايا' : 'Product Manager'}</option>
                <option value="order_manager">{isAr ? 'مدير الطلبات - متابعة وتحديث الشحن والتوصيل' : 'Order Manager'}</option>
                <option value="content_manager">{isAr ? 'مدير المحتوى - الصفحات والبانرات والتسويق' : 'Content Manager'}</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" isLoading={isSaving}>{isAr ? 'حفظ المشرف' : 'Save Admin'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 p-8 text-center text-neutral-500">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-neutral-900 dark:text-white" />
          <p className="text-xs">{isAr ? 'جاري استرجاع سجلات المشرفين...' : 'Loading admin users...'}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{isAr ? 'المشرف' : 'Admin User'}</th>
                  <th>{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th>{isAr ? 'الدور والصلاحيات' : 'Role'}</th>
                  <th>{isAr ? 'الحالة' : 'Status'}</th>
                  <th>{isAr ? 'آخر نشاط' : 'Last Activity'}</th>
                  <th className="text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs uppercase">
                          {admin.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-xs text-neutral-900 dark:text-white">{admin.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-neutral-600 dark:text-neutral-400">{admin.email}</td>
                    <td>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {ROLE_LABELS[admin.role]?.[locale] || admin.role}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(admin)}
                        className={`text-[11px] px-2 py-0.5 rounded-xs font-semibold border ${
                          admin.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        }`}
                      >
                        {admin.isActive ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Suspended')}
                      </button>
                    </td>
                    <td className="text-xs text-neutral-500 font-mono">{admin.lastLogin}</td>
                    <td className="text-end">
                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-xs transition-colors"
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
      )}
    </div>
  );
}
