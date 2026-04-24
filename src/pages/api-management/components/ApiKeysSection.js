import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpRightFromSquare,
    faCircleExclamation,
    faCopy,
    faKey,
    faMagnifyingGlass,
} from '@/utils/icons';
import Button from '@/components/Button';
import { FILTER_FEATURE_OPTIONS, STATUS_OPTIONS } from '../constants';
import { featureLabel, formatDateTime, statusBadgeClasses } from '../utils';

const ApiKeysSection = ({
    showPermissionState,
    showGenericError,
    listError,
    refetch,
    isListFetching,
    apiKeys,
    filteredApiKeys,
    hasActiveFilters,
    isAdmin,
    searchQuery,
    featureFilter,
    statusFilter,
    onSearchChange,
    onFeatureFilterChange,
    onStatusFilterChange,
    onOpenCreate,
    onView,
    onEdit,
    onDelete,
    onCopy,
    createDisabled,
}) => {
    if (showPermissionState) {
        return (
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-xl" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">You do not have access to API Management</h3>
                <p className="mt-2 max-w-xl mx-auto text-sm text-gray-600 dark:text-gray-300">This page is intended for admin accounts and root recruiters. Non-root recruiters should be redirected before backend returns a 403.</p>
            </section>
        );
    }

    if (showGenericError) {
        return (
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Unable to load API keys</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{listError?.data?.message || 'Something went wrong while fetching the API key list.'}</p>
                    </div>
                    <Button mode="primary" onClick={refetch}>Try again</Button>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API keys</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Filter locally by name, feature scope, and status.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[720px]">
                    <div className="relative sm:col-span-1">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search by name, masked key, company..."
                            className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <select
                        value={featureFilter}
                        onChange={(event) => onFeatureFilterChange(event.target.value)}
                        className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {FILTER_FEATURE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(event) => onStatusFilterChange(event.target.value)}
                        className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isListFetching && <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">Refreshing API key list...</div>}

            {apiKeys.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-primary flex items-center justify-center">
                        <FontAwesomeIcon icon={faKey} className="text-xl" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No API keys yet</h3>
                    <p className="mt-2 max-w-2xl mx-auto text-sm text-gray-600 dark:text-gray-300">You have no API keys yet. Create one to start integrating with Smart Recruit parsing and matching APIs.</p>
                    <div className="mt-6 flex justify-center">
                        <Button mode="primary" onClick={onOpenCreate} disabled={createDisabled}>Create first API Key</Button>
                    </div>
                </div>
            ) : filteredApiKeys.length === 0 ? (
                <div className="px-6 py-16 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No matching API keys</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{hasActiveFilters ? 'Try adjusting your search or filters.' : 'No API keys available right now.'}</p>
                </div>
            ) : (
                <>
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-neutral-950 text-gray-500 dark:text-gray-400 text-[11px] tracking-wider uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Name</th>
                                    <th className="px-6 py-4 text-left">Masked API Key</th>
                                    <th className="px-6 py-4 text-left">Feature</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Default Webhook URL</th>
                                    {isAdmin && <th className="px-6 py-4 text-left">Company</th>}
                                    <th className="px-6 py-4 text-left">Created At</th>
                                    <th className="px-6 py-4 text-left">Updated At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredApiKeys.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-neutral-950/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <code className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200">{item.maskedApiKey || '-'}</code>
                                                <button
                                                    type="button"
                                                    onClick={() => onCopy(item.maskedApiKey, 'Masked API key')}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                    aria-label={`Copy masked key for ${item.name}`}
                                                >
                                                    <FontAwesomeIcon icon={faCopy} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-900/20 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
                                                {featureLabel(item.feature)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(item.isActive)}`}>
                                                {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-[240px]">
                                            {item.defaultWebhookUrl ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-gray-700 dark:text-gray-200">{item.defaultWebhookUrl}</span>
                                                    <a
                                                        href={item.defaultWebhookUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-primary transition-colors"
                                                        aria-label={`Open webhook for ${item.name}`}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                                                {item.company?.name || `#${item.company?.id || '-'}`}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDateTime(item.createdAt)}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDateTime(item.updatedAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button mode="secondary" size="sm" onClick={() => onView(item.id)}>View</Button>
                                                <Button mode="secondary" size="sm" onClick={() => onEdit(item)}>Edit</Button>
                                                <Button mode="ghost" size="sm" onClick={() => onDelete(item)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="lg:hidden p-4 space-y-4">
                        {filteredApiKeys.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-neutral-950">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{featureLabel(item.feature)}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(item.isActive)}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-400">Masked API key</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <code className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 break-all">{item.maskedApiKey || '-'}</code>
                                            <button
                                                type="button"
                                                onClick={() => onCopy(item.maskedApiKey, 'Masked API key')}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faCopy} />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-400">Webhook</p>
                                        {item.defaultWebhookUrl ? (
                                            <a
                                                href={item.defaultWebhookUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-flex items-center gap-2 text-primary text-sm break-all"
                                            >
                                                {item.defaultWebhookUrl}
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-gray-500 dark:text-gray-400">No default webhook</p>
                                        )}
                                    </div>
                                    {isAdmin && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-400">Company</p>
                                            <p className="mt-1 text-gray-700 dark:text-gray-200">{item.company?.name || `Company #${item.company?.id || '-'}`}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button mode="secondary" size="sm" onClick={() => onView(item.id)}>View details</Button>
                                    <Button mode="secondary" size="sm" onClick={() => onEdit(item)}>Edit</Button>
                                    <Button mode="ghost" size="sm" onClick={() => onDelete(item)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default ApiKeysSection;
