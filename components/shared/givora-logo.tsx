import { cn } from '@/lib/utils';

interface GivoraLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function GivoraLogo({ className, variant = 'full' }: GivoraLogoProps) {
  if (variant === 'icon') {
    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            letterSpacing: '0.08em',
            fontSize: '1.25em',
          }}
          className="text-neutral-950 dark:text-white transition-colors duration-150"
        >
          G
        </span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          letterSpacing: '0.22em',
          fontSize: '1.4em',
          lineHeight: 1,
        }}
        className="text-neutral-950 dark:text-white tracking-widest transition-colors duration-150 select-none"
      >
        GIVORA
      </span>
    </div>
  );
}
