import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Drawer } from 'antd';
import Sidebar from './sidebar';
import Header from './header';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';

const routeTitleMap = {
  '/dashboard': 'Dashboard',
  '/recruiters': 'Recruiters',
  '/jobs': 'Jobs',
  '/jobs/create': 'Create Job',
  '/jobs/edit': 'Edit Job',
  '/company': 'Company',
  '/applications': 'Applications',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help Center',
  '/billing-plans': 'Billing & Plans',
};

const routeSubtitleMap = {
  '/dashboard': 'Overview of your recruitment activities',
  '/recruiters': 'Manage your recruitment team',
  '/jobs': 'Manage your job postings',
  '/jobs/create': 'Create a new job posting',
  '/jobs/edit': 'Edit your job posting',
  '/company': 'Manage your company profile',
  '/applications': 'Track and manage candidate applications',
  '/reports': 'View recruitment analytics and reports',
  '/settings': 'Configure your account settings',
  '/help': 'Find answers and get support',
  '/billing-plans': 'Manage your subscription and view your current usage quotas',
};

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { setHeaderConfig } = useContext(PageHeaderContext);

  useEffect(() => {
    const path = location.pathname;
    // Handle dynamic routes like /jobs/:id
    const matchedPath = Object.keys(routeTitleMap).find(route => path === route)
      || (path.match(/^\/jobs\/\d+\/edit/) ? '/jobs/edit' : null)
      || (path.match(/^\/jobs\/\d+/) ? '/jobs' : null);

    const title = routeTitleMap[matchedPath] || 'Dashboard';
    const description = routeSubtitleMap[matchedPath] || '';

    setHeaderConfig({ title, description });
  }, [location.pathname, setHeaderConfig]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased h-screen flex overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={closeMobileSidebar}
        open={isMobileSidebarOpen}
        width={280}
        className="lg:hidden"
        styles={{
          body: { padding: 0 },
          header: { display: 'none' }
        }}
      >
        <Sidebar
          collapsed={false}
          onMobileClose={closeMobileSidebar}
          isMobile
        />
      </Drawer>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
        <Header onMobileMenuClick={toggleMobileSidebar} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
