import React, { useEffect, useState } from 'react';
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useUploadFileMutation } from '@/apis/apis';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { message } from 'antd';
import Form from '@/components/Form';
import GeneralInfo from './components/GeneralInfo';
import Classification from './components/Classification';
import ContactInfo from './components/ContactInfo';
import Location from './components/Location';
import LegalInfo from './components/LegalInfo';

const CompanyProfile = () => {
    const { data: companyData, isLoading, refetch } = useGetCompanyProfileQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (companyData && companyData.data) {
            form.setFieldsValue(companyData.data);
        }
    }, [companyData, form]);

    const onFinish = async (values) => {
        try {
            const { taxIdentificationNumber, erc, ...updateData } = values;
            await updateCompany(updateData).unwrap();
            message.success('Company profile updated successfully');
            setIsEditing(false);
            refetch();
        } catch (error) {
            message.error('Failed to update company profile');
            console.error('Update failed:', error);
        }
    };

    const handleCancel = () => {
        if (companyData?.data) {
            form.setFieldsValue(companyData.data);
        }
        setIsEditing(false);
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">

            <Card className="p-6">
                <Form form={form} onFinish={onFinish} className="space-y-6" disabled={!isEditing}>
                    <GeneralInfo />
                    <Classification />
                    <ContactInfo />
                    <Location />
                    <LegalInfo />

                    <div className="flex justify-start gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <Button
                                    mode="primary"
                                    type="submit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    mode="ghost"
                                    onClick={handleCancel}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                mode="primary"
                                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                                iconLeft={<span className="material-icons-round text-sm">edit</span>}
                            >
                                Edit Information
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CompanyProfile;
