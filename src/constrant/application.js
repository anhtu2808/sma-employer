export const JOB_STATUS = {
    DRAFT: { label: 'Draft', color: 'text-neutral-400' },
    PENDING_REVIEW: { label: 'Pending Review', color: 'text-neutral-400' },
    REJECTED: { label: 'Rejected', color: 'text-red-500' },
    PUBLISHED: { label: 'Published', color: 'text-green-500' },
    CLOSED: { label: 'Closed', color: 'text-neutral-500' },
    COMPLETED: { label: 'Completed', color: 'text-blue-500' }
};

export const getJobStatusConfig = (statusEnum) => {
    return JOB_STATUS[statusEnum] || { label: statusEnum, color: 'text-neutral-400' };
};

export const APPLICATION_STATUS = {
    APPLIED: { label: 'Applied', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600', textColor: 'text-orange-500' },
    VIEWED: { label: 'In Review', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600', textColor: 'text-blue-500' },
    SHORTLISTED: { label: 'Shortlisted', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-600', textColor: 'text-emerald-500' },
    NOT_SUITABLE: { label: 'Rejected', color: 'bg-red-50 text-red-600', dot: 'bg-red-600', textColor: 'text-red-500' },
    AUTO_REJECTED: { label: 'Auto Rejected', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-500', textColor: 'text-gray-500' },
};

export const getApplicationStatusConfig = (statusEnum) => {
    return APPLICATION_STATUS[statusEnum] || { 
        label: statusEnum, 
        color: 'bg-gray-50 text-gray-600', 
        dot: 'bg-gray-600', 
        textColor: 'text-gray-500' 
    };
};
