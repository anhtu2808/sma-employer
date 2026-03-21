import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvitationByIdQuery } from '@/apis/invitationApi';
import { usePageHeader } from '@/hooks/usePageHeader';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { ArrowLeft, Building2, MapPin, Briefcase, Mail, Calendar, User, DollarSign } from 'lucide-react';
import { Tag } from 'antd';

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

    const { company, candidate, job, status, content } = invitation;
    const statusConfig = STATUS_CONFIG[status] || { color: 'default', label: status };

    const formatSalary = (start, end, currency) => {
        if (!start && !end) return 'Negotiable';
        const fmt = (v) => v?.toLocaleString() || '0';
        return `${fmt(start)} – ${fmt(end)} ${currency || ''}`;
    };

    return (
        <div className="max-w-4xl space-y-6 animate-fadeIn pb-10">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <Button
                    mode="secondary"
                    onClick={() => navigate('/invitations')}
                    iconLeft={<ArrowLeft size={18} />}
                    className="!bg-white dark:!bg-gray-800"
                >
                    Back to List
                </Button>
                <Tag color={statusConfig.color} className="!text-sm !font-semibold !px-3 !py-1 !rounded-full !border-0 m-0">
                    {statusConfig.label}
                </Tag>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Job & Company */}
                <div className="md:col-span-2 space-y-6">
                    {/* Message Card */}
                    {content && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Message from Company</h3>
                            <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-500/20 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                “{content}”
                            </div>
                        </div>
                    )}

                    {/* Job Details Card */}
                    {job && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
                                <Briefcase className="text-primary" size={20} />
                                Job Position
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{job.name}</div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                            <Briefcase className="text-gray-500" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Level</div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{job.jobLevel || 'N/A'}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                            <MapPin className="text-gray-500" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Working Model</div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{job.workingModel || 'N/A'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                            <DollarSign className="text-gray-500" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Salary</div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{formatSalary(job.salaryStart, job.salaryEnd, job.currency)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                                            <Calendar className="text-gray-500" size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Experience</div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{job.experienceTime || 0} years</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Company & Candidate */}
                <div className="space-y-6">
                    {/* Candidate Info */}
                    {candidate && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/10 to-orange-200/50 dark:from-primary/20 dark:to-orange-900/20"></div>
                            <div className="relative mt-8 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 overflow-hidden flex items-center justify-center shadow-md">
                                    {candidate.user?.avatar ? (
                                        <img src={candidate.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-400" size={32} />
                                    )}
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white text-center">
                                    {candidate.user?.fullName || 'Candidate Menu'}
                                </h3>
                                
                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="text-gray-400 shrink-0" size={16} />
                                        <span className="text-gray-600 dark:text-gray-300 truncate" title={candidate.user?.email}>{candidate.user?.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="text-gray-400 shrink-0" size={16} />
                                        <span className="text-gray-600 dark:text-gray-300">{candidate.user?.dateOfBirth ? new Date(candidate.user.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="text-gray-400 shrink-0" size={16} />
                                        <span className="text-gray-600 dark:text-gray-300 capitalize">{candidate.user?.gender?.toLowerCase() || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Info */}
                    {company && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
                                <Building2 className="text-gray-400" size={18} />
                                Company Info
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center shrink-0">
                                    {company.logo ? (
                                        <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="text-gray-400" size={20} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">{company.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{company.industry}</div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3 text-sm">
                                    <Mail className="text-gray-400 shrink-0 mt-0.5" size={16} />
                                    <span className="text-gray-600 dark:text-gray-300 break-all">{company.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default InvitationDetail;
