'use client';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeSwitcher({ className, showLabels = false }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 p-2 rounded-sm text-xs font-medium',
        'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors',
        className
      )}
      title={`Theme: ${theme} (click to toggle)`}
      aria-label="Toggle theme"
    >
      {theme === 'system' ? (
        <Monitor className="h-4 w-4" />
      ) : resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      {showLabels && (
        <span className="capitalize hidden sm:inline">
          {theme === 'system' ? 'System' : resolvedTheme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
