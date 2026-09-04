'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 text-slate-400 opacity-50" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode (current: ${theme})`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-all hover:-rotate-12 dark:text-slate-300" />
      )}
    </Button>
  );
}

export function ThemeSelectDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
      <button
        onClick={() => setTheme('light')}
        className={`rounded-md p-1.5 transition-all ${
          theme === 'light'
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        title="Light Mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`rounded-md p-1.5 transition-all ${
          theme === 'dark'
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        title="Dark Mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`rounded-md p-1.5 transition-all ${
          theme === 'system'
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        title="System Preference"
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
