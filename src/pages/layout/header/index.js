import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';
import { useGetNotificationsQuery } from '@/apis/notificationApi';
import { useGetMyRecruiterInfoQuery } from '@/apis/recruiterApi';
import { useSelector, useDispatch } from 'react-redux';
import { hidePreview } from '../../notification/components/notification-slice';
import dayjs from 'dayjs';

const Header = ({ onMobileMenuClick }) => {
  const [searchValue, setSearchValue] = useState('');
  const { headerConfig } = useContext(PageHeaderContext);
  const navigate = useNavigate();
  const { data } = useGetNotificationsQuery({
    page: 0,
    size: 1,
    isRead: false,
    type: null,
    keyword: ''
  });
  const unreadCount = data?.data?.unreadCount || 0;
  const { data: myInfoData } = useGetMyRecruiterInfoQuery();
  const user = myInfoData?.data?.user;
  const dispatch = useDispatch();
  const { preview, showPreview } = useSelector(state => state.notification);
  useEffect(() => {
    if (!showPreview || !preview) return;

    const timer = setTimeout(() => {
      dispatch(hidePreview());
    }, 5000);

    return () => clearTimeout(timer);
  }, [showPreview]);

  return (
    <header className="h-16 sm:h-20 bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-icons-outlined">menu</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            {headerConfig.title}
          </h1>
          {headerConfig.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {headerConfig.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Link
          to="/ui-kit"
          className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
          title="UI Kit"
        >
          <span className="material-icons-outlined">palette</span>
        </Link>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <span className="material-icons-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {showPreview && preview && preview.id && (
          <div className="fixed bottom-6 right-6 w-96 
              bg-white dark:bg-gray-900 
              shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-5 
              border border-gray-200 dark:border-gray-700 
              z-[9999] animate-slide-in-right text-left">

            <div className="flex gap-4 items-start text-left">

              <div className="flex-shrink-0 w-10 h-10 rounded-xl 
                  bg-orange-100 dark:bg-orange-900/30
                  text-orange-500 
                  flex items-center justify-center">
                <span className="material-icons-outlined text-lg">
                  notifications
                </span>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col items-start"> {/* Thêm flex-col và items-start */}

                {/* Title + Time */}
                <div className="flex justify-between items-start gap-3 w-full"> {/* Thêm w-full */}
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug text-left">
                    {preview.title}
                  </h4>

                  <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                    {dayjs(preview.createdAt).fromNow()}
                  </span>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed text-left">
                  {preview.message}
                </p>

              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || 'User avatar'}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 border-2 border-white dark:border-gray-700 shadow-sm flex items-center justify-center text-primary font-bold text-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
