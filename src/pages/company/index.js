import React, { useState, useEffect } from 'react';
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useUploadFileMutation } from '@/apis/apis';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { message, ConfigProvider } from 'antd';
import GeneralInfo from './components/GeneralInfo';
import Classification from './components/Classification';
import ContactInfo from './components/ContactInfo';
import Location from './components/Location';
import LegalInfo from './components/LegalInfo';

const CompanyProfile = () => {
    const { data: companyData, isLoading, refetch } = useGetCompanyProfileQuery();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        companyIndustry: undefined,
        companyType: undefined,
        minSize: '',
        maxSize: '',
        companyEmail: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        country: '',
        taxIdentificationNumber: '',
        erc: '',
        companyLink: ''
    });

    useEffect(() => {
        if (companyData && companyData.data) {
            setFormData(companyData.data);
        }
    }, [companyData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { taxIdentificationNumber, erc, ...updateData } = formData;
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
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#F97316',
                    colorLink: '#F97316',
                    borderRadius: 8,
                },
            }}
        >
            <div className="p-6 space-y-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your company information</p>
                </header>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <GeneralInfo formData={formData} handleChange={handleChange} />
                        <Classification
                            formData={formData}
                            handleChange={handleChange}
                            handleSelectChange={handleSelectChange}
                        />
                        <ContactInfo formData={formData} handleChange={handleChange} />
                        <Location formData={formData} handleChange={handleChange} />
                        <LegalInfo formData={formData} />

                        <div className="flex justify-start pt-4">
                            <Button
                                mode="primary"
                                type="submit"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update Information'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default CompanyProfile;
