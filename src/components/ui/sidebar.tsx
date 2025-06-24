import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, children }: SidebarProps) {
    return (
        <aside className={cn("flex h-full flex-col gap-y-4 border-r p-4", className)}>
            {children}
        </aside>
    );
}

export function SidebarLogo({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-14 items-center border-b px-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                {children}
            </Link>
        </div>
    );
}

export function SidebarNav({ children }: { children: React.ReactNode }) {
    return (
        <nav className="flex-1 space-y-2">
            {children}
        </nav>
    );
}

export function SidebarNavGroup({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <div className="space-y-1">
            {title && <h4 className="px-2 py-1 text-sm font-semibold text-muted-foreground">{title}</h4>}
            {children}
        </div>
    );
}

export interface SidebarNavItemProps {
    href: string;
    active?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export function SidebarNavItem({ href, active, icon, children }: SidebarNavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                active && "bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
        >
            {icon}
            {children}
        </Link>
    );
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-auto border-t p-2">
            {children}
        </div>
    );
}