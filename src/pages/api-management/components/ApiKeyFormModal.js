import React from 'react';
import Modal from '@/components/Modal';
import ApiKeyFormFields from './ApiKeyFormFields';

const FORM_COPY = {
    create: {
        title: 'Create API Key',
        submitText: 'Create API Key',
        noticeClassName: 'rounded-xl border border-orange-200 bg-orange-50/70 dark:bg-orange-900/10 dark:border-orange-800 px-4 py-3',
        notice: 'API key and webhook secret are shown only once. Please copy and store them securely after creation.',
    },
    edit: {
        title: 'Edit API Key',
        submitText: 'Save changes',
        noticeClassName: 'rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-neutral-900 px-4 py-3',
        notice: 'Rotate key is not supported by the current backend. Editing only updates metadata, feature scope, activation state, and default webhook URL.',
    },
};

const ApiKeyFormModal = ({
    mode,
    open,
    loading,
    onCancel,
    onSubmit,
    isAdmin,
    companies,
    isCompaniesLoading,
    isCompaniesError,
    recruiterCompanyName,
    formState,
    formErrors,
    onFormChange,
    featureEntitlements,
}) => {
    const copy = FORM_COPY[mode];

    return (
        <Modal
            open={open}
            title={copy.title}
            onCancel={onCancel}
            onSubmit={onSubmit}
            loading={loading}
            submitText={copy.submitText}
            width={760}
        >
            <div className="space-y-4">
                <div className={copy.noticeClassName}>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{copy.notice}</p>
                </div>
                <ApiKeyFormFields
                    isAdmin={isAdmin}
                    companies={companies}
                    isCompaniesLoading={isCompaniesLoading}
                    isCompaniesError={isCompaniesError}
                    recruiterCompanyName={recruiterCompanyName}
                    formState={formState}
                    formErrors={formErrors}
                    onChange={onFormChange}
                    featureEntitlements={featureEntitlements}
                />
            </div>
        </Modal>
    );
};

export default ApiKeyFormModal;
