import React from 'react';
import { Form, ConfigProvider } from 'antd';
import Button from '@/components/Button';
import BasicInformation from './components/BasicInformation';
import JobSettings from './components/JobSettings';
import JobLocations from './components/JobLocations';
import RoleDetails from './components/RoleDetails';
import Classification from './components/Classification';
import ScreeningQuestions from './components/ScreeningQuestions';
import ScoringWeights from './components/ScoringWeights';
import { useNavigate } from 'react-router-dom';

const JobCreate = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button
                mode="text"
                className="self-start text-gray-500 hover:text-primary pl-0 -ml-20"
                onClick={() => navigate('/jobs')}
            >
                <span className="material-icons-round text-lg mr-1">arrow_back</span>
                Back to Jobs
            </Button>

            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#F97316',
                        colorLink: '#F97316',
                        borderRadius: 8,
                    },
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-6"
                >
                    <BasicInformation />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <JobSettings />
                        <JobLocations />
                    </div>

                    <RoleDetails />

                    <Classification />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ScreeningQuestions />
                        <ScoringWeights />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center bottom-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10">
                        <Button mode="ghost" size="md" onClick={() => navigate('/jobs')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            Cancel
                        </Button>
                        <div className="flex gap-3">
                            <Button mode="secondary" size="md">
                                Save as Draft
                            </Button>
                            <Button mode="primary" size="md" htmlType="submit">
                                Publish Job
                            </Button>
                        </div>
                    </div>
                </Form>
            </ConfigProvider>
        </div>
    );
};

export default JobCreate;
