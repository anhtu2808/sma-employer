import React, { useState } from 'react';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '@/apis/notificationApi';
import NotificationItem from './components/notification-item';
import SearchInput from '@/components/SearchInput';

const NotificationList = () => {
    const [filter, setFilter] = useState({ page: 0, size: 10, isRead: null, types: null, keyword: '' });

    const { data, isLoading } = useGetNotificationsQuery(filter);
    const [markAllAsRead] = useMarkAllAsReadMutation();

    const paging = data?.data?.notifications;
    const notifications = paging?.content || [];
    const unreadCount = data?.data?.unreadCount || 0;

    const startEntry = (paging?.pageNumber || 0) * (paging?.pageSize || 10) + 1;
    const endEntry = Math.min(((paging?.pageNumber || 0) + 1) * (paging?.pageSize || 10), paging?.totalElements || 0);

    const tabs = [
        { label: 'All', value: { isRead: null, types: null } },
        { label: 'Unread', value: { isRead: false, types: null }, count: unreadCount },
        { label: 'Applications', value: { isRead: null, types: ['APPLICATION_STATUS'] } },
        { label: 'Payments', value: { isRead: null, types: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE'] } },
        { label: 'System Alerts', value: { isRead: null, types: ['SYSTEM', 'COMPANY_REGISTRATION'] } },
    ];

    return (
        <main className="h-full flex flex-col bg-background-light dark:bg-background-dark">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                <div className="border-b border-gray-200 dark:border-gray-700 w-full md:w-auto">
                    <nav className="-mb-px flex space-x-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setFilter({ ...filter, ...tab.value, page: 0 })}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all ${(filter.isRead === tab.value.isRead && JSON.stringify(filter.types) === JSON.stringify(tab.value.types))
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-2 bg-primary text-white py-0.5 px-2 rounded-full text-[10px] font-bold">
                                        {tab.count > 99 ? '99+' : tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-64 lg:w-72">
                        <SearchInput
                            placeholder="Filter by title, message..."
                            value={filter.keyword}
                            size="sm"
                            onChange={(val) => {
                                const keyword = val?.target ? val.target.value : val;
                                setFilter({ ...filter, keyword: keyword, page: 0 });
                            }}
                        />
                    </div>

                    <button
                        onClick={() => markAllAsRead()}
                        className="whitespace-nowrap text-sm font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 border border-transparent hover:border-orange-100 flex-shrink-0"
                    >
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pt-4">
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((noti) => (
                        <NotificationItem key={noti.id} noti={noti} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                        <p className="text-subtext-light">No notifications found.</p>
                    </div>
                )}
            </div>

            {paging?.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
                    <p className="text-sm text-subtext-light dark:text-subtext-dark">
                        Showing <span className="font-medium text-text-light">{startEntry}</span> to{' '}
                        <span className="font-medium text-text-light">{endEntry}</span> of{' '}
                        <span className="font-medium text-text-light">{paging.totalElements}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={paging.first}
                            onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-subtext-light hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={paging.last}
                            onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-subtext-light hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default NotificationList;