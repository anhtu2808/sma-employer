import React from 'react';
import { message } from 'antd';
import Form from '@/components/Form';
import Button from '@/components/Button';
import { useCreateJobMutation } from '@/apis/jobApi';
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

    const [createJob, { isLoading }] = useCreateJobMutation();

    const onFinish = async (values) => {
        try {
            const scoringCriterias = [
                { criteriaId: 1, weight: values.weight_1 || 0, enable: values.enableAiScoring },
                { criteriaId: 2, weight: values.weight_2 || 0, enable: values.enableAiScoring },
                { criteriaId: 3, weight: values.weight_3 || 0, enable: values.enableAiScoring },
            ];

            const totalWeight = scoringCriterias.reduce((sum, item) => sum + item.weight, 0);
            if (values.enableAiScoring && totalWeight !== 100) {
                message.error(`Total scoring weight must be 100%. Current: ${totalWeight}%`);
                return;
            }

            const submitData = {
                ...values,
                expDate: values.expDate ? values.expDate.toISOString() : null,
                scoringCriterias,
                skillIds: values.skillIds || [],
                domainIds: values.domainIds || [],
                benefitIds: values.benefitIds || [],
                questionIds: values.questionIds || [],
                locationIds: values.locationIds || [],
                salaryStart: Number(values.salaryStart) || 0,
                salaryEnd: Number(values.salaryEnd) || 0,
                experienceTime: Number(values.experienceTime) || 0,
                quantity: Number(values.quantity) || 0,
                autoRejectThreshold: Number(values.autoRejectThreshold) || 0,
            };

            // Remove temporary fields
            delete submitData.weight_1;
            delete submitData.weight_2;
            delete submitData.weight_3;

            await createJob(submitData).unwrap();
            message.success('Job published successfully!');
            navigate('/jobs');
        } catch (error) {
            console.error('Failed to create job:', error);
            message.error('Failed to create job. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button
                mode="text"
                className="self-start text-gray-500 hover:text-primary pl-0 -ml-20"
                onClick={() => navigate('/jobs')}
                iconLeft={<span className="material-icons-round text-lg">arrow_back</span>}
            >
                Back to Jobs
            </Button>

            <Form
                form={form}
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
                        <Button mode="primary" size="md" htmlType="submit" loading={isLoading}>
                            Publish Job
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default JobCreate;
