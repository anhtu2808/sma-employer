import React, { useEffect, useRef, useState } from 'react';
import { message, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useGetMyRecruiterInfoQuery, useUpdateMyProfileMutation } from '@/apis/recruiterApi';
import { useUploadFileMutation } from '@/apis/apis';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Card from '@/components/Card';

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const ProfileSettings = () => {
    const { data: myInfoData, isLoading } = useGetMyRecruiterInfoQuery();
    const [updateMyProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const fileInputRef = useRef(null);

    const user = myInfoData?.data?.user;

    const [formData, setFormData] = useState({
        fullName: '',
        gender: 'MALE',
        dateOfBirth: '',
        avatar: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                gender: user.gender || 'MALE',
                dateOfBirth: user.dateOfBirth || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error('Image must be smaller than 5MB');
            return;
        }

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('files', file);
            const response = await uploadFile(formDataUpload).unwrap();
            const downloadUrl = response[0]?.downloadUrl || response?.downloadUrl;
            if (downloadUrl) {
                handleChange('avatar', downloadUrl);
            }
        } catch {
            message.error('Failed to upload image');
        }
    };

    const handleSave = async () => {
        if (!formData.fullName.trim()) {
            message.error('Full name is required');
            return;
        }

        try {
            const payload = {
                fullName: formData.fullName.trim(),
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth || null,
                avatar: formData.avatar || null,
            };
            await updateMyProfile(payload).unwrap();
            message.success('Profile updated successfully');
            setIsEditing(false);
        } catch {
            message.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                gender: user.gender || 'MALE',
                dateOfBirth: user.dateOfBirth || '',
                avatar: user.avatar || '',
            });
        }
        setIsEditing(false);
    };

    if (isLoading) return <Loading className="py-20" />;

    const initials = (formData.fullName || user?.email || '?')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="px-4 space-y-6">
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                                    <span className="material-icons-round text-3xl text-gray-400">person</span>
                                </div>
                            )}
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-white text-xl">
                                        {isUploading ? 'hourglass_empty' : 'photo_camera'}
                                    </span>
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                            >
                                {isUploading ? 'Uploading...' : 'Change photo'}
                            </button>
                        )}
                    </div>

                    {/* Form fields */}
                    <div className="flex-1 w-full space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    maxLength={255}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                                />
                            ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100 py-2">
                                    {formData.fullName || '-'}
                                </p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Email
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                                {user?.email || '-'}
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Gender
                            </label>
                            {isEditing ? (
                                <Select
                                    value={formData.gender}
                                    onChange={(value) => handleChange('gender', value)}
                                    options={GENDER_OPTIONS}
                                    className="w-full [&_.ant-select-selector]:!rounded-lg"
                                    size="large"
                                />
                            ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100 py-2">
                                    {GENDER_OPTIONS.find((o) => o.value === formData.gender)?.label || '-'}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Date of Birth
                            </label>
                            {isEditing ? (
                                <DatePicker
                                    value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                                    onChange={(date) => handleChange('dateOfBirth', date ? date.format('YYYY-MM-DD') : '')}
                                    format="DD/MM/YYYY"
                                    className="w-full !rounded-lg"
                                    size="large"
                                    placeholder="dd/mm/yyyy"
                                />
                            ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100 py-2">
                                    {formData.dateOfBirth || '-'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-start gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                    {isEditing ? (
                        <>
                            <Button
                                mode="primary"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                mode="ghost"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            mode="primary"
                            onClick={() => setIsEditing(true)}
                            iconLeft={<span className="material-icons-round text-sm">edit</span>}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ProfileSettings;
