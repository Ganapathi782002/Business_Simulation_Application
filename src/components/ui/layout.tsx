import { cn } from '@/lib/utils';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  //isSidebarCollapsed: boolean;
}

export function Layout({ children, sidebar, header }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className={cn(
        "hidden lg:block lg:flex-shrink-0 lg:border-r transition-[width] duration-300",
        ///isSidebarCollapsed ? "lg:w-20" : "lg:w-72"
      )}>
        {sidebar}
      </div>
      <div className="flex flex-1 flex-col">
        {header}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
