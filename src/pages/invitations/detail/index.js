import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvitationByIdQuery } from '@/apis/invitationApi';
import { usePageHeader } from '@/hooks/usePageHeader';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { Briefcase, Mail, Calendar, User, DollarSign, FileX, Download } from 'lucide-react';
import { Tag } from 'antd';
import PdfViewer from '../../application/detail/pdf-viewer';


const STATUS_CONFIG = {
    INVITED: { color: 'blue', label: 'Invited' },
    RECEIVED: { color: 'orange', label: 'Received' },
    ACCEPTED: { color: 'green', label: 'Accepted' },
    DECLINED: { color: 'red', label: 'Declined' }
};

const InvitationDetail = () => {
    usePageHeader('Invitation Details', 'View details of the candidate invitation');
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: response, isLoading } = useGetInvitationByIdQuery(id);
    const invitation = response?.data;

    if (isLoading) return <Loading className="py-16" />;

    if (!invitation) return (
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Invitation not found</h2>
            <Button className="mt-4" onClick={() => navigate('/invitations')}>Go Back</Button>
        </div>
    );

    const { candidate, job, status } = invitation;
    const statusConfig = STATUS_CONFIG[status] || { color: 'default', label: status };

    const formatSalary = (start, end, currency) => {
        if (!start && !end) return 'Negotiable';
        const fmt = (v) => v?.toLocaleString() || '0';
        return `${fmt(start)} – ${fmt(end)} ${currency || ''}`;
    };

    return (
        <div className="w-full space-y-4">
            {/* Unified Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-clip" style={{ height: 'calc(100vh - 20px)' }}>
                {/* Tabs Bar & Status */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
                    <div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full p-1">
                        <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm">
                            <User size={14} className="text-gray-500" />
                            <span className="hidden sm:inline">Basic Information</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border ${status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            status === 'DECLINED' ? 'bg-red-50 text-red-600 border-red-200' :
                                status === 'RECEIVED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${status === 'ACCEPTED' ? 'bg-emerald-500' :
                                status === 'DECLINED' ? 'bg-red-500' :
                                    status === 'RECEIVED' ? 'bg-amber-500' :
                                        'bg-blue-500'
                                }`} />
                            {statusConfig.label}
                        </div>
                    </div>
                </div>

                {/* Content: Left info + Right PDF */}
                <div className="flex flex-col lg:flex-row h-[calc(100%-60px)]">

                    {/* Left: Tab Content */}
                    <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">

                            {/* Candidate Info + Contact */}
                            <div className="bg-gray-50 dark:bg-neutral-800/30 rounded-xl p-6 space-y-5">
                                {/* Candidate Name & Contact Info */}
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {candidate?.user?.fullName || 'Candidate'}
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-3.5">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-base font-medium text-gray-800 dark:text-neutral-200 truncate">{candidate?.user?.email || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 dark:border-neutral-700" />

                                {/* Job Position Info */}
                                {job && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest">
                                            Job Position
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2.5 text-base text-gray-800 dark:text-neutral-200">
                                                <Briefcase className="w-[18px] text-gray-500 dark:text-neutral-400" />
                                                <span className="font-medium">{job.name} ({job.jobLevel || 'N/A'}{job.workingModel ? `, ${job.workingModel}` : ''})</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-base text-gray-800 dark:text-neutral-200">
                                                <DollarSign className="w-[18px] text-gray-500 dark:text-neutral-400" />
                                                <span className="font-medium">{formatSalary(job.salaryStart, job.salaryEnd, job.currency)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Right: PDF Viewer */}
                    <div className="w-full lg:w-1/2 bg-neutral-50 dark:bg-neutral-950 overflow-hidden relative">
                        {candidate?.resumeUrl ? (
                            <PdfViewer resumeUrl={candidate.resumeUrl} />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-800/20">
                                <FileX className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">No CV attached</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    The candidate didn't have any resume url to attach.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationDetail;
