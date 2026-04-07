import React from 'react';
import Modal from '@/components/Modal';

const ApiKeyDeleteModal = ({ deleteTarget, recruiterCompanyName, isDeleting, onCancel, onSubmit }) => (
    <Modal
        open={!!deleteTarget}
        title="Delete API Key"
        onCancel={onCancel}
        onSubmit={onSubmit}
        loading={isDeleting}
        submitText="Delete"
        cancelText="Cancel"
        danger
        width={560}
    >
        <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50/70 dark:bg-red-900/10 dark:border-red-800 px-4 py-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{deleteTarget?.name}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Company: {deleteTarget?.company?.name || recruiterCompanyName}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">This key will no longer authenticate integration requests after deletion.</p>
            </div>
        </div>
    </Modal>
);

export default ApiKeyDeleteModal;
