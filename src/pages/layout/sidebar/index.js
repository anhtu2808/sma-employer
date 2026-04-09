import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faClipboardCheck, faBoxArchive, faGear,
  faCreditCard, faClockRotateLeft, faTableCells, faUsers,
  faBriefcase, faClipboard, faEnvelopeRegular, faBan,
  faBell, faStar, faRightFromBracket, faChevronLeft, faChevronRight,
  faPaintbrush, faLink, faKey
} from '@/utils/icons';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import authService from '@/services/authService';
import { useGetNotificationsQuery } from '@/apis/notificationApi';
import { useGetMyRecruiterInfoQuery } from '@/apis/recruiterApi';


const Sidebar = ({ collapsed = false, onToggle, onMobileClose, isMobile = false }) => {
  const location = useLocation();
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const { data } = useGetNotificationsQuery({
    page: 0,
    size: 1,
    isRead: false
  });
  const unreadCount = data?.data?.unreadCount || 0;

  // Get recruiter info to check role permissions
  const { data: myInfoData } = useGetMyRecruiterInfoQuery();
  const isRecruiter = Boolean(myInfoData?.data);
  const isRootRecruiter = myInfoData?.data?.isRootRecruiter === true;
  const accessToken = localStorage.getItem('accessToken');
  const isAdmin = React.useMemo(() => {
    if (!accessToken) return false;
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      if (payload?.role === 'ADMIN') return true;
      if (Array.isArray(payload?.roles) && payload.roles.includes('ADMIN')) return true;
      if (Array.isArray(payload?.authorities) && payload.authorities.some((item) => item === 'ADMIN' || item === 'ROLE_ADMIN')) return true;
      return false;
    } catch (error) {
      return false;
    }
  }, [accessToken]);

  // --- Grouped sidebar sections ---

  // 1. Overview
  const overviewItems = [
    { icon: faTableCells, label: 'Dashboard', path: '/dashboard' },
    {
      icon: faBell,
      label: 'Notifications',
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
  ];

  // 2. Recruitment
  const recruitmentItems = [
    { icon: faBriefcase, label: 'Jobs', path: '/jobs' },
    { icon: faBoxArchive, label: 'Archived Jobs', path: '/jobs/archived' },
    { icon: faClipboard, label: 'Applications', path: '/applications' },
    { icon: faEnvelopeRegular, label: 'Invitations', path: '/invitations' },
    { icon: faClipboardCheck, label: 'Scoring Criteria', path: '/scoring-criteria' },
  ];

  // 3. Management (role-filtered)
  const managementItemsRaw = [
    { icon: faUsers, label: 'Recruiters', path: '/recruiters', requireRoot: true },
    { icon: faBuilding, label: 'Company', path: '/company', requireRoot: true },
    { icon: faBan, label: 'Blacklist', path: '/blacklist' },
  ];
  const managementItems = managementItemsRaw.filter((item) => {
    if (item.requireRoot) return isRootRecruiter;
    return true;
  });

  // 4. Configuration / Settings
  const configItemsRaw = [
    { icon: faPaintbrush, label: 'Career Page', path: '/career-builder' },
    { icon: faLink, label: 'Webhooks', path: '/webhooks' },
    { icon: faKey, label: 'API Management', path: '/api-management', requireRootOrAdmin: true },
    { icon: faGear, label: 'Settings', path: '/settings' },
  ];
  const configItems = configItemsRaw.filter((item) => {
    if (item.requireRootOrAdmin) return isRootRecruiter || isAdmin;
    return true;
  });

  // 5. Billing (only for recruiters)
  const billingItemsRaw = [
    { icon: faCreditCard, label: 'Billing & Plans', path: '/billing-plans', requireRoot: true },
    { icon: faClockRotateLeft, label: 'Usage', path: '/usage' },
  ];
  const billingItems = isRecruiter
    ? billingItemsRaw.filter((item) => {
        if (item.requireRoot) return isRootRecruiter;
        return true;
      })
    : [];

  // All sections
  const sections = [
    { title: 'Overview', items: overviewItems },
    { title: 'Recruitment', items: recruitmentItems },
    ...(managementItems.length > 0 ? [{ title: 'Management', items: managementItems }] : []),
    { title: 'Configuration', items: configItems },
    ...(billingItems.length > 0 ? [{ title: 'Billing', items: billingItems }] : []),
  ];

  // Render a single nav item
  const renderNavItem = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={onMobileClose}
      className={({ isActive }) => {
        // Don't highlight "Jobs" when on archived jobs page
        const checkActive = item.path === '/jobs' && location.pathname.startsWith('/jobs/archived') ? false : isActive;
        return `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${collapsed && !isMobile ? 'justify-center px-2' : ''} ${checkActive
          ? 'bg-orange-50 dark:bg-primary/20 text-primary font-medium'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white group'
          }`
      }}
      title={collapsed && !isMobile ? item.label : ''}
    >
      <>
        <div className="relative flex items-center justify-center w-5 text-center">
          <FontAwesomeIcon icon={item.icon} className="group-hover:text-primary transition-colors" />
          {collapsed && !isMobile && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-card-dark rounded-full"></span>
          )}
        </div>

        {(!collapsed || isMobile) && (
          <span className="flex-1 text-left">{item.label}</span>
        )}

        {(!collapsed || isMobile) && item.badge > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </>
    </NavLink>
  );

  return (
    <aside className={`bg-card-light dark:bg-card-dark ${!isMobile ? 'border-r border-gray-200 dark:border-gray-800' : ''} flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative ${collapsed && !isMobile ? 'w-20' : 'w-64'}`}>
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-9 z-50 w-6 h-6 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-sm" />
        </button>
      )}

      <div className={`px-4 py-3 ${collapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <Logo collapsed={collapsed && !isMobile} />
      </div>

      <div className={`flex-1 px-4 overflow-y-auto ${collapsed && !isMobile ? 'px-2' : ''}`}>
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {(!collapsed || isMobile) && (
              <p className="px-4 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1.5">
                {section.title}
              </p>
            )}
            {collapsed && !isMobile && (
              <div className="border-t border-gray-200 dark:border-gray-700 mx-2 mb-2"></div>
            )}
            <nav className="space-y-0.5">
              {section.items.map(renderNavItem)}
            </nav>
          </div>
        ))}
      </div>

      {/* Upgrade Plan Card - Only for root recruiters */}
      {(!collapsed || isMobile) && isRecruiter && isRootRecruiter && (
        <div className="px-4 pb-2">
          <Link
            to="/billing-plans"
            onClick={onMobileClose}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-primary/10 dark:to-amber-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
              <FontAwesomeIcon icon={faStar} className="text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">Upgrade Plan</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">Unlock AI features</p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-400 group-hover:text-primary transition-colors" />
          </Link>
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
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        ) : (
          <Button
            fullWidth
            mode="ghost"
            shape="rounded"
            iconLeft={<FontAwesomeIcon icon={faRightFromBracket} />}
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

