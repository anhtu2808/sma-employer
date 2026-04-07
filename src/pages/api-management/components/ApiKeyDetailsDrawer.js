import React from 'react';
import { Drawer } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faCopy, faTrash } from '@/utils/icons';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { FEATURE_ENDPOINTS } from '../constants';
import { featureLabel, formatDateTime, statusBadgeClasses } from '../utils';

const DetailCard = ({ label, children }) => (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        {children}
    </div>
);

const ApiKeyDetailsDrawer = ({
    detailId,
    isDetailFetching,
    selectedDetail,
    recruiterCompanyName,
    onClose,
    onCopy,
    onEdit,
    onDelete,
}) => (
    <Drawer placement="right" onClose={onClose} open={!!detailId} width="min(100vw, 32rem)" title="API key details">
        {isDetailFetching && !selectedDetail ? (
            <Loading />
        ) : selectedDetail ? (
            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Name</p>
                            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{selectedDetail.name}</h3>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(selectedDetail.isActive)}`}>
                            {selectedDetail.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{selectedDetail.description || 'No description provided.'}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <DetailCard label="ID">
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDetail.id}</p>
                    </DetailCard>

                    <DetailCard label="Masked API key">
                        <div className="mt-1 flex items-center justify-between gap-3">
                            <code className="block text-sm text-gray-900 dark:text-white break-all">{selectedDetail.maskedApiKey || '-'}</code>
                            <button
                                type="button"
                                onClick={() => onCopy(selectedDetail.maskedApiKey, 'Masked API key')}
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                    </DetailCard>

                    <DetailCard label="Feature">
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{featureLabel(selectedDetail.feature)}</p>
                    </DetailCard>

                    <DetailCard label="Default webhook URL">
                        {selectedDetail.defaultWebhookUrl ? (
                            <a
                                href={selectedDetail.defaultWebhookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-2 text-sm text-primary break-all"
                            >
                                {selectedDetail.defaultWebhookUrl}
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                            </a>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No default webhook configured</p>
                        )}
                    </DetailCard>

                    <DetailCard label="Company">
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedDetail.company?.name || recruiterCompanyName}</p>
                    </DetailCard>

                    <DetailCard label="Created at">
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDateTime(selectedDetail.createdAt)}</p>
                    </DetailCard>

                    <DetailCard label="Updated at">
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDateTime(selectedDetail.updatedAt)}</p>
                    </DetailCard>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-neutral-900 px-4 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Supported integration endpoints</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(FEATURE_ENDPOINTS[selectedDetail.feature] || []).map((endpoint) => (
                            <span
                                key={endpoint}
                                className="inline-flex items-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                            >
                                {endpoint}
                            </span>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Raw API key and webhook secret are not available from list/detail endpoints after creation.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button mode="secondary" onClick={() => onEdit(selectedDetail)}>Edit</Button>
                    <Button mode="ghost" onClick={() => onDelete(selectedDetail)}>
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        ) : (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Select an API key to view its details.</div>
        )}
    </Drawer>
);

export default ApiKeyDetailsDrawer;
