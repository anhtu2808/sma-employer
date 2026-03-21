import React from 'react';
import Loading from '@/components/Loading';
import SectionHeader from './SectionHeader';

const NotificationItem = ({ message: msg, createdAt, isRead }) => {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!isRead ? 'bg-orange-50/50 dark:bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!isRead ? 'bg-primary' : 'bg-transparent'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{msg}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(createdAt)}</p>
      </div>
    </div>
  );
};

const RecentNotifications = ({ isLoading, notifications }) => (
  <div className="lg:col-span-1 bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
    <SectionHeader title="Notifications" linkTo="/notifications" />
    {isLoading ? (
      <Loading className="py-8" />
    ) : notifications.length === 0 ? (
      <div className="text-center py-8">
        <span className="material-icons-outlined text-gray-300 dark:text-gray-600 text-4xl">notifications_none</span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">No notifications</p>
      </div>
    ) : (
      <div className="space-y-1">
        {notifications.map((n, i) => (
          <NotificationItem key={n.id || i} message={n.message || n.content || n.title} createdAt={n.createdAt} isRead={n.isRead ?? n.read} />
        ))}
      </div>
    )}
  </div>
);

export default RecentNotifications;
