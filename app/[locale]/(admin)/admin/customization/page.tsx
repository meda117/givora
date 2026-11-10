'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit, Sparkles, CheckSquare, AlignLeft, Type, Calendar, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Locale, CustomFieldType, CustomizationField } from '@/types';

const INITIAL_FIELDS: CustomizationField[] = [
  {
    id: 'f1',
    type: 'text',
    label: { ar: 'الاسم المراد حفره', en: 'Name to Engrave' },
    placeholder: { ar: 'اكتب الاسم هنا', en: 'Enter name here' },
    isRequired: true,
    order: 1,
    maxLength: 15,
  },
  {
    id: 'f2',
    type: 'date',
    label: { ar: 'التاريخ الخاص', en: 'Special Date' },
    isRequired: false,
    order: 2,
    priceModifier: 15,
  },
  {
    id: 'f3',
    type: 'image_upload',
    label: { ar: 'صورة الإهداء', en: 'Gift Photo' },
    isRequired: false,
    order: 3,
    priceModifier: 25,
  },
  {
    id: 'f4',
    type: 'textarea',
    label: { ar: 'رسالة إضافية خاصة', en: 'Personal Custom Message' },
    isRequired: false,
    order: 4,
  },
];

export default function AdminCustomizationPage() {
  const isAr = true;
  const locale: Locale = 'ar';
  const [fields, setFields] = useState<CustomizationField[]>(INITIAL_FIELDS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [labelAr, setLabelAr] = useState('');
  const [labelEn, setLabelEn] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldType>('text');
  const [isRequired, setIsRequired] = useState(true);
  const [priceModifier, setPriceModifier] = useState('');

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelAr) return;
    const newF: CustomizationField = {
      id: `f_${Date.now()}`,
      type: fieldType,
      label: { ar: labelAr, en: labelEn || labelAr },
      isRequired,
      order: fields.length + 1,
      priceModifier: priceModifier ? parseFloat(priceModifier) : undefined,
    };
    setFields([...fields, newF]);
    setLabelAr('');
    setLabelEn('');
    setPriceModifier('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            {isAr ? 'مدير نماذج التخصيص' : 'Customization Form Builder'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr
              ? 'صمم حقول التخصيص للمنتجات (حفر الاسم، رفع الصور، التواريخ، الرسوم الإضافية)'
              : 'Create custom fields (name engraving, image uploads, dates, price modifiers)'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="h-4 w-4" />}>
          {isAr ? 'إضافة حقل جديد' : 'Add Custom Field'}
        </Button>
      </div>

      {showAddModal && (
        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold text-charcoal border-b pb-3">
            {isAr ? 'إضافة حقل تخصيص جديد' : 'Add New Custom Field'}
          </h2>
          <form onSubmit={handleAddField} className="space-y-3">
            <Input
              label={isAr ? 'عنوان الحقل (بالعربية)' : 'Field Label (Arabic)'}
              placeholder="مثال: الاسم المراد كتابته"
              value={labelAr}
              onChange={(e) => setLabelAr(e.target.value)}
              required
            />
            <Input
              label={isAr ? 'عنوان الحقل (بالإنجليزية)' : 'Field Label (English)'}
              placeholder="e.g. Name to print"
              value={labelEn}
              onChange={(e) => setLabelEn(e.target.value)}
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal">
                  {isAr ? 'نوع الحقل' : 'Field Type'}
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as CustomFieldType)}
                  className="h-11 rounded-sm border border-gray-200 px-3 text-sm bg-white"
                >
                  <option value="text">{isAr ? 'نص قصير' : 'Short Text'}</option>
                  <option value="textarea">{isAr ? 'نص طويل / رسالة' : 'Long Text'}</option>
                  <option value="image_upload">{isAr ? 'رفع صورة' : 'Image Upload'}</option>
                  <option value="date">{isAr ? 'تاريخ' : 'Date'}</option>
                  <option value="dropdown">{isAr ? 'قائمة منسدلة' : 'Dropdown'}</option>
                  <option value="checkbox">{isAr ? 'اختيار' : 'Checkbox'}</option>
                </select>
              </div>
              <Input
                label={isAr ? 'رسوم إضافية (اختياري ر.س)' : 'Extra Price (Optional SAR)'}
                type="number"
                placeholder="0"
                value={priceModifier}
                onChange={(e) => setPriceModifier(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-charcoal pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="accent-gold"
              />
              <span>{isAr ? 'هذا الحقل إجباري لإتمام الطلب' : 'Required field'}</span>
            </label>
            <div className="flex gap-2 pt-3">
              <Button type="submit">{isAr ? 'حفظ الحقل' : 'Save Field'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Fields List */}
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{isAr ? 'عنوان الحقل' : 'Field Label'}</th>
              <th>{isAr ? 'النوع' : 'Type'}</th>
              <th>{isAr ? 'الحالة' : 'Required'}</th>
              <th>{isAr ? 'السعر الإضافي' : 'Extra Price'}</th>
              <th>{isAr ? 'الترتيب' : 'Order'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.id}>
                <td>
                  <div>
                    <p className="font-medium text-charcoal">{f.label[locale]}</p>
                    <p className="text-xs text-gray-400">{f.label.en}</p>
                  </div>
                </td>
                <td>
                  <Badge variant="default">
                    {f.type === 'text' ? (isAr ? 'نص' : 'Text')
                      : f.type === 'image_upload' ? (isAr ? 'صورة' : 'Image')
                      : f.type === 'date' ? (isAr ? 'تاريخ' : 'Date')
                      : f.type}
                  </Badge>
                </td>
                <td>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${f.isRequired ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {f.isRequired ? (isAr ? 'مطلوب' : 'Required') : (isAr ? 'اختياري' : 'Optional')}
                  </span>
                </td>
                <td className="font-medium">
                  {f.priceModifier ? `+${f.priceModifier} ر.س` : (isAr ? 'مجاني' : 'Free')}
                </td>
                <td>{f.order}</td>
                <td>
                  <button
                    onClick={() => setFields(fields.filter(x => x.id !== f.id))}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
