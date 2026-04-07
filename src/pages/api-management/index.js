import React, { useEffect, useMemo, useState } from 'react';
import {
    useCreateCompanyApiKeyMutation,
    useDeleteCompanyApiKeyMutation,
    useGetCompanyApiKeyQuery,
    useGetCompanyApiKeysQuery,
    useUpdateCompanyApiKeyMutation,
} from '@/apis/companyApiKeyApi';
import { useGetCompaniesQuery } from '@/apis/companyApi';
import { useGetMyRecruiterInfoQuery } from '@/apis/recruiterApi';
import Loading from '@/components/Loading';
import toastMessage from '@/utils/toastMessage';
import { createInitialFormState } from './constants';
import { decodeJwtPayload, getRoleFromPayload, isValidHttpUrl } from './utils';
import ApiKeyCredentialsModal from './components/ApiKeyCredentialsModal';
import ApiKeyDeleteModal from './components/ApiKeyDeleteModal';
import ApiKeyDetailsDrawer from './components/ApiKeyDetailsDrawer';
import ApiKeyFormModal from './components/ApiKeyFormModal';
import ApiKeysSection from './components/ApiKeysSection';
import ApiManagementHero from './components/ApiManagementHero';

const ApiManagementPage = () => {
    const tokenPayload = useMemo(() => decodeJwtPayload(localStorage.getItem('accessToken')), []);
    const tokenRole = getRoleFromPayload(tokenPayload);
    const isAdmin = tokenRole === 'ADMIN';

    const { data: myInfoData, isLoading: isRecruiterInfoLoading } = useGetMyRecruiterInfoQuery(undefined, { skip: isAdmin });
    const recruiterInfo = myInfoData?.data;
    const isRootRecruiter = recruiterInfo?.isRootRecruiter === true;
    const recruiterCompanyId = recruiterInfo?.company?.id || recruiterInfo?.companyId || '';
    const recruiterCompanyName = recruiterInfo?.company?.name || recruiterInfo?.companyName || recruiterInfo?.company?.companyName || 'Your company';
    const hasPermission = isAdmin || isRootRecruiter;

    const { data: companiesData, isLoading: isCompaniesLoading, isError: isCompaniesError } = useGetCompaniesQuery(undefined, {
        skip: !isAdmin || !hasPermission,
    });

    const {
        data: apiKeysResponse,
        isLoading: isListLoading,
        isFetching: isListFetching,
        error: listError,
        refetch,
    } = useGetCompanyApiKeysQuery(undefined, {
        skip: !hasPermission,
    });

    const [createCompanyApiKey, { isLoading: isCreating }] = useCreateCompanyApiKeyMutation();
    const [updateCompanyApiKey, { isLoading: isUpdating }] = useUpdateCompanyApiKeyMutation();
    const [deleteCompanyApiKey, { isLoading: isDeleting }] = useDeleteCompanyApiKeyMutation();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [featureFilter, setFeatureFilter] = useState('ALL');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formState, setFormState] = useState(createInitialFormState(recruiterCompanyId));
    const [editingItem, setEditingItem] = useState(null);
    const [detailId, setDetailId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [createdSecrets, setCreatedSecrets] = useState(null);

    const { data: detailResponse, isFetching: isDetailFetching, error: detailError } = useGetCompanyApiKeyQuery(detailId, {
        skip: !detailId || !hasPermission,
    });

    const companies = Array.isArray(companiesData) ? companiesData : [];
    const apiKeysData = apiKeysResponse?.data;
    const apiKeys = useMemo(() => (Array.isArray(apiKeysData) ? apiKeysData : []), [apiKeysData]);
    const selectedDetail = detailResponse?.data || apiKeys.find((item) => item.id === detailId) || null;

    useEffect(() => {
        if (recruiterCompanyId && !isAdmin) {
            setFormState((prev) => ({ ...prev, companyId: prev.companyId || String(recruiterCompanyId) }));
        }
    }, [isAdmin, recruiterCompanyId]);

    useEffect(() => {
        if (detailError?.status === 404) {
            toastMessage.error('API key no longer exists. The list has been refreshed.');
            setDetailId(null);
            refetch();
        }
    }, [detailError, refetch]);

    const filteredApiKeys = useMemo(() => {
        let result = apiKeys;

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter((item) =>
                [item.name, item.maskedApiKey, item.company?.name]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter((item) => Boolean(item.isActive) === (statusFilter === 'ACTIVE'));
        }

        if (featureFilter !== 'ALL') {
            result = result.filter((item) => item.feature === featureFilter);
        }

        return result;
    }, [apiKeys, featureFilter, searchQuery, statusFilter]);

    const showPermissionState = !hasPermission || listError?.status === 403;
    const showGenericError = hasPermission && listError && listError.status !== 403;
    const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== 'ALL' || featureFilter !== 'ALL';

    const resetForm = () => {
        setFormErrors({});
        setFormState(createInitialFormState(isAdmin ? '' : recruiterCompanyId));
    };

    const handleCopy = async (value, label) => {
        if (!value) {
            toastMessage.error(`No ${label.toLowerCase()} available to copy`);
            return;
        }

        try {
            await navigator.clipboard.writeText(value);
            toastMessage.success(`${label} copied to clipboard`);
        } catch (error) {
            toastMessage.error(`Failed to copy ${label.toLowerCase()}`);
        }
    };

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!formState.name.trim()) nextErrors.name = 'API key name is required';
        if (!formState.feature) nextErrors.feature = 'API feature is required';
        if (isAdmin && !String(formState.companyId || '').trim()) nextErrors.companyId = 'Company is required';
        if (formState.defaultWebhookUrl && !isValidHttpUrl(formState.defaultWebhookUrl)) {
            nextErrors.defaultWebhookUrl = 'Please enter a valid http(s) URL';
        }

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const buildPayload = () => ({
        name: formState.name.trim(),
        description: formState.description ?? '',
        feature: formState.feature,
        ...(isAdmin ? { companyId: Number(formState.companyId) } : { companyId: Number(recruiterCompanyId) }),
        isActive: Boolean(formState.isActive),
        defaultWebhookUrl: formState.defaultWebhookUrl?.trim() || '',
    });

    const handleOpenCreate = () => {
        resetForm();
        setEditingItem(null);
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormErrors({});
        setFormState({
            name: item.name || '',
            description: item.description ?? '',
            feature: item.feature || '',
            companyId: item.company?.id ? String(item.company.id) : (isAdmin ? '' : String(recruiterCompanyId || '')),
            isActive: Boolean(item.isActive),
            defaultWebhookUrl: item.defaultWebhookUrl || '',
        });
        setIsEditOpen(true);
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        try {
            const response = await createCompanyApiKey(buildPayload()).unwrap();
            setIsCreateOpen(false);
            setCreatedSecrets(response?.data || null);
            toastMessage.success('API key created successfully');
            resetForm();
        } catch (error) {
            const fieldErrors = error?.data?.data;
            if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) {
                setFormErrors(fieldErrors);
            } else {
                toastMessage.error(error?.data?.message || 'Failed to create API key');
            }
        }
    };

    const handleUpdate = async () => {
        if (!editingItem?.id || !validateForm()) return;

        try {
            await updateCompanyApiKey({ id: editingItem.id, data: buildPayload() }).unwrap();
            setIsEditOpen(false);
            setEditingItem(null);
            toastMessage.success('API key updated successfully');
            refetch();
        } catch (error) {
            if (error?.status === 404) {
                toastMessage.error('API key not found. The list has been refreshed.');
                setIsEditOpen(false);
                setEditingItem(null);
                refetch();
                return;
            }

            const fieldErrors = error?.data?.data;
            if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) {
                setFormErrors(fieldErrors);
            } else {
                toastMessage.error(error?.data?.message || 'Failed to update API key');
            }
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget?.id) return;

        try {
            await deleteCompanyApiKey(deleteTarget.id).unwrap();
            toastMessage.success('API key deleted successfully');
            if (detailId === deleteTarget.id) setDetailId(null);
            setDeleteTarget(null);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to delete API key');
        }
    };

    const handleStartEditFromDrawer = (item) => {
        setDetailId(null);
        handleOpenEdit(item);
    };

    if (!isAdmin && isRecruiterInfoLoading) return <Loading />;

    if (hasPermission && isListLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <ApiManagementHero hasPermission={hasPermission} onOpenCreate={handleOpenCreate} />

            <ApiKeysSection
                showPermissionState={showPermissionState}
                showGenericError={showGenericError}
                listError={listError}
                refetch={refetch}
                isListFetching={isListFetching}
                apiKeys={apiKeys}
                filteredApiKeys={filteredApiKeys}
                hasActiveFilters={hasActiveFilters}
                isAdmin={isAdmin}
                searchQuery={searchQuery}
                featureFilter={featureFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onFeatureFilterChange={setFeatureFilter}
                onStatusFilterChange={setStatusFilter}
                onOpenCreate={handleOpenCreate}
                onView={setDetailId}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTarget}
                onCopy={handleCopy}
            />

            <ApiKeyFormModal
                mode="create"
                open={isCreateOpen}
                loading={isCreating}
                onCancel={() => {
                    setIsCreateOpen(false);
                    resetForm();
                }}
                onSubmit={handleCreate}
                isAdmin={isAdmin}
                companies={companies}
                isCompaniesLoading={isCompaniesLoading}
                isCompaniesError={isCompaniesError}
                recruiterCompanyName={recruiterCompanyName}
                formState={formState}
                formErrors={formErrors}
                onFormChange={handleFormChange}
            />

            <ApiKeyFormModal
                mode="edit"
                open={isEditOpen}
                loading={isUpdating}
                onCancel={() => {
                    setIsEditOpen(false);
                    setEditingItem(null);
                    resetForm();
                }}
                onSubmit={handleUpdate}
                isAdmin={isAdmin}
                companies={companies}
                isCompaniesLoading={isCompaniesLoading}
                isCompaniesError={isCompaniesError}
                recruiterCompanyName={recruiterCompanyName}
                formState={formState}
                formErrors={formErrors}
                onFormChange={handleFormChange}
            />

            <ApiKeyDeleteModal
                deleteTarget={deleteTarget}
                recruiterCompanyName={recruiterCompanyName}
                isDeleting={isDeleting}
                onCancel={() => setDeleteTarget(null)}
                onSubmit={handleDelete}
            />

            <ApiKeyCredentialsModal
                createdSecrets={createdSecrets}
                onClose={() => setCreatedSecrets(null)}
                onCopy={handleCopy}
            />

            <ApiKeyDetailsDrawer
                detailId={detailId}
                isDetailFetching={isDetailFetching}
                selectedDetail={selectedDetail}
                recruiterCompanyName={recruiterCompanyName}
                onClose={() => setDetailId(null)}
                onCopy={handleCopy}
                onEdit={handleStartEditFromDrawer}
                onDelete={setDeleteTarget}
            />
        </div>
    );
};

export default ApiManagementPage;

