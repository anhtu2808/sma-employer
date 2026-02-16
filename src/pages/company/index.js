import React, { useEffect } from 'react';
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
            refetch();
        } catch (error) {
            message.error('Failed to update company profile');
            console.error('Update failed:', error);
        }
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your company information</p>
            </header>

            <Card className="p-6">
                <Form form={form} onFinish={onFinish} className="space-y-6">
                    <GeneralInfo />
                    <Classification />
                    <ContactInfo />
                    <Location />
                    <LegalInfo />

                    <div className="flex justify-start pt-4">
                        <Button
                            mode="primary"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Information'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default CompanyProfile;
