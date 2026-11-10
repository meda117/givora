// ============================================================
// GIVORA — MONOCHROME BUTTON COMPONENT
// ============================================================
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 ' +
    'dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:active:bg-neutral-300 shadow-sm',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 ' +
    'dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:active:bg-neutral-600',
  outline:
    'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 ' +
    'dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
  ghost:
    'text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 ' +
    'dark:text-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  xl: 'h-14 px-8 text-lg gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  },
  ref
) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-sm cursor-pointer',
        'transition-all duration-150 ease-in-out active:scale-[0.98] select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'tracking-wide',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';
