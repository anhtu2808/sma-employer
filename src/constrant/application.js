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
    APPLIED: { label: 'Applied', color: 'bg-gray-50 text-gray-400', dot: 'bg-gray-400', textColor: 'text-gray-400' },
    VIEWED: { label: 'Viewed', color: 'bg-blue-50 text-indigo-500', dot: 'bg-indigo-500', textColor: 'text-indigo-500' },
    SHORTLISTED: { label: 'Shortlisted', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600', textColor: 'text-orange-500' },
    REJECTED: { label: 'Rejected', color: 'bg-red-50 text-red-600', dot: 'bg-red-600', textColor: 'text-red-500' },
    APPROVED: { label: 'Approved', color: 'bg-green-50 text-green-600', dot: 'bg-green-600', textColor: 'text-green-500' },
};

export const getApplicationStatusConfig = (statusEnum) => {
    return APPLICATION_STATUS[statusEnum] || {
        label: statusEnum,
        color: 'bg-gray-50 text-gray-600',
        dot: 'bg-gray-600',
        textColor: 'text-gray-500'
    };
};

const ALLOWED_TRANSITIONS = {
    VIEWED: ['SHORTLISTED', 'REJECTED', 'APPROVED'],
    SHORTLISTED: ['REJECTED', 'APPROVED'],
    REJECTED: [],
    APPROVED: [],
};

export const getAllowedNextStatuses = (currentStatus, isRejectedByAi = false) => {
    if (currentStatus === 'REJECTED' && isRejectedByAi) {
        return ['SHORTLISTED', 'APPROVED'];
    }
    return ALLOWED_TRANSITIONS[currentStatus] || [];
};
