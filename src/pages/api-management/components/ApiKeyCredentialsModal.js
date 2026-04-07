import React from 'react';
import { Modal as AntModal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTriangleExclamation } from '@/utils/icons';
import Button from '@/components/Button';

const SecretCard = ({ label, value, actionLabel, onCopy }) => (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 break-all">{value || '-'}</p>
            </div>
            {onCopy ? (
                <Button mode="secondary" size="sm" onClick={onCopy}>
                    <FontAwesomeIcon icon={faCopy} className="mr-2" />
                    {actionLabel}
                </Button>
            ) : null}
        </div>
    </div>
);

const ApiKeyCredentialsModal = ({ createdSecrets, onClose, onCopy }) => (
    <AntModal open={!!createdSecrets} centered closable={false} maskClosable={false} footer={null} width={680}>
        <div className="-mx-6 -mt-2 border-b border-gray-100 px-6 pb-4">
            <h3 className="text-[20px] leading-7 font-bold text-gray-900 dark:text-white">Save your API credentials now</h3>
        </div>

        <div className="pt-6 space-y-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 dark:bg-amber-900/10 dark:border-amber-800 px-4 py-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">API key and webhook secret are shown only once.</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Please copy and store them securely now. Later screens will only show the masked API key.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <SecretCard
                    label="Raw API key"
                    value={createdSecrets?.apiKey}
                    actionLabel="Copy API Key"
                    onCopy={() => onCopy(createdSecrets?.apiKey, 'API key')}
                />
                <SecretCard
                    label="Webhook secret"
                    value={createdSecrets?.webhookSecret}
                    actionLabel="Copy Webhook Secret"
                    onCopy={() => onCopy(createdSecrets?.webhookSecret, 'Webhook secret')}
                />
                <SecretCard label="Masked API key" value={createdSecrets?.maskedApiKey} />
            </div>
        </div>

        <div className="-mx-6 mt-8 border-t border-gray-100 px-6 pt-4 flex justify-end">
            <Button mode="primary" onClick={onClose}>I have saved these values</Button>
        </div>
    </AntModal>
);

export default ApiKeyCredentialsModal;
