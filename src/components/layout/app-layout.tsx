"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarLogo, SidebarNav, SidebarNavGroup, SidebarNavItem, SidebarFooter } from '../ui/sidebar';
import { Header } from '../ui/header';
import { Layout } from '../ui/layout';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Users, Building2, Library, HandCoins, FlaskConical, Factory, Megaphone, Boxes } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const pathParts = pathname.split('/');
  const simId = pathParts.length > 2 && pathParts[1] === 'simulations' ? pathParts[2] : null;
  const companyId = pathParts[3] === 'company' ? pathParts[4] : null;

  return (
    <Layout
      sidebar={
        <Sidebar>
          <SidebarLogo>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-500 mr-3">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold">BusinessSim</span>
          </SidebarLogo>

          <SidebarNav>
            <SidebarNavGroup title="Main">
              <SidebarNavItem
                href="/"
                active={pathname === '/'}
                icon={<Library className="w-5 h-5" />}
              >
                My Simulations
              </SidebarNavItem>
            </SidebarNavGroup>

            {companyId && simId && (
              <>
                <SidebarNavGroup title="Game Menu">
                  <SidebarNavItem
                    href={`/simulations/${simId}`}
                    active={pathname === `/simulations/${simId}`}
                    icon={<Building2 className="w-5 h-5" />}
                  >
                    My Companies
                  </SidebarNavItem>
                  <SidebarNavItem
                    href={`/simulations/${simId}/company/${companyId}/performance`}
                    active={pathname.endsWith('/performance')}
                    icon={<BarChart3 className="w-5 h-5" />}
                  >
                    Performance
                  </SidebarNavItem>
                  <SidebarNavItem
                    href={`/simulations/${simId}/company/${companyId}/competitors`}
                    active={pathname.endsWith('/competitors')} 
                    icon={<Users className="w-5 h-5" />}
                  >
                    Competitors
                  </SidebarNavItem>
                </SidebarNavGroup>

                <SidebarNavGroup title="Departments">
                  <SidebarNavItem href="#" active={false} icon={<Users className="w-5 h-5" />}>Human Resources</SidebarNavItem>
                  <SidebarNavItem href="#" active={false} icon={<Megaphone className="w-5 h-s" />}>Marketing</SidebarNavItem>
                  <SidebarNavItem href="#" active={false} icon={<Factory className="w-5 h-5" />}>Production</SidebarNavItem>
                  <SidebarNavItem href={`/simulations/${simId}/company/${companyId}/finance`} active={pathname.endsWith('/finance')} icon={<HandCoins className="w-5 h-5" />}>Finance</SidebarNavItem>
                  <SidebarNavItem href="#" active={false} icon={<FlaskConical className="w-5 h-5" />}>R&D</SidebarNavItem>
                </SidebarNavGroup>

                <SidebarNavGroup title="Catalog">
                  <SidebarNavItem href="#" active={false} icon={<Boxes className="w-5 h-5" />}>
                    Products
                  </SidebarNavItem>
                </SidebarNavGroup>
              </>
            )}
          </SidebarNav>

          <SidebarFooter>
            <div className='flex justify-between items-center w-full'>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'NN'}
                </div>
                <div>
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              </div>
              <Button onClick={logout} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
      }
      header={
        <Header title="Business Simulation" />
      }
    >
      {children}
    </Layout>
  );
}