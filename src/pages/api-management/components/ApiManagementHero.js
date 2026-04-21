import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faFileLines, faKey, faPlus, faTriangleExclamation } from '@/utils/icons';
import Button from '@/components/Button';

const ApiManagementHero = ({ hasPermission, hasApiFeatureEntitlement, onOpenCreate }) => (
    <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 dark:bg-orange-900/20 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                    <FontAwesomeIcon icon={faKey} />
                    API management
                </div>
                <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Create and manage API keys for external parsing and matching integrations.</h2>
                <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">Each key can control feature scope, default webhook URL, and activation state for company integrations.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <a
                    href="docs/integration-api.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <FontAwesomeIcon icon={faFileLines} />
                    Docs
                </a>
                <Button mode="primary" onClick={onOpenCreate} disabled={!hasPermission || !hasApiFeatureEntitlement}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create API Key
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] border-t border-gray-100 dark:border-gray-800">
            <div className="p-6 sm:p-8 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-gray-800">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 dark:bg-amber-900/10 dark:border-amber-800 px-4 py-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Raw API key and webhook secret are shown only once after creation.</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Ask integrators to store them securely right away. Later screens only show the masked API key.</p>
                        </div>
                    </div>
                </div>
                {hasPermission && !hasApiFeatureEntitlement && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/80 dark:bg-red-900/10 dark:border-red-800 px-4 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Upgrade your plan to create integration API keys.</p>
                            <Link
                                to="/billing-plans"
                                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 h-10 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                            >
                                View plans
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 sm:p-8">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-neutral-950 px-5 py-5">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-primary" />
                        Integration onboarding
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Send the API key in the <code className="text-[11px]">X-API-Key</code> header when calling Smart Recruit integration endpoints.</p>
                    <div className="mt-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-3">
                        <code className="text-xs text-gray-700 dark:text-gray-200 break-all">X-API-Key: sma_xxx</code>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default ApiManagementHero;
