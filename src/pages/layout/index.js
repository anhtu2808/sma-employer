import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased h-screen flex overflow-hidden transition-colors duration-200">
      <Sidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
        <Header />

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
