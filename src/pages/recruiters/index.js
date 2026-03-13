import React, { useMemo, useState } from 'react';
import { message, Select } from 'antd';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import './index.scss';
import {
    useCreateRecruiterMemberMutation,
    useGetFeatureUsageQuery,
    useGetMyRecruiterInfoQuery,
    useGetRecruiterMembersQuery,
    useUpdateRecruiterMemberMutation,
    useUpdateRecruiterMemberStatusMutation,
} from '@/apis/apis';

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
};

const statusBadge = (status) => {
    const normalized = status || 'UNKNOWN';
    if (normalized === 'ACTIVE') {
        return 'bg-green-100 text-green-700';
    }
    if (normalized === 'INACTIVE') {
        return 'bg-gray-100 text-gray-600';
    }
    if (normalized === 'SUSPENDED') {
        return 'bg-red-100 text-red-700';
    }
    return 'bg-yellow-100 text-yellow-700';
};

const roleBadge = (isRoot) => (isRoot ? 'Root Recruiter' : 'Recruiter');

const RecruitersPage = () => {
    const { data: membersData, isLoading: isMembersLoading, refetch } = useGetRecruiterMembersQuery();
    const { data: myInfoData } = useGetMyRecruiterInfoQuery();
    const { data: usageData } = useGetFeatureUsageQuery();

    const [createMember, { isLoading: isCreating }] = useCreateRecruiterMemberMutation();
    const [updateMember, { isLoading: isUpdating }] = useUpdateRecruiterMemberMutation();
    const [updateMemberStatus, { isLoading: isUpdatingStatus }] = useUpdateRecruiterMemberStatusMutation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        fullName: '',
        gender: 'MALE',
        status: 'ACTIVE',
    });

    const members = membersData?.data || [];
    const isRootRecruiter = Boolean(myInfoData?.data?.isRootRecruiter);
    const currentRecruiterId = myInfoData?.data?.id;

    const teamUsage = useMemo(
        () => usageData?.find((item) => item?.featureKey === 'TEAM_MEMBER_LIMIT'),
        [usageData]
    );

    const quotaMax = typeof teamUsage?.maxQuota === 'number' ? teamUsage.maxQuota : null;
    const quotaUsed = typeof teamUsage?.used === 'number' ? teamUsage.used : 0;
    const quotaRemaining = typeof teamUsage?.remaining === 'number' ? teamUsage.remaining : null;
    const quotaExceeded = quotaMax != null && quotaUsed >= quotaMax;

    const resetForm = () => setFormState({
        email: '',
        password: '',
        fullName: '',
        gender: 'MALE',
        status: 'ACTIVE',
    });

    const handleOpenCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (member) => {
        setEditingMember(member);
        setFormState({
            email: member.email || '',
            password: '',
            fullName: member.fullName || '',
            gender: member.gender || 'MALE',
            status: member.status || 'ACTIVE',
        });
        setIsEditOpen(true);
    };

    const handleCreate = async () => {
        try {
            await createMember({
                email: formState.email,
                password: formState.password,
                fullName: formState.fullName,
                gender: formState.gender,
            }).unwrap();
            message.success('Member created successfully');
            setIsCreateOpen(false);
            resetForm();
            refetch();
        } catch (err) {
            message.error(err?.data?.message || 'Failed to create member');
        }
    };

    const handleUpdate = async () => {
        if (!editingMember?.id) return;
        try {
            await updateMember({
                recruiterId: editingMember.id,
                data: {
                    fullName: formState.fullName,
                    gender: formState.gender,
                },
            }).unwrap();
            if (
                isRootRecruiter &&
                editingMember.id !== currentRecruiterId &&
                formState.status &&
                formState.status !== editingMember.status
            ) {
                await updateMemberStatus({
                    recruiterId: editingMember.id,
                    status: formState.status,
                }).unwrap();
            }
            message.success('Member updated successfully');
            setIsEditOpen(false);
            setEditingMember(null);
            refetch();
        } catch (err) {
            message.error(err?.data?.message || 'Failed to update member');
        }
    };

    if (isMembersLoading) {
        return <Loading />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recruiter Team</h1>
                    <p className="text-sm text-gray-500">Manage members in your recruiting team</p>
                </div>
                {isRootRecruiter && (
                    <Button
                        mode="primary"
                        onClick={handleOpenCreate}
                        disabled={quotaExceeded}
                        tooltip={quotaExceeded ? 'Team member limit reached' : null}
                    >
                        Add Member
                    </Button>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Team Member Limit</p>
                    {quotaMax == null ? (
                        <p className="text-sm text-gray-500 mt-1">Feature not included in your plan.</p>
                    ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                            {quotaUsed} / {quotaMax} used
                            {typeof quotaRemaining === 'number' && (
                                <span className="text-sm text-gray-500 ml-2">({quotaRemaining} remaining)</span>
                            )}
                        </p>
                    )}
                </div>
                {quotaExceeded && (
                    <div className="text-sm text-red-600">
                        You have reached the team member limit. Upgrade your plan to add more members.
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700">Members</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-[11px] tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Member</th>
                                <th className="px-6 py-3 text-left">Gender</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Role</th>
                                <th className="px-6 py-3 text-left">Last Login</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-b last:border-b-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img
                                                    src={member.avatar}
                                                    alt={member.fullName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                                                    {(member.fullName || member.email || 'R').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{member.fullName || 'Unnamed'}</p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{member.gender || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(member.status)}`}>
                                            {member.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{roleBadge(member.isRootRecruiter)}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(member.lastLoginAt)}</td>
                                    <td className="px-6 py-4 text-right">
                                        {isRootRecruiter ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button mode="secondary" size="sm" onClick={() => handleOpenEdit(member)}>
                                                    Edit
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={isCreateOpen}
                title="Add Member"
                onCancel={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
                loading={isCreating}
                submitText="Create"
                submitDisabled={quotaExceeded}
            >
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Email"
                        value={formState.email}
                        onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <Input.Password
                        label="Password"
                        value={formState.password}
                        onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <Input
                        label="Full Name"
                        value={formState.fullName}
                        onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                    <div>
                        <label className="input-label">Gender</label>
                        <Select
                            className="w-full simple-select"
                            value={formState.gender}
                            onChange={(value) => setFormState((prev) => ({ ...prev, gender: value }))}
                            options={GENDER_OPTIONS}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                open={isEditOpen}
                title="Edit Member"
                onCancel={() => setIsEditOpen(false)}
                onSubmit={handleUpdate}
                loading={isUpdating}
                submitText="Save"
            >
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Full Name"
                        value={formState.fullName}
                        onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                    <div>
                        <label className="input-label">Gender</label>
                        <Select
                            className="w-full simple-select"
                            value={formState.gender}
                            onChange={(value) => setFormState((prev) => ({ ...prev, gender: value }))}
                            options={GENDER_OPTIONS}
                        />
                    </div>
                    {isRootRecruiter && editingMember?.id !== currentRecruiterId ? (
                        <div>
                            <label className="input-label">Status</label>
                            <Select
                                className="w-full simple-select"
                                value={formState.status}
                                onChange={(value) => setFormState((prev) => ({ ...prev, status: value }))}
                                options={STATUS_OPTIONS}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="input-label">Status</label>
                            <div className="mt-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(editingMember?.status)}`}>
                                    {editingMember?.status || 'UNKNOWN'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RecruitersPage;
