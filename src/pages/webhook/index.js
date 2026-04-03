import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faTrash, faRotate, faCopy, faEye, faEyeSlash, faCircleInfo, faLink, faBook
} from '@fortawesome/free-solid-svg-icons';
import {
    useGetMyWebhooksQuery,
    useRegenerateWebhookSecretMutation,
    useDeleteWebhookMutation,
    useCreateWebhookMutation
} from '@/apis/webhookApi';
import WebhookLogsTable from './WebhookLogsTable';
import { Tabs, Tag, Space, Checkbox, Tooltip, Select, ConfigProvider, Modal as AntModal } from 'antd';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import toastMessage from '@/utils/toastMessage';

const { TabPane } = Tabs;

const EVENT_OPTIONS = [
    // { label: 'Application Created', value: 'application.created' },
    { label: 'Application Approved', value: 'application.approved' },
    // { label: 'Candidate Scored', value: 'candidate.scored' },
];

const WebhookPage = () => {
    const { data: webhooks, isLoading } = useGetMyWebhooksQuery();
    const [createWebhook, { isLoading: isCreating }] = useCreateWebhookMutation();
    const [regenerateSecret] = useRegenerateWebhookSecretMutation();
    const [deleteWebhook] = useDeleteWebhookMutation();
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [formState, setFormState] = useState({ name: '', url: '', events: [] });

    const [logWebhookId, setLogWebhookId] = useState(null);

    React.useEffect(() => {
        if (webhooks?.data?.length > 0 && !logWebhookId) {
            setLogWebhookId(webhooks.data[0].id);
        }
    }, [webhooks, logWebhookId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toastMessage.success('Copied to clipboard');
    };

    const handleCreate = async () => {
        try {
            await createWebhook({ ...formState, events: formState.events }).unwrap();
            toastMessage.success('Webhook created successfully');
            setIsCreateOpen(false);
            setFormState({ name: '', url: '', events: [] });
        } catch (err) {
            toastMessage.error(err?.data?.message || 'Failed to create webhook');
        }
    };
    const handleDelete = (id) => {
        AntModal.confirm({
            title: 'Delete Webhook',
            content: 'Are you sure you want to delete this webhook? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await deleteWebhook(id).unwrap();
                    toastMessage.success('Webhook deleted successfully');
                } catch (err) {
                    toastMessage.error('Failed to delete webhook');
                }
            },
        });
    };
    return (
        <div className="">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white"></h1>
                <div className="flex items-center gap-3">
                    <a
                        href="docs/webhooks.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <FontAwesomeIcon icon={faBook} className="text-gray-500" />
                        Docs
                    </a>
                    <Button mode="primary" onClick={() => setIsCreateOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        New Webhook
                    </Button>
                </div>
            </div>

            <div className="bg-white  rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 w-full bg-white dark:bg-neutral-900">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { label: 'Overview', id: 'overview' },
                            { label: 'Logs', id: 'logs' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="pt-6" >
                    {activeTab === 'overview' ? (
                        <div className="space-y-6">
                            <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 text-[11px] tracking-wider  font-bold">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Name</th>
                                            <th className="px-6 py-4 text-left">Target URL</th>
                                            <th className="px-6 py-4 text-left">Events</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {webhooks?.data?.map((webhook) => (
                                            <tr key={webhook.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                    {webhook.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-[11px] text-primary bg-orange-50 dark:bg-primary/10 px-2 py-1 rounded-md font-mono border border-orange-100 dark:border-primary/20">
                                                        {webhook.url}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Space size={[0, 4]} wrap>
                                                        {(typeof webhook.events === 'string'
                                                            ? webhook.events.split(',')
                                                            : (webhook.events || [])
                                                        ).map(ev => (
                                                            <span key={ev} className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                                {ev}
                                                            </span>
                                                        ))}
                                                    </Space>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        className="text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                                        onClick={() => handleDelete(webhook.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wider ">
                                    Filter by Webhook:
                                </span>
                                <ConfigProvider theme={{ token: { colorPrimary: '#f97316' } }}>
                                    <Select
                                        className="min-w-[220px]"
                                        value={logWebhookId}
                                        onChange={(id) => setLogWebhookId(id)}
                                        placeholder="Select Webhook Name"
                                        options={webhooks?.data?.map(wh => ({
                                            label: wh.name,
                                            value: wh.id
                                        }))}
                                    />
                                </ConfigProvider>
                            </div>

                            {logWebhookId ? (
                                <WebhookLogsTable webhookId={logWebhookId} />
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    Please select a webhook to view logs.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Secret Section */}
            {webhooks?.data?.length > 0 && (
                <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 pb-2">
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-wider mb-1">
                            Webhook Secret
                        </h3>
                        <h5 className="text-xs text-gray-500 dark:text-gray-400">
                            Use this secret to verify your webhook's encrypted signature.
                        </h5>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex-1 font-mono text-sm text-gray-600 dark:text-gray-400 truncate">
                            {showSecret ? webhooks.data[0].secretKey : '••••••••••••••••••••••••••••••••'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button mode="secondary" size="sm" onClick={() => setShowSecret(!showSecret)}>
                                <FontAwesomeIcon icon={showSecret ? faEyeSlash : faEye} className="mr-2" />
                                {showSecret ? 'Hide' : 'Show'}
                            </Button>
                            <Button mode="secondary" size="sm" onClick={() => handleCopy(webhooks.data[0].secretKey)}>
                                <FontAwesomeIcon icon={faCopy} className="mr-2" />
                                Copy
                            </Button>
                            <Button mode="secondary" size="sm" onClick={() => regenerateSecret(webhooks.data[0].id)}>
                                <FontAwesomeIcon icon={faRotate} className="mr-2" />
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                open={isCreateOpen}
                title="Create New Webhook"
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
                loading={isCreating}
                submitText="Create Webhook"
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook Name<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="e.g. Production Slack Bot"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post URL<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="https://api.myapp.com/webhooks"
                            value={formState.url}
                            onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Send a message when...<span className="text-red-500">*</span></label>
                        <div className="space-y-2">
                            {EVENT_OPTIONS.map(opt => (
                                <Checkbox
                                    key={opt.value}
                                    checked={formState.events.includes(opt.value)}
                                    onChange={(e) => {
                                        const newEvents = e.target.checked
                                            ? [...formState.events, opt.value]
                                            : formState.events.filter(v => v !== opt.value);
                                        setFormState({ ...formState, events: newEvents });
                                    }}
                                >
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{opt.label}</span>
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WebhookPage;