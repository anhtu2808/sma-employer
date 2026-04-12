import React, { useState, useEffect } from 'react';
import { Switch, Select, Divider, Empty, Spin, ConfigProvider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLink, faCheckCircle, faSync, faPlus, faTrash, faCircleCheck, faNetworkWired
} from '@fortawesome/free-solid-svg-icons';
import {
    useGetRecruiteeConfigQuery,
    useSaveRecruiteeConfigMutation,
    useTestConnectionMutation,
    useLazyGetRecruiteeOffersQuery
} from '@/apis/recruiteeApi';
import Modal from '@/components/Modal';
import toastMessage from '@/utils/toastMessage';

const RecruiteeConfigModal = ({ open, onClose, jobs }) => {
    const { data: configRes, isFetching: isConfigLoading } = useGetRecruiteeConfigQuery(undefined, { skip: !open });
    const [saveConfig, { isLoading: isSaving }] = useSaveRecruiteeConfigMutation();
    const [testConnection, { isLoading: isTesting }] = useTestConnectionMutation();
    const [fetchOffers, { data: offersRes, isFetching: isFetchingOffers }] = useLazyGetRecruiteeOffersQuery();

    const [formData, setFormData] = useState({
        apiToken: '',
        recruiteeCompanyId: '',
        isAutoSync: false,
        jobMappings: []
    });
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (configRes?.data && open) {
            const config = configRes.data;
            setFormData({
                apiToken: '',
                recruiteeCompanyId: config.recruiteeCompanyId || '',
                isAutoSync: config.isAutoSync || false,
                jobMappings: (config.jobMappings || []).map(m => ({
                    ...m,
                    recruiteeOfferId: m.recruiteeOfferId ? String(m.recruiteeOfferId) : null
                }))
            });
            setIsConnected(config.isConnected || false);
            if (config.apiToken && config.recruiteeCompanyId) {
                fetchOffers({
                    apiToken: config.apiToken,
                    recruiteeCompanyId: config.recruiteeCompanyId
                });
            }
        }
    }, [configRes, open, fetchOffers]);

    const handleTestConnection = async () => {
        try {
            const result = await testConnection({
                apiToken: formData.apiToken,
                recruiteeCompanyId: formData.recruiteeCompanyId
            }).unwrap();

            if (result.data) {
                setIsConnected(true);
                toastMessage.success("Connection successful!");
                fetchOffers({
                    apiToken: formData.apiToken,
                    recruiteeCompanyId: formData.recruiteeCompanyId
                });
            } else {
                setIsConnected(false);
                toastMessage.error(result.message || "Connection failed.");
            }
        } catch (err) {
            setIsConnected(false);
            toastMessage.error("Could not connect to Recruitee API.");
        }
    };

    const updateMapping = (index, field, value) => {
        setFormData(prev => {
            const newMappings = prev.jobMappings.map((item, i) => {
                if (i === index) {
                    const finalValue = field === 'recruiteeOfferId' ? String(value) : value;
                    return { ...item, [field]: finalValue };
                }
                return item;
            });
            return { ...prev, jobMappings: newMappings };
        });
    };

    const handleSave = async () => {
        try {
            const cleanMappings = formData.jobMappings.filter(m => m.localJobId && m.recruiteeOfferId);
            await saveConfig({ ...formData, jobMappings: cleanMappings }).unwrap();
            toastMessage.success("Configuration saved successfully!");
            onClose();
        } catch (err) {
            toastMessage.error("Failed to save configuration.");
        }
    };

    const selectedLocalJobIds = formData.jobMappings.map(m => m.localJobId);

    return (
        <Modal
            open={open}
            title="Recruitee Integration"
            onCancel={onClose}
            onSubmit={handleSave}
            loading={isSaving}
            submitText="Save Changes"
            submitDisabled={!isConnected}
            width={700}
        >
            <Spin spinning={isConfigLoading}>
                <div className="space-y-6">
                    {/* Credentials */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Personal API Token</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.apiToken}
                                onChange={e => { setFormData({ ...formData, apiToken: e.target.value }); setIsConnected(false); }}
                                placeholder="Enter token"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company ID</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={formData.recruiteeCompanyId}
                                onChange={e => { setFormData({ ...formData, recruiteeCompanyId: e.target.value }); setIsConnected(false); }}
                                placeholder="e.g. 12345"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className={`w-full h-10 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all border ${isConnected
                            ? 'bg-green-50 border-green-200 text-green-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FontAwesomeIcon icon={isTesting ? faSync : (isConnected ? faCircleCheck : faNetworkWired)} className={isTesting ? 'fa-spin' : ''} />
                        {isTesting ? 'Verifying...' : (isConnected ? 'Connection Verified' : 'Verify Connection')}
                    </button>

                    {isConnected && (
                        <div className="space-y-6 animate-fadeIn">
                            <Divider className="my-0" />

                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Auto-Sync on Approved</div>
                                    <div className="text-xs text-gray-500">Automatically push candidates to Recruitee when approved</div>
                                </div>
                                <ConfigProvider theme={{ token: { colorPrimary: '#f97316' } }}>
                                    <Switch checked={formData.isAutoSync} onChange={val => setFormData({ ...formData, isAutoSync: val })} />
                                </ConfigProvider>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Job Mapping Rules</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, jobMappings: [...prev.jobMappings, { localJobId: null, recruiteeOfferId: null }] }))}
                                        className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1"
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Mapping
                                    </button>
                                </div>

                                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {formData.jobMappings.length === 0 ? (
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active mappings" />
                                    ) : (
                                        formData.jobMappings.map((map, idx) => (
                                            <div key={idx} className="flex gap-2 items-center bg-white dark:bg-neutral-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                <ConfigProvider theme={{ token: { colorPrimary: '#f97316' } }}>
                                                    <Select
                                                        className="flex-1"
                                                        placeholder="Our Job"
                                                        value={map.localJobId}
                                                        onChange={v => updateMapping(idx, 'localJobId', v)}
                                                        options={jobs?.map(j => ({
                                                            label: j.name,
                                                            value: j.id,
                                                            disabled: selectedLocalJobIds.includes(j.id) && map.localJobId !== j.id
                                                        }))}
                                                    />
                                                    <FontAwesomeIcon icon={faLink} className="text-gray-300 mx-1" />
                                                    <Select
                                                        className="flex-1"
                                                        placeholder="Recruitee Offer"
                                                        loading={isFetchingOffers}
                                                        value={map.recruiteeOfferId ? String(map.recruiteeOfferId) : null}
                                                        onChange={v => updateMapping(idx, 'recruiteeOfferId', v)}
                                                        options={offersRes?.data?.map(o => ({
                                                            label: o.title,
                                                            value: String(o.id)
                                                        }))}
                                                    />
                                                </ConfigProvider>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, jobMappings: prev.jobMappings.filter((_, i) => i !== idx) }))}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Spin>
        </Modal>
    );
};

export default RecruiteeConfigModal;