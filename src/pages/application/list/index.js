import React, { useState } from 'react';
import { ExternalLink, Mail, Calendar, MapPin, Brain, Briefcase, Eye } from 'lucide-react';
import moment from 'moment';
import { Table, Select, ConfigProvider, Modal as AntModal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getApplicationStatusConfig, getAllowedNextStatuses, APPLICATION_STATUS } from '@/constrant/application';
import Loading from '@/components/Loading';

const ApplicationList = ({ data, isLoading, totalElements, totalPages, currentPage, onPageChange, onStatusUpdate }) => {
    const navigate = useNavigate();
    const [rejectModal, setRejectModal] = useState({ open: false, id: null });
    const [rejectReason, setRejectReason] = useState('');
    const [approveModal, setApproveModal] = useState({ open: false, id: null });
    const [evalModal, setEvalModal] = useState({ open: false, evaluation: null, candidateName: '' });

    const handleStatusSelect = (appId, status, isRejectedByAi) => {
        if (status === 'REJECTED') {
            setRejectModal({ open: true, id: appId });
        } else if (status === 'APPROVED') {
            setApproveModal({ open: true, id: appId });
        } else {
            onStatusUpdate(appId, status);
        }
    };

    const columns = [
        {
            title: 'Candidate',
            dataIndex: 'candidateName',
            key: 'candidateName',
            width: '20%',
            render: (_, app) => (
                <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center mt-0.5">
                        <span className="material-icons-round text-lg text-gray-400">person</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary hover:underline transition-colors"
                            onClick={() => navigate(`/applications/${app.applicationId}`)}>
                            {app.candidateName}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 truncate lowercase leading-none mt-1">
                            <Mail size={13} className="flex-shrink-0" /> {app.candidateEmail}
                        </p>
                        {app.location && (
                            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin size={13} className="flex-shrink-0" /> {app.location}
                            </p>
                        )}
                        {app.totalExperienceYears > 0 && (
                            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                <Briefcase size={13} className="flex-shrink-0" /> {app.totalExperienceYears} years exp.
                            </p>
                        )}
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1.5">
                            <Calendar size={13} className="flex-shrink-0" />
                            {moment(app.appliedAt).format('DD MMM, YYYY')}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <StatusTag status={app.status} />
                            {app.isRejectedByAi && (
                                <span className="text-[10px] font-bold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800/50 flex items-center gap-1">
                                    <Brain size={10} className="flex-shrink-0" />
                                    AI REJECTED
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: () => (
                <span className="flex items-center gap-1.5">
                    <Brain size={14} className="text-primary" />
                    AI Evaluation
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">beta</span>
                </span>
            ),
            dataIndex: 'evaluation',
            key: 'evaluation',
            width: '55%',
            render: (evaluation, app) => {
                const aiScore = evaluation?.aiScore;
                const criteriaScores = evaluation?.criteriaScores || [];

                if (evaluation && evaluation.status === 'FINISH') {
                    return (
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0">
                                <span className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
                                    {aiScore != null ? `${Math.round(aiScore)}%` : '--'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                {criteriaScores.length > 0 && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                                        {criteriaScores.map((cs, idx) => (
                                            <span key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-gray-400 mr-0.5">&bull;</span>
                                                {cs.criteriaName}
                                                <span className={`ml-1 font-semibold ${getScoreColor(cs.aiScore)}`}>
                                                    ({cs.aiScore != null ? `${Math.round(cs.aiScore)}%` : '--'})
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {(evaluation.strengths || evaluation.weakness) && (
                                    <button
                                        onClick={() => setEvalModal({ open: true, evaluation, candidateName: app.candidateName })}
                                        className="text-sm text-primary hover:underline mt-1"
                                    >
                                        View more
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <span className="text-sm text-gray-400 italic">
                        {evaluation?.status === 'PARTIAL' || evaluation?.status === 'WAITING'
                            ? 'Evaluating...'
                            : evaluation?.status === 'FAIL'
                                ? 'Failed'
                                : 'Not evaluated'}
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (_, app) => {
                const allowedStatuses = getAllowedNextStatuses(app.status, app.isRejectedByAi);
                const statusOptions = allowedStatuses.map((key) => ({
                    value: key,
                    label: APPLICATION_STATUS[key]?.label || key,
                }));

                return (
                    <div className="flex items-center justify-center gap-2">
                        {statusOptions.length > 0 && (
                            <ConfigProvider theme={{ token: { colorPrimary: '#f97316', colorBorderHover: '#f97316' } }}>
                                <Select
                                    placeholder="Change status..."
                                    onChange={(status) => handleStatusSelect(app.applicationId, status, app.isRejectedByAi)}
                                    className="w-40 h-9"
                                    options={statusOptions}
                                    size="middle"
                                    value={app.status || null}
                                />
                            </ConfigProvider>
                        )}
                        <button
                            onClick={() => navigate(`/applications/${app.applicationId}`)}
                            className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                        {app.resumeUrl && (
                            <button
                                onClick={() => window.open(app.resumeUrl, '_blank')}
                                className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                                title="View Resume"
                            >
                                <ExternalLink size={16} />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    if (isLoading) return (
        <Loading className="py-20" size={96} />
    );

    return (
        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <div className="border border-neutral-200 rounded-xl overflow-visible">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="applicationId"
                    loading={isLoading}
                    locale={{
                        emptyText: (
                            <div className="flex flex-col items-center text-neutral-400 py-10">
                                <p className="text-sm font-medium">No applications found</p>
                            </div>
                        ),
                    }}
                    pagination={{
                        current: currentPage + 1,
                        pageSize: 10,
                        total: totalElements || 0,
                        onChange: (p) => onPageChange(p - 1),
                        showSizeChanger: false,
                    }}
                />
            </div>

            {/* Reject Modal */}
            <AntModal
                open={rejectModal.open}
                title={<span className="font-semibold text-red-600">Reject Candidate</span>}
                onCancel={() => {
                    setRejectModal({ open: false, id: null });
                    setRejectReason('');
                }}
                onOk={() => {
                    onStatusUpdate(rejectModal.id, 'REJECTED', rejectReason);
                    setRejectModal({ open: false, id: null });
                    setRejectReason('');
                }}
                okText="Confirm & Reject"
                okButtonProps={{ danger: true }}
                width={500}
            >
                <div className="text-left space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure to move this application to <span className="text-red-500 font-medium">Rejected</span> status? Please state the reason.
                    </p>
                    <div className="space-y-2">
                        <label className="flex justify-between items-center px-1">
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Reason for rejection
                            </span>
                            <span className="text-xs text-neutral-400">(Optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            autoFocus
                            placeholder="Provide a reason or leave it blank to continue..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all resize-none font-body"
                        />
                    </div>
                </div>
            </AntModal>

            {/* Approve Modal */}
            <AntModal
                open={approveModal.open}
                title={<span className="font-semibold text-green-600">Approve Candidate</span>}
                onCancel={() => setApproveModal({ open: false, id: null })}
                onOk={() => {
                    onStatusUpdate(approveModal.id, 'APPROVED');
                    setApproveModal({ open: false, id: null });
                }}
                okText="Confirm & Approve"
                okButtonProps={{ style: { backgroundColor: '#16a34a', borderColor: '#16a34a' } }}
                width={420}
            >
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Are you sure to move this application to <span className="text-green-600 font-medium">Approved</span> status? This action cannot be undone.
                </p>
            </AntModal>

            {/* AI Evaluation Modal */}
            <AntModal
                open={evalModal.open}
                title={<span className="font-semibold">AI Evaluation — {evalModal.candidateName}</span>}
                onCancel={() => setEvalModal({ open: false, evaluation: null, candidateName: '' })}
                footer={null}
                width={1000}
            >
                {evalModal.evaluation && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4">
                            <span className={`text-3xl font-bold ${getScoreColor(evalModal.evaluation.aiScore)}`}>
                                {evalModal.evaluation.aiScore != null ? `${Math.round(evalModal.evaluation.aiScore)}%` : '--'}
                            </span>
                            {(evalModal.evaluation.criteriaScores || []).length > 0 && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {evalModal.evaluation.criteriaScores.map((cs, idx) => (
                                        <span key={idx} className="text-base text-gray-700 dark:text-gray-400">
                                            <span className="text-gray-400 mr-0.5">&bull;</span>
                                            {cs.criteriaName}
                                            <span className={`ml-1 font-semibold ${getScoreColor(cs.aiScore)}`}>
                                                ({cs.aiScore != null ? `${Math.round(cs.aiScore)}%` : '--'})
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        {(evalModal.evaluation.strengths || evalModal.evaluation.weakness) && (
                            <div className="grid grid-cols-2 gap-6">
                                {evalModal.evaluation.strengths && (
                                    <div className="space-y-2">
                                        <p className="text-base font-semibold text-emerald-600">Strengths</p>
                                        {parseBullets(evalModal.evaluation.strengths).map((item, i) => (
                                            <p key={`s-${i}`} className="text-base text-gray-700 dark:text-gray-400 flex items-start gap-1">
                                                <span className="text-emerald-500 mt-px">+</span> {item}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                {evalModal.evaluation.weakness && (
                                    <div className="space-y-2">
                                        <p className="text-base font-semibold text-red-500">Weaknesses</p>
                                        {parseBullets(evalModal.evaluation.weakness).map((item, i) => (
                                            <p key={`w-${i}`} className="text-base text-gray-700 dark:text-gray-400 flex items-start gap-1">
                                                <span className="text-red-500 mt-px">-</span> {item}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </AntModal>
        </div>
    );
};

// Helper Components
const StatusTag = ({ status }) => {
    const config = getApplicationStatusConfig(status);

    return (
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 w-fit tracking-wide ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

const getScoreColor = (score) => {
    if (score == null) return 'text-gray-300';
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
};

const parseBullets = (text) => {
    if (!text) return [];
    return text
        .split('\n')
        .map(line => line.replace(/^[-*•+]\s*/, '').trim())
        .filter(line => line.length > 0);
};

export default ApplicationList;
