import React, { useState, useMemo } from 'react';
import { ConfigProvider, Tabs, Tag, Empty, Pagination } from 'antd';
import { useGetMyInvitationsQuery } from '@/apis/invitationApi';
import { usePageHeader } from '@/hooks/usePageHeader';
import Loading from '@/components/Loading';

const STATUS_CONFIG = {
    INVITED: { color: 'blue', label: 'Invited' },
    RECEIVED: { color: 'orange', label: 'Received' },
    ACCEPTED: { color: 'green', label: 'Accepted' },
    DECLINED: { color: 'red', label: 'Declined' },
};

const INVITATION_STATUS_TABS = [
    { key: '', label: 'All' },
    { key: 'INVITED', label: 'Invited' },
    { key: 'RECEIVED', label: 'Received' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'DECLINED', label: 'Declined' },
];

const InvitationList = () => {
    usePageHeader('Invitations', 'Manage candidate invitations');

    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');

    const queryParams = {
        page,
        size: 10,
        ...(statusFilter && { status: statusFilter }),
    };

    const { data: response, isLoading } = useGetMyInvitationsQuery(queryParams);
    // Fetch all to compute counts per status
    const { data: allResponse } = useGetMyInvitationsQuery({ page: 0, size: 1000 });

    const invitations = response?.data?.content || [];
    const totalElements = response?.data?.totalElements || 0;

    // Compute status counts from the full dataset
    const statusCountMap = useMemo(() => {
        const allInvitations = allResponse?.data?.content || [];
        const map = { '': allInvitations.length };
        allInvitations.forEach((inv) => {
            if (inv.status) {
                map[inv.status] = (map[inv.status] || 0) + 1;
            }
        });
        return map;
    }, [allResponse]);

    const tabItems = INVITATION_STATUS_TABS.map((tab) => ({
        key: tab.key,
        label: (
            <span>
                {tab.label}
                {(statusCountMap[tab.key] || 0) > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-orange-500 text-white">
                        {statusCountMap[tab.key]}
                    </span>
                )}
            </span>
        ),
    }));

    const getStatusTag = (status) => {
        const config = STATUS_CONFIG[status] || { color: 'default', label: status };
        return <Tag color={config.color} className="!text-xs !font-semibold !px-2.5 !py-0.5 !rounded-full !border-0">{config.label}</Tag>;
    };

    const formatSalary = (start, end, currency) => {
        if (!start && !end) return 'Negotiable';
        const fmt = (v) => v?.toLocaleString() || '0';
        return `${fmt(start)} – ${fmt(end)} ${currency || ''}`;
    };

    if (isLoading) return <Loading className="py-16" />;

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Status Filter Tabs — same style as Jobs page */}
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#f97316',
                        colorBorderHover: '#f97316',
                    },
                    components: {
                        Tabs: {
                            inkBarColor: '#f97316',
                            itemSelectedColor: '#f97316',
                            itemHoverColor: '#f97316',
                        },
                    },
                }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="px-4 pt-1">
                        <Tabs
                            activeKey={statusFilter}
                            onChange={(key) => { setStatusFilter(key); setPage(0); }}
                            items={tabItems}
                        />
                    </div>
                </div>
            </ConfigProvider>

            {/* List */}
            {invitations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16">
                    <Empty description="No invitations found" />
                </div>
            ) : (
                <div className="space-y-3">
                    {invitations.map((inv) => (
                        <div
                            key={inv.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: Candidate + Job Info */}
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Candidate Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-orange-200 dark:from-primary/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {inv.candidate?.user?.avatar ? (
                                            <img src={inv.candidate.user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-icons-outlined text-primary text-xl">person</span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Candidate Name */}
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                            {inv.candidate?.user?.fullName || 'Unknown Candidate'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {inv.candidate?.user?.email}
                                        </p>

                                        {/* Job Info */}
                                        {inv.job && (
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    <span className="material-icons-outlined text-sm">work_outline</span>
                                                    {inv.job.name}
                                                </span>
                                                {inv.job.jobLevel && (
                                                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                        <span className="material-icons-outlined text-sm">trending_up</span>
                                                        {inv.job.jobLevel}
                                                    </span>
                                                )}
                                                {inv.job.workingModel && (
                                                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                        <span className="material-icons-outlined text-sm">location_on</span>
                                                        {inv.job.workingModel}
                                                    </span>
                                                )}
                                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    <span className="material-icons-outlined text-sm">payments</span>
                                                    {formatSalary(inv.job.salaryStart, inv.job.salaryEnd, inv.job.currency)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Invitation Content */}
                                        {inv.content && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {inv.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalElements > 10 && (
                <div className="flex justify-center pt-2">
                    <Pagination
                        current={page + 1}
                        total={totalElements}
                        pageSize={10}
                        onChange={(p) => setPage(p - 1)}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default InvitationList;
