import React, { useState, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import { useUpdateJobStatusMutation, useUpdateExpiredDateMutation, useGetProposedCvsQuery, usePublishJobMutation } from '@/apis/jobApi';
import { useGetFeatureUsageQuery } from '@/apis/featureUsageApi';
import PublishConfirmModal from '../jobs/job-create/components/PublishConfirmModal';
import { useGetApplicationsQuery } from '@/apis/applicationApi';
import Button from '@/components/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { Skeleton, Tabs, ConfigProvider, Modal, DatePicker, Select, Button as AntButton, Tooltip } from 'antd';
import toastMessage from '@/utils/toastMessage';
import dayjs from 'dayjs';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
import JobApplicants from './components/JobApplicants';
import ProposedCVs from './components/ProposedCVs';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';
import AiScoringCard from './components/AiScoringCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBoxArchive, faCircleXmark, faPenToSquare, faTrash, faUpload } from '../../utils/icons';

const buildPublishBody = (job) => ({
    name: job.name,
    about: job.about,
    responsibilities: job.responsibilities,
    requirement: job.requirement,
    enableAiScoring: job.enableAiScoring ?? false,
    expDate: job.expDate,
    salaryStart: job.salaryStart ?? null,
    salaryEnd: job.salaryEnd ?? null,
    experienceTime: job.experienceTime ?? null,
    jobLevel: job.jobLevel,
    workingModel: job.workingModel,
    quantity: job.quantity,
    autoRejectThreshold: job.autoRejectThreshold ?? null,
    expertiseId: job.expertise?.id || job.expertiseId,
    skillIds: job.skills?.map(s => s.id) || [],
    domainIds: job.domains?.map(d => d.id) || [],
    benefits: (job.benefits || []).map(b => ({
        name: b.description || b.name || '',
        type: b.type || 'OTHER',
        description: b.description || b.name || '',
    })),
    questionIds: job.questions?.map(q => q.id) || [],
    locationIds: job.locations?.map(l => l.id) || [],
    scoringCriterias: (job.scoringCriterias || []).map(c => ({
        criteriaId: c.criteria?.id || c.criteriaId,
        weight: c.weight,
        enable: true,
        rule: c.rule || null,
    })),
    highlightJob: job.highlightJob ?? false,
});

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderConfig } = useContext(PageHeaderContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const VALID_TABS = ['1', '2', '3'];
    const urlTab = searchParams.get('tab');
    const activeTab = VALID_TABS.includes(urlTab) ? urlTab : '1';
    const handleTabChange = (key) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('tab', key);
            return next;
        }, { replace: true });
    };
    const { data: jobData, isLoading, error } = useGetJobDetailQuery(id);
    const job = jobData?.data;

    const { data: applicantsData } = useGetApplicationsQuery(
        { jobId: id, page: 0, size: 1 },
        { skip: !job?.id }
    );
    const applicantCount = applicantsData?.data?.totalElements || 0;

    const { data: proposedCvsData } = useGetProposedCvsQuery(
        { id, page: 0, size: 1 },
        { skip: !job?.id }
    );
    const proposedCvCount = proposedCvsData?.data?.totalElements || 0;

    const [updateJobStatus, { isLoading: isClosingJob }] = useUpdateJobStatusMutation();
    const [updateExpiredDate, { isLoading: isUpdatingExpDate }] = useUpdateExpiredDateMutation();
    const [publishJob, { isLoading: isPublishing }] = usePublishJobMutation();
    const { data: featureUsage = [] } = useGetFeatureUsageQuery();

    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishOverrides, setPublishOverrides] = useState({});
    const [isExpDateModalVisible, setIsExpDateModalVisible] = useState(false);
    const [newExpDate, setNewExpDate] = useState(null);

    const handleCloseJob = () => {
        Modal.confirm({
            title: 'Close Job',
            content: 'Are you sure you want to close this job? This action cannot be undone.',
            okText: 'Close Job Now',
            okButtonProps: { danger: true },
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    await updateJobStatus({ id: job.id, status: 'CLOSED' }).unwrap();
                    toastMessage.success('Job closed successfully');
                } catch (err) {
                    toastMessage.error('Failed to close job');
                }
            }
        });
    };

    const handleCloneJob = () => {
        navigate('/jobs/create', { state: { clonedJobId: job.id } });
    };

    const handleUpdateExpDate = async () => {
        if (!newExpDate) {
            toastMessage.warning('Please select a new expiration date');
            return;
        }
        try {
            await updateExpiredDate({
                id: job.id,
                body: { expDate: newExpDate.toISOString() }
            }).unwrap();
            toastMessage.success('Expiration date updated successfully');
            setIsExpDateModalVisible(false);
        } catch (err) {
            toastMessage.error('Failed to update expiration date');
        }
    };

    if (!isLoading && (error || !job)) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Job not found</h2>
                <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Negotiable';
        const format = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        if (min && !max) return `From ${format(min)}`;
        if (!min && max) return `Up to ${format(max)}`;
        return `${format(min)} - ${format(max)}`;
    };

    const tabItems = job ? [
        {
            key: '1',
            label: 'Job Details',
            children: (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <JobHeader
                                job={job}
                                formatDate={formatDate}
                                formatSalary={formatSalary}
                                onCloseJob={handleCloseJob}
                                onCloneJob={handleCloneJob}
                                onEditExpDate={() => {
                                    setNewExpDate(job.expDate ? dayjs(job.expDate) : null);
                                    setIsExpDateModalVisible(true);
                                }}
                                isClosingJob={isClosingJob}
                            />
                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
                            <JobDescription job={job} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AiScoringCard job={job} />
                    </div>
                </div>
            )
        },
        {
            key: '2',
            label: `Applicants (${applicantCount})`,
            children: <JobApplicants jobId={job.id} />,
        },
        {
            key: '3',
            label: `Proposed CVs (${proposedCvCount})`,
            children: <ProposedCVs jobId={job.id} />,
        },
    ] : [];

    return (
        <div className="relative space-y-2">
            <LoadingOverlay isLoading={isLoading} />
            {/* Top bar: Back button + Status & Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Button
                    mode="text"
                    className="text-gray-500 hover:text-primary pl-0 -ml-6"
                    onClick={() => navigate('/jobs')}
                    iconLeft={<FontAwesomeIcon icon={faArrowLeft} className="text-lg" />}
                >
                    Back to Jobs
                </Button>
                {job && <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border ${job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        job.status === 'DRAFT' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                            job.status === 'CLOSED' ? 'bg-red-100 text-red-600 border-red-300' :
                                job.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                                    job.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                        'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${job.status === 'PUBLISHED' ? 'bg-emerald-500' :
                            job.status === 'DRAFT' ? 'bg-slate-400' :
                                job.status === 'CLOSED' ? 'bg-red-500' :
                                    job.status === 'PENDING_REVIEW' ? 'bg-amber-500' :
                                        job.status === 'SUSPENDED' ? 'bg-orange-500' :
                                            'bg-gray-400'
                            }`} />
                        {job.status === 'PENDING_REVIEW' ? 'Pending Review' : job.status?.charAt(0) + job.status?.slice(1).toLowerCase()}
                    </span>
                    {job.status === 'DRAFT' && (
                        <>
                            <Tooltip title="Delete job">
                                <AntButton
                                    type="default"
                                    danger
                                    className="!rounded-xl !h-10 !w-10"
                                    icon={<FontAwesomeIcon icon={faTrash} className="text-base" />}
                                    loading={isClosingJob}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: 'Delete Job',
                                            content: 'Are you sure you want to delete this job?',
                                            okText: 'Yes, Delete',
                                            okButtonProps: { danger: true },
                                            cancelText: 'Cancel',
                                            centered: true,
                                            onOk: async () => {
                                                try {
                                                    await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                                    toastMessage.success('Job deleted successfully');
                                                } catch {
                                                    toastMessage.error('Failed to delete job');
                                                }
                                            }
                                        });
                                    }}
                                />
                            </Tooltip>
                            <Button
                                mode="secondary"
                                shape="round"
                                iconLeft={<FontAwesomeIcon icon={faUpload} className="text-sm" />}
                                onClick={() => setShowPublishModal(true)}
                            >
                                Publish
                            </Button>
                            <Button
                                mode="primary"
                                shape="round"
                                onClick={() => navigate(`/jobs/${job.id}/edit`)}
                                iconLeft={<FontAwesomeIcon icon={faPenToSquare} className="text-sm" />}
                            >
                                Edit
                            </Button>
                        </>
                    )}
                    {job.status === 'SUSPENDED' && (
                        <Button
                            mode="secondary"
                            shape="round"
                            loading={isClosingJob}
                            iconLeft={<FontAwesomeIcon icon={faTrash} className="text-sm" />}
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Delete Job',
                                    content: 'Are you sure you want to delete this job?',
                                    okText: 'Yes, Delete',
                                    okButtonProps: { danger: true },
                                    cancelText: 'Cancel',
                                    centered: true,
                                    onOk: async () => {
                                        try {
                                            await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                            toastMessage.success('Job deleted successfully');
                                        } catch {
                                            toastMessage.error('Failed to delete job');
                                        }
                                    }
                                });
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    {job.status === 'PUBLISHED' && (
                        <Button
                            mode="secondary"
                            shape="round"
                            loading={isClosingJob}
                            iconLeft={<FontAwesomeIcon icon={faCircleXmark} className="text-sm" />}
                            onClick={() => handleCloseJob()}
                        >
                            Close Job
                        </Button>
                    )}
                    {job.status === 'CLOSED' && (
                        <>
                            <Button
                                mode="secondary"
                                shape="round"
                                loading={isClosingJob}
                                iconLeft={<FontAwesomeIcon icon={faBoxArchive} className="text-sm" />}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Archive Job',
                                        content: 'Are you sure you want to archive this job? It will be moved to the Archived section.',
                                        okText: 'Yes, Archive',
                                        okButtonProps: { danger: true },
                                        cancelText: 'Cancel',
                                        centered: true,
                                        onOk: async () => {
                                            try {
                                                await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                                toastMessage.success('Job archived successfully');
                                            } catch {
                                                toastMessage.error('Failed to archive job');
                                            }
                                        }
                                    });
                                }}
                            >
                                Archive
                            </Button>
                        </>
                    )}
                </div>}
            </div>

            {job ? (
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#f97316',
                        },
                    }}
                >
                    <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} className="custom-tabs" />
                </ConfigProvider>
            ) : (
                <div className="space-y-6 mt-4">
                    <Skeleton active paragraph={{ rows: 8 }} />
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            )}

            {job && <Modal
                title="Update Expired Date"
                open={isExpDateModalVisible}
                onOk={handleUpdateExpDate}
                onCancel={() => setIsExpDateModalVisible(false)}
                confirmLoading={isUpdatingExpDate}
            >
                <div className="py-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Expiration Date</label>
                    <DatePicker
                        className="w-full"
                        value={newExpDate}
                        onChange={(date) => setNewExpDate(date)}
                        disabledDate={(current) => current && current < dayjs().endOf('day')}
                    />
                </div>
            </Modal>}

            {job && <PublishConfirmModal
                open={showPublishModal}
                onConfirm={async () => {
                    try {
                        await publishJob({
                            id: job.id,
                            body: { ...buildPublishBody(job), ...publishOverrides },
                        }).unwrap();
                        toastMessage.success('Job published successfully!');
                        setShowPublishModal(false);
                        setPublishOverrides({});
                    } catch (error) {
                        const validationErrors = error?.data?.data;
                        if (validationErrors && typeof validationErrors === 'object') {
                            Object.values(validationErrors).forEach((msg) => toastMessage.error(msg));
                        } else {
                            toastMessage.error(error?.data?.message || 'Failed to publish job');
                        }
                    }
                }}
                onCancel={() => {
                    setShowPublishModal(false);
                    setPublishOverrides({});
                }}
                loading={isPublishing}
                values={{ ...job, ...publishOverrides }}
                onValuesChange={(changed) => setPublishOverrides((prev) => ({ ...prev, ...changed }))}
                featureUsage={featureUsage}
                isEditMode={true}
            />}
        </div>
    );
};

export default JobDetail;
