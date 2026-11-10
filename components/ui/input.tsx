// ============================================================
// GIVORA — MONOCHROME INPUT COMPONENT
// ============================================================
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, hint, leftElement, rightElement, className, id, ...props },
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
      <div className="relative flex items-center">
        {leftElement && (
          <div className="absolute start-3 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 rounded-sm border text-sm',
            'bg-white text-neutral-900 border-neutral-200 placeholder:text-neutral-400',
            'dark:bg-[#1A1A1A] dark:text-neutral-100 dark:border-neutral-800 dark:placeholder:text-neutral-500',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100 dark:disabled:bg-neutral-900',
            error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'hover:border-neutral-300 dark:hover:border-neutral-700',
            leftElement ? 'ps-10' : 'ps-3.5',
            rightElement ? 'pe-10' : 'pe-3.5',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute end-3 text-neutral-400 dark:text-neutral-500">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
