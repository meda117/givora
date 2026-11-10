import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, error, hint, className, id, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-sm border text-sm resize-y px-3.5 py-2.5 min-h-[100px]',
          'bg-white text-neutral-900 border-neutral-200 placeholder:text-neutral-400',
          'dark:bg-[#1A1A1A] dark:text-neutral-100 dark:border-neutral-800 dark:placeholder:text-neutral-500',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-1 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500' : 'hover:border-neutral-300 dark:hover:border-neutral-700',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
