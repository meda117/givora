import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default:
    'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  outline:
    'border border-neutral-200 text-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
  success:
    'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold',
  warning:
    'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-800',
  danger:
    'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900',
  info:
    'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
};

const sizes = {
  sm: 'text-[11px] px-2 py-0.5 tracking-wide',
  md: 'text-xs px-2.5 py-1 tracking-wide',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-sm uppercase',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}
