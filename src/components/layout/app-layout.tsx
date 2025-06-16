import React from 'react';
import { Sidebar, SidebarLogo, SidebarNav, SidebarNavGroup, SidebarNavItem, SidebarFooter } from '../ui/sidebar';
import { Header } from '../ui/header';
import { Layout } from '../ui/layout';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth-context';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentPeriod, setCurrentPeriod] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const { user, loading,logout } = useAuth()
  async function handleLogout(){
    const res = await fetch('/api/auth/logout')
  }
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
                href="/dashboard"
                active={currentPage === 'dashboard'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                }
              >
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem
                href="/performance"
                active={currentPage === 'performance'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 20V10"></path>
                    <path d="M18 20V4"></path>
                    <path d="M6 20v-4"></path>
                  </svg>
                }
              >
                Performance
              </SidebarNavItem>
              <SidebarNavItem
                href="../market"
                active={currentPage === 'market'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                }
              >
                Market
              </SidebarNavItem>
            </SidebarNavGroup>

            <SidebarNavGroup title="Management">
              <SidebarNavItem
                href="/human-resources"
                active={currentPage === 'human-resources'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                }
              >
                Human Resources
              </SidebarNavItem>
              <SidebarNavItem
                href="/marketing"
                active={currentPage === 'marketing'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                }
              >
                Marketing
              </SidebarNavItem>
              <SidebarNavItem
                href="/production"
                active={currentPage === 'production'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                }
              >
                Production
              </SidebarNavItem>
              <SidebarNavItem
                href="/finance"
                active={currentPage === 'finance'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                }
              >
                Finance
              </SidebarNavItem>
              <SidebarNavItem
                href="/research"
                active={currentPage === 'research'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                }
              >
                R&D
              </SidebarNavItem>
            </SidebarNavGroup>

            <SidebarNavGroup title="Products">
              <SidebarNavItem
                href="/products"
                active={currentPage === 'products'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                }
              >
                Product Catalog
              </SidebarNavItem>
              <SidebarNavItem
                href="/products/new"
                active={currentPage === 'new-product'}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                }
              >
                New Product
              </SidebarNavItem>
            </SidebarNavGroup>
          </SidebarNav>

          <SidebarFooter>
            <div className='flex justify-between'>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                  {user?.name[0]}
                </div>
                <div>
                  <div className="font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-gray-400">{user?.role.toUpperCase()}</div>
                </div>
              </div>
              <Button onClick={logout} variant="default">Logout</Button>
              </div>
          </SidebarFooter>
        </Sidebar>
      }
      header={
        <Header
          title="Business Simulation"
          actions={
            <>
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
                <span className="text-sm font-medium text-gray-500 mr-2">Period:</span>
                <span className="text-sm font-medium text-gray-900">Q{currentPeriod + 1} 2025</span>
              </div>
              <Button
                variant="default"
                onClick={() => setCurrentPeriod(currentPeriod + 1)}
              >
                Advance to Next Period
              </Button>
            </>
          }
        />
      }
    >
      {children}
    </Layout>
  );
}
