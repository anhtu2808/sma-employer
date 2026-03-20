import React from 'react';
import { message } from 'antd';
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingMutation, useResetSettingsMutation } from '@/apis/notificationApi';
import Loading from '@/components/Loading';

const NotificationSettings = () => {
    const { data: settingsResponse, isLoading } = useGetNotificationSettingsQuery();
    const [updateSetting, { isLoading: isUpdating }] = useUpdateNotificationSettingMutation();
    const [resetSettings, { isLoading: isResetting }] = useResetSettingsMutation();

    const settings = settingsResponse?.data || [];

    const handleResetAll = async () => {
        try {
            await resetSettings().unwrap();
            message.success('All settings have been reset to default');
        } catch (error) {
            message.error('Failed to reset settings');
        }
    };

    const NOTI_DISPLAY_CONFIG = [
        {
            key: 'FLAGGED_JOB',
            title: 'Job Posting Updates',
            desc: 'Get notified when your jobs are approved, rejected, or flagged for review.',
            group: 'jobs'
        },
        {
            key: 'APPLICATION_STATUS',
            title: 'New Applications',
            desc: 'Receive alerts when new candidates apply to your job postings.',
            group: 'applications'
        }, {
            key: 'INVITATION',
            title: 'Candidate Responses',
            desc: 'Get notified when candidates accept or decline your job invitations.',
            group: 'invitations'
        },
        {
            key: 'PAYMENT_GROUP',
            title: 'Payments & Billing',
            desc: 'Confirmations for subscription purchases and alerts for failed transactions.',
            group: 'payment',
            subTypes: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE']
        },
        {
            key: 'SYSTEM',
            title: 'Platform Maintenance',
            desc: 'Important news about system updates, new features, or quota limits.',
            group: 'system'
        }
    ];

    const GROUPS = [
        { id: 'jobs', title: 'Jobs', icon: 'work_outline' },
        { id: 'applications', title: 'Applications', icon: 'description' },
        { id: 'invitations', title: 'Invitations', icon: 'forward_to_inbox' },
        { id: 'payment', title: 'Payments', icon: 'account_balance_wallet' },
        { id: 'system', title: 'System Alerts', icon: 'notifications_active' }
    ];
    const handleToggle = async (displayItem, field, value) => {
        try {
            if (displayItem.subTypes) {
                await Promise.all(
                    displayItem.subTypes.map(type =>
                        updateSetting({ notificationType: type, [field]: value }).unwrap()
                    )
                );
            } else {
                await updateSetting({ notificationType: displayItem.key, [field]: value }).unwrap();
            }
            message.success('Setting updated successfully');
        } catch (error) {
            message.error('Failed to update setting');
        }
    };

    if (isLoading) return <Loading className="py-20" />;

    return (
        <main className="flex-1 space-y-6 animate-fadeIn font-sans mx-auto">
            <div className=" pl-4 pr-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={handleResetAll}
                            disabled={isResetting}
                            className="whitespace-nowrap text-xs font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-100 flex items-center gap-2"
                        >
                            Reset to defaults
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {GROUPS.map((group) => {
                    const displayItemsInGroup = NOTI_DISPLAY_CONFIG.filter(item => item.group === group.id);
                    if (displayItemsInGroup.length === 0) return null;

                    return (
                        <section key={group.id}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">{group.icon}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{group.title}</h2>
                            </div>

                            <div className="bg-gray-50 dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm">
                                {displayItemsInGroup.map((displayItem) => {
                                    const actualData = displayItem.subTypes
                                        ? settings.find(s => s.notificationType === displayItem.subTypes[0])
                                        : settings.find(s => s.notificationType === displayItem.key);

                                    if (!actualData) return null;

                                    return (
                                        <div key={displayItem.key} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                                            <div className="max-w-xl">
                                                <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">{displayItem.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{displayItem.desc}</p>
                                            </div>

                                            <div className="flex gap-8 items-center">
                                                {['emailEnabled', 'inAppEnabled'].map(field => (
                                                    <div key={field} className="flex flex-col items-center gap-2 min-w-[60px]">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {field === 'emailEnabled' ? 'Email' : 'In-app'}
                                                        </span>
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => handleToggle(displayItem, field, !actualData[field])}
                                                            className={`w-11 h-6 rounded-full relative transition-all duration-300 ${actualData[field] ? 'bg-orange-500 shadow-md shadow-orange-200' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                        >
                                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${actualData[field] ? 'right-1' : 'left-1'}`}></span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="mt-12 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500 text-xl">verified</span>
                <p className="text-xs text-orange-700 dark:text-orange-400 font-medium italic">
                    Changes are synchronized instantly. You can always revert your choices at any time.
                </p>
            </div>
        </main>
    );
};

export default NotificationSettings;
