export const FEATURE_OPTIONS = [
    { value: 'PARSING', label: 'Parsing only' },
    { value: 'MATCHING', label: 'Matching only' },
    { value: 'PARSING_AND_MATCHING', label: 'Parsing + Matching' },
];

export const FEATURE_ENDPOINTS = {
    PARSING: ['POST /v1/integration/parsing-jobs'],
    MATCHING: ['POST /v1/integration/matching-jobs'],
    PARSING_AND_MATCHING: [
        'POST /v1/integration/parsing-jobs',
        'POST /v1/integration/matching-jobs',
        'POST /v1/integration/parsing-matching-jobs',
    ],
};

export const STATUS_OPTIONS = [
    { value: 'ALL', label: 'All status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

export const FILTER_FEATURE_OPTIONS = [{ value: 'ALL', label: 'All features' }, ...FEATURE_OPTIONS];

export const createInitialFormState = (companyId = '') => ({
    name: '',
    description: '',
    feature: '',
    companyId: companyId ? String(companyId) : '',
    isActive: true,
    defaultWebhookUrl: '',
});
