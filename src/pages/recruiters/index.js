import React, { useMemo, useState } from 'react';
import { message, Select } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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

dayjs.extend(relativeTime);

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

const formatRelativeDate = (dateString) => {
    if (!dateString) return '-';
    const date = dayjs(dateString);
    if (!date.isValid()) return '-';
    const now = dayjs();
    return now.diff(date, 'day') < 7 ? date.fromNow() : date.format('MMM D, YYYY');
};

const formatGender = (gender) => {
    const found = GENDER_OPTIONS.find((opt) => opt.value === gender);
    return found ? found.label : '-';
};

const statusBadge = (status) => {
    const normalized = status || 'UNKNOWN';
    if (normalized === 'ACTIVE') {
        return {
            badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            dot: 'bg-green-500',
        };
    }
    if (normalized === 'INACTIVE') {
        return {
            badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            dot: 'bg-gray-400',
        };
    }
    if (normalized === 'SUSPENDED') {
        return {
            badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            dot: 'bg-red-500',
        };
    }
    return {
        badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        dot: 'bg-yellow-500',
    };
};

const roleBadge = (isRoot) => {
    if (isRoot) {
        return {
            label: 'Root Recruiter',
            style: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        };
    }
    return {
        label: 'Recruiter',
        style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
};

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
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

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

    const filteredMembers = useMemo(() => {
        let result = members;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (m) =>
                    (m.fullName || '').toLowerCase().includes(q) ||
                    (m.email || '').toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'ALL') {
            result = result.filter((m) => m.status === statusFilter);
        }
        return result;
    }, [members, searchQuery, statusFilter]);

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

    const hasActiveSearch = searchQuery.trim() || statusFilter !== 'ALL';

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Team</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage members in your recruiting team</p>
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

            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="material-icons-round text-gray-400 dark:text-gray-500 text-xl">groups</span>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold">Team Member Limit</p>
                        {quotaMax == null ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Feature not included in your plan.</p>
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                {quotaUsed} / {quotaMax} used
                                {typeof quotaRemaining === 'number' && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({quotaRemaining} remaining)</span>
                                )}
                            </p>
                        )}
                    </div>
                </div>
                {quotaExceeded && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                        You have reached the team member limit. Upgrade your plan to add more members.
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Members ({filteredMembers.length})
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="material-icons-round absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-[18px]">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-56"
                            />
                        </div>
                        <Select
                            className="simple-select"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{ width: 130 }}
                            options={[
                                { value: 'ALL', label: 'All Status' },
                                ...STATUS_OPTIONS,
                            ]}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 text-[11px] tracking-wider">
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
                            {filteredMembers.map((member) => {
                                const status = statusBadge(member.status);
                                const role = roleBadge(member.isRootRecruiter);
                                return (
                                    <tr key={member.id} className="border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {member.avatar ? (
                                                    <img
                                                        src={member.avatar}
                                                        alt={member.fullName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center font-semibold">
                                                        {(member.fullName || member.email || 'R').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{member.fullName || 'Unnamed'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatGender(member.gender)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                {member.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${role.style}`}>
                                                {role.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatRelativeDate(member.lastLoginAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {isRootRecruiter ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button mode="secondary" size="sm" onClick={() => handleOpenEdit(member)}>
                                                        Edit
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td className="px-6 py-12 text-center" colSpan={6}>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-icons-round text-3xl text-gray-300 dark:text-gray-600">group_off</span>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {hasActiveSearch
                                                    ? 'No members match your search criteria.'
                                                    : 'No members found. Add your first team member to get started.'}
                                            </p>
                                        </div>
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
                                {(() => {
                                    const s = statusBadge(editingMember?.status);
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {editingMember?.status || 'UNKNOWN'}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RecruitersPage;
