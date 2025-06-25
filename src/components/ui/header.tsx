import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, actions, className }: HeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6",
      className
    )}>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}