import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import authService from '@/services/authService';

const menuItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'people', label: 'Recruiters', path: '/recruiters' },
  { icon: 'work_outline', label: 'Jobs', path: '/jobs' },
  { icon: 'business', label: 'Company', path: '/company' },
  { icon: 'badge', label: 'Applications', path: '/applications' },
  { icon: 'credit_card', label: 'Billing & Plans', path: '/billing-plans' },
  { icon: 'insights', label: 'Reports', path: '/reports' },
];

const generalItems = [
  { icon: 'settings', label: 'Settings', path: '/settings' },
  { icon: 'help_outline', label: 'Help Center', path: '/help' },
];


const Sidebar = ({ collapsed = false, onToggle, onMobileClose, isMobile = false }) => {
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className={`bg-card-light dark:bg-card-dark ${!isMobile ? 'border-r border-gray-200 dark:border-gray-800' : ''} flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative ${collapsed && !isMobile ? 'w-20' : 'w-64'}`}>
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-9 z-50 w-6 h-6 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-icons-outlined text-sm">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      )}

      <div className={`p-6 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <Logo collapsed={collapsed && !isMobile} />
      </div>

      <div className={`flex-1 px-4 overflow-y-auto ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="mb-6">
          {(!collapsed || isMobile) && (
            <p className="px-4 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2">
              Menu
            </p>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${collapsed && !isMobile ? 'justify-center px-2' : ''} ${isActive
                    ? 'bg-orange-50 dark:bg-primary/20 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white group'
                  }`
                }
                title={collapsed && !isMobile ? item.label : ''}
              >
                <>
                  <span className="material-icons-outlined group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  {(!collapsed || isMobile) && item.label}
                </>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* General Section */}
        <div className="mb-6">
          {(!collapsed || isMobile) && (
            <p className="px-4 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2">
              General
            </p>
          )}
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${collapsed && !isMobile ? 'justify-center px-2' : ''} ${isActive
                    ? 'bg-orange-50 dark:bg-primary/20 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white group'
                  }`
                }
                title={collapsed && !isMobile ? item.label : ''}
              >
                <>
                  <span className="material-icons-outlined group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                  {(!collapsed || isMobile) && item.label}
                </>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Upgrade Plan Card */}
      {(!collapsed || isMobile) && (
        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
              <span className="material-icons-outlined">stars</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Upgrade Plan</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Unlock premium features like AI candidate matching.
            </p>
            <Link to="/billing-plans" className="block w-full">
              <Button
                fullWidth
                mode="primary"
                shape="rounded"
                className=""
                onClick={onMobileClose}
              >
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        {collapsed && !isMobile ? (
          <Button
            btnIcon
            mode="ghost"
            shape="rounded"
            title="Logout"
            onClick={handleLogout}
          >
            <span className="material-icons-outlined">logout</span>
          </Button>
        ) : (
          <Button
            fullWidth
            mode="ghost"
            shape="rounded"
            iconLeft={<span className="material-icons-outlined">logout</span>}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
