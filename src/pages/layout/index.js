import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer } from 'antd';
import Sidebar from './sidebar';
import Header from './header';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
