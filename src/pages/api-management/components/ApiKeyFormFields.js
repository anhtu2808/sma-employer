import React from 'react';
import Input from '@/components/Input';
import Switch from '@/components/Switch';
import { FEATURE_ENDPOINTS, FEATURE_OPTIONS } from '../constants';
import { fieldErrorMessage } from '../utils';

const SectionLabel = ({ children }) => (
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
        {children}
    </label>
);

const selectClassName = (hasError) => (
    `w-full h-10 rounded-lg border px-3 text-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${hasError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`
);

const ApiKeyFormFields = ({
    isAdmin,
    companies,
    isCompaniesLoading,
    isCompaniesError,
    recruiterCompanyName,
    formState,
    formErrors,
    onChange,
    featureEntitlements = {},
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
            label="Name"
            value={formState.name}
            error={!!fieldErrorMessage(formErrors, 'name')}
            helperText={fieldErrorMessage(formErrors, 'name')}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="Partner A Production"
        />

        <div>
            <SectionLabel>Feature <span className="text-red-500">*</span></SectionLabel>
            <select
                value={formState.feature}
                onChange={(event) => onChange('feature', event.target.value)}
                className={selectClassName(!!fieldErrorMessage(formErrors, 'feature'))}
            >
                <option value="">Select a feature scope</option>
                {FEATURE_OPTIONS.map((option) => {
                    const disabled = featureEntitlements[option.value] === false;
                    return (
                    <option key={option.value} value={option.value} disabled={disabled}>
                        {disabled ? `${option.label} - upgrade required` : option.label}
                    </option>
                    );
                })}
            </select>
            {fieldErrorMessage(formErrors, 'feature') && (
                <p className="mt-1 text-xs text-red-500">{fieldErrorMessage(formErrors, 'feature')}</p>
            )}
        </div>

        {isAdmin ? (
            <div className="md:col-span-2">
                <SectionLabel>Company <span className="text-red-500">*</span></SectionLabel>
                {companies.length > 0 ? (
                    <>
                        <select
                            value={formState.companyId}
                            onChange={(event) => onChange('companyId', event.target.value)}
                            className={selectClassName(!!fieldErrorMessage(formErrors, 'companyId'))}
                            disabled={isCompaniesLoading}
                        >
                            <option value="">{isCompaniesLoading ? 'Loading companies...' : 'Select a company'}</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name || `Company #${company.id}`}
                                </option>
                            ))}
                        </select>
                        {!fieldErrorMessage(formErrors, 'companyId') && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Admin accounts must assign each API key to a company.</p>
                        )}
                    </>
                ) : (
                    <Input
                        type="number"
                        label=""
                        value={formState.companyId}
                        error={!!fieldErrorMessage(formErrors, 'companyId')}
                        helperText={fieldErrorMessage(formErrors, 'companyId') || (isCompaniesError ? 'Company list is unavailable, so enter company ID manually.' : 'Enter the target company ID.')}
                        onChange={(event) => onChange('companyId', event.target.value)}
                        placeholder="101"
                    />
                )}
            </div>
        ) : (
            <div className="md:col-span-2 rounded-xl border border-orange-200 bg-orange-50/70 dark:bg-orange-900/10 dark:border-orange-800 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Company</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{recruiterCompanyName}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Root recruiters can only manage API keys for their own company.</p>
            </div>
        )}

        <div className="md:col-span-2">
            <Input.TextArea
                label="Description"
                value={formState.description}
                error={!!fieldErrorMessage(formErrors, 'description')}
                helperText={fieldErrorMessage(formErrors, 'description')}
                onChange={(event) => onChange('description', event.target.value)}
                placeholder="Used for production parsing and matching traffic"
                rows={4}
            />
        </div>

        <div className="md:col-span-2">
            <Input
                label="Default Webhook URL"
                value={formState.defaultWebhookUrl}
                error={!!fieldErrorMessage(formErrors, 'defaultWebhookUrl')}
                helperText={fieldErrorMessage(formErrors, 'defaultWebhookUrl') || 'If integration requests omit webhookUrl, backend will use this default endpoint.'}
                onChange={(event) => onChange('defaultWebhookUrl', event.target.value)}
                placeholder="https://partner-a.com/webhooks/smartrecruit"
            />
        </div>

        <div className="md:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Active status</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Inactive keys cannot authenticate integration API requests.</p>
                </div>
                <Switch
                    id="api-key-active"
                    checked={formState.isActive}
                    onChange={(event) => onChange('isActive', event.target.checked)}
                />
            </div>
        </div>

        {formState.feature && (
            <div className="md:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-neutral-900 px-4 py-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Feature scope</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">This key can be used with the following integration endpoints:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {FEATURE_ENDPOINTS[formState.feature]?.map((endpoint) => (
                        <span
                            key={endpoint}
                            className="inline-flex items-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                        >
                            {endpoint}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default ApiKeyFormFields;
