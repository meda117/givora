import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>((
  { label, error, hint, options, placeholder, className, id, ...props },
  ref
) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {label}
          {props.required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 rounded-sm border appearance-none text-sm ps-3.5 pe-10',
            'bg-white text-neutral-900 border-neutral-200',
            'dark:bg-[#1A1A1A] dark:text-neutral-100 dark:border-neutral-800',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'hover:border-neutral-300 dark:hover:border-neutral-700',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white dark:bg-[#1A1A1A] text-neutral-900 dark:text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
});

Select.displayName = 'Select';
