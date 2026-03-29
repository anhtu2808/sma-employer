import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell } from '../../utils/icons';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';

const TABS = [
    { key: 'profile', label: 'Profile', icon: faUser },
    { key: 'notifications', label: 'Notifications', icon: faBell },
];

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <main className="flex-1 space-y-6 animate-fadeIn font-sans mx-auto">
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 px-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                            activeTab === tab.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
        </main>
    );
};

export default Settings;
